# SCANDOMAIN MCP

## 中文说明

SCANDOMAIN MCP 让 OpenClaw、Hermes、Cursor 等支持 MCP 的 AI Agent 能够调用
SCANDOMAIN 进行域名、IP、端口、服务、标题、ICP、Server Header 和组件等资产
检索。项目同时提供 MCP 服务和可复制的 Agent Skill：
`skills/scandomain/SKILL.md`。

### 获取 API Key

请访问 [SCANDOMAIN 官网](https://scandomain.cyayaa.com/)，注册并登录后进入
个人中心获取 API Key。每位用户应使用自己的 Key；不要将 Key 提交到 GitHub、
粘贴到公开对话或共享日志中。

### 安装与配置

需要 Node.js 20 或更高版本。在 OpenClaw、Hermes 或其他支持本地 stdio MCP 的
客户端中添加以下配置：

```json
{
  "mcpServers": {
    "scandomain": {
      "command": "npx",
      "args": ["-y", "github:Batman0506/scandomain-mcp"],
      "env": {
        "SCANDOMAIN_API_TOKEN": "从 https://scandomain.cyayaa.com/ 获取的 API Key",
        "SCANDOMAIN_API_BASE_URL": "https://api.scandomain.cyayaa.com"
      }
    }
  }
}
```

如果客户端支持 Skill，将 `skills/scandomain/SKILL.md` 复制到该客户端的 Skill
目录。配置完成后，Agent 可以调用 `scandomain_search`，例如查询
`domain:"baidu.com"` 或 `port:443 AND country:CN`。

### 工具参数

`scandomain_search` 使用 Quake 风格 DSL 查询资产：

| 参数 | 必填 | 说明 |
| --- | --- | --- |
| `query` | 是 | 查询语句；裸域名和 IPv4 会自动转换为 DSL。 |
| `start` | 否 | 页码起始值，默认 `1`。 |
| `start_time` | 否 | UTC 开始时间。 |
| `end_time` | 否 | UTC 结束时间。 |

请仅将 SCANDOMAIN 用于已授权的资产梳理、防御性安全分析与风险修复工作。

## English

Use SCANDOMAIN from MCP-compatible AI agents with an API key created in the
[SCANDOMAIN account center](https://scandomain.cyayaa.com/). The package
provides a local stdio MCP server and a portable agent skill at
`skills/scandomain/SKILL.md`.

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
      "args": ["-y", "github:Batman0506/scandomain-mcp"],
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
