## [5.0.0](https://github.com/tyler-johnson/form-blueprint/tree/release/1/) - Apr 20, 2019

### Breaking
- Set the defaults rule as the first rule so that its transform runs before the others. This is important so that other rule transforms have a chance to operate on the user selected default.

### Chores
- Removed the deprecated method `Schema#apply()`.

### Dependencies
- tslib: none → `^1.9.3`
- @pagedip/tool-autorelease: none → `^3.5.4`
- @types/jest: `^23.3.5` → `^24.0.11`
- @types/node: `^10.11.7` → `^11.13.6`
- @typescript-eslint/eslint-plugin: none → `^1.6.0`
- @typescript-eslint/parser: none → `^1.6.0`
- eslint: none → `^5.16.0`
- eslint-config-prettier: none → `^4.1.0`
- eslint-plugin-no-unsanitized: none → `^3.0.2`
- eslint-plugin-prettier: none → `^3.0.1`
- jest: `^23.6.0` → `^24.0.0`
- ts-jest: `^23.10.4` → `^24.0.2`
- typedoc: `^0.11.1` → `^0.14.2`

### Commits
[`e3cc95bd..2938da27`](https://github.com/tyler-johnson/form-blueprint/compare/e3cc95bd75630615cc8bb1e6b30a7c71e424c5f9..2938da270cdfab1f9ae6eb32423c3d22b2438850)
- [`2938da27`](https://github.com/tyler-johnson/form-blueprint/commit/2938da270cdfab1f9ae6eb32423c3d22b2438850) npm run instead of yarn
- [`6dea05d5`](https://github.com/tyler-johnson/form-blueprint/commit/6dea05d59cf0550cec448eea6209370375955457) Merge pull request #18 from tyler-johnson/dev
- [`f95a7196`](https://github.com/tyler-johnson/form-blueprint/commit/f95a71968d2854ccb591029de378a19b26768563) update vscode settings
- [`13aa6d83`](https://github.com/tyler-johnson/form-blueprint/commit/13aa6d83116727e27060d348c3114eb66ec071ea) fix lockfile locations for @pagedip packages
- [`7fd68782`](https://github.com/tyler-johnson/form-blueprint/commit/7fd6878229beb7775107bb42ab62e3c5bc98b680) remove deprecated method
- [`be5f274d`](https://github.com/tyler-johnson/form-blueprint/commit/be5f274d73e80802274b331333a5006383c24521) make breaking change
- [`378307a1`](https://github.com/tyler-johnson/form-blueprint/commit/378307a186e5e7c070c30d447c08384e471f724f) switch linting to eslint
- [`4ea227cf`](https://github.com/tyler-johnson/form-blueprint/commit/4ea227cf9edf14dd75b5dec84643431b35d82120) Merge branch 'dev' of https://github.com/tyler-johnson/form-blueprint into dev
- [`c3817ee1`](https://github.com/tyler-johnson/form-blueprint/commit/c3817ee1e9dfc078008e403d27321ba0d01643d4) fix order of rules
- [`cf1f8f3f`](https://github.com/tyler-johnson/form-blueprint/commit/cf1f8f3f51bfa51b8693f833d788df2cc3576f19) update travis config
- [`4ae58c97`](https://github.com/tyler-johnson/form-blueprint/commit/4ae58c979ed22b7044edad455d47da6580a2345c) upgrade deps
- [`dfdb8856`](https://github.com/tyler-johnson/form-blueprint/commit/dfdb88560caa1f28f5b39683bc0f8130ddb36630) Merge branch 'master' of https://github.com/tyler-johnson/form-blueprint into dev
- [`14d1f6a1`](https://github.com/tyler-johnson/form-blueprint/commit/14d1f6a112d2a1c4e92e6c4e9983bb7b258fc818) add release.yml


