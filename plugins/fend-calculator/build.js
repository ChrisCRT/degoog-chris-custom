import { rm, cp } from "node:fs/promises";

await rm("./index.js", { force: true });
await rm("./fend_wasm_bg.wasm", { force: true });

const result = await Bun.build({
  entrypoints: ["./src/index.js"],
  target: "bun",
  format: "esm",
  packages: "bundle",
  outdir: ".",
});

if (!result.success) {
  console.error(result.logs);
  process.exit(1);
}

await cp(
  "./node_modules/fend-wasm-web/fend_wasm_bg.wasm",
  "./fend_wasm_bg.wasm",
);

console.log("Fend calculator built successfully.");
