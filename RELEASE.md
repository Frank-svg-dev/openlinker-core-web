# Release Process

Chinese documentation: [RELEASE.zh-CN.md](./RELEASE.zh-CN.md)

OpenLinker Core Web releases are cut from `main` after CI and local release
gates pass. Until formal public versioning is introduced, document notable
changes under `Unreleased` in `CHANGELOG.md`.

## Pre-Release Checklist

1. Confirm `README.md` and `README.zh-CN.md` describe the same Core/Hosted,
   authentication, SDK Runtime, and Agent Node Adapter boundaries, and that
   `CONTRIBUTING`, `SECURITY`, `SUPPORT`, and examples are current. The private
   package version is not the deployment release identifier.
2. Confirm `CHANGELOG.md` describes user-visible UI, routing, and Core API
   compatibility changes.
3. Run `npm audit` and review the result.
4. Run `npm run lint`.
5. Run `npx tsc --noEmit`.
6. Run `npm run build`.
7. Run `npm run test:a2a-session`.
8. Run `npm run test:agent-library-card` and `npm run check:i18n`.
9. Run a current-source secret scan on a clean checkout, for example
   `gitleaks dir --redact .`.
10. Confirm `.env.local`, `.next`, `node_modules`, screenshots with private data,
   and build output are not tracked.

## Tagging

Use semantic version tags when maintainers publish versioned builds:

```bash
git tag v0.x.y
git push origin v0.x.y
```

Pre-1.0 releases may include breaking changes, but they must be called out in
`CHANGELOG.md`.
