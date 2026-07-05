# Support

Chinese documentation: [SUPPORT.zh-CN.md](./SUPPORT.zh-CN.md)

Use GitHub issues for reproducible bugs, documentation problems, and feature
requests that fit OpenLinker Core Web's open-source scope.

## Good Issue Topics

- broken Core Web routes or UI states
- API proxy behavior against `openlinker-core`
- auth/session behavior in a self-hosted Core setup
- A2A, MCP, tasks, runs, settings, creator, admin, or registry UI problems
- documentation gaps that block local development or deployment

## Before Opening an Issue

- Search existing issues and recent commits.
- Confirm the problem on the latest `main` branch or a named release.
- Include operating system, browser, Node.js version, npm version, and commit
  SHA.
- Include the Core API version or commit you are testing against.
- Include reproduction steps, expected behavior, actual behavior, and sanitized
  logs or screenshots.
- Redact tokens, private URLs, customer data, screenshots with private content,
  and local `.env.local` values.

## Not Supported Here

- vulnerabilities; follow [SECURITY.md](./SECURITY.md)
- commercial wallet, billing, withdrawal, Stripe, pricing, or dashboard flows
- private deployment debugging without reproducible public details
- browser extensions or custom reverse proxies that cannot be reproduced

## Cross-Repository Questions

For issues that span Core Web and Core API, include:

- frontend commit SHA
- Core API commit SHA or version
- relevant request path under `/api/v1/*`
- sanitized request/response status and error body
