import type {
  SendRequestInput,
  SendRequestOutput,
} from "../../../shared/types";
import { ConnectionsService } from "./connectionsService";
import { NatsService } from "./natsService";

export class RequestsService {
  constructor(
    private readonly connectionsService: ConnectionsService,
    private readonly natsService: NatsService,
  ) {}

  sendRequest(input: SendRequestInput): Promise<SendRequestOutput> {
    const conn = this.connectionsService.mustGetNatsConnection(
      input.connectionId,
    );

    return this.natsService.request(conn, input);
  }
}
