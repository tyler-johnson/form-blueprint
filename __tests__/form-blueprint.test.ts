import createBlueprint from "../src/index";

describe("form-blueprint tests", () => {
  test("validates valid blueprint", function() {
    expect.assertions(1);
    expect(createBlueprint({
      some_section: {
        label: "Some Section",
        options: {
          foo: {
            label: "Foo Option",
            type: "text",
            default: "The default value."
          }
        }
      }
    })).toBeTruthy();
  });

  test("creates empty blueprint", function() {
    expect.assertions(1);
    expect(createBlueprint()).toBeTruthy();
  });

  test("extracts default values from blueprint", function() {
    expect.assertions(1);

    const blueprint = createBlueprint({
      foo: {
        options: {
          bar: {
            type: "text",
            default: "foobar"
          },
          baz: {
            type: "text",
            default: "foobaz"
          }
        }
      },
      hello: {
        options: {
          world: {
            type: "checkbox",
            default: true
          }
        }
      }
    });

    expect(blueprint.transform()).toEqual({
      foo: {
        bar: "foobar",
        baz: "foobaz"
      },
      hello: {
        world: true
      }
    });
  });

  test("applies blueprint default to object", function() {
    expect.assertions(1);

    const blueprint = createBlueprint({
      foo: {
        options: {
          bar: {
            type: "text",
            default: "foobar"
          },
          baz: {
            type: "text",
            default: "foobaz"
          }
        }
      },
      hello: {
        options: {
          world: {
            type: "checkbox",
            default: true
          }
        }
      }
    });

    expect(blueprint.transform({
      foo: { bar: "bam" }
    })).toEqual({
      foo: {
        bar: "bam",
        baz: "foobaz"
      },
      hello: {
        world: true
      }
    });
  });

  test("joins blueprints together", function() {
    expect.assertions(1);

    const bp1 = createBlueprint({
      foo: {
        label: "Foo1",
        options: {
          bar: {
            type: "text",
            label: "Bar1",
            default: "foobar"
          }
        }
      },
      hello: {
        label: "Foo1",
        options: {
          world: {
            type: "checkbox",
            label: "World1",
            default: true
          }
        }
      }
    });

    const bp2 = createBlueprint({
      foo: {
        label: "Foo2",
        options: {
          bar: {
            type: "textarea",
            label: "Bar2",
            default: "overridden"
          },
          baz: {
            type: "text",
            label: "Baz1",
            default: "foobaz"
          }
        }
      }
    });

    const result = createBlueprint({
      foo: {
        label: "Foo2",
        options: {
          bar: {
            type: "textarea",
            label: "Bar2",
            default: "overridden"
          },
          baz: {
            type: "text",
            label: "Baz1",
            default: "foobaz"
          }
        }
      },
      hello: {
        label: "Foo1",
        options: {
          world: {
            type: "checkbox",
            label: "World1",
            default: true
          }
        }
      }
    });

    expect(bp2.join(bp1).toJSON()).toEqual(result.toJSON());
  });

  test("empty object defaults to section", function() {
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
          label: "asdf"
        }
      }
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
            default: "foobar"
          },
          baz: {
            type: "text",
            label: "Baz",
            default: "foobaz"
          }
        }
      }
    });

    const json = blueprint.serialize();
    const blueprint2 = createBlueprint(json);
    expect(blueprint).toEqual(blueprint2);
  });
});
