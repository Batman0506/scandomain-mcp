#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { buildPayload, getConfig, postJson, summarizeResponse } from "./client.js";

const server = new McpServer({
  name: "scandomain-mcp",
  version: "0.1.0",
});

server.registerTool(
  "scandomain_search",
  {
    title: "Search SCANDOMAIN assets",
    description: "Search SCANDOMAIN assets with Quake-style DSL. Bare domains and IPs are normalized automatically.",
    inputSchema: {
      query: z.string().min(1).describe('Query DSL, for example domain:"example.com", ip:"1.1.1.1", or port:443 AND country:CN.'),
      start: z.number().int().min(0).optional().describe("SCANDOMAIN public API start value. Use 1 for the first page."),
      start_time: z.string().optional().describe("Optional UTC start time filter, for example 2026-01-01T00:00:00Z."),
      end_time: z.string().optional().describe("Optional UTC end time filter, for example 2026-01-31T23:59:59Z."),
    },
  },
  async (args) => {
    const config = getConfig();
    const payload = buildPayload(args);

    try {
      const json = await postJson(`${config.baseUrl}/api/getDomain`, payload, config);
      const summary = summarizeResponse(json);

      return {
        content: [{ type: "text", text: JSON.stringify({ summary, request: payload, response: json }, null, 2) }],
      };
    } catch (error) {
      return {
        isError: true,
        content: [{ type: "text", text: error instanceof Error ? error.message : "SCANDOMAIN request failed." }],
      };
    }
  },
);

const transport = new StdioServerTransport();
await server.connect(transport);
