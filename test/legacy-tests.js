import test from "tape";
import {isEqual} from "lodash";

const {default:createBlueprint} = require("./");

test("validates valid blueprint", function(t) {
	t.plan(1);
	t.ok(createBlueprint({
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
	}), "blueprint is valid");
});

test("throws on invalid blueprint", function(t) {
	t.plan(1);
	t.throws(function() {
		createBlueprint(null);
	}, /expecting object/i);
});

test("extracts default values from blueprint", function(t) {
	t.plan(1);

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

	t.deepEquals(blueprint.transform(), {
		foo: {
			bar: "foobar",
			baz: "foobaz"
		},
		hello: {
			world: true
		}
	}, "extracted defaults");
});

test("applies blueprint default to object", function(t) {
	t.plan(1);

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

	t.deepEquals(blueprint.transform({
		foo: { bar: "bam" }
	}), {
		foo: {
			bar: "bam",
			baz: "foobaz"
		},
		hello: {
			world: true
		}
	}, "applied defaults");
});

test("joins blueprints together", function(t) {
	t.plan(1);

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

	t.ok(isEqual(bp2.join(bp1).toJSON(), result.toJSON()), "joins blueprints");
});

test("empty blueprint defaults to section", function(t) {
	t.plan(1);
	const blueprint = createBlueprint({});
	t.equals(blueprint.root.type, "section", "has section root");
});

// OLD TESTS THAT NOW BREAK WITH NEW FUNCTIONALITY
// test("throws on invalid section in blueprint", function(t) {
// 	t.plan(1);
// 	t.throws(function() {
// 		blueprint.validate({
// 			invalid_section: {}
// 		});
// 	}, /invalid blueprint section/i);
// });
//
// test("throws on invalid section option in blueprint", function(t) {
// 	t.plan(1);
// 	t.throws(function() {
// 		blueprint.validate({
// 			section: {
// 				options: {
// 					foo: {}
// 				}
// 			}
// 		});
// 	}, /invalid blueprint option/i);
// });
