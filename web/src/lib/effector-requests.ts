import { createEffect, createEvent, createStore, guard } from "effector";

export type RequestFactoryConfig = {
  handler: (
    path: string,
    params: unknown,
    fetchOptions: RequestInit,
  ) => Promise<unknown>;
};

export function makeRequestFactory(config: RequestFactoryConfig) {
  return <P, R>(path: string, fetchOptions: RequestInit) => {
    const data = createStore<R | null>(null);
    const error = createStore<Error | null>(null);
    const run = createEvent<P>();

    const callerFx = createEffect<P, R>((params) => {
      return config.handler(path, params, fetchOptions) as Promise<R>;
    });

    data.on(callerFx.doneData, (_, data) => data);
    error.on(callerFx.failData, (_, err) => err).reset(callerFx);

    guard({
      source: run,
      filter: callerFx.pending.map((pending) => !pending),
      target: callerFx,
    });

    return {
      data,
      error,
      run,
      loading: callerFx.pending,
      done: callerFx.done,
      doneData: callerFx.doneData,
      fail: callerFx.fail,
      failData: callerFx.failData,
      finally: callerFx.finally,
    };
  };
}
