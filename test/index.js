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
			options: {
				bar: {
					type: "text",
					default: "foobar"
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
		foo: {
			options: {
				bar: {
					type: "textarea",
					default: "overridden"
				},
				baz: {
					type: "text",
					default: "foobaz"
				}
			}
		}
	}), {
		foo: {
			options: {
				bar: {
					type: "textarea",
					default: "overridden"
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
	}, "merges blueprints");
});
