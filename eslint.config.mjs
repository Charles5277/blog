import antfu from '@antfu/eslint-config';

export default antfu(
  {
    ignores: [
      'docs/.vitepress/dist',
      'node_modules',
      'eslint.config.mjs',
      'docs/.vitepress/json/*.json',
    ],
    formatters: {
      css: true,
      html: true,
      markdown: 'prettier',
    },
    typescript: true,
    vue: true,
    json: false,

    stylistic: {
      indent: 2,
      quotes: 'single',
      semi: true,
    },

    rules: {
      'semi': 'error',
      'eqeqeq': 'warn',
      'camelcase': 'warn',
      'vue/max-len': ['error', {
        code: 120,
        template: 120,
        tabWidth: 2,
        comments: 120,
      }],
      'prefer-const': ['error', { destructuring: 'all' }],
      'no-console': 'off',
      'vue/operator-linebreak': ['error', 'before'],
      'vue/script-indent': ['error', 2, { baseIndent: 1 }],
      'style/indent': 'off',
      'vue/html-closing-bracket-newline': [
        'error',
        {
          singleline: 'never',
          multiline: 'always',
          selfClosingTag: {
            singleline: 'never',
            multiline: 'always',
          },
        },
      ],
      'vue/max-attributes-per-line': ['error', {
        singleline: {
          max: 1,
        },
        multiline: {
          max: 1,
        },
      }],
      'vue/multiline-html-element-content-newline': ['error', {
        ignoreWhenEmpty: true,
        allowEmptyLines: false,
      }],
      'vue/singleline-html-element-content-newline': ['error', {
        ignoreWhenNoAttributes: true,
        ignoreWhenEmpty: true,
        externalIgnores: [],
      }],
    },
  },
);
