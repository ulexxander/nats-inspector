import {
  combine,
  createEvent,
  createStore,
  Event,
  guard,
  sample,
  Store,
} from "effector";
import { useStore } from "effector-react";
import React from "react";

export type FormValue = string | number | boolean;

export type FieldValidator<FieldName> = (
  val: FormValue,
  externalField: (field: FieldName) => FormValue
) => string;

export type FormField<FieldName extends string> = {
  default: FormValue;
  validator?: FieldValidator<FieldName>;
};

export type FormConfig<FieldName extends string> = {
  fields: Record<FieldName, FormField<FieldName>>;
};

export type FormState<FieldName extends string> = Record<FieldName, FormValue>;
export type FormErrorState<FieldName extends string> = Record<
  FieldName,
  String
>;
export type FormValues<FieldName extends string> = Record<
  FieldName,
  Store<FormValue>
>;
export type FormUpdaters<FieldName extends string> = Record<
  FieldName,
  Event<FormValue>
>;
export type FormErrors<FieldName extends string> = Record<
  FieldName,
  Store<string>
>;

export type ReflectableProps = {
  value: FormValue;
  update: (value: FormValue) => void;
  error: string;
};
export type Reflectable = React.FC<ReflectableProps>;

export function createForm<FieldName extends string>(
  config: FormConfig<FieldName>
) {
  const validate = createEvent<void>();
  const submitted = createEvent<FormState<FieldName>>();
  const reset = createEvent();

  const values = {} as FormValues<FieldName>;
  const updaters = {} as FormUpdaters<FieldName>;
  const errors = {} as FormErrors<FieldName>;

  const fieldNames = Object.keys(config.fields) as FieldName[];

  const valueStores: Store<FormValue>[] = [];
  const errorStores: Store<string>[] = [];

  for (let name of fieldNames) {
    const field = config.fields[name];

    const $value = createStore<FormValue>(field.default);
    const $error = createStore<string>("");
    const updater = createEvent<FormValue>();

    $value.on(updater, (_, newVal) => newVal).reset(reset);
    $error.reset([updater, reset]);

    values[name] = $value;
    errors[name] = $error;
    updaters[name] = updater;
    valueStores.push($value);
    errorStores.push($error);

    sample({
      clock: validate,
      source: $value,
      fn(val) {
        return field.validator
          ? field.validator(val, (field) => values[field].getState())
          : "";
      },
      target: $error,
    });
  }

  const $state = combine(values, (v) => v as FormState<FieldName>);

  const $noErrors = combine(errors, (errs) =>
    Object.keys(errs).every((key) => errs[key as FieldName] === "")
  );

  guard({
    clock: validate,
    source: $state,
    filter: $noErrors,
    target: submitted,
  });

  return {
    send: validate,
    submitted,
    reset,
    reflect<P>(
      field: FieldName,
      Component: React.FC<ReflectableProps & P>
    ): React.FC<P> {
      return (restProps: P) =>
        React.createElement<ReflectableProps & P>(Component, {
          value: useStore(values[field]),
          update: updaters[field],
          error: useStore(errors[field]),
          ...restProps,
        });
    },
  };
}
