"use client";

import Link from "next/link";
import { Bell, Check, Play } from "lucide-react";
import type { Brand } from "@/lib/types";
import { useStore } from "@/store/useStore";
import { useHydrated } from "@/lib/hooks";
import { cn } from "@/lib/utils";

export function FollowDesignerButton({ brand }: { brand: Brand }) {
  const hydrated = useHydrated();
  const followed = useStore((s) => s.followedDesigners);
  const toggle = useStore((s) => s.toggleFollowDesigner);
  const alerts = useStore((s) => s.designerAlerts);
  const setAlerts = useStore((s) => s.setDesignerAlerts);
  const isFollowing = hydrated && followed.includes(brand.id);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        onClick={() => toggle(brand.id)}
        className={cn("btn", isFollowing ? "bg-canvas text-ink hover:bg-gold hover:text-void" : "bg-gold text-void")}
      >
        {isFollowing ? (
          <>
            <Check className="h-4 w-4" /> Following
          </>
        ) : (
          "Follow designer"
        )}
      </button>
      {isFollowing && (
        <button
          onClick={() => setAlerts(!alerts)}
          className="inline-flex items-center gap-2 rounded-full border border-canvas/40 px-4 py-2 text-xs uppercase tracking-luxe text-canvas/90"
        >
          <Bell className="h-3.5 w-3.5" />
          {alerts ? "New launch alerts on" : "Enable launch alerts"}
        </button>
      )}
      {brand.videoSeed && (
        <Link
          href={`/live`}
          className="inline-flex items-center gap-2 rounded-full border border-canvas/40 px-4 py-2 text-xs uppercase tracking-luxe text-canvas/90"
        >
          <Play className="h-3.5 w-3.5" /> Watch house films
        </Link>
      )}
    </div>
  );
}
