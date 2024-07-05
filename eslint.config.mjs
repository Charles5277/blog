import antfu from '@antfu/eslint-config';

export default antfu(
  {
    ignores: [
      'docs/.vitepress/dist',
      'node_modules',
      'eslint.config.mjs',
    ],
    formatters: {
      css: true,
      html: true,
      markdown: 'prettier',
    },

    typescript: true,
    vue: true,

    stylistic: {
      indent: 2,
      quotes: 'single',
      semi: true,
    },

    rules: {
      'semi': 'error',
      'eqeqeq': 'warn',
      'camelcase': 'warn',
      'vue/max-attributes-per-line': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'prefer-const': ['error', { destructuring: 'all' }],
      'no-console': 'off',
      'vue/operator-linebreak': ['error', 'before'],
      'vue/script-indent': ['error', 2, { baseIndent: 1 }],
      'style/indent': 'off',
    },
  },
);
