export function isIterable(i: any): i is Iterable<any> {
  return Boolean(i && typeof i[Symbol.iterator] === "function");
}

const warnings = new Set();
export function warnOnce(message: string) {
  if (!warnings.has(message)) {
    warnings.add(message);
    console.warn(message);
  }
}
