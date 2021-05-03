import React, { InputHTMLAttributes } from "react";
import { ReflectableProps } from "../../lib/effector-forms";

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export type TextInputProps = InputProps & {
  label: string;
  name: string;
  placeholder: string;
  error?: string;
};

export const TextInput: React.FC<TextInputProps> = ({
  label,
  name,
  error,
  placeholder,
  ...props
}) => {
  return (
    <div className="mt-3">
      <label className="text-gray-300" htmlFor="name">
        {label}
      </label>
      <input
        id={name}
        name={name}
        placeholder={placeholder}
        className="block w-64 mt-1 bg-gray-900 border-gray-700 rounded-md"
        {...props}
      />
      <p className="mt-1 text-red-500">{error}</p>
    </div>
  );
};

export const InputReflected: React.FC<ReflectableProps & TextInputProps> = ({
  value,
  update,
  error,
  ...props
}) => {
  return (
    <TextInput
      value={value}
      onChange={(e) => update(e.target.value)}
      error={error}
      {...props}
    />
  );
};
