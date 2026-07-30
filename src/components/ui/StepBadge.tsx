export function StepBadge({ step }: { step: number }) {
  return (
    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-xs text-canvas">
      {step}
    </span>
  );
}
