import React, { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export const FilledButton: React.FC<ButtonProps> = (props) => {
  return (
    <button
      className="px-4 py-1 mt-4 text-lg font-semibold tracking-wider text-white uppercase bg-blue-500 rounded-lg focus:outline-none focus:ring hover:bg-blue-600"
      {...props}
    />
  );
};
