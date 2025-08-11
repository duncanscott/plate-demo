import cheminfoBase from 'eslint-config-cheminfo/base';
import tseslint from 'typescript-eslint';

export default tseslint.config(...cheminfoBase, {
  files: ['**/*.{ts,tsx,cts,mts}'],
  extends: [
    ...tseslint.configs.strictTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    parserOptions: {
      projectService: true,
      warnOnUnsupportedTypeScriptVersion: false,
    },
  },
  rules: {
    //region specific rules of typescript-eslint
    // https://typescript-eslint.io/rules/
    '@typescript-eslint/array-type': [
      'error',
      {
        default: 'array-simple',
        readonly: 'array-simple',
      },
    ],
    // Too noisy for now.
    '@typescript-eslint/no-confusing-void-expression': 'off',
    '@typescript-eslint/no-deprecated': 'warn',
    // Empty interfaces are common (React component props that extend others, AdonisJS default configs).
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-floating-promises': [
      'error',
      {
        ignoreVoid: true,
      },
    ],
    // Only affects special edge cases.
    '@typescript-eslint/no-invalid-void-type': 'off',

    /**
     * @see https://typescript-eslint.io/rules/no-redundant-type-constituents/
     * > primitive types such as string "override" any of their literal types such as ""
     *
     * But `'literal' | string`
     * can be use-full to suggest auto-complete to IDE about known and prevalent literals but accepts other strings
     */
    '@typescript-eslint/no-redundant-type-constituents': 'off',
    // Problematic when doing checks with array elements or values from records.
    '@typescript-eslint/no-unnecessary-condition': 'off',
    // TODO: enable no-unsafe rules when we are ready to ban `any` everywhere.
    '@typescript-eslint/no-unsafe-argument': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-unsafe-return': 'off',
    '@typescript-eslint/no-useless-empty-export': 'error',
    // Clashes with no-non-null-assertion.
    '@typescript-eslint/non-nullable-type-assertion-style': 'off',
    '@typescript-eslint/prefer-enum-initializers': 'warn',
    // TODO: enable when we are ready for it.
    '@typescript-eslint/prefer-nullish-coalescing': 'off',
    '@typescript-eslint/prefer-optional-chain': 'warn',
    '@typescript-eslint/prefer-regexp-exec': 'off',
    '@typescript-eslint/require-array-sort-compare': 'error',
    // We consider it valid to use `async` without `await` in some cases.
    '@typescript-eslint/require-await': 'off',
    '@typescript-eslint/restrict-template-expressions': [
      'error',
      // TODO: remove allowAny when we are ready.
      { allowAny: true },
    ],
    '@typescript-eslint/switch-exhaustiveness-check': 'error',
    // It is useful to split signatures for readability and documentation.
    '@typescript-eslint/unified-signatures': 'off',
    //endregion

    //region rules from eslint override by typescript-eslint
    'default-param-last': 'off',
    '@typescript-eslint/default-param-last': 'error',
    'no-dupe-class-members': 'off',
    '@typescript-eslint/no-dupe-class-members': 'error',
    'no-empty-function': 'off',
    '@typescript-eslint/no-empty-function': 'warn',
    'no-loop-func': 'off',
    '@typescript-eslint/no-loop-func': 'error',
    'no-redeclare': 'off',
    '@typescript-eslint/no-redeclare': 'error',
    // no-unreachable is disabled by the typescript-eslint plugin, because it can be checked by the TypeScript compiler.
    // But we re-enable here it because treating it as an error requires setting `allowUnreachableCode` to false in the compiler options.
    'no-unreachable': 'error',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { vars: 'all', args: 'after-used', ignoreRestSiblings: true },
    ],
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: ['typeLike'],
        format: ['PascalCase'],
      },
      {
        selector: ['variable', 'typeProperty'],
        format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
        leadingUnderscore: 'allowSingleOrDouble',
      },
      {
        selector: ['function', 'typeMethod'],
        format: ['camelCase', 'PascalCase'],
      },
      {
        selector: [
          'method',
          'classProperty',
          'classMethod',
          'parameterProperty',
          'accessor',
        ],
        format: ['camelCase'],
        leadingUnderscore: 'allowSingleOrDouble',
      },
      {
        selector: [
          'objectLiteralProperty',
          'objectLiteralMethod',
          'enumMember',
        ],
        format: null,
      },
    ],
    //endregion
  },
});
