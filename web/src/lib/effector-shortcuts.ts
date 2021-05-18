import { Event } from "effector";

function nothing() {}

export function voidEvent(event: Event<any>) {
  return event.map(nothing);
}
