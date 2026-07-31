import { readdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { gzipSync } from "node:zlib";

const assetsDirectory = resolve("dist/assets");
const files = await readdir(assetsDirectory);
const measured = [];

for (const file of files.filter((name) => /\.(?:js|css)$/.test(name))) {
  const bytes = await readFile(resolve(assetsDirectory, file));
  measured.push({
    file,
    type: file.endsWith(".js") ? "js" : "css",
    gzipBytes: gzipSync(bytes).length,
  });
}

const kib = (bytes) => bytes / 1024;
const javascript = measured.filter((asset) => asset.type === "js");
const styles = measured.filter((asset) => asset.type === "css");
const totalJavaScript = javascript.reduce((total, asset) => total + asset.gzipBytes, 0);
const totalStyles = styles.reduce((total, asset) => total + asset.gzipBytes, 0);
const largestJavaScript = [...javascript].sort((a, b) => b.gzipBytes - a.gzipBytes)[0];
const failures = [];

if (kib(totalJavaScript) > 320) {
  failures.push(`total JavaScript is ${kib(totalJavaScript).toFixed(1)} KiB gzip (budget: 320 KiB)`);
}
if (kib(totalStyles) > 40) {
  failures.push(`total CSS is ${kib(totalStyles).toFixed(1)} KiB gzip (budget: 40 KiB)`);
}
if (largestJavaScript && kib(largestJavaScript.gzipBytes) > 120) {
  failures.push(
    `${largestJavaScript.file} is ${kib(largestJavaScript.gzipBytes).toFixed(1)} KiB gzip (single-chunk budget: 120 KiB)`,
  );
}

console.log(
  `Bundle budget: ${kib(totalJavaScript).toFixed(1)} KiB JS gzip, ` +
    `${kib(totalStyles).toFixed(1)} KiB CSS gzip, largest JS ` +
    `${largestJavaScript ? `${largestJavaScript.file} (${kib(largestJavaScript.gzipBytes).toFixed(1)} KiB)` : "none"}.`,
);

if (failures.length > 0) {
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
}
