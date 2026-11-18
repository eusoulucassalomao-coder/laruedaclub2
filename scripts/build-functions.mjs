// Empacota as Netlify Functions (netlify/src -> netlify/functions) com todas as dependências embutidas.
import { build } from "esbuild";
import { readdirSync, rmSync, mkdirSync } from "node:fs";

rmSync("netlify/functions", { recursive: true, force: true });
mkdirSync("netlify/functions", { recursive: true });
const entries = readdirSync("netlify/src").filter((f) => f.endsWith(".mjs")).map((f) => `netlify/src/${f}`);
await build({
  entryPoints: entries,
  outdir: "netlify/functions",
  outExtension: { ".js": ".mjs" },
  bundle: true,
  platform: "node",
  format: "esm",
  target: "node20",
  banner: { js: "import { createRequire as __createRequire } from 'module'; const require = __createRequire(import.meta.url);" },
  logLevel: "info",
});