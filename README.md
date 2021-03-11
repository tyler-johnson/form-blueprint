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
    default: "bar",
  },
  numberino: {
    type: "number",
    label: "A Number!",
    default: 123,
  },
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

- `key` - The unique string within the parent. The value is derived from the object the field is set on.
- `type` - The type of the field. Types are listed below in detail. This is the only required property.
- `label` - The human readable identifier for this field.
- `description` - A description of the field.
- `default` - A default value to use when the form field is left blank.
- `visible` - A selector to conditionally show/hide this field depending on other form values (see below).

### Field Types

These are the field types supported by Pagedip.

#### Text

The most basic field is the text field. Use the type `"text"` for a basic input field, or use `"textarea"` for a multi-line input. This does not take any special properties.

```yaml
type: text
label: A Text Field
```

#### Number

Very similar to the text field, this is a field for numbers. Use the type `"number"`. This does not take any special properties.

```yaml
type: number
label: A number field
default: 10
```

#### Color

Similar to text field and number, presents a color wheel for choosing a color. Use the type `"color"`. This does not take any special properties.

```yaml
type: color
label: Choose a color:
default: magenta
```

#### Checkbox

Displays a checkbox with a label to the right. Use the type `"checkbox"`. This does not take any special properties.

```yaml
type: checkbox
label: Enable something?
default: true
```

#### Dropdown

A dropdown with selectable options. Use the type `"select"` or `"dropdown"`. This takes one special property:

- `values` - An object or array with items for the dropdown. See below for a description of this object.

```yaml
type: dropdown
label: Select one
values:
  - Option 1
  - Option 2
  - Option 3
```

#### Radio

Similar to dropdown, but displays the values as a list radio options. Use the type `"radio"`. This takes one special property:

- `values` - An object or array with items for the radio. See below for a description of this object.

```yaml
type: radio
label: Select one
values:
  - Option 1
  - Option 2
  - Option 3
```

#### Section

A higher-order type that composes several fields together and organizes their values into an object.

A section accepts one of two different structures. The first being the most regular, using an object with type `"section"`. This will take one special field:

- `children` - An object of keys mapped to more field schemas. This is also aliased as `options` which was the property used in the past.

```yaml
type: section
children:
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

- `field` - A child form-blueprint schema to repeat N times. This can be literally any valid type, including sections and even more lists.

```yaml
type: list
label: list
field:
  type: text
  label: A Text Field
```

### Values

Dropdowns and radio inputs take a special property called `"values"` that is used to display the options available. This property can take several forms, depending on what you need.

If the raw, underlying values match what is displayed, use an array of strings:

```yaml
values:
  - Option 1
  - Option 2
  - Option 3
```

Otherwise, if you want the value to be different that what is displayed for the option, use an object. The key will be the label and the value is the raw value:

```yaml
values:
  China: CN
  United States of America: US
  United Kingdom: UK
```

Radios need one more special format that allows for a description below each radio element. This is an array of objects.

```yaml
values:
  - value: opt1
    label: Option 1
    description: This is option 1
  - value: opt2
    label: Option 2
    description: This is option 2
```

### Controlling Field Visibility

> Note: This functionality is not directly provided by this package and is instead something the UI would need to interpret. This is provided as example of how form visibility could work; we have successfully implemented into Pagedip's tools using [mingo](https://www.npmjs.com/package/mingo).

A field can be dynamically shown and hidden on the page by using other form values to control. The most common example would be showing a series of inputs when a checkbox is selected. Here is an example of this:

```yaml
type: section
children:
  enablecheck:
    type: checkbox
    label: Enable this thing?
  importantvalue:
    type: text
    label: Only shown when enabled
    visible:
      enablecheck: true
```

This is all controlled through the `visible` property. This property is a MongoDB selector that is compared to the parent value. In this case, "parent" means the root section schema, however in the case of a deep schema, the selector is only compared to the direct parent and does not get access to all the data.
