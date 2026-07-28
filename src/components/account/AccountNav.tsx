"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  RotateCcw,
  Heart,
  Award,
  Settings,
  LogOut,
  Shirt,
  Sparkles,
  Users,
  Calendar,
  Radio,
  Headphones,
  Scissors,
  MapPin,
  Smartphone,
  UsersRound,
  LayoutGrid,
  Shield,
  Store,
} from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/account", label: "Dashboard", icon: LayoutDashboard },
  { href: "/account/orders", label: "Orders & Tracking", icon: Package },
  { href: "/account/returns", label: "Returns & Exchanges", icon: RotateCcw },
  { href: "/account/appointments", label: "Styling appointments", icon: Calendar },
  { href: "/wishlist", label: "Wishlist", icon: Heart },
  { href: "/community", label: "Community", icon: UsersRound },
  { href: "/boards", label: "Outfit boards", icon: LayoutGrid },
  { href: "/account/wardrobe", label: "Digital wardrobe", icon: Shirt },
  { href: "/account/style", label: "Style profile", icon: Sparkles },
  { href: "/account/referrals", label: "Referrals", icon: Users },
  { href: "/live", label: "Live shopping", icon: Radio },
  { href: "/support", label: "Concierge", icon: Headphones },
  { href: "/care", label: "Alterations & care", icon: Scissors },
  { href: "/stores", label: "Stores", icon: MapPin },
  { href: "/app", label: "Mobile app", icon: Smartphone },
  { href: "/rewards", label: "Bosiano Club", icon: Award },
  { href: "/admin", label: "Admin", icon: Shield },
  { href: "/vendor", label: "Vendor portal", icon: Store },
  { href: "/account/settings", label: "Settings", icon: Settings },
];

export function AccountNav() {
  const pathname = usePathname();
  return (
    <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible" aria-label="Account">
      {links.map((l) => {
        const active = pathname === l.href;
        return (
          <Link
            key={l.href}
            href={l.href}
            className={cn(
              "flex shrink-0 items-center gap-3 rounded-lg px-4 py-3 text-sm transition-colors",
              active ? "bg-ink text-canvas" : "text-ink-soft hover:bg-canvas-sunk"
            )}
          >
            <l.icon className="h-4 w-4" strokeWidth={1.5} />
            {l.label}
          </Link>
        );
      })}
      <button className="mt-2 flex shrink-0 items-center gap-3 rounded-lg px-4 py-3 text-sm text-ink-muted hover:bg-canvas-sunk">
        <LogOut className="h-4 w-4" strokeWidth={1.5} /> Sign out
      </button>
    </nav>
  );
}
