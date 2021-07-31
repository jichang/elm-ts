export function memorize<A extends any[], B>(fn: (...args: [...A]) => B) {
  const cache: Record<string, any> = {};

  return (...args: [...A]) => {
    const key = JSON.stringify(args);
    if (typeof cache[key] !== "undefined") {
      return cache[key];
    }

    const result = fn(...args);
    cache[key] = result;

    return result;
  };
}
