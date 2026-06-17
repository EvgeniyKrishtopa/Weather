import { execFileSync } from "node:child_process";

const port = process.env.VITE_DEV_SERVER_PORT ?? "5173";

let output = "";

try {
  output = execFileSync("lsof", [`-tiTCP:${port}`, "-sTCP:LISTEN"], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
  });
} catch {
  console.log(`No development server found on port ${port}.`);
  process.exit(0);
}

const processIds = output
  .split("\n")
  .map((processId) => processId.trim())
  .filter(Boolean);

if (processIds.length === 0) {
  console.log(`No development server found on port ${port}.`);
  process.exit(0);
}

for (const processId of processIds) {
  process.kill(Number(processId), "SIGTERM");
}

console.log(`Stopped development server on port ${port}.`);
