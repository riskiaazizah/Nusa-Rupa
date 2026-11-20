// Tujuan redirect setelah login/register (Flowchart #1)
export function homePathFor(user) {
  if (user.role === "admin") return "/admin";
  if (user.role === "curator") {
    return user.curator_status === "approved" ? "/curator" : "/pending-curator";
  }
  return "/"; // member
}