'use client';

export default function LoadingSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="space-y-4">
        <div className="h-8 bg-neutral-200 dark:bg-neutral-800 rounded-xl w-3/4"></div>
        <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded-lg w-1/2"></div>
        <div className="space-y-3 mt-6">
          <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded-lg"></div>
          <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded-lg w-5/6"></div>
          <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded-lg w-4/6"></div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="h-32 bg-neutral-200 dark:bg-neutral-800 rounded-2xl"></div>
          <div className="h-32 bg-neutral-200 dark:bg-neutral-800 rounded-2xl"></div>
        </div>
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="animate-pulse p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-neutral-200 dark:bg-neutral-800 rounded-xl flex-shrink-0"></div>
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-neutral-200 dark:bg-neutral-800 rounded w-3/4"></div>
          <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded w-1/2"></div>
          <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded w-1/3"></div>
        </div>
      </div>
    </div>
  );
}
