import fs from "fs";
import path from "path";
import { l } from "./modules/logs";
import { errText } from "./utils/errors";

export function setupProcess() {
  process.on("SIGINT", () => {
    l({
      msg: "Received SIGINT from the OS",
    });
    process.exit(0);
  });

  process.on("SIGTERM", () => {
    l({
      msg: "Received SIGTERM from the OS",
    });
    process.exit(0);
  });

  process.on("uncaughtException", (err) => {
    l({
      msg: "Unhandled exception",
      err: errText(err),
      stack: err.stack,
    });
    process.exit(1);
  });

  process.on("unhandledRejection", (err: Error) => {
    l({
      msg: "Unhandled rejection",
      err: errText(err),
      stack: err.stack,
    });
    process.exit(1);
  });
}

export function setupDataDir() {
  const dataDir = path.join(process.cwd(), "data");

  if (!fs.existsSync(dataDir)) {
    l({
      msg: "Creating data directory inside cwd",
    });

    fs.mkdirSync(dataDir);
  }
}
