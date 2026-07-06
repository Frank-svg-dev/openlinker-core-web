import { redirect } from "next/navigation";

export default async function CreatorHubRedirect({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;

  if (tab === "access") redirect("/hub/access");
  if (tab === "registry") redirect("/connect/bridge");
  if (tab === "skills") redirect("/hub/skills");

  redirect("/hub/agents");
}
