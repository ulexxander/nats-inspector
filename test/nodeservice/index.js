const nats = require("nats");

function sleep(duration) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}

function randomInt(min, max) {
  return min + (max - min) * Math.random();
}

function env(key) {
  const val = process.env[key];
  if (!val) {
    throw new Error(`Mandatory env variable ${key} is missing`);
  }
  return val;
}

async function main() {
  const natsAddress = `${env("NATS_HOST")}:${env("NATS_PORT")}`;
  console.log("connecting to nats", natsAddress);

  const natsServer = await nats.connect({
    servers: [natsAddress],
  });
  console.log("connected to the nats");

  const codec = nats.JSONCodec();

  while (true) {
    const now = new Date();

    if (now.getSeconds() % 2 === 0) {
      console.log("node_does_request sending");

      const reply = await natsServer.request(
        "node_does_request",
        codec.encode({
          operation: "SUM",
          stuff: [3, 62, 7, 9],
        })
      );

      console.log("node_does_request got response", reply.data.toString());
    } else {
      natsServer.publish("whasup_from_node", codec.encode({ message: "yo" }));

      console.log("whasup_from_node published");
    }

    await sleep(randomInt(1000, 5000));
  }
}

process.on("SIGTERM", () => {
  console.log("sigint");
  process.exit();
});
process.on("SIGINT", () => {
  console.log("sigint");
  process.exit();
});

main().catch((err) => {
  console.log(err);
  process.exit(1);
});
