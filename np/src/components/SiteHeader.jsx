import { getSession } from "@/lib/session";
import { dashboardPathFor } from "@/lib/roles";
import NavbarClient from "./NavbarClient";

export default async function SiteHeader() {
  const user = await getSession();
  const dashboardHref = user ? dashboardPathFor(user) : "/login";

  return <NavbarClient user={user} dashboardHref={dashboardHref} />;
}
