import globals from 'globals';

export default [
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        chrome: 'readonly',
        // Add other global variables if needed, e.g., for WebExtensions APIs
      },
    },
    rules: {
      // Enable recommended rules
      // For example, you might want to extend from a recommended set:
      // ...eslint.configs.recommended.rules,
      // Or define specific rules:
      'no-unused-vars': 'warn',
      'no-console': 'off',
      'indent': ['error', 2],
      'linebreak-style': ['error', 'unix'],
      'quotes': ['error', 'single'],
      'semi': ['error', 'always'],
    },
  },
];