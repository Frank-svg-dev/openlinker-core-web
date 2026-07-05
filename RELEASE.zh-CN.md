# 发布流程

English documentation: [RELEASE.md](./RELEASE.md)

OpenLinker Core Web 从 `main` 发布，前提是 CI 和本地发布检查都通过。在正式公共版本化
之前，重要变化记录在 [CHANGELOG.md](./CHANGELOG.md) 的 `Unreleased` 中。

## 发布前检查

1. 确认 `README.md`、`CONTRIBUTING.md`、`SECURITY.md`、`SUPPORT.md` 和示例是最新的。
2. 确认 `CHANGELOG.md` 描述了用户可见 UI、路由和 Core API 兼容性变化。
3. 运行 `npm audit` 并审查结果。
4. 运行 `npm run lint`。
5. 运行 `npx tsc --noEmit`。
6. 运行 `npm run build`。
7. 运行 `npm run test:a2a-session`。
8. 在干净 checkout 上运行源码 secret scan，例如 `gitleaks dir --redact .`。
9. 确认 `.env.local`、`.next`、`node_modules`、含隐私截图和构建产物没有被跟踪。

## 打 tag

维护者发布版本化构建时使用语义化版本 tag：

```bash
git tag v0.x.y
git push origin v0.x.y
```

pre-1.0 版本可以包含 breaking change，但必须在 `CHANGELOG.md` 中说明。

发布前必须确认没有真实 `.env.local`、token、客户截图或本地构建产物进入仓库。
