"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search,
  X,
  Sparkles,
  Camera,
  TrendingUp,
  Tag,
  User,
  Mic,
  MicOff,
  ScanBarcode,
  Clock,
  Package,
} from "lucide-react";
import { useUI } from "@/store/useUI";
import { useStore } from "@/store/useStore";
import { useHydrated } from "@/lib/hooks";
import {
  semanticSearch,
  searchSuggestions,
  trendingSearches,
  lookPalettes,
  shopTheLook,
  shopByTags,
  customLookTags,
  getSearchPredictions,
  visualSearchFromUpload,
} from "@/lib/search";
import { findByBarcode } from "@/lib/products";
import { getBrand } from "@/lib/brands";
import { Media } from "@/components/Media";
import { formatPrice, cn } from "@/lib/utils";

export function SearchOverlay() {
  const { searchOpen, setSearch } = useUI();
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<"text" | "visual" | "scan">("text");
  const [palette, setPalette] = useState(lookPalettes[0].id);
  const [tags, setTags] = useState<string[]>([]);
  const [uploadedName, setUploadedName] = useState<string | null>(null);
  const [listening, setListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [barcode, setBarcode] = useState("");
  const [scanMsg, setScanMsg] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<{ stop: () => void } | null>(null);

  const hydrated = useHydrated();
  const recentSearches = useStore((s) => s.recentSearches);
  const addRecentSearch = useStore((s) => s.addRecentSearch);
  const clearRecentSearches = useStore((s) => s.clearRecentSearches);

  useEffect(() => {
    if (searchOpen) setTimeout(() => inputRef.current?.focus(), 60);
  }, [searchOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSearch(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setSearch]);

  useEffect(() => {
    const SR =
      typeof window !== "undefined"
        ? (window as unknown as { SpeechRecognition?: new () => SpeechRecognitionLike; webkitSpeechRecognition?: new () => SpeechRecognitionLike })
            .SpeechRecognition ||
          (window as unknown as { webkitSpeechRecognition?: new () => SpeechRecognitionLike }).webkitSpeechRecognition
        : undefined;
    setVoiceSupported(!!SR);
  }, []);

  const results = useMemo(() => semanticSearch(query, 6), [query]);
  const predictions = useMemo(() => getSearchPredictions(query, 8), [query]);
  const lookResults = useMemo(() => {
    if (uploadedName) return visualSearchFromUpload(uploadedName, 8);
    return tags.length ? shopByTags(tags, 8) : shopTheLook(palette, 8);
  }, [palette, tags, uploadedName]);

  const toggleTag = (t: string) =>
    setTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

  const commitSearch = (value: string) => {
    const q = value.trim();
    if (!q) return;
    setQuery(q);
    addRecentSearch(q);
  };

  const startVoice = () => {
    const SR =
      (window as unknown as { SpeechRecognition?: new () => SpeechRecognitionLike; webkitSpeechRecognition?: new () => SpeechRecognitionLike })
        .SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: new () => SpeechRecognitionLike }).webkitSpeechRecognition;
    if (!SR) return;
    const recognition = new SR();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript ?? "";
      if (transcript) commitSearch(transcript);
      setListening(false);
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
    setMode("text");
  };

  const stopVoice = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  const handleBarcode = () => {
    const hit = findByBarcode(barcode);
    if (hit) {
      setScanMsg(`Found ${hit.name}`);
      addRecentSearch(hit.barcode);
      window.location.href = `/product/${hit.slug}`;
      setSearch(false);
    } else {
      setScanMsg("No product matched that barcode. Try a Bosiano code from a product page.");
    }
  };

  const typeIcon = {
    category: Tag,
    designer: User,
    trending: TrendingUp,
    query: Search,
    product: Package,
  };

  return (
    <AnimatePresence>
      {searchOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[120]">
          <div className="absolute inset-0 bg-void/60 backdrop-blur-sm" onClick={() => setSearch(false)} aria-hidden />
          <motion.div
            initial={{ y: -24 }}
            animate={{ y: 0 }}
            exit={{ y: -24 }}
            transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.35 }}
            className="relative mx-auto max-h-[min(92dvh,92vh)] w-full max-w-shell overflow-y-auto overscroll-contain bg-canvas-raised px-4 pb-[calc(2.5rem+env(safe-area-inset-bottom))] pt-5 sm:px-8 sm:pt-6 lg:px-12"
            role="dialog"
            aria-label="Search"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkles className="h-4 w-4 text-gold" />
                <span className="eyebrow">Intelligent search &amp; discovery</span>
              </div>
              <button className="btn-ghost" aria-label="Close search" onClick={() => setSearch(false)}>
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <ModeTab active={mode === "text"} onClick={() => setMode("text")} icon={<Search className="h-3.5 w-3.5" />}>
                Predictive
              </ModeTab>
              <ModeTab active={mode === "visual"} onClick={() => setMode("visual")} icon={<Camera className="h-3.5 w-3.5" />}>
                Visual search
              </ModeTab>
              <ModeTab active={mode === "scan"} onClick={() => setMode("scan")} icon={<ScanBarcode className="h-3.5 w-3.5" />}>
                Barcode / QR
              </ModeTab>
            </div>

            {mode === "text" && (
              <>
                <div className="mt-4 flex items-center gap-3 border-b-2 border-ink pb-3">
                  <Search className="h-6 w-6 text-ink-muted" strokeWidth={1.5} />
                  <input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && query.trim()) {
                        commitSearch(query);
                        setSearch(false);
                        window.location.href = `/search?q=${encodeURIComponent(query.trim())}`;
                      }
                    }}
                    placeholder="Try “Black Italian leather bag under $500”…"
                    className="w-full bg-transparent font-serif text-2xl placeholder:text-ink-muted/60 focus:outline-none sm:text-3xl"
                    aria-label="Search products"
                    aria-autocomplete="list"
                    autoComplete="off"
                  />
                  {voiceSupported && (
                    <button
                      type="button"
                      onClick={listening ? stopVoice : startVoice}
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-colors",
                        listening ? "border-gold bg-gold text-void" : "border-line hover:border-ink"
                      )}
                      aria-label={listening ? "Stop voice search" : "Start voice search"}
                    >
                      {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    </button>
                  )}
                </div>
                {listening && <p className="mt-2 text-xs text-gold-deep">Listening… speak a look, designer, or colour</p>}

                <div className="mt-5 grid gap-6 lg:grid-cols-[300px_1fr]">
                  <div>
                    {!query && hydrated && recentSearches.length > 0 && (
                      <div className="mb-5">
                        <div className="mb-3 flex items-center justify-between">
                          <p className="eyebrow inline-flex items-center gap-1.5">
                            <Clock className="h-3 w-3" /> Recent
                          </p>
                          <button onClick={clearRecentSearches} className="text-[0.65rem] uppercase tracking-luxe text-ink-muted hover:text-ink">
                            Clear
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {recentSearches.map((s) => (
                            <button
                              key={s}
                              onClick={() => commitSearch(s)}
                              className="rounded-full border border-line px-3 py-1.5 text-xs text-ink-soft hover:border-ink"
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {!query && (
                      <div className="mb-5">
                        <p className="eyebrow mb-3 inline-flex items-center gap-1.5">
                          <TrendingUp className="h-3 w-3" /> Trending
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {trendingSearches.map((s) => (
                            <button
                              key={s}
                              onClick={() => commitSearch(s)}
                              className="rounded-full border border-line px-3 py-1.5 text-xs text-ink-soft hover:border-ink"
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <p className="eyebrow mb-3">{query ? "Suggestions" : "Browse"}</p>
                    <ul className="space-y-1" role="listbox">
                      {predictions.map((p) => {
                        const Icon = typeIcon[p.type] ?? Search;
                        return (
                          <li key={`${p.type}-${p.label}`}>
                            <Link
                              href={p.href}
                              onClick={() => {
                                addRecentSearch(p.label);
                                setSearch(false);
                              }}
                              className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm transition-colors hover:bg-canvas-sunk"
                              role="option"
                            >
                              {p.image ? (
                                <span className="h-10 w-10 shrink-0 overflow-hidden rounded-md">
                                  <Media seed={p.image} ratio="square" monogram={false} sizes="40px" label={p.label} />
                                </span>
                              ) : (
                                <Icon className="h-4 w-4 shrink-0 text-gold" strokeWidth={1.5} />
                              )}
                              <span className="flex-1 font-medium leading-tight">{p.label}</span>
                              {p.meta && (
                                <span className="text-[0.65rem] uppercase tracking-luxe text-ink-muted">{p.meta}</span>
                              )}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>

                    {!query && (
                      <div className="mt-5">
                        <p className="eyebrow mb-2">Natural language</p>
                        <div className="flex flex-wrap gap-2">
                          {searchSuggestions.slice(0, 4).map((s) => (
                            <button
                              key={s}
                              onClick={() => commitSearch(s)}
                              className="rounded-full border border-line px-3 py-1.5 text-xs text-ink-soft hover:border-ink"
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {query && (
                    <div>
                      <div className="flex items-center justify-between">
                        <p className="eyebrow">{results.length ? `${results.length} matches` : "No product matches"}</p>
                        {results.length > 0 && (
                          <Link
                            href={`/search?q=${encodeURIComponent(query)}`}
                            onClick={() => {
                              commitSearch(query);
                              setSearch(false);
                            }}
                            className="link-underline text-xs uppercase tracking-luxe"
                          >
                            See all
                          </Link>
                        )}
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
                        {results.map(({ product }) => (
                          <Link
                            key={product.id}
                            href={`/product/${product.slug}`}
                            onClick={() => {
                              commitSearch(query);
                              setSearch(false);
                            }}
                            className="group"
                          >
                            <Media
                              seed={product.variants[0].images[0]}
                              swatches={[product.variants[0].hex]}
                              ratio="portrait"
                              label={product.name}
                              className="rounded-lg"
                              sizes="200px"
                            />
                            <p className="mt-2 text-[0.7rem] uppercase tracking-luxe text-ink-muted">
                              {getBrand(product.brandId)?.name}
                            </p>
                            <p className="font-serif text-base leading-tight">{product.name}</p>
                            <p className="text-xs">{formatPrice(product.price)}</p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {mode === "visual" && (
              <div className="mt-5">
                <div className="flex flex-col gap-6 lg:flex-row">
                  <div className="lg:w-1/3">
                    <div className="rounded-xl border border-dashed border-line p-6 text-center">
                      <Camera className="mx-auto h-8 w-8 text-ink-muted" strokeWidth={1.2} />
                      <p className="mt-3 text-sm text-ink-soft">
                        Upload a photo — we match colour, material cues, and silhouette to our edit.
                      </p>
                      <input
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setUploadedName(file.name);
                            setTags([]);
                          }
                        }}
                      />
                      <button className="btn-outline mt-4 w-full" onClick={() => fileRef.current?.click()}>
                        {uploadedName ? "Change photo" : "Upload style photo"}
                      </button>
                      {uploadedName && (
                        <p className="mt-2 text-xs text-[#3a4a3b]">Matched from “{uploadedName}”</p>
                      )}
                    </div>

                    <p className="eyebrow mb-3 mt-6">Custom tags</p>
                    <div className="flex flex-wrap gap-2">
                      {customLookTags.map((t) => (
                        <button
                          key={t}
                          onClick={() => {
                            toggleTag(t);
                            setUploadedName(null);
                          }}
                          className={cn(
                            "rounded-full border px-3 py-1.5 text-xs capitalize transition-colors",
                            tags.includes(t) ? "border-ink bg-void text-canvas" : "border-line hover:border-ink"
                          )}
                        >
                          {t}
                        </button>
                      ))}
                    </div>

                    <p className="eyebrow mb-3 mt-6">Or shop by mood</p>
                    <div className="space-y-2">
                      {lookPalettes.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => {
                            setPalette(p.id);
                            setTags([]);
                            setUploadedName(null);
                          }}
                          className={cn(
                            "flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left text-sm transition-colors",
                            palette === p.id && !tags.length && !uploadedName
                              ? "border-ink bg-canvas"
                              : "border-line hover:border-ink"
                          )}
                        >
                          <span>{p.label}</span>
                          <span className="flex gap-1">
                            {p.swatches.map((sw) => (
                              <span key={sw} className="h-4 w-4 rounded-full border border-line" style={{ background: sw }} />
                            ))}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid flex-1 grid-cols-2 gap-4 sm:grid-cols-4">
                    {lookResults.map((product) => (
                      <Link
                        key={product.id}
                        href={`/product/${product.slug}`}
                        onClick={() => setSearch(false)}
                        className="group"
                      >
                        <Media
                          seed={product.variants[0].images[0]}
                          swatches={[product.variants[0].hex]}
                          ratio="portrait"
                          label={product.name}
                          className="rounded-lg"
                          sizes="200px"
                        />
                        <p className="mt-2 text-[0.7rem] uppercase tracking-luxe text-ink-muted">
                          {getBrand(product.brandId)?.name}
                        </p>
                        <p className="font-serif text-base leading-tight">{product.name}</p>
                        <p className="text-xs">{formatPrice(product.price)}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {mode === "scan" && (
              <div className="mx-auto mt-8 max-w-md rounded-2xl border border-line p-6">
                <ScanBarcode className="h-8 w-8 text-gold" strokeWidth={1.3} />
                <h2 className="mt-3 font-serif text-2xl">Barcode / QR scan</h2>
                <p className="mt-2 text-sm text-ink-soft">
                  Mobile app scanning is simulated here — enter a product barcode (shown on each product page) to jump
                  straight to the piece.
                </p>
                <input
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  placeholder="e.g. BOS000123456"
                  className="mt-5 w-full border border-line bg-canvas px-4 py-3 font-mono text-sm focus:border-ink focus:outline-none"
                  aria-label="Barcode"
                />
                <button className="btn-primary mt-4 w-full" onClick={handleBarcode} disabled={!barcode.trim()}>
                  Look up product
                </button>
                {scanMsg && <p className="mt-3 text-xs text-ink-muted">{scanMsg}</p>}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

function ModeTab({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium uppercase tracking-luxe transition-colors",
        active ? "bg-void text-canvas" : "border border-line text-ink-soft hover:border-ink"
      )}
    >
      {icon}
      {children}
    </button>
  );
}
