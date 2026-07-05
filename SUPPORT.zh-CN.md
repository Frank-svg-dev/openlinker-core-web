# 支持

English documentation: [SUPPORT.md](./SUPPORT.md)

可用 GitHub Issues 报告可复现 bug、文档问题，以及符合 OpenLinker Core Web 开源范围
的功能请求。

## 适合提交 Issue 的内容

- 破损的 Core Web 路由或 UI 状态
- 针对 `openlinker-core` 的 API proxy 行为
- 自托管 Core 设置下的 auth/session 行为
- A2A、MCP、tasks、runs、settings、creator、admin 或 registry UI 问题
- 阻碍本地开发或部署的文档缺口

## 提交前请确认

- 搜索已有 Issue 和近期 commit。
- 在最新 `main` 或指定 release 上确认问题。
- 提供操作系统、浏览器、Node.js 版本、npm 版本和 commit SHA。
- 提供正在测试的 Core API 版本或 commit。
- 提供复现步骤、期望行为、实际行为和脱敏日志/截图。
- 删除 token、私有 URL、客户数据、含隐私的截图和本地 `.env.local`。

## 不在这里处理

- 安全漏洞；请看 [SECURITY.zh-CN.md](./SECURITY.zh-CN.md)
- 商业钱包、计费、提现、Stripe、价格或 Dashboard 流程
- 无法公开复现的私有部署调试
- 无法复现的浏览器扩展或自定义反向代理问题

## 跨仓库问题

涉及 Core Web 和 Core API 的问题请包含：

- 前端 commit SHA
- Core API commit SHA 或版本
- `/api/v1/*` 下的相关请求路径
- 脱敏后的请求/响应状态和错误体
