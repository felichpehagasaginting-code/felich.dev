export default function Loading() {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-pulse p-4">
      {/* Header skeleton */}
      <div className="p-8 bg-[var(--bg-surface)] border border-[var(--border-default)] space-y-3" style={{ borderRadius: '8px' }}>
        <div className="h-4 w-28 bg-[var(--bg-muted)]" style={{ borderRadius: '4px' }} />
        <div className="h-8 w-56 bg-[var(--bg-muted)]" style={{ borderRadius: '4px' }} />
        <div className="h-3.5 w-80 max-w-full bg-[var(--bg-muted)]" style={{ borderRadius: '4px', opacity: 0.6 }} />
      </div>

      {/* Filter pills skeleton */}
      <div className="flex gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-7 w-16 bg-[var(--bg-muted)]" style={{ borderRadius: '6px' }} />
        ))}
      </div>

      {/* Cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-[var(--bg-surface)] border border-[var(--border-default)] p-5 space-y-3" style={{ borderRadius: '8px' }}>
            <div className="flex items-center gap-3 pb-3 border-b border-[var(--border-default)]">
              <div className="w-9 h-9 bg-[var(--bg-muted)]" style={{ borderRadius: '6px' }} />
              <div className="space-y-1.5 flex-1">
                <div className="h-4 w-32 bg-[var(--bg-muted)]" style={{ borderRadius: '4px' }} />
                <div className="h-2.5 w-16 bg-[var(--bg-muted)]" style={{ borderRadius: '4px', opacity: 0.5 }} />
              </div>
            </div>
            <div className="h-3 w-full bg-[var(--bg-muted)]" style={{ borderRadius: '4px', opacity: 0.6 }} />
            <div className="h-3 w-3/4 bg-[var(--bg-muted)]" style={{ borderRadius: '4px', opacity: 0.4 }} />
            <div className="flex gap-1 pt-2">
              {[1, 2, 3].map((j) => (
                <div key={j} className="h-5 w-14 bg-[var(--bg-muted)]" style={{ borderRadius: '4px' }} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
