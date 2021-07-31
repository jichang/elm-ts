import { VNode } from "snabbdom/src/package/vnode";
import { h } from "snabbdom/src/package/h";
import { Component } from "./core/component";
import { Dispatch, run, Cmd } from "./core/runtime";
import { fmap, just, Maybe, nothing } from "./base/maybe";
import { random } from "./core/cmd/random";
import { Either } from "./base/either";
import { route } from "./core/cmd/router";

export type Initial = number;

export type Model = {
  url: string;
  count: number;
};

export type Msg =
  | {
      kind: "increment";
    }
  | {
      kind: "decrement";
    }
  | {
      kind: "random";
      value: number;
    }
  | {
      kind: "urlchange";
      value: string;
    }
  | {
      kind: "changeurl";
      value: string;
    };

function init(initial: Initial): [Model, Maybe<Cmd<Msg>>] {
  const cmd = random<Msg>((num) => {
    return {
      kind: "random",
      value: num,
    };
  });

  return [
    {
      url: "",
      count: initial,
    },
    just(cmd),
  ];
}

function update(model: Model, msg: Msg): [Model, Maybe<Cmd<Msg>>] {
  switch (msg.kind) {
    case "increment":
      return [{ ...model, count: model.count + 1 }, nothing];
    case "decrement":
      return [{ ...model, count: model.count - 1 }, nothing];
    case "random":
      return [{ ...model, count: msg.value }, nothing];
    case "urlchange":
      return [
        model,
        just(route({ _tag: "push", state: {}, title: "home", url: msg.value })),
      ];
    case "changeurl":
      return [{ ...model, url: msg.value }, nothing];
  }
}

function view(model: Model, dispath: Dispatch<Msg>): VNode {
  return h("div", {}, [
    h("button", { on: { click: () => dispath({ kind: "increment" }) } }, ["+"]),
    h("span", {}, [model.count]),
    h("button", { on: { click: () => dispath({ kind: "decrement" }) } }, ["-"]),
    h("span", {}, [model.url]),
    h(
      "button",
      { on: { click: () => dispath({ kind: "urlchange", value: "/home" }) } },
      ["Go"]
    ),
  ]);
}

let app: Component<Initial, Model, Msg> = {
  init,
  update,
  view,
};

run(
  app,
  0,
  document.getElementById("app") as Element,
  (url: string): Msg => {
    return {
      kind: "changeurl",
      value: url,
    };
  }
);
