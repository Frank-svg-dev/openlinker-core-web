import { redirect } from "next/navigation";

import { AgentTokenCreatePanel } from "@/components/creator/automation-access-panel";
import { CreatorHubFrame } from "@/components/creator/creator-hub-frame";
import { auth } from "@/lib/auth";
import { getLocale } from "@/lib/i18n-server";

export default async function CreatorHubAccessPage() {
  const session = await auth();
  if (!session?.jwt) redirect("/login?callbackUrl=/hub/access");

  const locale = await getLocale();

  return (
    <CreatorHubFrame active="access" locale={locale} coreCopy>
      <AgentTokenCreatePanel />
    </CreatorHubFrame>
  );
}
