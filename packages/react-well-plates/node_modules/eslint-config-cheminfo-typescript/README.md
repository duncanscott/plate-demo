# eslint-config-cheminfo-typescript

Shared ESLint config for TypeScript projects.

> [!IMPORTANT]  
> Configs now require to use the ESLint Flat Config format.
> See the [migration guide](https://github.com/cheminfo/eslint-config/blob/main/MIGRATION.md) for more information.

## Installation

```console
npm i -D eslint-config-cheminfo-typescript eslint@^8.57.0
```

## Usage

Create a `eslint.config.mjs` file with the following contents:

```js
import cheminfo from 'eslint-config-cheminfo-typescript';

export default [...cheminfo];
```

You can then customize the config for your project.

## Exported configurations

This package exports three separate configurations:

- [`eslint-config-cheminfo-typescript/base`](./base.js): The base config with most rules. At least this config should be used in all TypeScript projects.
- [`eslint-config-cheminfo-typescript/jsdoc`](./jsdoc.js): Rules from the [jsdoc plugin](https://github.com/gajus/eslint-plugin-jsdoc) to help improve the documentation of our libraries.
- [`eslint-config-cheminfo-typescript/unicorn`](./unicorn.js): Additional opinionated rules selected from the [unicorn plugin](https://github.com/sindresorhus/eslint-plugin-unicorn).

The default export from [`eslint-config-cheminfo-typescript`](./index.js) combines all of them.

## References

This config extends our [`eslint-config-cheminfo`](https://github.com/cheminfo/eslint-config) JavaScript config.
