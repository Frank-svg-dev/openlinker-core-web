import Link from "next/link";
import type { ReactNode } from "react";

import { PageTabs } from "@/components/layout/page-tabs";
import { Topbar } from "@/components/layout/topbar";
import { MyWorkspaceSwitcher } from "@/components/my/workspace-switcher";
import type { Locale } from "@/lib/i18n";

export type CreatorHubSection = "agents" | "access" | "tokens" | "bridge" | "approvals" | "skills";

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
    label: { zh: "注册邀请", en: "Registration Invites" },
    desc: { zh: "生成 Agent 接入凭证", en: "Create Agent credentials" },
    href: "/hub/access",
  },
  {
    id: "tokens",
    label: { zh: "Agent 接入凭证", en: "Agent Credentials" },
    desc: { zh: "查看、排序、撤销", en: "Review, sort, revoke" },
    href: "/hub/tokens",
  },
  {
    id: "bridge",
    label: { zh: "跨节点 Bridge", en: "Cross-node Bridge" },
    desc: { zh: "同步到 Registry Node", en: "Sync to Registry Nodes" },
    href: "/hub/bridge",
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
          creator: "Agent 管理",
          kicker: coreCopy ? "Core 供给" : "Agent 所有者工作台 · 我管理的能力",
          heading: coreCopy ? "Agent 管理 · Agent、接入凭证与 Skill" : "Agent 管理 · Agent、接入凭证、Bridge、审批与 Skill",
          lead: coreCopy
            ? "管理开源 core 需要的 Agent 供给能力：发布、认证、运行记录、注册邀请、跨节点 Bridge 和 Skill 声明。"
            : "管理你拥有的 Agent：发布状态、可见性、接入凭证、跨节点 Bridge、审批和 Skill 声明。",
          publish: "+ 发布 Agent",
        }
      : {
          mine: "My",
          creator: "Agent Console",
          kicker: coreCopy ? "core supply" : "Agent owner workspace · What I manage",
          heading: coreCopy ? "Agent Console · Agents, Credentials, and Skills" : "Agent Console · Agents, Credentials, Bridge, Approvals, and Skills",
          lead: coreCopy
            ? "Manage the Agent supply capabilities required by open-source core: publishing, verification, runs, registration invites, cross-node Bridge, and Skill claims."
            : "Manage the Agents you own: publishing state, visibility, credentials, cross-node Bridge, approvals, and Skill claims.",
          publish: "+ Publish Agent",
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
          ariaLabel={locale === "zh" ? "Agent 管理功能分页" : "Agent Console sections"}
          className="mt-6 xl:grid-cols-6"
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
            ? "core-web 只维护开源 core 可以独立运行的供给、发布与运行能力。"
            : "Agent 管理负责所有者自己的 Agent 供给、接入凭证、跨节点 Bridge 和审批。不同页面只加载自己的数据。",
          guide: {
            agents: "Agent 列表会加载统计和筛选数据，适合处理大量供给项。",
            access: "注册邀请页只创建一次性 Agent 接入凭证，不再预加载凭证列表或审批列表。",
            tokens: "Agent 接入凭证页只读取凭证列表，支持分页、排序和撤销。",
            bridge: "跨节点 Bridge 页只读取 Registry Node 与 Listing，用于把可公开同步的 Agent 供给到其他节点。",
            approvals: "审批页只读取待处理高风险动作，空列表也会快速返回。",
            skills: "Skill 声明页才加载 Agent 详情和能力标签。",
          } satisfies Record<CreatorHubSection, string>,
          bridge: "跨节点 Bridge",
          bridgeHref: "/hub/bridge",
        }
      : {
          title: coreCopy ? "Core frontend boundary" : "Section boundary",
          body: coreCopy
            ? "core-web only maintains supply, publishing, and run capabilities that open-source core can operate independently."
            : "Agent Console owns the Agent owner's supply, credentials, cross-node Bridge, and approvals. Each page loads only its own data.",
          guide: {
            agents: "The Agent list loads stats and filters for larger supply sets.",
            access: "The registration invite page only creates one-time Agent access credentials; it does not preload credential or approval lists.",
            tokens: "Agent Credentials only reads the credential list, with pagination, sorting, and revoke actions.",
            bridge: "Cross-node Bridge only reads Registry Nodes and Listings to supply bridgeable Agents to other nodes.",
            approvals: "Approvals only reads pending high-risk actions, so an empty list returns quickly.",
            skills: "Skill claims is the only page that loads Agent details and capability tags.",
          } satisfies Record<CreatorHubSection, string>,
          bridge: "Cross-node Bridge",
          bridgeHref: "/hub/bridge",
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
