---
title: Self-hosted Supabase 部署與遷移
description: 從 Supabase Cloud 遷移到 Self-hosted，涵蓋 Docker 部署、Cloudflare Tunnel 配置、Migration 手動執行與日常維護。
datePublished: 2026-01-25
category: Nuxt
tags:
  - Nuxt
  - Supabase
  - PostgreSQL
  - Docker
  - Self-hosted
series: nuxt-fullstack
seriesTitle: Nuxt 4 全棧實戰筆記
seriesOrder: 8.5
---

## 這篇要解決什麼問題

Supabase Cloud 對大多數專案來說已經足夠，但某些情境下你可能需要 Self-hosted：

- **資料主權**：資料必須存放在特定地區或自有伺服器
- **成本考量**：大量資料或高流量時，自架可能更經濟
- **網路延遲**：內網部署減少 API 延遲
- **離線環境**：無法連接外部網路的場景

這篇文章將說明如何從 Supabase Cloud 遷移到 Self-hosted，以及遷移後的開發流程調整。

---

## 架構對比

### Cloud vs Self-hosted

| 項目 | Supabase Cloud | Self-hosted |
|------|----------------|-------------|
| 部署方式 | SaaS（託管） | Docker Compose |
| Migration | CLI `supabase db push` | 手動 `docker exec psql` |
| 網路存取 | 公開 API | Cloudflare Tunnel / VPN |
| 維護責任 | Supabase 團隊 | 自己 |
| 費用模式 | 按用量計費 | 伺服器成本 |
| Studio | 雲端 Dashboard | 自架 Web UI |

### 遷移決策流程

```
需要 Self-hosted 嗎？
    │
    ├─ 資料主權要求？ ──────→ Yes → Self-hosted
    │
    ├─ 月費 > 伺服器成本？ ──→ Yes → 評估 Self-hosted
    │
    ├─ 需要內網部署？ ───────→ Yes → Self-hosted
    │
    └─ 以上皆否 ────────────→ 繼續使用 Cloud
```

---

## 基礎設施部署

### 部署目錄結構

```
/opt/supabase/
├── docker-compose.yml
├── .env
└── volumes/
    ├── api/
    │   └── kong.yml
    ├── db/
    │   └── data/
    └── storage/
```

### 端口映射策略

為避免與本地開發環境的 `supabase start` 衝突，Self-hosted 使用不同端口：

| 服務 | 預設端口 | Self-hosted 端口 | 原因 |
|------|----------|------------------|------|
| Kong (API Gateway) | 8000 | 8001 | 避免與 Portainer 衝突 |
| Studio | 3000 | 3001 | 避免與 dev server 衝突 |
| PostgreSQL | 5432 | 5433 | 避免與其他 DB 衝突 |
| Supavisor | 6543 | 6544 | 連線池 |

### Docker Compose 關鍵配置

修改 `.env` 中的端口設定：

```bash
# Kong
KONG_HTTP_PORT=8001

# Studio
STUDIO_PORT=3001

# Database
POSTGRES_PORT=5433
```

啟動服務：

```bash
cd /opt/supabase
docker compose up -d
```

---

## 網路配置

### Cloudflare Tunnel 設定

透過 Cloudflare Tunnel 將內部服務暴露到公網，無需開放防火牆端口：

| 子域名 | 指向服務 | 用途 |
|--------|----------|------|
| `supabase-api.example.com` | `localhost:8001` | REST API |
| `supabase-studio.example.com` | `localhost:3001` | 資料庫管理 |

Tunnel 配置範例（`config.yml`）：

```yaml
tunnel: your-tunnel-id
credentials-file: /root/.cloudflared/your-tunnel-id.json

ingress:
  - hostname: supabase-api.example.com
    service: http://localhost:8001
  - hostname: supabase-studio.example.com
    service: http://localhost:3001
  - service: http_status:404
```

### 安全考量

- **Studio 存取限制**：建議透過 Cloudflare Access 加上認證，或限制 IP
- **API 安全**：依賴 `anon key` 和 `service_role key` 保護
- **資料庫直連**：僅透過 SSH tunnel 或 VPN 存取，不對外開放 5433

---

## 環境配置變更

### 環境變數抽象化

確保程式碼使用環境變數，而非硬編碼 URL：

```typescript
// ❌ 硬編碼（不要這樣做）
const supabaseUrl = 'https://xxxx.supabase.co'

// ✅ 環境變數
const supabaseUrl = process.env.NUXT_PUBLIC_SUPABASE_URL
```

### wrangler.jsonc 配置

Cloudflare Workers 的環境變數設定：

```jsonc
{
  "vars": {
    "NUXT_PUBLIC_SUPABASE_URL": "https://supabase-api.example.com",
    "NUXT_PUBLIC_SUPABASE_KEY": "<ANON_KEY>"
  }
}
```

### Cloudflare Workers Secrets

敏感金鑰使用 Secrets 管理：

```bash
# 設定 Secrets
wrangler secret put SUPABASE_URL
wrangler secret put SUPABASE_KEY
wrangler secret put SUPABASE_SECRET_KEY
```

---

## CI/CD 變更

### 為什麼移除自動化 db push

Supabase Cloud 環境下，CI 可以直接執行 `supabase db push`。但 Self-hosted 情境：

- CI 無法直接連接內網資料庫
- 需要 SSH tunnel 或 VPN，增加複雜度
- 手動執行更可控、更安全

### 新的部署流程

```
開發環境                           生產環境 (Self-hosted)
┌──────────────────┐              ┌────────────────────────┐
│  本地開發         │              │  /opt/supabase         │
│  supabase start  │              │  docker-compose        │
└────────┬─────────┘              └───────────┬────────────┘
         │                                    │
         ▼                                    ▼
supabase migration new             手動執行 migration
supabase db reset                  docker cp + psql
         │                                    │
         └──────── git push ─────────────────→│
                                              │
                                    拉取最新 migration
                                    手動執行 SQL
```

### Migration 手動執行步驟

```bash
# 1. 複製 migration 檔案到容器
docker cp supabase/migrations/20240124000000_create_table.sql \
  supabase-db:/tmp/

# 2. 執行 migration
docker exec -it supabase-db \
  psql -U postgres -d postgres -f /tmp/20240124000000_create_table.sql

# 3. 驗證結果
docker exec -it supabase-db \
  psql -U postgres -d postgres -c "\dt public.*"

# 4. 清理暫存檔案
docker exec supabase-db rm /tmp/20240124000000_create_table.sql
```

### 批次執行多個 Migration

```bash
# 複製整個 migrations 目錄
docker cp supabase/migrations supabase-db:/tmp/

# 依序執行（按檔名排序）
docker exec supabase-db bash -c '
  for f in /tmp/migrations/*.sql; do
    echo "Executing: $f"
    psql -U postgres -d postgres -f "$f"
  done
'
```

---

## MCP Server 設定

Supabase 內建 MCP Server，讓 Claude Code 可以直接操作資料庫。

### 本地開發環境

連接 `supabase start` 啟動的本地環境：

```json
{
  "mcpServers": {
    "local-supabase": {
      "type": "http",
      "url": "http://localhost:54321/mcp"
    }
  }
}
```

### 透過 SSH Tunnel 連接 Self-hosted

```bash
# 1. 建立 SSH tunnel（本地 8001 → 遠端 8001）
ssh -L 8001:localhost:8001 user@your-server

# 2. MCP 連接本地轉發的端口
```

專案設定（`.mcp.json`）：

```json
{
  "mcpServers": {
    "local-supabase": {
      "type": "http",
      "url": "http://localhost:54321/mcp"
    },
    "remote-supabase": {
      "type": "http",
      "url": "http://localhost:8001/mcp"
    }
  }
}
```

| Server | 用途 | 端口 |
|--------|------|------|
| `local-supabase` | 本地開發（supabase start） | 54321 |
| `remote-supabase` | Self-hosted 生產環境 | 8001（透過 SSH tunnel） |

---

## 日常維護操作

### 服務狀態檢查

```bash
cd /opt/supabase

# 檢視所有服務狀態
docker compose ps

# 檢視特定服務日誌
docker compose logs -f kong      # API Gateway
docker compose logs -f rest      # PostgREST
docker compose logs -f db        # PostgreSQL
docker compose logs -f studio    # Studio UI
```

### 重啟服務

```bash
# 重啟所有服務
docker compose restart

# 重啟單一服務
docker compose restart kong
docker compose restart rest
```

### 資料庫備份

```bash
# 備份特定 schema
docker exec supabase-db pg_dump -U postgres -d postgres \
  --schema=public \
  --schema=your_schema \
  --no-owner \
  --no-privileges \
  > backup_$(date +%Y%m%d).sql

# 備份全部（排除系統 schema）
docker exec supabase-db pg_dump -U postgres -d postgres \
  -N auth \
  -N storage \
  -N realtime \
  -N supabase_functions \
  --no-owner \
  --no-privileges \
  > backup_data_$(date +%Y%m%d).sql
```

### 資料庫還原

```bash
# 複製備份到容器
docker cp backup_20240124.sql supabase-db:/tmp/

# 執行還原
docker exec -it supabase-db \
  psql -U postgres -d postgres -f /tmp/backup_20240124.sql
```

### 定期備份腳本

```bash
#!/bin/bash
# /opt/supabase/scripts/backup.sh

BACKUP_DIR="/opt/supabase/backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

docker exec supabase-db pg_dump -U postgres -d postgres \
  --schema=public \
  --no-owner \
  --no-privileges \
  | gzip > "$BACKUP_DIR/backup_$DATE.sql.gz"

# 保留最近 7 天的備份
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +7 -delete

echo "Backup completed: backup_$DATE.sql.gz"
```

加入 crontab：

```bash
# 每天凌晨 3 點備份
0 3 * * * /opt/supabase/scripts/backup.sh
```

---

## 踩坑經驗

### 端口衝突問題

**問題**：本地 `supabase start` 與 Self-hosted 使用相同端口。

**症狀**：服務啟動失敗或連到錯誤的環境。

**解決**：Self-hosted 一律使用不同端口（8001, 3001, 5433），開發時不會衝突。

### 認證不依賴 Supabase Auth 的優勢

**發現**：如果認證使用 `nuxt-auth-utils` 等外部方案，遷移更簡單。

**原因**：
- RLS 使用自定義的 `set_app_context()`，不依賴 `auth.uid()`
- 不需要遷移 Supabase Auth 的使用者資料
- Session 管理與 Supabase 完全解耦

### 程式碼無需修改

**發現**：只需更新環境變數，程式碼完全不用改。

**前提**：
- 所有 URL 和 Key 都透過環境變數配置
- 沒有硬編碼 Supabase Cloud 的 URL
- API 呼叫都經過 PostgREST，沒有直連資料庫

### Kong 配置遺失

**問題**：MCP endpoint 無法存取。

**原因**：`kong.yml` 沒有設定 `/mcp` 路由。

**解決**：確保 `volumes/api/kong.yml` 包含 MCP 路由設定。

---

## 檢查清單

### 遷移前確認

- [ ] 環境變數已抽象化（非硬編碼 URL）
- [ ] 了解 RLS 策略是否依賴 Supabase Auth
- [ ] 備份 Cloud 資料庫（`pg_dump` 或 Dashboard 匯出）
- [ ] 確認目標伺服器規格足夠

### 部署後確認

- [ ] Docker Compose 所有服務正常運行
- [ ] Cloudflare Tunnel 連線正常
- [ ] Studio 可以登入並存取資料
- [ ] Migration 可手動執行成功
- [ ] 應用程式可正常讀寫資料
- [ ] MCP Server 可正常連接

### 上線後維護

- [ ] 設定定期備份（crontab）
- [ ] 設定監控告警（可選）
- [ ] 文件化維護流程

---

## 最佳實踐總結

1. **端口規劃**：Self-hosted 使用不同端口，避免與本地開發衝突
2. **環境變數**：所有 URL 和 Key 透過環境變數配置，程式碼不需改動
3. **Migration 手動**：不依賴 CI 自動執行，使用 `docker exec psql`
4. **備份策略**：定期 `pg_dump`，排除系統 schema，保留多版本
5. **存取控制**：Studio 加上認證限制，API 依賴 Key 保護
6. **監控日誌**：使用 `docker compose logs` 監控服務狀態

---

## 延伸閱讀

- [Supabase Self-hosting 官方文件](https://supabase.com/docs/guides/self-hosting)
- [Supabase Docker 部署指南](https://supabase.com/docs/guides/self-hosting/docker)
- [Cloudflare Tunnel 文件](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/)
- 上一篇：[Database Function 安全規範](/nuxt/supabase-function-security/)
- 下一篇：[Nitro Server API 設計模式](/nuxt/nitro-api-design/)
