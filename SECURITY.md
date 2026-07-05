# Security Policy

Chinese documentation: [SECURITY.zh-CN.md](./SECURITY.zh-CN.md)

Do not open public issues for vulnerabilities.

Use GitHub private vulnerability reporting when available. If it is not
available, contact the maintainers through the published OpenLinker
security/support channel. Include the affected repository, commit or release,
reproduction steps, impact, and whether any live token, public endpoint, or
customer data is involved.

## Supported Versions

OpenLinker Core Web is pre-1.0. Security fixes target the current `main` branch
and the latest tagged release when tags are available. Older commits may not
receive backports unless maintainers explicitly announce support for a release
line.

## Security-Sensitive Areas

- session handling and protected routes
- Next.js API proxy behavior
- authorization headers forwarded to Core
- access-token display, copy, and redaction flows
- user-controlled URLs, callback URLs, and local HTTP warnings
- admin pages and operator-only views
- error rendering that may expose upstream details

## Reporting Guidance

Please include:

- the affected commit, tag, or deployment version
- browser and Node.js versions when relevant
- a minimal reproduction or route-level description
- expected vs. actual behavior
- whether exploitation requires authentication
- whether any live secret was exposed

Never include real third-party secrets in public reports, tests, screenshots, or
logs. If a token was exposed, rotate it before sharing details.

## Disclosure

Maintainers will triage reports as quickly as practical. Please avoid public
disclosure until a fix, mitigation, or coordinated disclosure timeline is
available.
