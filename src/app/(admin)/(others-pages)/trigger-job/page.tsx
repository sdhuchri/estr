import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import TriggerJobClient from "./TriggerJobClient";

export default async function TriggerJobPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) {
    redirect("/signin");
  }

  return <TriggerJobClient />;
}

export const metadata = {
  title: "STR | Trigger Manual Job",
  description: "Trigger manual job untuk indikator ESTR"
};
