export default function DashboardLoading() {
  return (
    <div className="w-full space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-8 w-40 bg-[var(--bg-muted)]" style={{ borderRadius: '4px' }} />
        <div className="h-3.5 w-64 bg-[var(--bg-muted)]" style={{ borderRadius: '4px', opacity: 0.6 }} />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-[var(--bg-surface)] border border-[var(--border-default)]" style={{ borderRadius: '8px' }} />
        ))}
      </div>
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-[var(--bg-surface)] border border-[var(--border-default)]" style={{ borderRadius: '8px' }} />
        ))}
      </div>
    </div>
  );
}
