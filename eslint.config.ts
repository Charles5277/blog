import antfu from '@antfu/eslint-config';

export default antfu({
  stylistic: {
    indent: 2,
    quotes: 'single',
  },

  typescript: true,
  vue: true,
  formatters: true,

  ignores: [
    '**/*.md',
  ],
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
    'vue/require-component-is': 'off',
    'vue/max-attributes-per-line': ['error', {
      singleline: {
        max: 1,
      },
      multiline: {
        max: 1,
      },
    }],
    'no-console': ['error', { allow: ['warn', 'error'] }],
    // 關閉衝突的規則，只保留 vue/script-indent
    'style/indent': 'off',
    'vue/script-indent': ['error', 2, { baseIndent: 1 }],
  },
});
