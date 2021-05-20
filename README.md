# NATS Inspector

Inspect, test and do cool stuff with your Nats network.

## Currently supported features

- Multi server support: create, delete, resume, pause connections on the fly
- Restoring connections on boot (persisting data in sqlite)
- Per server subscriptions support - subs of inactive servers are paused automatically
- Create any number of subscriptions you want (different subjects)
- View incoming messages for each subject
- Making request: define subject, payload and see response you got using handy code editor
- Saving request history: view subject, your input (located in localStorage)
- One-click copy previous request anytime you want

## Running in docker

- Build an image: `build -t nats-inspector .`
- Then run it: `docker run --rm -p 4001:80 nats-inspector`

Or use scripts from root Makefile:

- `inspector-build`
- `inspector-up`

So go ahead and open it in your browser:

`http://localhost:4001`

You should see running web app and u can start clicking on things.

## Environment variables

```
# require dev dependency "dotenv" to parse and load .env file
# use in development (yarn dev sets it to true), disabled by default
ENV_FILE=false

# override port on which http/websocket server will be listening
SERVER_PORT=80
```
