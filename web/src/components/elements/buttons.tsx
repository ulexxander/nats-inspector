import React, { ButtonHTMLAttributes } from "react";
import { cn } from "../../lib/classes";

export type BtnColor = "red" | "green" | "blue";

const mapBtnColorToClass: Record<BtnColor, { border: string; text: string }> = {
  red: {
    border: "border-red-400",
    text: "text-red-400",
  },
  green: {
    border: "border-green-400",
    text: "text-green-400",
  },
  blue: {
    border: "border-blue-400",
    text: "text-blue-400",
  },
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  btnColor: BtnColor;
  small?: boolean;
};

export const OutlinedButton: React.FC<ButtonProps> = ({
  btnColor,
  small,
  className,
  ...props
}) => {
  const color = mapBtnColorToClass[btnColor];

  const sizeClasses = small ? "px-3 py-1 text-sm" : "px-4 py-2";

  return (
    <button
      className={cn(
        "tracking-widest",
        "uppercase focus:outline-none rounded border",
        "hover:bg-blues-700",
        sizeClasses,
        color.border,
        color.text,
        className,
      )}
      {...props}
    />
  );
};
