import { init } from "snabbdom/src/package/init";
import { styleModule } from "snabbdom/src/package/modules/style";
import { eventListenersModule } from "snabbdom/src/package/modules/eventlisteners";
import { Component } from "./component";
import { VNode } from "snabbdom/src/package/vnode";

export type Cmd<Msg> = (dispatch: Dispatch<Msg>) => any;

export type Dispatch<Msg> = (msg: Msg) => void;

export function run<Initial, Model, Msg>(
  component: Component<Initial, Model, Msg>,
  initial: Initial,
  rootNode: Element,
  onUrlChange?: (url: string) => Msg
) {
  const render = init([styleModule, eventListenersModule]);

  let vnode: Element | VNode;
  let [model, cmd] = component.init(initial);

  const dispatch = (msg: Msg) => {
    let [newModel, newCmd] = component.update(model, msg);
    const currVNode = component.view(newModel, dispatch);
    model = newModel;

    vnode = render(vnode, currVNode);

    switch (newCmd._tag) {
      case "just":
        newCmd.value(dispatch);
        break;
      case "nothing":
        break;
    }
  };

  vnode = component.view(model, dispatch);

  render(rootNode, vnode);

  switch (cmd._tag) {
    case "just":
      cmd.value(dispatch);
      break;
    case "nothing":
      break;
  }

  window.addEventListener("popstate", () => {
    // url change, dispatch msg
    if (onUrlChange) {
      const url = location.href;
      const msg = onUrlChange(url);
      dispatch(msg);
    }
  });
}
