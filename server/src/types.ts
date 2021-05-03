import {
  Protocol,
  Request,
  RequestHandler,
  Response,
  Router,
  Service,
} from "restana";

export type Routes = Router<Protocol.HTTP>;
export type Serv = Service<Protocol.HTTP>;
export type Handler = RequestHandler<Protocol.HTTP>;
export type Res = Response<Protocol.HTTP>;
export type Req = Request<Protocol.HTTP>;

export type WebsocketEvents = "SUB_MESSAGE";
