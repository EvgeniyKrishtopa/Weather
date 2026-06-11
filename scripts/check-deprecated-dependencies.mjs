import { execFileSync } from "node:child_process";

const npmCli = process.env.npm_execpath;

if (!npmCli) {
  throw new Error("Run this check through npm.");
}

const output = execFileSync(process.execPath, [npmCli, "query", "[deprecated]"], {
  encoding: "utf8",
});
const dependencies = JSON.parse(output);

if (dependencies.length === 0) {
  console.log("No deprecated dependencies found.");
  process.exit(0);
}

const deprecatedDependencies = [
  ...new Map(
    dependencies.map((dependency) => [
      `${dependency.name}@${dependency.version}`,
      {
        package: `${dependency.name}@${dependency.version}`,
        reason: dependency.deprecated,
      },
    ])
  ).values(),
];

console.error("Deprecated dependencies found:");
console.table(deprecatedDependencies);
process.exit(1);
