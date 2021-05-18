import React from "react";
import { ClassProps, cn } from "../../lib/classes";

export const Surface: React.FC<ClassProps> = ({ className, children }) => {
  return (
    <div className={cn("p-5 mb-4 rounded-lg bg-blues-600", className)}>
      {children}
    </div>
  );
};
