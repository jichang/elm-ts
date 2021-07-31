// /user/username/comment/10
//
// /user/a/comment/0
// /user/a/comment/0
// /user/b/comment/1
//
// /user/:username/comment/:id
//
// s "user" </> string </> s "comment" </> int

import { Either, left, right } from "../base/either";

export type State = {
  unvisited: string[]; // ['comment', '10']
  visited: string[]; // ['user']
  values: any[]; // ['a',]
};

export type Parser = (state: State) => Either<Error, State>;

export function s(value: string): Parser {
  return (state: State): Either<Error, State> => {
    const segment = state.unvisited[0];
    if (!segment) {
      return right(new Error(`expected ${value}, but found nothing`));
    }

    if (segment !== value) {
      return right(new Error(`expected ${value}, but found ${segment}`));
    }

    return left({
      unvisited: state.unvisited.slice(1),
      visited: [...state.visited, segment],
      values: state.values,
    });
  };
}

export function string(state: State): Either<Error, State> {
  const segment = state.unvisited[0];
  if (!segment) {
    return right(new Error(`expected any string, but found nothing`));
  }

  return left({
    unvisited: state.unvisited.slice(1),
    visited: [...state.visited, segment],
    values: [...state.values, segment],
  });
}

export function int(state: State): Either<Error, State> {
  const segment = state.unvisited[0];
  if (!segment) {
    return right(new Error(`expected any integer, but found nothing`));
  }

  const num = parseInt(segment, 10);
  if (isNaN(num)) {
    return right(new Error(`expected any integer, but found ${segment}`));
  }

  return left({
    unvisited: state.unvisited.slice(1),
    visited: [...state.visited, segment],
    values: [...state.values, num],
  });
}

export function sequence(parsers: Parser[]): Parser {
  return (state: State): Either<Error, State> => {
    return parsers.reduce((state: Either<Error, State>, parser: Parser) => {
      switch (state._tag) {
        case "left":
          return parser(state.value);
        case "right":
          return state;
      }
    }, left(state));
  };
}

export function parse(url: string, parser: Parser) {
  const segments = url.split("/");
  return parser({
    unvisited: segments,
    visited: [],
    values: [],
  });
}
