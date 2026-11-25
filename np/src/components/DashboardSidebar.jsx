"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Palette,
  Heart,
  Trophy,
  User,
  Settings,
  LogOut,
  ExternalLink,
  Compass,
  BarChart3,
  Users,
  UserCheck,
  Tag,
  Flag,
  Plus,
  Menu,
  X,
  Sparkles,
} from "lucide-react";

const ICON_MAP = {
  LayoutDashboard,
  Palette,
  Heart,
  Trophy,
  User,
  Settings,
  LogOut,
  ExternalLink,
  Compass,
  BarChart3,
  Users,
  UserCheck,
  Tag,
  Flag,
  Plus,
  Sparkles,
};

// Role Theme Tokens
const ROLE_THEMES = {
  member: {
    name: "Member",
    color: "#1f6b45",
    activeClass: "bg-forest text-white shadow-xs font-semibold",
    badgeClass: "bg-forest/10 text-forest border border-forest/20",
    avatarBg: "bg-forest text-white",
    cardBg: "bg-gradient-to-br from-[#0c1c13] to-[#12281b]",
    cardAction: {
      title: "Share Artwork",
      desc: "Upload paintings, photos, or digital art for conservation.",
      btnText: "+ New Artwork",
      href: "/member/artworks/new",
    },
  },
  curator: {
    name: "Curator",
    color: "#2f3fa8",
    activeClass: "bg-animals text-white shadow-xs font-semibold",
    badgeClass: "bg-animals/10 text-animals border border-animals/20",
    avatarBg: "bg-animals text-white",
    cardBg: "bg-gradient-to-br from-[#0a1029] to-[#162152]",
    cardAction: {
      title: "Open Call Challenge",
      desc: "Launch new challenges to inspire creators across Indonesia.",
      btnText: "+ New Challenge",
      href: "/curator/challenges/new",
    },
  },
  admin: {
    name: "Admin",
    color: "#d92e1c",
    activeClass: "bg-people text-white shadow-xs font-semibold",
    badgeClass: "bg-people/10 text-people border border-people/20",
    avatarBg: "bg-people text-white",
    cardBg: "bg-gradient-to-br from-[#210907] to-[#3a130f]",
    cardAction: {
      title: "Platform Overview",
      desc: "Monitor moderation, creator accounts, and category impact.",
      btnText: "Exhibition",
      href: "/#collection",
    },
  },
};

export default function DashboardSidebar({
  links,
  menuLinks,
  generalLinks,
  subtitle,
  displayName,
  user,
  role = "member",
  children,
}) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const theme = ROLE_THEMES[role] || ROLE_THEMES.member;
  const userDisplayName = user?.display_name || displayName || "User";
  const userEmail = user?.email || "";
  const userAvatar = user?.avatar_url || "";

  // Support both menuLinks and legacy links prop
  const mainLinks = menuLinks || links || [];
  const defaultGeneralLinks = generalLinks || [
    { href: "/#collection", label: "Public Exhibition", icon: "ExternalLink" },
  ];

  // Close drawer on Escape key or route change
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") setDrawerOpen(false);
    }
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [drawerOpen]);

  const isActive = (link) =>
    link.exact ? pathname === link.href : pathname.startsWith(link.href);

  // Render a navigation link item
  const renderNavLink = (link) => {
    const active = isActive(link);
    const IconComponent = ICON_MAP[link.icon] || LayoutDashboard;

    return (
      <Link
        key={link.href}
        href={link.href}
        onClick={() => setDrawerOpen(false)}
        aria-current={active ? "page" : undefined}
        className={`group flex items-center justify-between rounded-xl px-4 py-3 text-sm transition duration-150 ${
          active
            ? theme.activeClass
            : "text-ink/80 hover:bg-white hover:text-ink hover:shadow-2xs font-medium"
        }`}
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <IconComponent
            className={`h-5 w-5 shrink-0 transition-colors ${
              active ? "text-white" : "text-mute group-hover:text-ink"
            }`}
          />
          <span className="truncate">{link.label}</span>
        </div>
        {link.badge && (
          <span
            className={`ml-2 rounded-full px-2.5 py-0.5 text-xs font-semibold shrink-0 ${
              active ? "bg-white/20 text-white" : "bg-line text-mute"
            }`}
          >
            {link.badge}
          </span>
        )}
      </Link>
    );
  };

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between p-6">
      {/* Top Brand Header */}
      <div>
        <div className="flex items-center justify-between pb-5 border-b border-line">
          <Link
            href="/"
            onClick={() => setDrawerOpen(false)}
            className="flex items-center gap-2.5 group transition-transform hover:scale-105"
            aria-label="TIGA Homepage"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo/tiga-logo-red.svg" alt="TIGA" className="h-8 w-auto" />
          </Link>

          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close menu"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-mute hover:text-ink hover:bg-line/50 transition min-[1000px]:hidden cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Section 1: MENU */}
        <div className="pt-6">
          <span className="block px-3 mb-2.5 text-xs font-semibold uppercase tracking-wider text-mute">
            Menu
          </span>
          <nav className="space-y-1.5">
            {mainLinks.map((link) => renderNavLink(link))}
          </nav>
        </div>

        {/* Section 2: GENERAL */}
        {defaultGeneralLinks.length > 0 && (
          <div className="pt-6">
            <span className="block px-3 mb-2.5 text-xs font-semibold uppercase tracking-wider text-mute">
              General
            </span>
            <nav className="space-y-1.5">
              {defaultGeneralLinks.map((link) => renderNavLink(link))}
            </nav>
          </div>
        )}
      </div>

      {/* Bottom Area: Logout Bar */}
      <div className="pt-5 border-t border-line flex items-center justify-between">
        <form action="/api/auth/logout" method="post">
          <button
            type="submit"
            className="flex items-center gap-2 rounded-lg border border-line bg-white px-3 py-1.5 text-xs font-semibold text-mute hover:text-people hover:border-people/30 transition cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Log out</span>
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-[#f7f9f7] text-ink antialiased">
      {/* Mobile Drawer Backdrop */}
      {drawerOpen && (
        <div
          onClick={() => setDrawerOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs min-[1000px]:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Left Sidebar (Desktop Fixed/Sticky, Mobile Sliding Drawer) */}
      <aside
        id="dashboard-drawer"
        role="navigation"
        aria-label={subtitle || "Dashboard navigation"}
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-[280px] shrink-0 flex-col border-r border-line bg-[#fbfcfb] text-ink transition-transform duration-300 ease-out min-[1000px]:sticky min-[1000px]:top-0 min-[1000px]:z-20 min-[1000px]:h-screen min-[1000px]:translate-x-0 ${
          drawerOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full min-[1000px]:translate-x-0"
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Main Content Column with Topbar */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Modern Topbar matching layout pattern */}
        <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-line/80 bg-white/90 backdrop-blur-md px-5 sm:px-8 lg:px-10">
          {/* Left: Mobile Toggle & Title */}
          <div className="flex items-center gap-3.5">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open sidebar menu"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-white text-ink hover:bg-soft transition min-[1000px]:hidden cursor-pointer shrink-0"
            >
              <Menu className="h-5 w-5" />
            </button>

            <span className="text-sm font-bold uppercase tracking-wider text-ink/80">
              {subtitle || "Dashboard"}
            </span>
          </div>

          {/* Right: User Profile Pill (matching mockup top-right) */}
          <div className="flex items-center gap-3.5 shrink-0">
            {/* User Pill Card */}
            <div className="flex items-center gap-3">
              {/* Avatar circle */}
              {userAvatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={userAvatar}
                  alt={userDisplayName}
                  className="h-10 w-10 rounded-full object-cover border border-line shadow-2xs"
                />
              ) : (
                <div
                  aria-hidden="true"
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${theme.avatarBg} text-sm font-bold shadow-2xs`}
                >
                  {(userDisplayName || "?").charAt(0).toUpperCase()}
                </div>
              )}

              {/* User Name & Role/Email */}
              <div className="hidden sm:block text-left leading-tight">
                <span className="block text-sm font-semibold text-ink truncate max-w-[160px]">
                  {userDisplayName}
                </span>
                <span className="block text-xs text-mute truncate max-w-[160px]">
                  {userEmail || theme.name}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-5 sm:p-8 lg:p-10 max-w-7xl w-full mx-auto text-base">
          {children}
        </main>
      </div>
    </div>
  );
}
