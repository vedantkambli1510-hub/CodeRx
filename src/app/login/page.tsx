import { getCurrentUser } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { LoginView } from "./LoginView";

export const dynamic = "force-dynamic";

interface LoginPageProps {
  searchParams: {
    role?: "DOCTOR" | "PATIENT";
    switch?: string;
  };
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const currentUser = await getCurrentUser();

  // If already authenticated and not explicitly requesting to switch accounts,
  // automatically redirect straight to the user's dashboard!
  if (currentUser && searchParams?.switch !== "true") {
    redirect(currentUser.role === "DOCTOR" ? "/doctor" : "/patient");
  }

  return (
    <LoginView
      currentUser={currentUser}
      requestedRole={searchParams?.role === "DOCTOR" ? "DOCTOR" : "PATIENT"}
    />
  );
}
