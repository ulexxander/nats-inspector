import React, { InputHTMLAttributes } from "react";
import { ReflectableProps } from "../../lib/effector-forms";

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: string;
  placeholder: string;
  error?: string;
};

export const Input: React.FC<InputProps> = ({
  label,
  name,
  error,
  placeholder,
  ...props
}) => {
  return (
    <div className="mt-4 text-lg">
      <label className="text-gray-300" htmlFor="name">
        {label}
      </label>
      <input
        id={name}
        name={name}
        placeholder={placeholder}
        className="block w-64 h-12 mt-2 border-gray-700 rounded-md form-input bg-blues-900"
        {...props}
      />
      <p className="mt-2 text-red-500">{error}</p>
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
