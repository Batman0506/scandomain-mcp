# SCANDOMAIN MCP

Use SCANDOMAIN from MCP-compatible AI agents with an API key created in the
SCANDOMAIN account center. The package provides a local stdio MCP server and a
portable agent skill at `skills/scandomain/SKILL.md`.

The server calls the public SCANDOMAIN API:

```http
POST https://api.scandomain.cyayaa.com/api/getDomain
Content-Type: application/json
api-token: <SCANDOMAIN_API_TOKEN>
```

## Install

The package requires Node.js 20 or newer. Add this MCP configuration to a
client such as OpenClaw, Hermes, Cursor, or another stdio MCP client:

```json
{
  "mcpServers": {
    "scandomain": {
      "command": "npx",
      "args": ["-y", "scandomain-mcp"],
      "env": {
        "SCANDOMAIN_API_TOKEN": "your-api-key",
        "SCANDOMAIN_API_BASE_URL": "https://api.scandomain.cyayaa.com"
      }
    }
  }
}
```

Copy `skills/scandomain/SKILL.md` into the agent's skill directory when the
client supports skills. It tells the agent when to call `scandomain_search` and
how to present authorized asset-search results.

## Tool

`scandomain_search` queries assets using Quake-style DSL.

```json
{
  "query": "domain:\"baidu.com\"",
  "start": 1,
  "start_time": "2026-01-01T00:00:00Z",
  "end_time": "2026-01-31T23:59:59Z"
}
```

Bare domains and IPs are normalized automatically:

```text
baidu.com                 -> domain:"baidu.com"
8.8.8.8                   -> ip:"8.8.8.8"
port:443 AND country:CN    -> unchanged
```

`start` defaults to `1`. The public SCANDOMAIN endpoint controls page size.

## Environment variables

| Name | Required | Default |
| --- | --- | --- |
| `SCANDOMAIN_API_TOKEN` | Yes | |
| `SCANDOMAIN_API_BASE_URL` | No | `https://api.scandomain.cyayaa.com` |
| `SCANDOMAIN_TIMEOUT_MS` | No | `20000` |

`SCANDOMAIN_API_KEY` is accepted as a compatibility alias for the token.

## Development

```bash
npm install
npm run check
npm test
```

Run the server locally:

```bash
SCANDOMAIN_API_TOKEN="your-api-key" npm start
```

## Security

Keep API keys out of prompts, repositories, and shared logs. Use SCANDOMAIN
only for authorized asset discovery and defensive security work.

## License

[MIT](LICENSE)
