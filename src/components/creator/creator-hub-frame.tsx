import Link from "next/link";
import type { ReactNode } from "react";

import { PageTabs } from "@/components/layout/page-tabs";
import { Topbar } from "@/components/layout/topbar";
import { MyWorkspaceSwitcher } from "@/components/my/workspace-switcher";
import type { Locale } from "@/lib/i18n";

export type CreatorHubSection = "agents" | "access" | "tokens" | "approvals" | "skills";

const NAV_ITEMS: ReadonlyArray<{
  id: CreatorHubSection;
  label: Record<Locale, string>;
  desc: Record<Locale, string>;
  href: string;
}> = [
  {
    id: "agents",
    label: { zh: "我的 Agent", en: "My Agents" },
    desc: { zh: "列表、状态、调用入口", en: "List, status, run entry" },
    href: "/hub/agents",
  },
  {
    id: "access",
    label: { zh: "生成 Token", en: "Create Token" },
    desc: { zh: "Agent 自注册邀请", en: "Agent registration invite" },
    href: "/hub/access",
  },
  {
    id: "tokens",
    label: { zh: "Token 管理", en: "Token Management" },
    desc: { zh: "查看、排序、撤销", en: "Review, sort, revoke" },
    href: "/hub/tokens",
  },
  {
    id: "approvals",
    label: { zh: "审批", en: "Approvals" },
    desc: { zh: "高风险动作确认", en: "High-risk actions" },
    href: "/hub/approvals",
  },
  {
    id: "skills",
    label: { zh: "Skill 声明", en: "Skill Claims" },
    desc: { zh: "能力标签、市场匹配", en: "Capabilities, matching" },
    href: "/hub/skills",
  },
];

export function CreatorHubFrame({
  active,
  locale,
  children,
  aside,
  coreCopy = false,
}: {
  active: CreatorHubSection;
  locale: Locale;
  children: ReactNode;
  aside?: ReactNode;
  coreCopy?: boolean;
}) {
  const copy =
    locale === "zh"
      ? {
          mine: "我的",
          creator: "创作者中心",
          kicker: coreCopy ? "Core 供给" : "创作者工作台 · 我发布的能力",
          heading: coreCopy ? "创作者中心 · Agent、Token 与 Skill" : "创作者中心 · Agent、Token、审批与 Skill",
          lead: coreCopy
            ? "管理开源 core 需要的 Agent 供给能力：接入、认证、运行记录、Agent Token、审批和 Skill 声明。"
            : "管理 Agent 可见性与认证、Agent Token、审批和 Skill 声明。跨节点 Bridge 已移到接入中心。",
          publish: "+ 接入新 Agent",
        }
      : {
          mine: "My",
          creator: "Creator Hub",
          kicker: coreCopy ? "core supply" : "Creator workspace · What I publish",
          heading: coreCopy ? "Creator Hub · Agents, Tokens, and Skills" : "Creator Hub · Agents, Tokens, Approvals, and Skills",
          lead: coreCopy
            ? "Manage the Agent supply capabilities required by open-source core: onboarding, verification, runs, Agent Tokens, approvals, and Skill claims."
            : "Manage Agent visibility, verification, Agent Tokens, approvals, and Skill claims. Cross-node Bridge now lives in Connect.",
          publish: "+ Connect Agent",
        };

  return (
    <>
      <Topbar />
      <main className="mx-auto max-w-7xl px-6 pb-16">
        <div className="ol-breadcrumb">
          <span>{copy.mine}</span>
          <span className="sep">/</span>
          <span className="current">{copy.creator}</span>
        </div>

        <div className="ol-page-head">
          <div className="ol-page-title">
            <div className="ol-kicker">{copy.kicker}</div>
            <h1>{copy.heading}</h1>
            <p>{copy.lead}</p>
          </div>
          <Link
            href="/publish"
            className="inline-flex h-11 items-center justify-center rounded-[14px] bg-[color:var(--ol-primary)] px-5 text-[13.5px] font-[900] text-white shadow-sm transition-colors hover:bg-[color:var(--ol-primary-dark)]"
          >
            {copy.publish}
          </Link>
        </div>

        <MyWorkspaceSwitcher locale={locale} className="mt-6" />
        <PageTabs
          ariaLabel={locale === "zh" ? "创作者中心功能分页" : "Creator Hub sections"}
          className="mt-6 xl:grid-cols-5"
          items={NAV_ITEMS.map((item) => ({
            label: item.label[locale],
            desc: item.desc[locale],
            href: item.href,
            active: item.id === active,
          }))}
        />

        <div className="ol-dash-layout">
          <section className="ol-dash-section">{children}</section>
          {aside ?? <CreatorHubGuide active={active} locale={locale} coreCopy={coreCopy} />}
        </div>
      </main>
    </>
  );
}

export function CreatorHubGuide({
  active,
  locale,
  coreCopy = false,
}: {
  active: CreatorHubSection;
  locale: Locale;
  coreCopy?: boolean;
}) {
  const content =
    locale === "zh"
      ? {
          title: coreCopy ? "Core 前端边界" : "功能边界",
          body: coreCopy
            ? "core-web 只维护开源 core 可以独立运行的供给、接入与运行能力。"
            : "创作者中心负责作者自己的 Agent 供给、Token 和审批；跨节点 Bridge 属于接入中心。不同页面只加载自己的数据。",
          guide: {
            agents: "Agent 列表会加载统计和筛选数据，适合处理大量供给项。",
            access: "生成页只创建一次性 Agent Token，不再预加载 token 列表或审批列表。",
            tokens: "Token 管理页只读取 Agent Token 列表，支持分页、排序和撤销。",
            approvals: "审批页只读取待处理高风险动作，空列表也会快速返回。",
            skills: "Skill 声明页才加载 Agent 详情和能力标签。",
          } satisfies Record<CreatorHubSection, string>,
          bridge: "跨节点 Bridge",
          bridgeHref: "/connect/bridge",
        }
      : {
          title: coreCopy ? "Core frontend boundary" : "Section boundary",
          body: coreCopy
            ? "core-web only maintains supply, connection, and run capabilities that open-source core can operate independently."
            : "Creator Hub owns the creator's Agents, Tokens, and approvals. Cross-node Bridge belongs in Connect. Each page loads only its own data.",
          guide: {
            agents: "The Agent list loads stats and filters for larger supply sets.",
            access: "The create page only mints one-time Agent Tokens; it does not preload token or approval lists.",
            tokens: "Token management only reads Agent Tokens, with pagination, sorting, and revoke actions.",
            approvals: "Approvals only reads pending high-risk actions, so an empty list returns quickly.",
            skills: "Skill claims is the only page that loads Agent details and capability tags.",
          } satisfies Record<CreatorHubSection, string>,
          bridge: "Cross-node Bridge",
          bridgeHref: "/connect/bridge",
        };

  return (
    <aside className="space-y-4 self-start">
      <div className="ol-panel ol-panel-pad">
        <strong className="text-[15px] font-black text-[color:var(--ol-ink)]">
          {content.title}
        </strong>
        <p className="mt-3 text-[13px] leading-relaxed text-[color:var(--ol-muted)]">
          {content.body}
        </p>
      </div>
      <div className="ol-panel ol-panel-pad">
        <p className="text-[13px] leading-relaxed text-[color:var(--ol-muted)]">
          {content.guide[active]}
        </p>
        <Link className="ol-filter-item mt-4" href={content.bridgeHref}>
          {content.bridge} <span>→</span>
        </Link>
      </div>
    </aside>
  );
}
