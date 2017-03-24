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
import createBlueprint, { Blueprint, Schema, Field, defaultSchema } from "form-blueprint";
```

### createBlueprint()

```text
createBlueprint( blueprint [, schema ] )
```

Creates a new blueprint object with a schema. If a schema is not provided, the builtin default schema is used.


### Blueprint#root

```text
blueprint.root
```

The blueprint's root field object.

### Blueprint#schema

```text
blueprint.schema
```

The blueprint's schema object.

### Blueprint#getField()

```text
blueprint.getField( key )
```

Get a field in a blueprint by key. The key can be complex to get deep values (eg. `a[0].b.c`).

### Blueprint#transform()

```text
blueprint.transform( [ value ] )
```

Transforms a value according to the blueprint and schema rules. Value does not need to be provided, in which case default values are returned.

### Blueprint#normalize()

```text
blueprint.normalize()
```

Normlaize a blueprint using schema rules. This generally doesn't need to be called as this run when a blueprint is created.

### Blueprint#join()

```text
blueprint.join( blueprint1 [, blueprint2 [, ... ] ] )
```

Joins one or more blueprints together into a single blueprint. The blueprint that join is called on is considered the master blueprint. The master's schema is used to join and upon conflicts, the master's copy will always win.
