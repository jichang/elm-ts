import { Cmd, Dispatch } from "../runtime";

export function random<Msg>(transform: (num: number) => Msg): Cmd<Msg> {
  return (dispatch: Dispatch<Msg>) => {
    const num = Math.random();

    dispatch(transform(num));
  };
}
