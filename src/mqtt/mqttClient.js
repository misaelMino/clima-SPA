import mqtt from "mqtt";

const DEFAULT_URL = import.meta.env.VITE_MQTT_URL || "ws://localhost:9001";
const DEFAULT_TOPICS = {
  telemetry: "butterboi/telemetry/#",
  cmd: "butterboi/cmd",
  events: "butterboi/events",
};

let client;

export function getClient() {
  if (client) return client;
  client = mqtt.connect(DEFAULT_URL, {
    username: import.meta.env.VITE_MQTT_USER,
    password: import.meta.env.VITE_MQTT_PASS,
    clientId: `bb-web-${Math.random().toString(16).slice(2)}`,
    reconnectPeriod: 1500,
  });
  client.on("connect", () => {
    client.subscribe(DEFAULT_TOPICS.telemetry);
  });
  return client;
}

export function publishCmd(type, payload = {}) {
  const c = getClient();
  const message = JSON.stringify({ type, payload, ts: Date.now() });
  c.publish(DEFAULT_TOPICS.cmd, message, { qos: 0, retain: false });
}

export const topics = DEFAULT_TOPICS;
