"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  Palette,
  Heart,
  Trophy,
  User,
  Compass,
  Sparkles,
  Plus,
  Shield,
  Users,
  Tag,
  LogOut,
} from "lucide-react";

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

export default function ProfileDropdown({ user, role = "member", transparent = false }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const roleKey = (user?.role || role || "member").toLowerCase();
  const roleConfig = ROLE_BADGES[roleKey] || ROLE_BADGES.member;

  const displayName = user?.display_name || "User";
  const email = user?.email || "";
  const avatarUrl = user?.avatar_url || "";
  const initial = (displayName || "?").charAt(0).toUpperCase();

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Close dropdown on Escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Close dropdown on navigation
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const isItemActive = (href) => {
    if (href === "/#collection") return false;
    if (href === "/curator/challenges") return pathname === "/curator/challenges";
    return pathname.startsWith(href);
  };

  // Build items based on role
  const getSections = () => {
    if (roleKey === "curator") {
      return [
        {
          items: [
            { href: "/curator/challenges", label: "Challenges", icon: Trophy },
            { href: "/curator/challenges/new", label: "New Challenge", icon: Plus },
            { href: "/curator/profile", label: "Edit Profile", icon: User },
            ...(user?.id
              ? [{ href: `/creators/${user.id}`, label: "Public Profile", icon: Compass }]
              : []),
          ],
        },
        {
          items: [
            { href: "/challenges", label: "Public Challenges", icon: Compass },
            { href: "/#collection", label: "Collection", icon: Sparkles },
          ],
        },
      ];
    }

    if (roleKey === "admin") {
      return [
        {
          items: [
            { href: "/admin/moderation", label: "Moderation", icon: Shield },
            { href: "/admin/curators", label: "Curators", icon: Users },
            { href: "/admin/users", label: "Users", icon: Users },
            { href: "/admin/categories", label: "Categories", icon: Tag },
            { href: "/admin/profile", label: "Edit Profile", icon: User },
          ],
        },
        {
          items: [
            { href: "/challenges", label: "Public Challenges", icon: Compass },
            { href: "/#collection", label: "Collection", icon: Sparkles },
          ],
        },
      ];
    }

    // Default: Member
    return [
      {
        items: [
          { href: "/member/artworks", label: "My Artworks", icon: Palette },
          { href: "/member/favorites", label: "My Favorites", icon: Heart },
          { href: "/member/submissions", label: "My Submissions", icon: Trophy },
          { href: "/member/profile", label: "Edit Profile", icon: User },
        ],
      },
      {
        items: [
          { href: "/challenges", label: "Challenges", icon: Compass },
          { href: "/#collection", label: "Collection", icon: Sparkles },
        ],
      },
    ];
  };

  const sections = getSections();

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dropdown Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="User menu"
        className={`group flex items-center gap-2 rounded-full py-1 pl-1 pr-3 transition cursor-pointer ${
          transparent
            ? isOpen
              ? "border border-white bg-white/20 text-white shadow-xs"
              : "border border-white/30 text-white hover:border-white hover:bg-white/10"
            : isOpen
            ? "border border-ink/40 bg-soft shadow-xs"
            : "border border-line hover:border-ink/30 hover:bg-soft"
        }`}
      >
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl}
            alt={displayName}
            className={`h-8 w-8 rounded-full object-cover ${
              transparent ? "border border-white/40" : "border border-line"
            }`}
          />
        ) : (
          <div
            aria-hidden="true"
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${roleConfig.avatarBg} text-xs font-bold transition-transform group-hover:scale-105`}
          >
            {initial}
          </div>
        )}
        <span
          className={`text-sm font-semibold transition truncate max-w-[130px] ${
            transparent ? "text-white" : "text-ink group-hover:text-people"
          }`}
        >
          {displayName}
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform duration-200 ${
            transparent
              ? isOpen
                ? "rotate-180 text-white"
                : "text-white/70 group-hover:text-white"
              : isOpen
              ? "rotate-180 text-ink"
              : "text-mute group-hover:text-ink"
          }`}
        />
      </button>

      {/* Dropdown Menu Panel */}
      {isOpen && (
        <div
          role="menu"
          aria-label="User navigation"
          className="absolute right-0 top-full mt-2 w-72 origin-top-right rounded-2xl border border-line bg-white shadow-xl py-2 z-50 animate-in fade-in-0 zoom-in-95 duration-150"
        >
          {/* User Card Header */}
          <div className="px-4 py-3 border-b border-line flex items-center gap-3">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt={displayName}
                className="h-10 w-10 rounded-full object-cover border border-line shrink-0"
              />
            ) : (
              <div
                aria-hidden="true"
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${roleConfig.avatarBg} text-sm font-bold`}
              >
                {initial}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-ink truncate">{displayName}</p>
                <span
                  className={`inline-flex items-center rounded-full border px-1.5 py-0.2 text-[10px] font-semibold uppercase tracking-wider ${roleConfig.badgeClass}`}
                >
                  {roleConfig.label}
                </span>
              </div>
              {email && <p className="text-xs text-mute truncate mt-0.5">{email}</p>}
            </div>
          </div>

          {/* Section Items */}
          <div className="py-1">
            {sections.map((section, sIdx) => (
              <div key={sIdx}>
                {sIdx > 0 && <div className="border-t border-line my-1.5" />}
                <div className="px-2 space-y-0.5">
                  {section.items.map((item) => {
                    const active = isItemActive(item.href);
                    const IconComponent = item.icon;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${
                          active
                            ? "bg-soft text-people font-semibold"
                            : "text-ink hover:bg-soft hover:text-people"
                        }`}
                      >
                        <IconComponent
                          className={`h-4 w-4 shrink-0 ${
                            active ? "text-people" : "text-mute group-hover:text-people"
                          }`}
                        />
                        <span className="truncate">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Logout Section */}
          <div className="border-t border-line pt-1 mt-1 px-2">
            <form action="/api/auth/logout" method="post">
              <button
                type="submit"
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-ink hover:bg-soft hover:text-people transition cursor-pointer font-medium"
              >
                <LogOut className="h-4 w-4 text-mute" />
                <span>Log Out</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
