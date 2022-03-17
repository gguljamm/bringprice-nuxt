module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 2017,
    sourceType: 'module',
  },
  env: {
    browser: true,
    node: true
  },
  extends: [
    'airbnb-base',
    'plugin:vue/essential',
  ],
  plugins: [
    'vue',
  ],
  settings: {
    'import/core-modules': [
      'vue', // vueはnuxtが抱えているため明記する必要がある
    ],
  },
  globals: {},
  rules: {
    'linebreak-style': 0,
    // don't require .vue extension when importing
    'import/extensions': ['error', 'always', {
      'js': 'never',
      'vue': 'never'
    }],
    // allow optionalDependencies
    'import/no-extraneous-dependencies': ['error', {
      'optionalDependencies': ['test/unit/index.js']
    }],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    "no-underscore-dangle" : 1,
    'max-len': 'off',
  },
}
