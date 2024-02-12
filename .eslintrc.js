module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:jest/recommended',
    'plugin:prettier/recommended',
  ],
  plugins: ['@typescript-eslint', 'jest', 'prettier'],
  parserOptions: {
    ecmaVersion: 15,
    sourceType: 'module',
  },
  env: {
    node: true,
    es6: true,
    jest: true,
  },
  rules: {
    'eol-last': ['error', 'always'],
    'newline-before-return': 'warn',
    'import/extensions': 0,
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: false,
        optionalDependencies: false,
        peerDependencies: false,
      },
    ],
    'semi': 'warn',
    // comma-dangle controlled by @typescript-eslint below
    'comma-dangle': 'off',
    '@typescript-eslint/comma-dangle': ['error', 'always-multiline'],
    // quotes controlled by @typescript-eslint below
    'quotes': 'off',
    '@typescript-eslint/quotes': [
      'warn',
      'single',
      {
        allowTemplateLiterals: true,
      },
    ],
    'no-shadow': 'off', // no-shadow controlled by @typescript-eslint below
    '@typescript-eslint/no-shadow': ['error'],
    'arrow-parens': ['warn', 'always'],
    // indent controlled by prettier, no linters must be involved here
    'indent': 'off',
    '@typescript-eslint/indent': 'off',
    // do not trust anybody, even yourself
    '@typescript-eslint/no-non-null-assertion': 'off',
    // unused vars are only allowed using preceeding underscore
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
      },
    ],
    // single whitespace before comment. Readability 📈📈📈
    'spaced-comment': ['warn', 'always'],
    // empty lines don't do anything, man
    'no-multiple-empty-lines': [
      'warn',
      {
        max: 2,
        maxEOF: 0,
      },
    ],
    // no default export because why would you want to have one thing names differently across the app?
    'import/prefer-default-export': 'off',
    'import/export': 'off',
    'import/order': [
      'error',
      {
        'groups': [['external', 'internal', 'builtin'], ['sibling', 'parent'], 'index', 'object'],
        'pathGroups': [
          {
            pattern: '@nestjs/**',
            group: 'external',
            position: 'after',
          },
        ],
        'pathGroupsExcludedImportTypes': ['builtin'],
        'newlines-between': 'always',
        'alphabetize': {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
    // NestJS tends to have empty constructors
    'no-useless-constructor': 'off',
    // empty function = empty constructor as well
    'no-empty-function': 'off',
    // make sure to always have return type specified!
    '@typescript-eslint/explicit-function-return-type': 'error',
    // useless in NestJS
    'class-methods-use-this': 'off',
    // up to developer, feel free to disable
    'consistent-return': 'off',
    // NestJS tends to have circular dependencies
    'import/no-cycle': 'off',
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.ts'],
      },
    },
  },
};
