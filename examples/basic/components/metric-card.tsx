export default function MetricCard({
  value,
  label,
  delta,
}: {
  value: string;
  label: string;
  delta?: string;
}) {
  return (
    <div className="inline-flex flex-col gap-1 rounded-2xl border border-(--color-foreground)/10 bg-(--color-foreground)/[0.03] px-8 py-6">
      <span className="flex items-baseline gap-3">
        <span className="font-bold text-6xl tracking-tight">{value}</span>
        {delta ? (
          <span className="font-medium text-(--color-primary) text-xl">
            {delta}
          </span>
        ) : null}
      </span>
      <span className="text-lg opacity-60">{label}</span>
    </div>
  );
}
