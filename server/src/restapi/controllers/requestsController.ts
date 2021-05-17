import type { SendRequestInput } from "../../../../shared/types";
import { validator } from "../../modules/validation";
import { RequestsService } from "../../service/requestsService";
import { Controller } from "../endpoints";
import { result } from "../responses";
import { Routes } from "../restapiTypedefs";

const validateSendRequestInput = validator<SendRequestInput>({
  type: "object",
  properties: {
    connectionId: { type: "number" },
    subject: { type: "string" },
    payload: { type: "string", nullable: true },
  },
  required: ["connectionId", "subject"],
});

export class RequestsController implements Controller {
  path = "/requests";

  constructor(private readonly requestsService: RequestsService) {}

  register(routes: Routes): void {
    routes.post("/send", async (req, res) => {
      const input = validateSendRequestInput(req.body);

      const response = await this.requestsService.sendRequest(input);

      result(res, response);
    });
  }
}
