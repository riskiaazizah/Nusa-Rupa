import { redirect } from "next/navigation";

// Sementara diarahkan ke Karya Saya. Nanti diganti ke /member/profile.
export default function MemberIndexPage() {
  redirect("/member/artworks");
}