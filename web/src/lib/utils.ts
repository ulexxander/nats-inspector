export function clazz(...possibleClasses: (string | false | undefined)[]) {
  return possibleClasses.filter(Boolean).join(" ");
}
