## [6.1.1](https://github.com/tyler-johnson/form-blueprint/tree/release/5/) - Mar 30, 2021

### Fixes
- Children fields without keys are properly normalized. This fixed an issue with defaults not applying to list types.

### Commits
[`bbed36d1..d7f2edc2`](https://github.com/tyler-johnson/form-blueprint/compare/bbed36d13406bd83687c7cec5497440b51c390fe..d7f2edc26254f6107b6d30afc190b6561b5c47d7)
- [`d7f2edc2`](https://github.com/tyler-johnson/form-blueprint/commit/d7f2edc26254f6107b6d30afc190b6561b5c47d7) Merge pull request #22 from tyler-johnson/dev
- [`89549faf`](https://github.com/tyler-johnson/form-blueprint/commit/89549fafbf9e551edbc8e8cd9dfa74f846266d00) normalize children without keys


## [6.1.0](https://github.com/tyler-johnson/form-blueprint/tree/release/4/) - Mar 12, 2021

### Features
- Rules can define a `serialize()` method which is used to modify a field before it gets serialized. This works similarly to `normalize()` and can be thought of as the inverse operation to `normalize()`, usually undoing what `normalize()` changed.  `serialize()` should be used to compress the field data for stringification and transfer.
- Field.serialize() now returns an object of type `FieldCreate` and not `FieldSerialized`. It will attempt to reduce the field to the smallest form of `FieldCreate` that can still be interpretted correctly. The `FieldSerialized` has been removed.

### Commits
[`5dd1792a..995ea36c`](https://github.com/tyler-johnson/form-blueprint/compare/5dd1792a305461734bd5694f1ff599ffcab187db..995ea36c080af44a8ec537ca620d2840a448ac09)
- [`995ea36c`](https://github.com/tyler-johnson/form-blueprint/commit/995ea36c080af44a8ec537ca620d2840a448ac09) Merge pull request #21 from tyler-johnson/dev
- [`9164a3ba`](https://github.com/tyler-johnson/form-blueprint/commit/9164a3ba8eabf8d5eb72d70015d8cc88a6ecd3b6) patch fromEntries
- [`6b4fc218`](https://github.com/tyler-johnson/form-blueprint/commit/6b4fc21876195bebb54a949acf3bbde9976deed5) better serialization


## [6.0.1](https://github.com/tyler-johnson/form-blueprint/tree/release/3/) - Mar 12, 2021

### Fixes
- Properly set field key on joins with null keys.

### Commits
[`098999ca..1e1ed0a3`](https://github.com/tyler-johnson/form-blueprint/compare/098999ca5df8fbfbdfeebf0cb43d723c7ba566c2..1e1ed0a3cb52078072fe06452cf78a0c5006e240)
- [`1e1ed0a3`](https://github.com/tyler-johnson/form-blueprint/commit/1e1ed0a3cb52078072fe06452cf78a0c5006e240) Merge pull request #20 from tyler-johnson/dev
- [`4d500233`](https://github.com/tyler-johnson/form-blueprint/commit/4d50023302457286a3cf767e1c2233cae5650014) fix null key joining


## [6.0.0](https://github.com/tyler-johnson/form-blueprint/tree/release/2/) - Mar 11, 2021

### Breaking
- Changed `join()` method to combine children and props on fields of the same key and type, unlike the previous which generally would overwrite. The exception to this is fields matching the list and values rules, which overwrite children completely.
- Additionally, `join()` also now works like `Object.assign()`. Items are merged left-to-right, with the right-most item replacing data in the items left of it. The same applies to rules implementing a custom `join()`; the 2nd argument should replace the 1st.
- Both fields given to a rule's custom `join()` are guaranteed to match the rule and have the same key.
- The first rule's custom `join()` to return a field is used and the remaining rules are ignored.
- Renamed `Field.getChildField()` to `Field.findChildByKey()`.
- Fields `key` and `type` are no longer typed as `string | null` and are now `string | undefined`.
- `Schema.normalize()` no longer runs recursively on children fields, however the new rule 'children' does.
- The arguments for `transform()` have been flipped, it is now `transform(field, value)`.

### Features
- The `serialize()` method will no longer output empty properties.
- Added new rules: children, color, and values

### Dependencies
- @types/color: none → `^3.0.1`
- @types/lodash.topath: `^4.5.4` → `^4.5.6`
- color: none → `^3.1.3`
- immutable: `^4.0.0-rc.10` → `^4.0.0-rc.12`
- tslib: `^1.9.3` → `^2.1.0`
- @babel/core: none → `^7.13.10`
- @babel/eslint-parser: none → `^7.13.10`
- @pagedip/tool-autorelease: `^3.5.4` → `^3.9.2`
- @types/jest: `^24.0.11` → `^26.0.20`
- @types/node: `^11.13.6` → `^14.14.33`
- @typescript-eslint/eslint-plugin: `^1.6.0` → `^4.17.0`
- @typescript-eslint/parser: `^1.6.0` → `^4.17.0`
- cross-env: `^5.2.0` → `^7.0.3`
- eslint: `^5.16.0` → `^7.21.0`
- eslint-config-prettier: `^4.1.0` → `^8.1.0`
- eslint-plugin-no-unsanitized: `^3.0.2` → `^3.1.4`
- eslint-plugin-prettier: `^3.0.1` → `^3.3.1`
- jest: `^24.0.0` → `^26.6.3`
- prettier: none → `^2.2.1`
- shx: `^0.3.2` → `^0.3.3`
- ts-jest: `^24.0.2` → `^26.5.3`
- typedoc: `^0.14.2` → `^0.20.30`
- typescript: `^3.1.2` → `^4.2.3`

### Commits
[`9d341e34..855a6ada`](https://github.com/tyler-johnson/form-blueprint/compare/9d341e3496a417c79241d7b34e86d08efb6c02c9..855a6ada9d93f4d43fa2384f48210a9a9a0b7657)
- [`855a6ada`](https://github.com/tyler-johnson/form-blueprint/commit/855a6ada9d93f4d43fa2384f48210a9a9a0b7657) Merge pull request #19 from tyler-johnson/dev
- [`3fda191f`](https://github.com/tyler-johnson/form-blueprint/commit/3fda191fc59eeb6fc9a72f59aea63e8e55bf51a1) update release
- [`a7bf1398`](https://github.com/tyler-johnson/form-blueprint/commit/a7bf1398ffa91bc0db31c231a271942d107566d5) update travis config
- [`a3f50207`](https://github.com/tyler-johnson/form-blueprint/commit/a3f5020717afd2cf07b4cc31356ab7d1a0b695b4) update lockfile
- [`3bd6a894`](https://github.com/tyler-johnson/form-blueprint/commit/3bd6a894eeb81c1ed32bb3e179b4e76dd9265225) added actual blueprint merging and added some new rules


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


