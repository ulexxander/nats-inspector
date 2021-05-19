import React, { InputHTMLAttributes } from "react";
import { ReflectableProps } from "../../lib/effector-forms";
import { errText } from "../../lib/errors";

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: string;
  placeholder: string;
  error?: Error | string | null;
};

export const Input: React.FC<InputProps> = ({
  label,
  name,
  error,
  placeholder,
  ...props
}) => {
  const err = errText(error);

  return (
    <div className="mt-3 text-lg">
      <label className="text-gray-300" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        placeholder={placeholder}
        className="block w-64 h-12 mt-1 border-gray-700 rounded-md form-input bg-blues-900"
        {...props}
      />
      {err && <p className="mt-1 text-sm text-red-500">{err}</p>}
    </div>
  );
};

export const InputReflected: React.FC<ReflectableProps & InputProps> = ({
  value,
  update,
  error,
  ...props
}) => {
  return (
    <Input
      value={value}
      onChange={(e) => update(e.target.value)}
      error={error}
      {...props}
    />
  );
};
