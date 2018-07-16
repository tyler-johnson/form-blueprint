export function isIterable(i: any): i is Iterable<any> {
  return Boolean(i && typeof i[Symbol.iterator] === "function");
}
