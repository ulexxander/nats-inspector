import React, { HTMLAttributes } from "react";
import { clazz } from "../../lib/utils";

type HeadingProps = HTMLAttributes<HTMLHeadingElement>;

export const H2: React.FC<HeadingProps> = ({ className, ...props }) => {
  return <h2 className={clazz("text-2xl", className)} {...props} />;
};

export const Caption: React.FC = ({ children }) => {
  return <p className="mt-3 text-gray-300">{children}</p>;
};
