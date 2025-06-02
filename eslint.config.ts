import antfu from '@antfu/eslint-config'

export default antfu({
  ignores: ['**/*.md'],
  rules: {
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
    'vue/html-self-closing': 'off',
    'vue/max-attributes-per-line': 'off',
  },
})
