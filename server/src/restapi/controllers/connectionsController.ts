import type { InsertConnectionVars } from "../../../../shared/types";
import { validator } from "../../modules/validation";
import { validateIdInput } from "../../modules/validationPresets";
import { ConnectionsService } from "../../service/connectionsService";
import { Controller } from "../endpoints";
import { result } from "../responses";
import { Routes } from "../restapiTypedefs";

const validateCreateConnectionInput = validator<InsertConnectionVars>({
  type: "object",
  properties: {
    title: { type: "string" },
    description: { type: "string", nullable: true },
    host: { type: "string" },
    port: { type: "integer" },
  },
  required: ["title", "description", "host", "port"],
});

export class ConnectionsController implements Controller {
  path = "/connections";

  constructor(private readonly connectionsService: ConnectionsService) {}

  register(routes: Routes) {
    routes.get("/active", (_req, res) => {
      result(res, this.connectionsService.getActiveList());
    });

    routes.get("/paused", (_req, res) => {
      result(res, this.connectionsService.getPausedList());
    });

    routes.post("/create", async (req, res) => {
      const input = validateCreateConnectionInput(req.body);

      result(res, await this.connectionsService.createConnection(input));
    });

    routes.delete("/delete", async (req, res) => {
      const input = validateIdInput(req.body);

      result(res, await this.connectionsService.deleteConnection(input));
    });
  }
}
