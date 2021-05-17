import Ajv, { ErrorObject, JSONSchemaType } from "ajv";

const ajv = new Ajv();

export class ValidationError extends Error {
  constructor(public readonly ajvErrors: ErrorObject[]) {
    super();
    this.name = ValidationError.name;
  }
}

export function validator<T>(schema: JSONSchemaType<T>) {
  const isValid = ajv.compile(schema);

  return (data: any) => {
    if (!isValid(data)) {
      throw new ValidationError(isValid.errors || []);
    }

    return data as T;
  };
}
