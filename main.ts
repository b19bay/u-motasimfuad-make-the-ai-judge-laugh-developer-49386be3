import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "The bug only happens in production because production is the only place anyone actually uses it.";

const outDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outDir) {
  throw new Error("MAKEFUN_OUTPUT_DIR is not set");
}

mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, LINE, "utf8");

// Gate: 1-200 characters, non-whitespace, single line.
const chars = [...LINE];
if (chars.length < 1 || chars.length > 200) {
  throw new Error(`entry must be 1-200 characters, got ${chars.length}`);
}
// Ties break on bytes: assert the UTF-8 byte length too (all ASCII here,
// so bytes equal characters, but the check guards against a future edit
// sneaking in a multi-byte character).
const bytes = Buffer.byteLength(LINE, "utf8");
if (bytes > 200) {
  throw new Error(`entry must be at most 200 bytes, got ${bytes}`);
}
if (LINE.trim().length === 0) {
  throw new Error("entry must not be only whitespace");
}
if (LINE.includes("\n")) {
  throw new Error("entry must be a single line");
}

const readBack = readFileSync(outPath, "utf8");
if (readBack !== LINE) {
  throw new Error("read-back mismatch: entry.txt differs from the line");
}
