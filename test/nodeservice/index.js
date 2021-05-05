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

    const huh = now.getSeconds() % 4;

    if (huh === 0) {
      console.log("node_does_request sending");

      const reply = await natsServer.request(
        "node_does_request",
        codec.encode({
          operation: "SUM",
          stuff: [3, 62, 7, 9],
        })
      );

      console.log("node_does_request got response", reply.data.toString());
    } else if (huh === 1) {
      natsServer.publish(
        "long_one",
        codec.encode({
          text:
            "NATS is a connective technology that powers modern distributed systems. A connective technology is responsible for addressing and discovery and exchanging of messages that drive the common patterns in distributed systems; asking and answering questions, aka services/microservices, and making and processing statements, or stream processing.",
        })
      );
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
