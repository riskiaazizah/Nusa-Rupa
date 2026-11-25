"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Palette,
  Heart,
  Trophy,
  User,
  Compass,
  Sparkles,
  Plus,
  LogOut,
} from "lucide-react";
import ProfileDropdown from "./ProfileDropdown";

const ROLE_BADGES = {
  member: {
    label: "Member",
    badgeClass: "bg-forest/10 text-forest border-forest/20",
    avatarBg: "bg-forest text-white",
  },
  curator: {
    label: "Curator",
    badgeClass: "bg-animals/10 text-animals border-animals/20",
    avatarBg: "bg-animals text-white",
  },
  admin: {
    label: "Admin",
    badgeClass: "bg-people/10 text-people border-people/20",
    avatarBg: "bg-people text-white",
  },
};

const DEFAULT_CENTER_LINKS = [
  { href: "/#collection", label: "Collection" },
  { href: "/challenges", label: "Challenges" },
];

export default function RoleNavbar({ user, role = "member", links }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on Escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") setMobileMenuOpen(false);
    }
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen]);

  // Close mobile menu on pathname change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = links && links.length > 0 ? links : DEFAULT_CENTER_LINKS;

  const roleKey = (user?.role || role || "member").toLowerCase();
  const roleConfig = ROLE_BADGES[roleKey] || ROLE_BADGES.member;

  const profileHref =
    roleKey === "curator"
      ? "/curator/profile"
      : roleKey === "admin"
      ? "/admin/profile"
      : "/member/profile";
  const userDisplayName = user?.display_name || "User";
  const userAvatar = user?.avatar_url || "";
  const userInitial = (userDisplayName || "?").charAt(0).toUpperCase();

  const isLinkActive = (link) => {
    if (link.exact) return pathname === link.href;
    if (link.href === "/#collection") return false;
    return pathname.startsWith(link.href);
  };

  const getMobileItems = () => {
    if (roleKey === "curator") {
      return [
        { href: "/curator/challenges", label: "Challenges", icon: Trophy },
        { href: "/curator/challenges/new", label: "New Challenge", icon: Plus },
        { href: "/curator/profile", label: "Edit Profile", icon: User },
        ...(user?.id
          ? [{ href: `/creators/${user.id}`, label: "Public Profile", icon: Compass }]
          : []),
        { href: "/challenges", label: "Public Challenges", icon: Compass },
        { href: "/#collection", label: "Collection", icon: Sparkles },
      ];
    }

    // Default: Member
    return [
      { href: "/member/artworks", label: "My Artworks", icon: Palette },
      { href: "/member/favorites", label: "My Favorites", icon: Heart },
      { href: "/member/submissions", label: "My Submissions", icon: Trophy },
      { href: "/member/profile", label: "Edit Profile", icon: User },
      { href: "/challenges", label: "Challenges", icon: Compass },
      { href: "/#collection", label: "Collection", icon: Sparkles },
    ];
  };

  const mobileItems = getMobileItems();

  return (
    <>
      <header className="sticky top-0 left-0 right-0 z-40 bg-white/95 text-ink backdrop-blur-md border-b border-line shadow-xs">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left: TIGA Logo */}
          <Link href="/" className="flex items-center gap-2 group" aria-label="TIGA Homepage">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo/tiga-logo-red.svg"
              alt="TIGA"
              className="h-9 w-auto transition-transform duration-200 group-hover:scale-105"
            />
          </Link>

          {/* Center: Desktop Navigation Links (Collection & Challenges - matching Image 2) */}
          <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide">
            {navLinks.map((link) => {
              const active = isLinkActive(link);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`group relative py-1 transition-colors ${
                    active ? "text-people font-semibold" : "text-ink hover:text-people"
                  }`}
                >
                  <span>{link.label}</span>
                  <span
                    aria-hidden="true"
                    className={`absolute -bottom-1 left-0 h-[2px] w-full bg-people transition-all duration-200 ${
                      active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Right: User Profile Dropdown (Replaced Dashboard text) */}
          <div className="hidden md:flex items-center">
            <ProfileDropdown user={user} role={roleKey} />
          </div>

          {/* Mobile Right: Profile Icon & Hamburger Toggle */}
          <div className="flex md:hidden items-center gap-2.5">
            <Link href={profileHref} className="flex items-center" aria-label="Profile">
              {userAvatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={userAvatar}
                  alt={userDisplayName}
                  className="h-8 w-8 rounded-full object-cover border border-line"
                />
              ) : (
                <div
                  aria-hidden="true"
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${roleConfig.avatarBg} text-xs font-bold`}
                >
                  {userInitial}
                </div>
              )}
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle menu"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-white text-ink hover:bg-soft transition cursor-pointer"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-line bg-white px-4 py-6 shadow-xl animate-in slide-in-from-top-2 duration-200">
            {/* User Info Header */}
            <div className="flex items-center gap-3 pb-5 border-b border-line">
              {userAvatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={userAvatar}
                  alt={userDisplayName}
                  className="h-10 w-10 rounded-full object-cover border border-line"
                />
              ) : (
                <div
                  aria-hidden="true"
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${roleConfig.avatarBg} text-sm font-bold`}
                >
                  {userInitial}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-ink truncate">{userDisplayName}</p>
                  <span
                    className={`inline-flex items-center rounded-full border px-1.5 py-0.2 text-[10px] font-semibold uppercase tracking-wider ${roleConfig.badgeClass}`}
                  >
                    {roleConfig.label}
                  </span>
                </div>
                <p className="text-xs text-mute truncate">{user?.email || role}</p>
              </div>
            </div>

            {/* Mobile Nav Links */}
            <nav className="py-4 space-y-1">
              {mobileItems.map((item) => {
                const active =
                  item.href === "/#collection"
                    ? false
                    : pathname.startsWith(item.href);
                const IconComponent = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                      active
                        ? "bg-soft text-people font-semibold"
                        : "text-ink hover:bg-soft hover:text-people"
                    }`}
                  >
                    <IconComponent
                      className={`h-4 w-4 shrink-0 ${
                        active ? "text-people" : "text-mute"
                      }`}
                    />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Logout Button */}
            <div className="pt-4 border-t border-line">
              <form action="/api/auth/logout" method="post">
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-full border border-line py-2.5 text-xs font-semibold uppercase tracking-wider text-ink hover:border-people hover:text-people transition cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  <span>LOG OUT</span>
                </button>
              </form>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
