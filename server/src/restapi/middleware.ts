import { wrap } from "../errors";
import { Handler } from "../types";
import { ValidationError } from "../validation";
import { internalError, unprocessable } from "./responses";

export function bodyParser(): Handler {
  return (req, res, next) => {
    if (req.headers["content-type"] !== "application/json") {
      next();
      return;
    }

    let bodyBuffer = Buffer.alloc(0);

    req.on("data", (chunk) => {
      bodyBuffer = Buffer.concat([bodyBuffer, chunk]);
    });

    req.on("end", () => {
      try {
        const parsedBody = JSON.parse(bodyBuffer.toString());
        req.body = parsedBody;
        next();
      } catch (err) {
        unprocessable(res, wrap(err, "Can not parse body"));
      }
    });
  };
}

export function requestLog(): Handler {
  return (req, _res, next) => {
    console.log(req.method, req.url);
    return next();
  };
}

export function errorHandler(): Handler {
  return async (_req, res, next) => {
    try {
      await next();
    } catch (err) {
      if (err instanceof ValidationError) {
        const [firstErr] = err.ajvErrors;

        if (!firstErr) {
          unprocessable(res, "Unknown validation error");
          return;
        }

        if (!firstErr.instancePath) {
          unprocessable(res, firstErr.message || "Unknown validation error");
          return;
        }

        if (!firstErr.message) {
          unprocessable(res, `Invalid ${firstErr.instancePath}`);
          return;
        }

        unprocessable(res, `${firstErr.instancePath}: ${firstErr.message}`);
      } else {
        internalError(res, err.message);
      }
    }
  };
}
