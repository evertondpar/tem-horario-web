import { cn } from "../../lib/utils";

function SkeletonBlock({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-md bg-[#E4E1D8]/70", className)} />;
}

export function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-6" role="status" aria-live="polite">
      <span className="sr-only">Carregando o painel…</span>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-[#E4E1D8] bg-white p-5">
            <div className="flex items-center gap-2">
              <SkeletonBlock className="h-4 w-4 rounded-full" />
              <SkeletonBlock className="h-3 w-24" />
            </div>
            <SkeletonBlock className="mt-4 h-8 w-16" />
            <SkeletonBlock className="mt-2 h-3 w-20" />
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-[#E4E1D8] bg-white">
        <div className="border-b border-[#E4E1D8] px-5 py-4">
          <SkeletonBlock className="h-4 w-40" />
        </div>
        <div className="flex flex-col gap-5 px-5 py-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <SkeletonBlock className="h-4 w-12 shrink-0" />
              <div className="min-w-0 flex-1">
                <SkeletonBlock className="h-3.5 w-32" />
                <SkeletonBlock className="mt-1.5 h-3 w-40" />
              </div>
              <SkeletonBlock className="h-5 w-20 shrink-0 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
