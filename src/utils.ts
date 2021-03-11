export function isIterable(i: any): i is Iterable<any> {
  return Boolean(i && typeof i[Symbol.iterator] === "function");
}

export function isNullOrEqual<T>(a: T, b: T) {
  return a == null || b == null || a === b;
}
