# Form Blueprint

[![npm](https://img.shields.io/npm/v/form-blueprint.svg)](https://www.npmjs.com/package/form-blueprint) [![Build Status](https://travis-ci.org/tyler-johnson/form-blueprint.svg?branch=master)](https://travis-ci.org/tyler-johnson/form-blueprint)

Helpers for validating and handling form blueprint objects.

## Install

Install via NPM:

```sh
npm i form-blueprint
```

## Basic Usage

```js
import createBlueprint from "form-blueprint";

const blueprint = createBlueprint({
  foo: {
    type: "text",
    label: "Foo",
    default: "bar"
  },
  numberino: {
    type: "number",
    label: "A Number!",
    default: 123
  }
});

const data = blueprint.transform();
console.log(data); // { foo: "bar", numberino: 123 }
```

## Blueprint Specification

A form blueprint is defined by a schema, which is just a simple JavaScript object. The schema can be very deep, describing both the resulting data structure as well as the elements that make up the HTML form.

In general, we use the YAML format to describe form blueprints. Here is a very simple form blueprint, describing a single input field:

```yaml
type: text
label: A Text Field
```

### General Properties

All field schemas can have these properties.

- `key` - The property on the parent this field's data will be set on. In general, this value is determined for you.
- `type` - The type of the field. Types are listed below in detail. This is the only required property.
- `label` - The human readable identifier for this field.
- `description` - A description of the field.
- `children` - An array of children fields. In general, leave this empty.
- `default` - A default value to use when the form field is left blank.

### Field Types

These are a few of the common field types supported by form-blueprint.

#### Basic Types

Basic types typically match that of a standard input element. They do not take any special properties.

```yaml
# text input
type: text
label: A Text Field
```

```yaml
# number input
type: number
label: A number field
default: 10
```

```yaml
# checkbox input
type: checkbox
label: Enable something?
default: true
```

#### Section

A higher-order type that composes several fields together and organizes their values into an object.

A section accepts one of two different structures. The first being the most regular, using an object with type `"section"`. This will take one special field:

- `options` - An object of keys mapped to more field schemas. Note that this property comes from legacy versions of form-blueprint, and using `children` instead is also acceptable.

```yaml
type: section
options:
  foo:
    type: text
    label: Foobar
  hello:
    type: checkbox
    label: say hello?
```

The second form that can be used for sections is much simpler and generally recommended. As long as your resulting data structure does not have a property named `type`, you can skip the outer object and just use the contents of the `options` property. So the example above, would turn into the following in short form:

```yaml
foo:
  type: text
  label: Foobar
hello:
  type: checkbox
  label: say hello?
```

#### List

Another higher-order type that allows the end user to create as many values as needed. This will more or less just repeat a form-blueprint for every time the user clicks the add button and produces and array of values for the result.

This uses the type `"list"` and has one special property:

- `field` - A child form-blueprint schema to repeat N times. This can be any valid type, including sections and even more lists.

```yaml
type: list
label: list
field:
  type: text
  label: A Text Field
```
