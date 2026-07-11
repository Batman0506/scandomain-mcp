---
name: scandomain
description: Search and analyze SCANDOMAIN internet-exposed assets by domain, IP, port, service, title, ICP record, server header, or component using the user's SCANDOMAIN API key. Use for authorized asset inventory and defensive security analysis.
---

# SCANDOMAIN

Use SCANDOMAIN when the user wants to search or analyze internet-exposed assets
by domain, IP, port, service, title, ICP record, server header, component, or
other Quake-style DSL fields.

SCANDOMAIN is best for:

- domain asset discovery
- IP and service lookup
- exposed port and protocol investigation
- web title, server, ICP, component, and banner review
- defensive asset inventory and security analysis

## Authentication

SCANDOMAIN requires an API key from the user's SCANDOMAIN account center. The MCP
server reads it from:

```text
SCANDOMAIN_API_TOKEN
```

Never reveal the API key in replies. If authentication fails, tell the user to
check their SCANDOMAIN API key in the account center.

## Tool

Call `scandomain_search` for asset search.

Inputs:

- `query`: Quake-style DSL query. Required.
- `start`: first page is normally `1`. Optional.
- `start_time`: UTC time filter. Optional.
- `end_time`: UTC time filter. Optional.

Examples:

```text
domain:"example.com"
ip:"8.8.8.8"
port:443 AND country:CN
title:"admin portal"
server:"nginx" AND domain:"example.com"
```

If the user gives a bare domain such as `example.com`, convert it to:

```text
domain:"example.com"
```

If the user gives a bare IP such as `8.8.8.8`, convert it to:

```text
ip:"8.8.8.8"
```

## Response Style

Summarize results before listing raw details. Prioritize:

- total result count
- unique IPs
- notable ports and services
- suspicious or high-risk exposed services
- relevant titles, ICP data, server headers, and components
- geographic and ISP context when useful

Do not overstate risk. If the user asks for exploitation instructions, keep the
response focused on authorized inventory, exposure review, and remediation.

## Errors

When SCANDOMAIN returns an error:

- invalid API key: ask the user to refresh their key from SCANDOMAIN
- insufficient points: ask the user to recharge or reduce query scope
- permission or verification required: ask the user to complete account center
  requirements
- no results: suggest a broader query or related filters

## Safety

Use SCANDOMAIN only for lawful, authorized asset discovery and defensive security
work. Avoid helping users target systems they do not own or administer.
