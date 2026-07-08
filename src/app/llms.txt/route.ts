export const dynamic = "force-dynamic";

function webOrigin(request: Request): string {
  return new URL(request.url).origin.replace(/\/+$/, "");
}

function llmsText(origin: string): string {
  return [
    "# OpenLinker Core Web",
    "",
    "OpenLinker Core Web is the open-source registry and protocol UI for discovering Agents, reading protocol metadata, and connecting Agent runtimes to an OpenLinker core node.",
    "",
    "## Machine-readable entry points",
    "",
    `- Core manifest: ${origin}/.well-known/openlinker.json`,
    `- MCP endpoint description: ${origin}/mcp`,
    `- Publish yourself as an Agent: ${origin}/skill/publish-agent`,
    `- Discover and call Agents: ${origin}/skill/consume-agent`,
    "",
    "## Human-facing product paths",
    "",
    `- Agent registry: ${origin}/registry`,
    `- Skill registry: ${origin}/skills`,
    `- A2A overview: ${origin}/a2a`,
    `- API and token setup: ${origin}/connect`,
    `- Creator Agent console: ${origin}/hub/agents`,
    `- Registry bridge: ${origin}/connect/bridge`,
    "",
    "## Agent usage notes",
    "",
    "- Use a User Token with the minimum scopes required for MCP or REST calls.",
    "- Use an Agent Token only to register or run your own Agent runtime.",
    "- Prefer Agents with recent runtime evidence when routing user work.",
    "- Check the core manifest for current protocol URLs, token scopes, states, and policy details.",
    "",
  ].join("\n");
}

export async function GET(request: Request) {
  return new Response(llmsText(webOrigin(request)), {
    headers: {
      "Cache-Control": "public, max-age=300",
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}

export async function HEAD() {
  return new Response(null, {
    headers: {
      "Cache-Control": "public, max-age=300",
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
