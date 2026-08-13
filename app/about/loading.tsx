export default function AboutLoading() {
  return (
    <div className="w-full space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-8 w-32 bg-[var(--bg-muted)]" style={{ borderRadius: '4px' }} />
        <div className="h-3.5 w-48 bg-[var(--bg-muted)]" style={{ borderRadius: '4px', opacity: 0.6 }} />
      </div>
      <div className="h-40 bg-[var(--bg-surface)] border border-[var(--border-default)]" style={{ borderRadius: '8px' }} />
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="h-24 bg-[var(--bg-surface)] border border-[var(--border-default)]" style={{ borderRadius: '8px' }} />
        ))}
      </div>
    </div>
  );
}
