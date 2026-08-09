import { Suspense } from "react";
import type { Metadata } from "next";
import { SearchResults } from "@/components/search/SearchResults";

export const metadata: Metadata = {
  title: "Search",
  description: "Search Bosiano with natural language — describe what you want and let our AI find it.",
};

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="shell py-20 text-center text-ink-muted">Searching…</div>}>
      <SearchResults />
    </Suspense>
  );
}
