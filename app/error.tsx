'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex-1 min-h-[60vh] flex flex-col items-center justify-center gap-6 px-6">
      <div className="w-16 h-16 rounded-full bg-[var(--danger-bg)] flex items-center justify-center">
        <span className="text-2xl">⚠️</span>
      </div>
      <div className="text-center">
        <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
        <p className="text-sm text-[var(--text-muted)] max-w-md">
          {error.message || 'An unexpected error occurred. Please try again.'}
        </p>
      </div>
      <button
        onClick={reset}
        className="px-6 py-2.5 rounded-xl bg-[var(--text-primary)] text-[var(--bg-base)] text-xs font-bold uppercase tracking-widest hover:scale-105 transition-all active:scale-95"
      >
        Try again
      </button>
    </div>
  );
}
