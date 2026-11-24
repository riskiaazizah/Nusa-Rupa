import { redirect } from "next/navigation";

// Dashboard Member dibuka di Profile Management (sesuai spesifikasi)
export default function MemberIndexPage() {
  redirect("/member/profile");
}
