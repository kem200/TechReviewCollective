module.exports = {
  root: true,
  env: { browser: true, es2020: true, node: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  ignorePatterns: ['dist', 'node_modules'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',  // This rule is set to 'warn' so it won't block the build
      { allowConstantExport: true },
    ],
    'react/prop-types': 'off', // Turn off prop-types rule
    'no-console': 'warn', // Change 'error' to 'warn' for console statements
    'no-unused-vars': 'warn', // Change 'error' to 'warn' for unused variables
    'react/jsx-no-duplicate-props': 'warn', // Change duplicate props error to a warning
  },
};
