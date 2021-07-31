import { Either, left, right } from "../../base/either";
import { Cmd, Dispatch } from "../runtime";

export function http<Msg>(
  transform: (response: Either<Error, Response>) => Msg,
  input: RequestInfo,
  init?: RequestInit
): Cmd<Msg> {
  return async (dispatch: Dispatch<Msg>) => {
    const response = await fetch(input, init);
    if (response.ok) {
      const value = left<Error, Response>(response);
      const msg = transform(value);
      dispatch(msg);
    } else {
      const error = new Error(response.statusText);
      const value = right<Error, Response>(error);
      const msg = transform(value);
      dispatch(msg);
    }
  };
}
