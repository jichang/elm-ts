import { Cmd, Dispatch } from "../runtime";

export type Action =
  | {
      _tag: "push";
      url: string;
      state: any;
      title: string;
    }
  | {
      _tag: "replace";
      url: string;
      state: any;
      title: string;
    }
  | { _tag: "go"; step: number }
  | {
      _tag: "back";
      step: number;
    };

export function route<Msg>(action: Action): Cmd<Msg> {
  return (dispatch: Dispatch<Msg>) => {
    switch (action._tag) {
      case "push":
        history.pushState(action.state, action.title, action.url);
        break;
      case "replace":
        history.replaceState(action.state, action.title, action.url);
        break;
      case "go":
        history.go(action.step);
        break;
      case "back":
        history.back();
    }
  };
}
