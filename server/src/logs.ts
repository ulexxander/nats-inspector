type LogPayload = Record<string, any> & {
  msg: string;
};

export function l(payload: LogPayload) {
  const json = JSON.stringify({
    ...payload,
    time: new Date().toISOString(),
  });
  process.stdout.write(json + "\n");
}
