import { redirect } from "next/navigation";

import { AgentTokenListPanel } from "@/components/creator/automation-access-panel";
import { CreatorHubFrame } from "@/components/creator/creator-hub-frame";
import { auth } from "@/lib/auth";
import { getLocale } from "@/lib/i18n-server";

export default async function CreatorHubTokensPage() {
  const session = await auth();
  if (!session?.jwt) redirect("/login?callbackUrl=/hub/tokens");

  const locale = await getLocale();

  return (
    <CreatorHubFrame active="tokens" locale={locale} coreCopy>
      <AgentTokenListPanel />
    </CreatorHubFrame>
  );
}
