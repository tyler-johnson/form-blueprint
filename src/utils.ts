export function isIterable(i: any): i is Iterable<any> {
  return Boolean(i && typeof i[Symbol.iterator] === "function");
}

export function isNullOrEqual<T>(a: T, b: T) {
  return a == null || b == null || a === b;
}

export const fromEntries: (iterable: Iterable<readonly [string, any]>) => Record<string, any> =
  typeof Object.fromEntries === "function"
    ? Object.fromEntries.bind(Object)
    : function (iterable) {
        return [...iterable].reduce((obj, [key, val]) => {
          obj[key] = val;
          return obj;
        }, {} as Record<string, any>);
      };
