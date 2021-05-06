# NATS Inspector

Inspect, test and do cool stuff with your Nats network.

## Currently supported features

- Subscribe/Unsubscibe to a particular subject
- View incoming messages for each subject
- Making request: define subject, payload and see response you got
- Saving request history: view subject, your input (located in localStorage)
- Resend previous request anytime you want

## Features that are coming soon

- Support multiple Nats servers, manage workspaces client-side
- Configuration system
- Stats from Inspector server
- Stats from Nats info endpoint

## Features that are coming not that soon

- Introspection and easier work by pre-defining subjects (client-side)
- Define Nats communication schema in typescript file with types only and use TS api to parse AST and provide type-safety and codegenration to backend services (may go into another proj)
