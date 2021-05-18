import React, { HTMLAttributes } from "react";
import { cn } from "../../lib/classes";

type HeadingProps = HTMLAttributes<HTMLHeadingElement>;

export const H2: React.FC<HeadingProps> = ({ className, ...props }) => {
  return <h2 className={cn("text-2xl", className)} {...props} />;
};

export const Caption: React.FC = ({ children }) => {
  return <p className="mt-3 text-gray-300">{children}</p>;
};
