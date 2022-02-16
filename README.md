# unimport

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![Github Actions][github-actions-src]][github-actions-href]
[![Codecov][codecov-src]][codecov-href]

> Package description

## Usage

Install package:

```sh
# npm
npm install unimport

# yarn
yarn install unimport

# pnpm
pnpm install unimport
```

Import:

```js
// ESM
import { createUnimport } from 'unimport'

// CommonJS
const { createUnimport } = require('unimport')
```

```js
const { addImports } = createUnimport({
  imports: [{ name: 'fooBar', from: 'test-id' }]
})

// { code: "import { fooBar } from 'test-id';console.log(fooBar())" }
console.log(addImports('console.log(fooBar())'))
```

## 💻 Development

- Clone this repository
- Enable [Corepack](https://github.com/nodejs/corepack) using `corepack enable` (use `npm i -g corepack` for Node.js < 16.10)
- Install dependencies using `yarn install`
- Run interactive tests using `yarn dev`

## License

Made with 💛

Published under [MIT License](./LICENSE).

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/unimport?style=flat-square
[npm-version-href]: https://npmjs.com/package/unimport

[npm-downloads-src]: https://img.shields.io/npm/dm/unimport?style=flat-square
[npm-downloads-href]: https://npmjs.com/package/unimport

[github-actions-src]: https://img.shields.io/github/workflow/status/unjs/unimport/ci/main?style=flat-square
[github-actions-href]: https://github.com/unjs/unimport/actions?query=workflow%3Aci

[codecov-src]: https://img.shields.io/codecov/c/gh/unjs/unimport/main?style=flat-square
[codecov-href]: https://codecov.io/gh/unjs/unimport