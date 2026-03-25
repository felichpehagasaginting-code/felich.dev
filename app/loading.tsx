export default function Loading() {
  return (
    <div className="flex-1 w-full min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <div className="relative w-14 h-14">
        {/* Outer Ring */}
        <div className="absolute inset-0 rounded-full border-[3px] border-t-primary border-r-primary border-b-transparent border-l-transparent animate-spin"></div>
        {/* Inner Ring */}
        <div className="absolute inset-2 rounded-full border-[3px] border-l-primary/50 border-b-primary/50 border-t-transparent border-r-transparent animate-[spin_1.5s_linear_infinite_reverse]"></div>
        {/* Center Dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-primary animate-ping"></div>
        </div>
      </div>
      <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 animate-pulse tracking-widest">
        LOADING...
      </p>
    </div>
  );
}
