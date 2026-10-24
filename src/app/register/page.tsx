import { getCurrentUser } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { RegisterView } from "./RegisterView";

export const dynamic = "force-dynamic";

export default async function RegisterPage() {
  const currentUser = await getCurrentUser();

  if (currentUser) {
    redirect(currentUser.role === "DOCTOR" ? "/doctor" : "/patient");
  }

  return <RegisterView />;
}
