const { join } = require('path');
module.exports = {
  extends: ['react-app'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2019,
    project: join(__dirname, './tsconfig.json'),
    sourceType: 'module',
  },

  rules: {
    'unused-imports/no-unused-imports': 'off',
    'unused-imports/no-unused-imports-ts': 'off',
    'react/jsx-curly-brace-presence': 'off',
    'no-unused-vars': 'off',
    'jsx-a11y/alt-text': 'off',
    eqeqeq: 'off',
    'no-mixed-operators': 'off',
    'no-useless-concat': 'off',
    'array-callback-return': 'off',
  },
};
