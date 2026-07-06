import { redirect } from "next/navigation";

import type { AgentResponse } from "@/components/agent/my-agents-card";
import { CreatorHubFrame } from "@/components/creator/creator-hub-frame";
import { SkillPlaceholder } from "@/components/creator/skill-placeholder";
import { apiFetchAuthed } from "@/lib/api";
import { auth } from "@/lib/auth";
import { getLocale } from "@/lib/i18n-server";

interface AgentDetailSkill {
  id: string;
  category: string;
  name: string;
  description: string;
}

interface AgentDetailWithSkills {
  id: string;
  skills: AgentDetailSkill[];
}

type AgentsPayload = AgentResponse[] | { items?: AgentResponse[] };

function normalizeAgents(payload: AgentsPayload): AgentResponse[] {
  return Array.isArray(payload) ? payload : payload.items ?? [];
}

export default async function CreatorHubSkillsPage() {
  const session = await auth();
  if (!session?.jwt) redirect("/login?callbackUrl=/hub/skills");

  const locale = await getLocale();
  const agents = await apiFetchAuthed<AgentsPayload>("/api/v1/creator/agents")
    .then(normalizeAgents)
    .catch(() => [] as AgentResponse[]);
  const agentSkills = await loadAgentSkills(agents);

  return (
    <CreatorHubFrame active="skills" locale={locale} coreCopy>
      <SkillPlaceholder locale={locale} agents={agents} agentSkills={agentSkills} />
    </CreatorHubFrame>
  );
}

async function loadAgentSkills(
  agents: AgentResponse[],
): Promise<Record<string, AgentDetailSkill[]>> {
  const approved = agents.filter(
    (agent) => agent.lifecycle_status === "active" && agent.visibility === "public",
  );
  if (approved.length === 0) return {};

  const pairs = await Promise.all(
    approved.map(async (agent) => {
      try {
        const detail = await apiFetchAuthed<AgentDetailWithSkills>(
          `/api/v1/agents/${encodeURIComponent(agent.slug)}`,
        );
        return [agent.id, detail.skills ?? []] as const;
      } catch {
        return [agent.id, []] as const;
      }
    }),
  );

  return Object.fromEntries(pairs);
}
