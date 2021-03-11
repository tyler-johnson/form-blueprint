import createBlueprint from "../src/index";

describe("form-blueprint tests", () => {
  test("validates valid blueprint", function () {
    expect.assertions(1);
    expect(
      createBlueprint({
        some_section: {
          label: "Some Section",
          options: {
            foo: {
              label: "Foo Option",
              type: "text",
              default: "The default value.",
            },
          },
        },
      })
    ).toBeTruthy();
  });

  test("creates empty blueprint", function () {
    expect.assertions(1);
    expect(createBlueprint()).toBeTruthy();
  });

  test("extracts default values from blueprint", function () {
    expect.assertions(1);

    const blueprint = createBlueprint({
      foo: {
        options: {
          bar: {
            type: "text",
            default: "foobar",
          },
          baz: {
            type: "text",
            default: "foobaz",
          },
        },
      },
      hello: {
        options: {
          world: {
            type: "checkbox",
            default: true,
          },
        },
      },
    });

    expect(blueprint.transform()).toEqual({
      foo: {
        bar: "foobar",
        baz: "foobaz",
      },
      hello: {
        world: true,
      },
    });
  });

  test("applies blueprint default to object", function () {
    expect.assertions(1);

    const blueprint = createBlueprint({
      foo: {
        options: {
          bar: {
            type: "text",
            default: "foobar",
          },
          baz: {
            type: "text",
            default: "foobaz",
          },
        },
      },
      hello: {
        options: {
          world: {
            type: "checkbox",
            default: true,
          },
        },
      },
    });

    expect(
      blueprint.transform({
        foo: { bar: "bam" },
      })
    ).toEqual({
      foo: {
        bar: "bam",
        baz: "foobaz",
      },
      hello: {
        world: true,
      },
    });
  });

  test("joins blueprints together", function () {
    expect.assertions(1);

    const bp1 = createBlueprint({
      foo: {
        label: "Foo1",
        options: {
          bar: {
            type: "text",
            label: "Bar1",
            default: "foobar",
          },
        },
      },
      hello: {
        label: "Foo1",
        options: {
          world: {
            type: "checkbox",
            label: "World1",
            default: true,
          },
        },
      },
    });

    const bp2 = createBlueprint({
      foo: {
        label: "Foo2",
        options: {
          bar: {
            type: "textarea",
            label: "Bar2",
            default: "overridden",
          },
          baz: {
            type: "text",
            label: "Baz1",
            default: "foobaz",
          },
        },
      },
    });

    const result = createBlueprint({
      foo: {
        label: "Foo2",
        options: {
          bar: {
            type: "textarea",
            label: "Bar2",
            default: "overridden",
          },
          baz: {
            type: "text",
            label: "Baz1",
            default: "foobaz",
          },
        },
      },
      hello: {
        label: "Foo1",
        options: {
          world: {
            type: "checkbox",
            label: "World1",
            default: true,
          },
        },
      },
    });

    expect(bp1.join(bp2).serialize()).toEqual(result.serialize());
  });

  test("merges fields", function () {
    expect.assertions(1);

    const bp1 = createBlueprint({
      foo: {
        label: "Foo1",
        options: {
          bar: {
            type: "text",
            label: "Bar1",
            default: "foobar",
          },
        },
      },
    });

    const bp2 = createBlueprint({
      foo: {
        bar: {
          default: "baz",
        },
      },
    });

    const result = createBlueprint({
      foo: {
        label: "Foo1",
        options: {
          bar: {
            type: "text",
            label: "Bar1",
            default: "baz",
          },
        },
      },
    });

    expect(bp1.join(bp2).serialize()).toEqual(result.serialize());
  });

  test("doesn't merge when types don't match", function () {
    expect.assertions(1);

    const bp1 = createBlueprint({
      foo: {
        label: "Foo1",
        options: {
          bar: {
            type: "text",
            label: "Bar1",
            default: "foobar",
          },
        },
      },
    });

    const bp2 = createBlueprint({
      foo: {
        bar: {
          type: "number",
          default: 10,
        },
      },
    });

    const result = createBlueprint({
      foo: {
        label: "Foo1",
        options: {
          bar: {
            type: "number",
            default: 10,
          },
        },
      },
    });

    expect(bp1.join(bp2).serialize()).toEqual(result.serialize());
  });

  test("empty object defaults to section", function () {
    expect.assertions(1);
    const blueprint = createBlueprint({});
    expect(blueprint.root.type).toBe("section");
  });

  test("parses malformed blueprint", () => {
    const blueprint = createBlueprint({
      foo: {
        label: "Foo",
        options: {
          type: "text",
          label: "asdf",
        },
      },
    });

    expect(blueprint).toBeTruthy();
  });

  test("can create blueprint from serialized blueprint", () => {
    const blueprint = createBlueprint({
      foo: {
        label: "Foo",
        options: {
          bar: {
            type: "textarea",
            label: "Bar",
            default: "foobar",
          },
          baz: {
            type: "text",
            label: "Baz",
            default: "foobaz",
          },
        },
      },
    });

    const json = blueprint.serialize();
    const blueprint2 = createBlueprint(json);
    expect(blueprint).toEqual(blueprint2);
  });

  test("validates field with array of values", () => {
    const values = ["a", "b", "c"];
    const blueprint = createBlueprint({
      type: "dropdown",
      values,
    });

    const fields = blueprint.root.children;
    expect(fields.size).toEqual(3);

    fields.forEach((val, i) => {
      expect(val.type).toEqual("value-item");
      expect(val.props.get("value")).toEqual(values[i]);
      expect(val.props.get("label")).toEqual(values[i]);
    });
  });

  test("validates field with map of values", () => {
    const values: {
      [key: string]: number;
    } = {
      a: 1,
      b: 2,
      c: 3,
    };

    const blueprint = createBlueprint({
      type: "dropdown",
      values,
    });

    const fields = blueprint.root.children;
    expect(fields.size).toEqual(3);

    const valueKeys = Object.keys(values);
    fields.forEach((val, i) => {
      expect(val.type).toEqual("value-item");
      expect(val.props.get("label")).toEqual(valueKeys[i]);
      expect(val.props.get("value")).toEqual(values[valueKeys[i]]);
    });
  });

  test("doesn't merge children on fields with values", () => {
    const bp1 = createBlueprint({ type: "dropdown", values: { foo: "bar" } });
    const bp2 = createBlueprint({ type: "dropdown", values: { hello: "world" } });
    expect(bp1.join(bp2).serialize()).toEqual(bp2.serialize());
  });

  test("converts string color value to hex", () => {
    const blueprint = createBlueprint({ type: "color" });
    expect(blueprint.transform("black")).toEqual("#000000");
  });
});
