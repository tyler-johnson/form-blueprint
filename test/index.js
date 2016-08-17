import test from "tape";

const blueprint = require("./");

test("validates valid blueprint", function(t) {
	t.plan(1);
	blueprint.validate({
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
	});
	t.pass("blueprint is valid");
});

test("throws on invalid blueprint", function(t) {
	t.plan(1);
	t.throws(function() {
		blueprint.validate(null);
	}, /expecting object/i);
});

test("throws on invalid section in blueprint", function(t) {
	t.plan(1);
	t.throws(function() {
		blueprint.validate({
			invalid_section: {}
		});
	}, /invalid blueprint section/i);
});

test("throws on invalid section option in blueprint", function(t) {
	t.plan(1);
	t.throws(function() {
		blueprint.validate({
			section: {
				options: {
					foo: {}
				}
			}
		});
	}, /invalid blueprint option/i);
});

test("extracts default values from blueprint", function(t) {
	t.plan(1);
	t.deepEquals(blueprint.defaults({
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
	}), {
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
	t.deepEquals(blueprint.applyDefaults({
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
	}, {
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

test("merges blueprints together", function(t) {
	t.plan(1);
	t.deepEquals(blueprint.merge({
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
	}, {
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
	}), {
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
	}, "merges blueprints");
});
