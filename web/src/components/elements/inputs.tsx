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
    <div className="mt-4 text-lg">
      <label className="text-gray-300" htmlFor="name">
        {label}
      </label>
      <input
        id={name}
        name={name}
        placeholder={placeholder}
        className="block w-64 h-12 mt-4 border-gray-700 rounded-md form-input bg-blag-900"
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
