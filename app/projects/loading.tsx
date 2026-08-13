export default function ProjectsLoading() {
  return (
    <div className="w-full space-y-6 animate-pulse">
      <div className="p-8 bg-[var(--bg-surface)] border border-[var(--border-default)] space-y-3" style={{ borderRadius: '8px' }}>
        <div className="h-4 w-24 bg-[var(--bg-muted)]" style={{ borderRadius: '4px' }} />
        <div className="h-8 w-48 bg-[var(--bg-muted)]" style={{ borderRadius: '4px' }} />
        <div className="h-3.5 w-72 bg-[var(--bg-muted)]" style={{ borderRadius: '4px', opacity: 0.6 }} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-56 bg-[var(--bg-surface)] border border-[var(--border-default)]" style={{ borderRadius: '8px' }} />
        ))}
      </div>
    </div>
  );
}
