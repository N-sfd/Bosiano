"use client";

import { useEffect, useState } from "react";

const messages = [
  "Complimentary express shipping on orders over $250",
  "Members earn 2× rewards points this week — join Bosianos Club",
  "New season arrivals from 8 designers, just landed",
  "Free returns within 30 days · Shop with confidence",
];

export function AnnouncementBar() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % messages.length), 4200);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="bg-ink text-canvas">
      <div className="shell flex items-center justify-center overflow-hidden px-4 py-2.5 sm:py-3">
        <p
          key={i}
          className="animate-fade-in text-center text-[0.65rem] font-medium uppercase tracking-luxe sm:text-[0.68rem]"
        >
          {messages[i]}
        </p>
      </div>
    </div>
  );
}
