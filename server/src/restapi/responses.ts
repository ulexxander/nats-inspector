import { Res } from "../types";

export function err(res: Res, message: string, code: number) {
  res.send({ error: message }, code);
}

export function unprocessable(res: Res, message: string) {
  err(res, message, 422);
}

export function internalError(res: Res, message: string) {
  err(res, message, 500);
}

export function result(res: Res, data: any) {
  res.send({ data });
}
