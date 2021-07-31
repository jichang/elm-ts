export interface Left<T> {
  _tag: "left";
  value: T;
}

export function left<E, T>(t: T): Either<E, T> {
  return {
    _tag: "left",
    value: t,
  };
}

export interface Right<E> {
  _tag: "right";
  value: E;
}

export function right<E, T>(t: E): Either<E, T> {
  return {
    _tag: "right",
    value: t,
  };
}

export type Either<E, T> = Left<T> | Right<E>;

export function map<T, E, U>(
  either: Either<E, T>,
  fn: (t: T) => U
): Either<E, U> {
  switch (either._tag) {
    case "left":
      return {
        _tag: "left",
        value: fn(either.value),
      };
    case "right":
      return either;
  }
}

export function fmap<A, B, E>(
  fn: (a: A) => B
): (fa: Either<E, A>) => Either<E, B> {
  return (fa: Either<E, A>) => {
    switch (fa._tag) {
      case "left":
        let b = fn(fa.value);
        return {
          _tag: "left",
          value: b,
        };
      case "right":
        return {
          _tag: "right",
          value: fa.value,
        };
    }
  };
}
