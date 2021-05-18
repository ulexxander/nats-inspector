import { ExclamationCircleIcon } from "@heroicons/react/outline";
import React, { ComponentProps } from "react";
import { cn } from "../../lib/classes";
import { errText } from "../../lib/errors";

export type ErrorBoxProps = ComponentProps<"div"> & {
  error: Error | string;
};

export const ErrorBox: React.FC<ErrorBoxProps> = ({
  error,
  className,
  ...props
}) => {
  const err = errText(error);

  return (
    <div
      className={cn(
        "flex items-center max-w-lg",
        "mt-3 p-3 bg-red-600 bg-opacity-30 text-white",
        "border-red-600 border-2 rounded",
        className,
      )}
      {...props}
    >
      <ExclamationCircleIcon className="w-10 h-10 mr-3" />

      <p className="text-lg tracking-wider">
        Error: <span className="font-light">{err}</span>
      </p>
    </div>
  );
};
