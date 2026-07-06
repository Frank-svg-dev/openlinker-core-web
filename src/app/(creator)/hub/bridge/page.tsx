import { redirect } from "next/navigation";

import type { AgentResponse } from "@/components/agent/my-agents-card";
import { CreatorHubFrame } from "@/components/creator/creator-hub-frame";
import { RegistryBridgePanel } from "@/components/creator/registry-bridge-panel";
import { apiFetchAuthed } from "@/lib/api";
import { auth } from "@/lib/auth";
import { getLocale } from "@/lib/i18n-server";

type AgentsPayload = AgentResponse[] | { items?: AgentResponse[] };

interface RegistryNode {
  id: string;
  node_name: string;
  node_type: string;
  base_url?: string;
  secret_prefix: string;
  scopes: string[];
  heartbeat_status: string;
  last_heartbeat_at?: string;
}

interface RegistryListing {
  id: string;
  registry_listing_id: string;
  registry_node_id: string;
  node_name: string;
  agent_id: string;
  agent_slug: string;
  agent_name: string;
  routing_mode: string;
  payload_policy: string;
  sync_status: string;
  last_sync_at: string;
}

function normalizeAgents(payload: AgentsPayload): AgentResponse[] {
  return Array.isArray(payload) ? payload : payload.items ?? [];
}

export default async function AgentBridgePage() {
  const session = await auth();
  if (!session?.jwt) redirect("/login?callbackUrl=/hub/bridge");

  const locale = await getLocale();
  const [agents, registryNodes, registryListings] = await Promise.all([
    apiFetchAuthed<AgentsPayload>("/api/v1/creator/agents")
      .then(normalizeAgents)
      .catch(() => [] as AgentResponse[]),
    apiFetchAuthed<{ items: RegistryNode[] }>("/api/v1/registry/nodes")
      .then((data) => data.items ?? [])
      .catch(() => [] as RegistryNode[]),
    apiFetchAuthed<{ items: RegistryListing[] }>("/api/v1/registry/listings")
      .then((data) => data.items ?? [])
      .catch(() => [] as RegistryListing[]),
  ]);

  return (
    <CreatorHubFrame active="bridge" locale={locale} coreCopy>
      <RegistryBridgePanel
        locale={locale}
        agents={agents}
        initialNodes={registryNodes}
        initialListings={registryListings}
      />
    </CreatorHubFrame>
  );
}
