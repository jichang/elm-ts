export type Curried<T extends (...args: any[]) => any> = Parameters<T> extends [

]
  ? () => ReturnType<T>
  : Parameters<T> extends [infer U]
  ? (u: U) => ReturnType<T>
  : Parameters<T> extends [infer U, ...infer Rest]
  ? (u: U) => Curried<(...args: [...Rest]) => ReturnType<T>>
  : never;

export function curry<T extends (...args: any[]) => any>(fn: T): Curried<T> {
  const arity = fn.length;
  const args = [];

  // @ts-ignore
  return function curried(arg: any) {
    args.push(arg);
    if (args.length === arity) {
      fn(...args);
    } else {
      return curried;
    }
  };
}
