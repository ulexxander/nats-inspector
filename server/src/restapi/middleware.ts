import { createReadStream } from "fs";
import path from "path";
import serveStatic from "serve-static";
import { errtext, wrap } from "../errors";
import { l } from "../logs";
import { ValidationError } from "../validation";
import { internalError, unprocessable } from "./responses";
import { Handler } from "./restapiTypedefs";

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
    l({
      msg: "Incoming http request",
      method: req.method,
      url: req.url,
    });
    next();
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
        internalError(res, errtext(err));
      }
    }
  };
}

export function serveWebDist() {
  const distPath = path.join(__dirname, "../../../web/dist");
  return serveStatic(distPath);
}

export function serveWebIndex(): Handler {
  const indexPath = path.join(__dirname, "../../../web/dist/index.html");

  return (_req, res) => {
    const stream = createReadStream(indexPath);
    res.setHeader("content-type", "text/html; charset=utf-8");
    stream.pipe(res);
  };
}
