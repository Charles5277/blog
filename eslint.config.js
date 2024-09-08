import js from '@eslint/js';
import vue from 'eslint-plugin-vue';
import ts from 'typescript-eslint';

export default [
  {
    languageOptions: {
      ecmaVersion: 'latest',
    },
  },

  // js
  js.configs.recommended,

  // ts
  ...ts.configs.recommended,

  // vue
  ...vue.configs['flat/recommended'],
  {
    // files: ['*.vue', '**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: ts.parser,
      },
    },
  },
  {
    rules: {
      eqeqeq: 'error',
      camelcase: 'error',
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
      'vue/html-self-closing': 'off',
      'vue/max-attributes-per-line': 'off',
    },
  },
];
