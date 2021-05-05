import {
  createEffect,
  createEvent,
  createStore,
  forward,
  Store,
} from "effector";

type PersistentStoreConfig<State> = {
  key: string;
  initialState: State;
  marshal: (state: State) => string;
  unmarshal: (rawState: string) => State;
};

export function createPersistentStore<State>(
  config: PersistentStoreConfig<State>
) {
  const update = createEvent<State>();
  const updateFx = createEffect<State, void>((newState) => {
    localStorage.setItem(config.key, config.marshal(newState));
  });

  const reset = createEvent();
  const resetFx = createEffect<void, void>(() => {
    localStorage.removeItem(config.key);
  });

  let store: Store<State>;

  const currentValue = localStorage.getItem(config.key);
  if (currentValue) {
    store = createStore(config.unmarshal(currentValue));
  } else {
    store = createStore(config.initialState);
  }

  store.on(updateFx, (_, newState) => newState).reset(resetFx);

  forward({
    from: update,
    to: updateFx,
  });

  forward({
    from: reset,
    to: resetFx,
  });

  return {
    value: store,
    update,
    reset,
  };
}
