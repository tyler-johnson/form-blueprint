import {has,clone,reduce,assignWith} from "lodash";

// throw an error if blueprint is not valid
export function validate(bp) {
	if (typeof bp !== "object" || bp == null) {
		throw new Error("Expecting object for blueprint.");
	}

	for (let section_key in bp) {
		if (!has(bp, section_key)) continue;
		let section = bp[section_key];
		if (!validSection(section)) {
			throw new Error(`Invalid blueprint section '${section_key}'.`);
		}

		let options = section.options;
		for (let option_key in options) {
			if (!has(options, option_key)) continue;
			if (!validOption(options[option_key])) {
				throw new Error(`Invalid blueprint option '${section_key}.${option_key}'.`);
			}
		}
	}
}

// returns boolean for if section object is valid
export function validSection(section) {
	return (typeof section === "object" && section != null) &&
		(typeof section.options === "object" && section.options != null);
}

// returns boolean for if section option object is valid
export function validOption(option) {
	return (typeof option === "object" && option != null) &&
		(typeof option.type === "string" && option.type);
}

// merge several blueprints together
export function merge(...args) {
	return args.reduce((m, obj) => {
		if (!obj) return m;

		for (let section_key in obj) {
			if (!has(obj, section_key)) continue;
			let section = obj[section_key];
			if (!validSection(section)) continue;

			if (!has(m, section_key)) m[section_key] = { options: {} };
			let options = section.options;

			for (let option_key in options) {
				if (!has(options, option_key)) continue;
				let option = options[option_key];
				if (!validOption(option)) continue;

				m[section_key].options[option_key] = clone(option);
			}
		}

		return m;
	},{});
}

// extract default values from a blueprint
export function defaults(bp={}) {
	return reduce(bp, (m, s, k) => {
		m[k] = reduce(s.options, (m, o, k) => {
			m[k] = o.default;
			return m;
		}, {});
		return m;
	}, {});
}

// apply blueprint defaults onto an object
export function applyDefaults(bp, obj) {
	let defaultOpts = defaults(bp);

	for (let k in defaultOpts) {
		if (!has(defaultOpts, k) || (obj[k] && !has(obj, k))) continue;

		if (obj[k] == null) obj[k] = {};
		if (typeof obj[k] !== "object") continue;

		assignWith(obj[k], defaultOpts[k], (cur, def) => {
			return (typeof def !== "undefined") &&
				(typeof cur === "undefined" || cur === "") ?
				def : cur;
		});
	}

	return obj;
}
