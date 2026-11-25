import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { homePathFor } from "@/lib/roles";
import ForgotPasswordForm from "@/components/ForgotPasswordForm";

export const metadata = {
  title: "Reset Password · TIGA",
  description: "Reset your TIGA account password.",
};

export default async function ForgotPasswordPage() {
  const user = await getSession();
  if (user) redirect(homePathFor(user));

  return (
    <Suspense
      fallback={
        <div className="py-12 text-center text-sm text-mute">
          Loading reset form...
        </div>
      }
    >
      <ForgotPasswordForm />
    </Suspense>
  );
}
