import React, { ButtonHTMLAttributes } from "react";
import { cn } from "../../lib/classes";

type BtnColor = "red" | "green" | "blue";

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

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  btnColor: BtnColor;
};

export const OutlinedButton: React.FC<ButtonProps> = ({
  btnColor,
  className,
  ...props
}) => {
  const color = mapBtnColorToClass[btnColor];

  return (
    <button
      className={cn(
        "px-4 py-2 mt-3 tracking-widest",
        "uppercase focus:outline-none rounded border",
        "hover:bg-blues-700",
        color.border,
        color.text,
        className,
      )}
      {...props}
    />
  );
};
