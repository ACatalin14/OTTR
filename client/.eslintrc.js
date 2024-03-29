module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    'eslint:recommended'
  ],
  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    'vue/valid-v-on': 'off',
    'no-unused-vars': 'off',
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
};
