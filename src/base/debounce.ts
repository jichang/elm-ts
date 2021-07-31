export function debounce<A extends any[], B>(
  interval: number,
  fn: (...args: [...A]) => B
) {
  let timeoutId: number | null;
  return (...args: [...A]) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      fn(...args);
      timeoutId = null;
    }, interval);
  };
}
