import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

import { a2aSessionLabel } from "../src/lib/a2a-session.mjs";

const root = dirname(dirname(fileURLToPath(import.meta.url)));

describe("A2A session compatibility", () => {
  it("labels current snake_case context payloads from Core", () => {
    assert.equal(
      a2aSessionLabel({
        protocol_context_id: "ctx-protocol",
        root_context_id: "ctx-root",
        trace_id: "trace-1",
      }),
      "ctx-root",
    );
    assert.equal(
      a2aSessionLabel({
        protocol_context_id: "ctx-protocol",
        trace_id: "trace-1",
      }),
      "ctx-protocol",
    );
  });

  it("accepts camelCase and protocol-level context aliases", () => {
    assert.equal(a2aSessionLabel({ rootContextId: "ctx-root-camel" }), "ctx-root-camel");
    assert.equal(a2aSessionLabel({ protocolContextId: "ctx-protocol-camel" }), "ctx-protocol-camel");
    assert.equal(a2aSessionLabel({ contextId: "ctx-a2a-message" }), "ctx-a2a-message");
    assert.equal(a2aSessionLabel({ traceId: "trace-camel" }), "trace-camel");
  });

  it("trims blank values and falls back safely", () => {
    assert.equal(
      a2aSessionLabel({
        root_context_id: "  ",
        protocol_context_id: "\n",
        context_id: " ctx-from-session ",
      }),
      "ctx-from-session",
    );
    assert.equal(a2aSessionLabel(null), "");
    assert.equal(a2aSessionLabel({}), "");
  });

  it("keeps both A2A panels wired to the shared session helper", async () => {
    const parent = await readFile(join(root, "src/components/a2a/parent-run-directory.tsx"), "utf8");
    const consolePanel = await readFile(join(root, "src/components/a2a/a2a-console.tsx"), "utf8");

    assert.match(parent, /import \{ a2aSessionLabel \} from "@\/lib\/a2a-session\.mjs"/);
    assert.match(consolePanel, /import \{ a2aSessionLabel \} from "@\/lib\/a2a-session\.mjs"/);
    assert.match(parent, /a2aSessionLabel\(item\.a2a_context\)/);
    assert.match(consolePanel, /a2aSessionLabel\(child\.a2a_context\)/);
  });
});
