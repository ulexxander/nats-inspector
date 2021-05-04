import React, { ButtonHTMLAttributes } from "react";
import { clazz } from "../../lib/utils";

type FillColor = "red" | "blue";

const mapFillColorToClass: Record<
  FillColor,
  { base: string; hover: string }
> = {
  red: { base: "bg-red-500", hover: "hover:bg-red-600" },
  blue: { base: "bg-blue-500", hover: "hover:bg-blue-600" },
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  fillColor: FillColor;
};

export const FilledButton: React.FC<ButtonProps> = ({
  fillColor,
  className,
  ...props
}) => {
  const c = `
  px-4 py-1 mt-4 text-lg font-semibold tracking-wider
  uppercase text-white rounded-lg
  focus:outline-none focus:ring`;

  const fill = mapFillColorToClass[fillColor];

  return (
    <button className={clazz(c, fill.base, fill.hover, className)} {...props} />
  );
};
