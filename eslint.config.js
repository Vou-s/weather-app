// eslint.config.js
import angular from '@angular-eslint/eslint-plugin';
import angularTemplate from '@angular-eslint/eslint-plugin-template';
import globals from 'globals';

/** @type {import("eslint").Linter.Config} */
export default [
  {
    files: ['**/*.ts'],
    languageOptions: {
      sourceType: 'module',
      ecmaVersion: 2022,
      globals: {
        ...globals.browser,
      },
    },
    plugins: {
      '@angular-eslint': angular,
    },
    rules: {
      // aturan Angular/TypeScript
    },
  },
  {
    files: ['**/*.html'],
    plugins: {
      '@angular-eslint/template': angularTemplate,
    },
    rules: {
      // aturan HTML Angular template
    },
  },
];
