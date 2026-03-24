// eslint.config.js
import { defineConfig } from 'eslint/config';

export default defineConfig({
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    // your custom rules
  },
});
