module.exports = {
  extends: 'airbnb-base',
  rules: {
    'arrow-parens': ['error', 'as-needed'],
    'class-methods-use-this': ['warn'],
    'import/prefer-default-export' : 1,
    'import/no-named-as-default': 1,
    "import/no-extraneous-dependencies": ["error", {"devDependencies": true}],
    'max-len': ['warn', 120],
    'no-param-reassign': [2, { props: false }],
    'no-restricted-syntax': ['off', 'FunctionExpression', 'WithStatement'],
    'no-use-before-define': ['error', { functions: false, classes: true }],
    'one-var': ['error', {'const': 'never', 'let': 'always'}],
    'one-var-declaration-per-line': ['error', 'initializations'],
    'space-before-function-paren': ['error', 'never'],
    'no-console' : 0
  },
  globals: {
    'window': false,
    'describe': false,
    'it': false,
    'beforeEach': false,
    'inject': false,
    'expect': false,
    'angular': false,
    'sinon': false,
    'document': false,
    'mocha':true
  },
  settings: {
    'import/resolver': {
      webpack: {
        config: 'webpack/webpack.config.js',
      },
    },
  },
};
