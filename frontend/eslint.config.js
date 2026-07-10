import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import prettier from 'eslint-config-prettier';

export default [
  { ignores: ['build/', 'coverage/'] },

  // Base: regras de qualidade de código do ESLint
  js.configs.recommended,

  // React (flat config recommended)
  react.configs.flat.recommended,

  // Ambiente browser (ESM) + hooks + ajustes do projeto
  {
    files: ['src/**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      globals: { ...globals.browser },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: { 'react-hooks': reactHooks },
    settings: { react: { version: 'detect' } },
    rules: {
      // React 19 usa o novo JSX transform: não é preciso importar React em escopo
      'react/react-in-jsx-scope': 'off',
      // prop-types não é usado de forma consistente no projeto
      'react/prop-types': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', ignoreRestSiblings: true },
      ],
    },
  },

  // Prettier por último: desliga regras de formatação que conflitam
  prettier,
];
