import { redirect } from "next/navigation";

export default async function ConnectBridgePage() {
  redirect("/hub/bridge");
}
