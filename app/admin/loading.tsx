export default function Loading() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Memuat admin">
      <div className="h-10 w-64 bg-[var(--bg-muted)] rounded animate-pulse" />
      <div className="h-64 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-lg animate-pulse" />
    </div>
  );
}
