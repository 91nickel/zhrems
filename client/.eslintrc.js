module.exports = {
    env: {
        browser: true,
        es2021: true
    },
    extends: ['plugin:react/recommended'],
    overrides: [],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
    },
    plugins: ['react'],
    rules: {
        indent: ['error', 4],
        curly: ['off'],
        'space-before-function-paren': 0,
        'object-curly-spacing': 0,
        "react/no-unescaped-entities": 0,
        'no-extra-boolean-cast': 'off',
        'comma-dangle': 'off',
        // 'no-unused-vars': 0,
    }
}
