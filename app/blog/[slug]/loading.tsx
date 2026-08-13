export default function BlogPostLoading() {
  return (
    <div className="flex-1 w-full max-w-3xl mx-auto px-6 py-16 animate-pulse">
      <div className="h-4 w-24 bg-[var(--bg-muted)] rounded mb-8" />
      <div className="h-10 w-3/4 bg-[var(--bg-muted)] rounded-lg mb-4" />
      <div className="h-4 w-48 bg-[var(--bg-muted)] rounded mb-8" />
      <div className="space-y-3">
        <div className="h-4 w-full bg-[var(--bg-muted)] rounded" />
        <div className="h-4 w-5/6 bg-[var(--bg-muted)] rounded" />
        <div className="h-4 w-4/5 bg-[var(--bg-muted)] rounded" />
        <div className="h-4 w-full bg-[var(--bg-muted)] rounded" />
        <div className="h-4 w-3/4 bg-[var(--bg-muted)] rounded" />
      </div>
    </div>
  );
}
