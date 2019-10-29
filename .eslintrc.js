
module.exports = {
  extends: [
    "eslint:recommended",
  ],
  parserOptions: {
    codeFrame: false,
    ecmaVersion: 6,
    ecmaFeatures: {
      jsx: true,
      experimentalObjectRestSpread: true
    }
  },
  env: {
    browser: true,
    es6: true,
  },
  rules: {
    "no-console": 0,
    "no-extra-semi": 0,
    semi: 1,
    eqeqeq: 1,
    "no-unused-vars": 1,
    "no-useless-escape": 1,
    "prefer-const": ["error", {
        "destructuring": "any",
        "ignoreReadBeforeAssign": false
    }]
  }
};
