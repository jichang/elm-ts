export interface Just<T> {
  _tag: "just";
  value: T;
}

export function just<T>(value: T): Just<T> {
  return {
    _tag: "just",
    value,
  };
}

export interface Nothing<T> {
  _tag: "nothing";
}

export const nothing: Nothing<any> = { _tag: "nothing" };

export type Maybe<T> = Just<T> | Nothing<T>;

export function fmap<A, B>(fn: (a: A) => B): (fa: Maybe<A>) => Maybe<B> {
  return (fa: Maybe<A>) => {
    switch (fa._tag) {
      case "nothing":
        return {
          _tag: "nothing",
        } as Maybe<B>;
      case "just":
        let b = fn(fa.value);
        return {
          _tag: "just",
          value: b,
        };
    }
  };
}

export const pure = just;

export function apply<A, B>(
  ff: Maybe<(a: A) => B>
): (fa: Maybe<A>) => Maybe<B> {
  return (fa: Maybe<A>): Maybe<B> => {
    switch (ff._tag) {
      case "nothing":
        return {
          _tag: "nothing",
        } as Maybe<B>;
      case "just":
        switch (fa._tag) {
          case "nothing":
            return {
              _tag: "nothing",
            } as Maybe<B>;
          case "just":
            return {
              _tag: "just",
              value: ff.value(fa.value),
            };
        }
    }
  };
}

export const return_ = just;

export function bind<A, B>(fa: Maybe<A>): (f: (a: A) => Maybe<B>) => Maybe<B> {
  return (f: (a: A) => Maybe<B>): Maybe<B> => {
    switch (fa._tag) {
      case "nothing":
        return {
          _tag: "nothing",
        } as Maybe<B>;
      case "just":
        return f(fa.value);
    }
  };
}
