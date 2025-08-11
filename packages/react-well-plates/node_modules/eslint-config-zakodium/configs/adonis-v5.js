export default [
  {
    rules: {
      'import/no-unresolved': 'off',
      'import/default': 'off',
      'import/order': [
        'warn',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
          'newlines-between': 'always',
          alphabetize: { order: 'asc' },
          pathGroups: [
            {
              pattern: '{@ioc:*,@ioc:*/**}',
              group: 'external',
              position: 'after',
            },
            { pattern: 'Contracts/**', group: 'internal', position: 'before' },
            { pattern: 'App/**', group: 'internal', position: 'before' },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
        },
      ],
    },
  },
];
