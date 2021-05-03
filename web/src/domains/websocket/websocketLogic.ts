import { websocketConnectFx, websocketMessage } from "./websocketUnits";

websocketConnectFx.use(() => {
  const wsClient = new WebSocket("ws://localhost:4098");
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
    console.log(e);
  };
});
