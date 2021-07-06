module.exports = {
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 8
    },
    "rules": {
        // enable additional rules
        // "no-magic-numbers": "warn", // sehr heftig
        "semi": ["warn", "always"],
        "no-constant-condition": ["error", {"checkLoops": false}],
        "no-console": "error",
        "no-var": "error",
        "guard-for-in": "error",   // http://thecodebarbarian.com/for-vs-for-each-vs-for-in-vs-for-of-in-javascript.html
        //"prefer-const": "warn"
    },
    "env": {
        "browser": true,
        "qunit": true,
        "es6": true
    },
    "globals": {
        "THREE": false
    }
};