import Link from "next/link";

export default function NotFound() {
  return (
    <div className="shell flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="font-serif text-8xl text-gold">404</p>
      <h1 className="mt-4 font-serif text-3xl">This page has slipped away</h1>
      <p className="mt-2 max-w-sm text-sm text-ink-muted">
        The piece you&apos;re looking for may have sold out or moved. Let&apos;s find you something beautiful instead.
      </p>
      <div className="mt-6 flex gap-3">
        <Link href="/" className="btn-primary">Return home</Link>
        <Link href="/shop" className="btn-outline">Shop the edit</Link>
      </div>
    </div>
  );
}
