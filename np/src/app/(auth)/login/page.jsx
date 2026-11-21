import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { homePathFor } from "@/lib/roles";
import LoginForm from "@/components/LoginForm";

export const metadata = { title: "Masuk" };

export default async function LoginPage() {
  const user = await getSession();
  if (user) redirect(homePathFor(user)); // sudah login: tidak perlu melihat form
  return <LoginForm />;
}