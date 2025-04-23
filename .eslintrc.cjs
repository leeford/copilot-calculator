module.exports = {
    parser: '@typescript-eslint/parser',
    plugins: [
        '@typescript-eslint',
        'react',
        'react-hooks'
    ],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended'
    ],
    settings: {
        react: {
            version: 'detect'
        }
    },
    rules: {
        'quotes': ['error', 'double'],
        'react/prop-types': 'off',
        'react/react-in-jsx-scope': 'off'
    },
    env: {
        browser: true,
        node: true
    },
    parserOptions: {
        ecmaFeatures: {
            jsx: true
        }
    }
};