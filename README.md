# Form Blueprint

[![npm](https://img.shields.io/npm/v/form-blueprint.svg)](https://www.npmjs.com/package/form-blueprint) [![David](https://img.shields.io/david/tyler-johnson/form-blueprint.svg)](https://david-dm.org/tyler-johnson/form-blueprint) [![Build Status](https://travis-ci.org/tyler-johnson/form-blueprint.svg?branch=master)](https://travis-ci.org/tyler-johnson/form-blueprint)

Helpers for validating and handling form blueprint objects.

## Install

Install via NPM:

```sh
npm i form-blueprint --save
```

## Usage

```js
import * as bpTools from "form-blueprint";
```

### validate()

```text
bpTools.validate( blueprint )
```

Validates a blueprint object. An error is thrown if the value is invalid.

### merge()

```text
bpTools.merge( blueprint1, blueprint2 [, ... blueprintN ] )
```

Merges blueprint several objects together into a new blueprint. The last blueprint wins when there are section and option conflicts.

### defaults()

```text
bpTools.defaults( blueprint )
```

Returns an object of default blueprint values.

### applyDefaults()

```text
bpTools.applyDefaults( blueprint, object )
```

Applies a blueprint's default values to an object. The default values are only set if the object's value is undefined or an empty string.
