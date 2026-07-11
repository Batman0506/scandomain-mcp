import assert from "node:assert/strict";
import test from "node:test";
import { buildPayload, getConfig, normalizeQuery, postJson, summarizeResponse } from "../src/client.js";

test("normalizes bare domains and IPs", () => {
  assert.equal(normalizeQuery("baidu.com"), 'domain:"baidu.com"');
  assert.equal(normalizeQuery("8.8.8.8"), 'ip:"8.8.8.8"');
  assert.equal(normalizeQuery('port:443 AND country:CN'), 'port:443 AND country:CN');
});

test("builds the public API payload", () => {
  assert.deepEqual(buildPayload({ query: "baidu.com", start: 2, start_time: "2026-01-01T00:00:00Z" }), {
    domain: 'domain:"baidu.com"', start: 2, start_time: "2026-01-01T00:00:00Z",
  });
});

test("uses valid configuration defaults", () => {
  assert.deepEqual(getConfig({ SCANDOMAIN_API_TOKEN: "token", SCANDOMAIN_API_BASE_URL: "https://api.example.com///", SCANDOMAIN_TIMEOUT_MS: "0" }), {
    token: "token", baseUrl: "https://api.example.com", timeoutMs: 20000,
  });
});

test("returns readable API errors", async () => {
  await assert.rejects(
    postJson("https://api.example.com", {}, { token: "token", timeoutMs: 1000 }, async () => new Response(JSON.stringify({ msg: "invalid key" }), { status: 401 })),
    /SCANDOMAIN HTTP 401: invalid key/,
  );
});

test("summarizes result rows", () => {
  assert.deepEqual(summarizeResponse({ code: 0, data: { total: 3, data: [{ ip: "1.1.1.1", port: 443 }, { ip: "1.1.1.1", port: 443 }, { ip: "2.2.2.2", port: 80 }] } }), {
    code: 0, message: "success", total: 3, returned: 3, unique_ips: 2, ports: [443, 80],
  });
});
