import { websocketConnectFx, websocketMessage } from "./websocketUnits";

function websocketUrl() {
  // @ts-ignore
  if (import.meta.env.DEV) {
    // @ts-ignore
    return DEV_WEBSOCKET_URL;
  }

  switch (window.location.protocol) {
    case "http:": {
      return "ws://" + window.location.host;
    }
    case "https:": {
      return "wss:" + window.location.host;
    }
    default: {
      throw new Error(`Unexpected protocol: ${window.location.protocol}`);
    }
  }
}

websocketConnectFx.use(() => {
  const url = websocketUrl();
  console.log("connecting to websocket", url);

  const wsClient = new WebSocket(url);

  wsClient.onopen = () => {
    console.log("opened ws client");
  };
  wsClient.onclose = () => {
    console.log("closed ws client");
  };
  wsClient.onmessage = (message) => {
    const json = JSON.parse(message.data);
    websocketMessage(json);
  };
  wsClient.onerror = (e) => {
    console.log("websocket error", e);
  };
});
