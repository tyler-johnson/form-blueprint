import test from "tape";
import {is} from "immutable";

const {normalize} = require("./");

test("validates valid blueprint", function(t) {
	t.plan(1);
	t.ok(normalize({
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
		normalize(null);
	}, /expecting object/i);
});

test("extracts default values from blueprint", function(t) {
	t.plan(1);

	const blueprint = normalize({
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

	const blueprint = normalize({
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

	const bp1 = normalize({
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

	const bp2 = normalize({
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

	const result = normalize({
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

	t.ok(is(bp2.join(bp1), result), "joins blueprints");
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
