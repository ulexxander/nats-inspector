import { createEffect, Store } from "effector";

export type PersistCodec<State> = {
  marshal: (state: State) => string;
  unmarshal: (rawState: string) => State;
};

export function persist<State>(
  key: string,
  store: Store<State>,
  config: PersistCodec<State>,
) {
  const updateFx = createEffect<State, void>((newState) =>
    localStorage.setItem(key, config.marshal(newState)),
  );

  const restoreFx = createEffect<void, State | null>(() => {
    const storedItem = localStorage.getItem(key);
    return storedItem ? config.unmarshal(storedItem) : null;
  });

  store.on(restoreFx.doneData, (state, data) => (data !== null ? data : state));

  restoreFx();

  store.updates.watch(updateFx);
}

export function persistScalar<State extends string | number | boolean | null>(
  key: string,
  store: Store<State>,
) {
  persist(key, store, {
    marshal(state) {
      return state !== null ? state.toString() : "null";
    },
    unmarshal(rawState) {
      switch (typeof store.defaultState) {
        case "string":
          return rawState as State;
        case "number":
          return Number(rawState) as State;
        case "boolean":
          return (rawState === "true") as State;
        default:
          return store.defaultState as State;
      }
    },
  });
}

export function persistJSON<State>(key: string, store: Store<State>) {
  persist(key, store, {
    marshal(state) {
      return JSON.stringify(state);
    },
    unmarshal(rawState) {
      return JSON.parse(rawState);
    },
  });
}
