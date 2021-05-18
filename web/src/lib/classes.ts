import { ComponentProps } from "react";

export type ClassProps = Pick<ComponentProps<"div">, "className">;

export function cn(...classNames: (string | boolean | null | undefined)[]) {
  return classNames.filter(Boolean).join(" ");
}
