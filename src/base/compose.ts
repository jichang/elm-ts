export function compose<
  A extends (...args: any[]) => any,
  B extends (...args: any[]) => any
>(fa: A, fb: B) {
  return (...args: Parameters<A>): ReturnType<B> => {
    return fb(fa(...args));
  };
}
