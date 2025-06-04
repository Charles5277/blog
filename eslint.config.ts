import antfu from '@antfu/eslint-config';
import stylistic from '@stylistic/eslint-plugin';

export default antfu({
  ignores: ['**/*.md', '.vscode/**'],
  typescript: true,
  vue: true,
  plugins: {
    '@stylistic': stylistic,
  },
  rules: {
    '@stylistic/semi': ['error', 'always'],
    '@stylistic/member-delimiter-style': ['error', {
      multiline: {
        delimiter: 'semi',
        requireLast: true,
      },
      singleline: {
        delimiter: 'semi',
        requireLast: false,
      },
    }],
    'no-useless-escape': 'off',
    'eqeqeq': 'error',
    'camelcase': 'error',
    'vue/eqeqeq': 'error',
    'no-async-promise-executor': 'error',
    'no-await-in-loop': 'error',
    'no-promise-executor-return': 'error',
    'require-atomic-updates': 'error',
    'max-nested-callbacks': ['warn', 3],
    'no-return-await': 'error',
    'prefer-promise-reject-errors': 'error',
    'prefer-const': 'error',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/max-attributes-per-line': 'off',
    'vue/require-component-is': 'off',
    'no-console': ['error', { allow: ['warn', 'error'] }],
    // 關閉衝突的規則，只保留 vue/script-indent
    'style/indent': 'off',
    'vue/script-indent': ['error', 2, { baseIndent: 1 }],
  },
});
