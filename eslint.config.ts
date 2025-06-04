import antfu from '@antfu/eslint-config';

export default antfu({
  vue: true,
  typescript: true,

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
    'camelcase': 'error',
    'vue/eqeqeq': 'error',
    'no-await-in-loop': 'error',
    'require-atomic-updates': 'error',
    'max-nested-callbacks': ['warn', 3],
    'no-return-await': 'error',
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
    'style/indent': 'off',
    'vue/script-indent': ['error', 2, { baseIndent: 1 }],
  },
});
