const DEFAULT_BASE_URL = "https://api.scandomain.cyayaa.com";
const DEFAULT_TIMEOUT_MS = 20000;

export function getConfig(env = process.env) {
  const token = env.SCANDOMAIN_API_TOKEN || env.SCANDOMAIN_API_KEY;
  const baseUrl = env.SCANDOMAIN_API_BASE_URL || DEFAULT_BASE_URL;
  const timeoutMs = Number(env.SCANDOMAIN_TIMEOUT_MS || DEFAULT_TIMEOUT_MS);

  return {
    token,
    baseUrl: baseUrl.replace(/\/+$/, ""),
    timeoutMs: Number.isFinite(timeoutMs) && timeoutMs > 0 ? timeoutMs : DEFAULT_TIMEOUT_MS,
  };
}

export function normalizeQuery(query) {
  const trimmed = query.trim();

  if (/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(trimmed)) return `domain:"${trimmed}"`;
  if (/^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/.test(trimmed)) return `ip:"${trimmed}"`;

  return trimmed;
}

export function buildPayload(args) {
  const payload = { domain: normalizeQuery(args.query), start: args.start ?? 1 };
  if (args.start_time) payload.start_time = args.start_time;
  if (args.end_time) payload.end_time = args.end_time;
  return payload;
}

export async function postJson(url, payload, config, fetchImpl = fetch) {
  if (!config.token) throw new Error("Missing SCANDOMAIN_API_TOKEN environment variable.");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), config.timeoutMs);

  try {
    const response = await fetchImpl(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "api-token": config.token },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    const text = await response.text();
    let json;

    try {
      json = text ? JSON.parse(text) : {};
    } catch {
      throw new Error(`SCANDOMAIN returned non-JSON response: HTTP ${response.status}`);
    }

    if (!response.ok) throw new Error(`SCANDOMAIN HTTP ${response.status}: ${json.msg || json.message || response.statusText}`);
    return json;
  } catch (error) {
    if (error.name === "AbortError") throw new Error(`SCANDOMAIN request timed out after ${config.timeoutMs}ms.`);
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export function summarizeResponse(json) {
  const data = json?.data || {};
  const rows = Array.isArray(data.data) ? data.data : [];
  const total = data.total ?? rows.length;
  const uniqueIps = new Set(rows.map((item) => item.ip).filter(Boolean)).size;
  const ports = [...new Set(rows.map((item) => item.port).filter((port) => port !== undefined && port !== null))].slice(0, 12);

  return { code: json?.code, message: json?.msg || json?.message || "success", total, returned: rows.length, unique_ips: uniqueIps, ports };
}
