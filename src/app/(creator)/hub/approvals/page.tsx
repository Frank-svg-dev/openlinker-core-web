import { redirect } from "next/navigation";

import { ApprovalRequestsPanel } from "@/components/creator/automation-access-panel";
import { CreatorHubFrame } from "@/components/creator/creator-hub-frame";
import { auth } from "@/lib/auth";
import { getLocale } from "@/lib/i18n-server";

export default async function CreatorHubApprovalsPage() {
  const session = await auth();
  if (!session?.jwt) redirect("/login?callbackUrl=/hub/approvals");

  const locale = await getLocale();

  return (
    <CreatorHubFrame active="approvals" locale={locale} coreCopy>
      <ApprovalRequestsPanel />
    </CreatorHubFrame>
  );
}
