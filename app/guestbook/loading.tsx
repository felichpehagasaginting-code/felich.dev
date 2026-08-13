export default function GuestbookLoading() {
  return (
    <div className="w-full space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-8 w-36 bg-[var(--bg-muted)]" style={{ borderRadius: '4px' }} />
        <div className="h-3.5 w-56 bg-[var(--bg-muted)]" style={{ borderRadius: '4px', opacity: 0.6 }} />
      </div>
      <div className="h-32 bg-[var(--bg-surface)] border border-[var(--border-default)]" style={{ borderRadius: '8px' }} />
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-start gap-3 p-4 bg-[var(--bg-surface)] border border-[var(--border-default)]" style={{ borderRadius: '8px' }}>
            <div className="w-9 h-9 rounded-full bg-[var(--bg-muted)] flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3.5 w-28 bg-[var(--bg-muted)]" style={{ borderRadius: '4px' }} />
              <div className="h-3 w-full bg-[var(--bg-muted)]" style={{ borderRadius: '4px', opacity: 0.5 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
