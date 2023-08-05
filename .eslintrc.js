module.exports = {
  env: {
    node: true,
    es6: true
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  globals: {},
  plugins: ['@typescript-eslint', 'unused-imports'],
  root: true,
  rules: {
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    'no-prototype-builtins': 'off'
  },
  settings: {}
};
