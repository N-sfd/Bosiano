"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MessageCircle,
  Phone,
  Mail,
  Video,
  Bot,
  UserRound,
  Crown,
  Send,
  ExternalLink,
} from "lucide-react";
import { conciergeChannels, aiQuickReplies, aiReply } from "@/lib/concierge";
import { useStore } from "@/store/useStore";
import { useHydrated } from "@/lib/hooks";
import { tierForPoints } from "@/lib/club";
import { cn } from "@/lib/utils";

const icons = {
  chat: MessageCircle,
  whatsapp: MessageCircle,
  email: Mail,
  phone: Phone,
  video: Video,
  ai: Bot,
};

export default function ConciergePage() {
  const hydrated = useHydrated();
  const points = useStore((s) => s.loyaltyPoints);
  const tickets = useStore((s) => s.supportTickets);
  const openTicket = useStore((s) => s.openSupportTicket);
  const tier = tierForPoints(hydrated ? points : 2480);
  const isPC = tier.id === "private-client";

  const [channel, setChannel] = useState<"chat" | "ai" | "video">("ai");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "ai" | "agent"; text: string }[]>([
    { role: "ai", text: "Hi — I'm the Bosiano assistant. Ask anything, or say “speak to a human”." },
  ]);
  const [videoOn, setVideoOn] = useState(false);
  const [handoff, setHandoff] = useState(false);

  const send = (text: string) => {
    const prompt = text.trim();
    if (!prompt) return;
    setMessages((m) => [...m, { role: "user", text: prompt }]);
    setInput("");
    const reply = aiReply(prompt, isPC);
    const needsHuman = /human|agent|private client/i.test(prompt) || /Connecting you/i.test(reply);
    setTimeout(() => {
      setMessages((m) => [...m, { role: needsHuman ? "agent" : "ai", text: reply }]);
      if (needsHuman) {
        setHandoff(true);
        openTicket(prompt.slice(0, 60), isPC ? "private-client" : "chat", isPC);
      }
    }, 500);
  };

  return (
    <div className="shell py-12 lg:py-16">
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">Concierge support</p>
        <h1 className="mt-3 font-serif text-5xl">We're here — every channel</h1>
        <p className="mt-4 text-ink-soft">
          Live chat, WhatsApp, email, phone, video, AI assistant with human handoff
          {isPC ? ", plus your Private Client priority queue." : "."}
        </p>
        {isPC && (
          <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-gold/15 px-4 py-1.5 text-xs uppercase tracking-luxe text-gold-deep">
            <Crown className="h-3.5 w-3.5" /> Private Client support queue active
          </p>
        )}
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {conciergeChannels.map((c) => {
          const Icon = icons[c.id];
          const isEmbed = c.id === "chat" || c.id === "ai" || c.id === "video";
          return (
            <button
              key={c.id}
              onClick={() => {
                if (c.id === "chat" || c.id === "ai" || c.id === "video") setChannel(c.id);
                else if (c.href) window.open(c.href, "_blank");
              }}
              className={cn(
                "rounded-2xl border p-5 text-left transition-colors",
                isEmbed && channel === c.id ? "border-ink bg-canvas-raised" : "border-line hover:border-ink"
              )}
            >
              <Icon className="h-6 w-6 text-gold" strokeWidth={1.4} />
              <p className="mt-3 font-serif text-2xl">{c.label}</p>
              <p className="mt-1 text-sm text-ink-muted">{c.copy}</p>
              {c.href && (
                <span className="mt-3 inline-flex items-center gap-1 text-xs uppercase tracking-luxe text-gold-deep">
                  Open <ExternalLink className="h-3 w-3" />
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-2xl border border-line p-5">
          <div className="mb-4 flex flex-wrap gap-2">
            {(
              [
                ["ai", "AI assistant"],
                ["chat", "Live chat"],
                ["video", "Video"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                onClick={() => setChannel(id)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs uppercase tracking-luxe",
                  channel === id ? "border-ink bg-ink text-canvas" : "border-line"
                )}
              >
                {label}
              </button>
            ))}
          </div>

          {channel === "video" ? (
            <div>
              <button onClick={() => setVideoOn((v) => !v)} className="btn-primary">
                <Video className="h-4 w-4" /> {videoOn ? "End video desk" : "Start video consultation"}
              </button>
              {videoOn && (
                <div className="relative mt-4 overflow-hidden rounded-xl bg-ink text-canvas">
                  <div className="flex aspect-video items-center justify-center">
                    <p className="text-sm">Connected to concierge video desk</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="max-h-80 space-y-2 overflow-y-auto">
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={cn(
                      "rounded-xl px-4 py-3 text-sm",
                      m.role === "user"
                        ? "ml-8 bg-ink text-canvas"
                        : m.role === "agent"
                          ? "mr-8 border border-gold/40 bg-gold/10"
                          : "mr-8 bg-canvas-sunk"
                    )}
                  >
                    <p className="mb-1 flex items-center gap-1 text-[0.65rem] uppercase tracking-luxe opacity-70">
                      {m.role === "user" ? (
                        "You"
                      ) : m.role === "agent" ? (
                        <>
                          <UserRound className="h-3 w-3" /> Specialist
                        </>
                      ) : (
                        <>
                          <Bot className="h-3 w-3" /> AI
                        </>
                      )}
                    </p>
                    {m.text}
                  </div>
                ))}
              </div>
              {handoff && (
                <p className="mt-3 text-xs text-gold-deep">
                  Human handoff started{isPC ? " · Private Client queue" : ""}.
                </p>
              )}
              <div className="mt-3 flex flex-wrap gap-2">
                {aiQuickReplies.map((q) => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    className="rounded-full border border-line px-3 py-1 text-xs hover:border-ink"
                  >
                    {q}
                  </button>
                ))}
              </div>
              <div className="mt-3 flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send(input)}
                  placeholder="Message concierge…"
                  className="flex-1 rounded-lg border border-line bg-canvas px-4 py-3 text-sm"
                />
                <button onClick={() => send(input)} className="btn-primary !px-4" aria-label="Send">
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </>
          )}
        </section>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-line p-5">
            <h2 className="font-serif text-2xl">Support tickets</h2>
            <div className="mt-3 space-y-2 text-sm">
              {(hydrated ? tickets : []).map((t) => (
                <div key={t.id} className="rounded-lg border border-line px-3 py-2">
                  <p className="font-medium">
                    #{t.id} · {t.subject}
                  </p>
                  <p className="text-xs text-ink-muted">
                    {t.status}
                    {t.privateClient ? " · Private Client" : ""} · {t.channel} · {t.updatedAt}
                  </p>
                </div>
              ))}
            </div>
            <button
              onClick={() => openTicket("General concierge request", "email", isPC)}
              className="btn-outline mt-4 w-full"
            >
              Open email ticket
            </button>
          </div>
          <div className="rounded-2xl border border-line p-5 text-sm">
            <p className="font-serif text-xl">Also available</p>
            <ul className="mt-3 space-y-2 text-ink-soft">
              <li>
                <Link href="/account/appointments" className="hover:text-gold">
                  Book styling / video consult →
                </Link>
              </li>
              <li>
                <Link href="/care" className="hover:text-gold">
                  Alterations & care →
                </Link>
              </li>
              <li>
                <Link href="/stores" className="hover:text-gold">
                  Chat with a store associate →
                </Link>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
