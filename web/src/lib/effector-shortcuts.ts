import { Effect, Event, forward, merge } from "effector";

function nothing() {}

export function isArray<T>(thing: T | T[]): thing is T[] {
  return Array.isArray(thing);
}

export function voidEvent(events: Event<any>): Event<void> {
  return events.map(nothing);
}

export type ForwardVoidOpts = {
  from: Event<any> | ReadonlyArray<Event<any>>;
  to: Event<void> | ReadonlyArray<Event<void>>;
};

export function forwardVoid(opts: ForwardVoidOpts) {
  const sourceEvents: Event<any>[] = Array.isArray(opts.from)
    ? opts.from
    : [opts.from];

  return forward({
    from: merge(sourceEvents).map(nothing),
    to: opts.to,
  });
}

export function handle<P, D>(
  effect: Effect<P, D>,
  cases: Partial<
    Pick<typeof effect, "done" | "doneData" | "fail" | "failData" | "finally">
  >,
) {
  if (cases.done) {
    forward({ from: effect.done, to: cases.done });
  }
  if (cases.doneData) {
    forward({ from: effect.doneData, to: cases.doneData });
  }
  if (cases.fail) {
    forward({ from: effect.fail, to: cases.fail });
  }
  if (cases.failData) {
    forward({ from: effect.failData, to: cases.failData });
  }
  if (cases.finally) {
    forward({ from: effect.finally, to: cases.finally });
  }
}
