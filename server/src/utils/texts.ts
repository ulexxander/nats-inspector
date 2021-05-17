import type { ConnectionModel } from "../../../shared/types";

export function address(hostPort: Pick<ConnectionModel, "host" | "port">) {
  return hostPort.host + ":" + hostPort.port;
}
