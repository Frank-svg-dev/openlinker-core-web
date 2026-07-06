import { redirect } from "next/navigation";

import type { AgentResponse } from "@/components/agent/my-agents-card";
import type { AgentStatsItem } from "@/components/agent/agent-stats-list";
import { AgentsList } from "@/components/creator/agents-list";
import { CreatorHubFrame } from "@/components/creator/creator-hub-frame";
import { apiFetchAuthed } from "@/lib/api";
import { auth } from "@/lib/auth";
import type { Locale } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";

interface CreatorDashboard {
  summary: {
    this_month_calls_received: number;
    total_agents: number;
    public_agents?: number;
    pending_agents: number;
  };
  agents: AgentStatsItem[];
}

type AgentsPayload = AgentResponse[] | { items?: AgentResponse[] };

function normalizeAgents(payload: AgentsPayload): AgentResponse[] {
  return Array.isArray(payload) ? payload : payload.items ?? [];
}

export default async function CreatorHubAgentsPage() {
  const session = await auth();
  if (!session?.jwt) redirect("/login?callbackUrl=/hub/agents");

  const locale = await getLocale();
  const [agents, dashboard] = await Promise.all([
    apiFetchAuthed<AgentsPayload>("/api/v1/creator/agents")
      .then(normalizeAgents)
      .catch(() => [] as AgentResponse[]),
    apiFetchAuthed<CreatorDashboard>("/api/v1/creator/dashboard").catch(() => null),
  ]);

  const activeAgents = agents.filter((agent) => agent.lifecycle_status !== "disabled");
  const overview = {
    totalAgents: dashboard?.summary.total_agents ?? activeAgents.length,
    pendingAgents:
      dashboard?.summary.pending_agents ??
      agents.filter((agent) => agent.certification_status === "pending").length,
    publicAgents:
      dashboard?.summary.public_agents ??
      activeAgents.filter((agent) => agent.visibility === "public").length,
    callsThisMonth: dashboard?.summary.this_month_calls_received ?? 0,
  };

  return (
    <CreatorHubFrame active="agents" locale={locale} coreCopy>
      <CoreHubOverview locale={locale} overview={overview} />
      <AgentsList locale={locale} stats={dashboard?.agents ?? null} agents={agents} />
    </CreatorHubFrame>
  );
}

function CoreHubOverview({
  locale,
  overview,
}: {
  locale: Locale;
  overview: {
    totalAgents: number;
    pendingAgents: number;
    publicAgents: number;
    callsThisMonth: number;
  };
}) {
  const labels =
    locale === "zh"
      ? {
          total: "Agent 总数",
          public: "公开 Agent",
          pending: "待认证",
          calls: "本月被调",
        }
      : {
          total: "Total Agents",
          public: "Public Agents",
          pending: "Pending review",
          calls: "Calls this month",
        };

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <Metric label={labels.total} value={overview.totalAgents} />
      <Metric label={labels.public} value={overview.publicAgents} />
      <Metric label={labels.pending} value={overview.pendingAgents} />
      <Metric label={labels.calls} value={overview.callsThisMonth} />
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="ol-panel ol-panel-pad">
      <span className="block text-[11px] font-black uppercase tracking-[0.06em] text-[color:var(--ol-subtle)]">
        {label}
      </span>
      <strong className="mt-2 block text-[26px] font-black text-[color:var(--ol-ink)]">
        {value.toLocaleString()}
      </strong>
    </div>
  );
}
