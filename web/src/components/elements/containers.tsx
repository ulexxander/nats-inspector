import React, { ComponentProps } from "react";
import { cn } from "../../lib/classes";

export type ClassProps = Pick<ComponentProps<"div">, "className">;

export const Surface: React.FC<ClassProps> = ({ className, children }) => {
  return (
    <div className={cn("p-5 mb-4 rounded-lg bg-blues-600", className)}>
      {children}
    </div>
  );
};
