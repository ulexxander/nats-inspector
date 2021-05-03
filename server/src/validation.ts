import { Static, TObject, TProperties, Type } from "@sinclair/typebox";
import Ajv, { ErrorObject } from "ajv";

const ajv = new Ajv();

export class ValidationError extends Error {
  constructor(public readonly ajvErrors: ErrorObject[]) {
    super();
    this.name = ValidationError.name;
  }
}

export function validator<T extends TProperties>(schema: TObject<T>) {
  const check = ajv.compile(Type.Strict(schema));

  return (data: any) => {
    if (!check(data)) {
      throw new ValidationError(check.errors || []);
    }

    return data as Static<TObject<T>>;
  };
}
