import { VNode } from "snabbdom/src/package/vnode";
import { Maybe } from "../base/maybe";
import { Cmd, Dispatch } from "./runtime";

export interface Component<Initial, Model, Msg> {
  init: (initial: Initial) => [Model, Maybe<Cmd<Msg>>];
  update: (model: Model, msg: Msg) => [Model, Maybe<Cmd<Msg>>];
  view: (model: Model, dispatch: Dispatch<Msg>) => VNode;
}
