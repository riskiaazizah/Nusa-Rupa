import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { homePathFor } from "@/lib/roles";
import RegisterForm from "@/components/RegisterForm";

export const metadata = { title: "Daftar" };

export default async function RegisterPage() {
  const user = await getSession();
  if (user) redirect(homePathFor(user));
  return <RegisterForm />;
}