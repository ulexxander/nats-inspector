import React, { ComponentProps, useEffect, useState } from "react";
import { ClassProps, cn } from "../../lib/classes";

export const TextWithAnimatedDots: React.FC<ComponentProps<"p">> = ({
  children,
  ...props
}) => {
  const [dots, setDots] = useState("...");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((dots) => (dots.length > 3 ? "." : dots + "."));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <p {...props}>
      {children}
      {dots}
    </p>
  );
};

export const LoadingDots: React.FC<ClassProps> = ({ className, children }) => {
  return (
    <TextWithAnimatedDots className={cn("mt-2 text-lg font-light", className)}>
      {children || "Loading"}
    </TextWithAnimatedDots>
  );
};
