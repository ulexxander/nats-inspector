import { errtext } from "./errors";
import { l } from "./logs";

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
      err: errtext(err),
    });
    process.exit(1);
  });

  process.on("unhandledRejection", (err) => {
    l({
      msg: "Unhandled rejection",
      err: errtext(err as Error),
    });
    process.exit(1);
  });
}
