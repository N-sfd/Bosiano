"use client";

import { useStore } from "@/store/useStore";
import { useHydrated } from "@/lib/hooks";
import { formatPrice } from "@/lib/utils";

export default function SettingsPage() {
  const hydrated = useHydrated();
  const prefs = useStore((s) => s.setNotificationPrefs);
  const notificationPrefs = useStore((s) => s.notificationPrefs);
  const bodyProfile = useStore((s) => s.bodyProfile);
  const updateBodyProfile = useStore((s) => s.updateBodyProfile);
  const giftCardBalance = useStore((s) => s.giftCardBalance);
  const storeCredit = useStore((s) => s.storeCredit);
  const savedAddresses = useStore((s) => s.savedAddresses);
  const savedPayments = useStore((s) => s.savedPayments);

  if (!hydrated) {
    return <h1 className="font-serif text-4xl">Settings</h1>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-4xl">Settings</h1>
        <p className="mt-1 text-sm text-ink-muted">Profile, body measurements, addresses, payments, and alerts.</p>
      </div>

      <section className="rounded-2xl border border-line p-6">
        <h2 className="mb-4 font-serif text-2xl">Profile</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="First name" value="Amelia" />
          <Field label="Last name" value="Rousseau" />
          <Field label="Email" value="amelia@email.com" type="email" />
          <Field label="Phone" value="+44 20 7946 0000" />
        </div>
        <button className="btn-primary mt-5">Save changes</button>
      </section>

      <section className="rounded-2xl border border-line p-6">
        <h2 className="mb-4 font-serif text-2xl">Body profile (try-on)</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <NumberField
            label="Height (cm)"
            value={bodyProfile.heightCm}
            onChange={(v) => updateBodyProfile({ heightCm: v })}
          />
          <NumberField
            label="Weight (kg)"
            value={bodyProfile.weightKg}
            onChange={(v) => updateBodyProfile({ weightKg: v })}
          />
          <NumberField
            label="Bust (cm)"
            value={bodyProfile.bustCm ?? 0}
            onChange={(v) => updateBodyProfile({ bustCm: v })}
          />
          <NumberField
            label="Waist (cm)"
            value={bodyProfile.waistCm ?? 0}
            onChange={(v) => updateBodyProfile({ waistCm: v })}
          />
          <NumberField
            label="Hips (cm)"
            value={bodyProfile.hipsCm ?? 0}
            onChange={(v) => updateBodyProfile({ hipsCm: v })}
          />
          <label className="block">
            <span className="mb-1.5 block text-[0.7rem] uppercase tracking-luxe text-ink-muted">Body type</span>
            <select
              value={bodyProfile.bodyType}
              onChange={(e) =>
                updateBodyProfile({ bodyType: e.target.value as typeof bodyProfile.bodyType })
              }
              className="w-full rounded-lg border border-line bg-canvas px-4 py-3 text-sm"
            >
              {["Petite", "Regular", "Tall", "Curvy", "Athletic"].map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-line p-6">
        <h2 className="mb-4 font-serif text-2xl">Balances</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-canvas-sunk p-4">
            <p className="text-xs uppercase tracking-luxe text-ink-muted">Gift cards</p>
            <p className="mt-1 font-serif text-3xl">{formatPrice(giftCardBalance)}</p>
          </div>
          <div className="rounded-xl bg-canvas-sunk p-4">
            <p className="text-xs uppercase tracking-luxe text-ink-muted">Store credit</p>
            <p className="mt-1 font-serif text-3xl">{formatPrice(storeCredit)}</p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-line p-6">
        <h2 className="mb-4 font-serif text-2xl">Saved addresses</h2>
        <div className="space-y-3 text-sm">
          {savedAddresses.map((a) => (
            <div key={a.id} className="rounded-lg border border-line px-4 py-3">
              <p className="font-medium">{a.label}{a.isDefault ? " · Default" : ""}</p>
              <p className="text-ink-muted">
                {a.line1}, {a.city} {a.postcode}, {a.country}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-line p-6">
        <h2 className="mb-4 font-serif text-2xl">Saved payment methods</h2>
        <div className="space-y-3 text-sm">
          {savedPayments.map((p) => (
            <div key={p.id} className="rounded-lg border border-line px-4 py-3">
              <p className="font-medium">
                {p.brand} ···· {p.last4}
              </p>
              <p className="text-ink-muted">Expires {p.exp}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-line p-6">
        <h2 className="mb-4 font-serif text-2xl">Preferences</h2>
        <div className="space-y-3">
          {(
            [
              ["emailNewArrivals", "Email me about new arrivals"],
              ["emailWishlistPriceDrops", "Notify me about wishlist price drops"],
              ["emailEditorsPicks", "Editor's Picks emails"],
              ["personalizeHomepage", "Personalize my homepage based on browsing"],
              ["smsDelivery", "SMS delivery updates"],
              ["pushStyleSuggestions", "Push style suggestions"],
              ["pushLowStock", "Push low-stock alerts"],
              ["pushBackInStock", "Push back-in-stock alerts"],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="flex items-center justify-between rounded-lg border border-line px-4 py-3 text-sm">
              {label}
              <input
                type="checkbox"
                checked={notificationPrefs[key]}
                onChange={(e) => prefs({ [key]: e.target.checked })}
                className="h-4 w-4 accent-gold"
              />
            </label>
          ))}
        </div>
      </section>
    </div>
  );
}

function Field({ label, value, type = "text" }: { label: string; value: string; type?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[0.7rem] uppercase tracking-luxe text-ink-muted">{label}</span>
      <input
        type={type}
        defaultValue={value}
        className="w-full rounded-lg border border-line bg-canvas px-4 py-3 text-sm focus:border-ink focus:outline-none"
      />
    </label>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[0.7rem] uppercase tracking-luxe text-ink-muted">{label}</span>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded-lg border border-line bg-canvas px-4 py-3 text-sm focus:border-ink focus:outline-none"
      />
    </label>
  );
}
