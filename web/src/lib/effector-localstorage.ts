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

export function persistText(key: string, store: Store<string>) {
  persist(key, store, {
    marshal(state) {
      return state;
    },
    unmarshal(rawState) {
      return rawState;
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
