import { Skeleton } from "../ui/Skeleton";

export function ServicesTableSkeleton() {
  return (
    <div
      className="overflow-hidden rounded-2xl border border-[#E4E1D8] bg-white"
      role="status"
      aria-live="polite"
    >
      <span className="sr-only">Carregando serviços…</span>

      <div className="border-b border-[#E4E1D8] px-5 py-3">
        <div className="grid grid-cols-4 gap-4">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="ml-auto h-3 w-12" />
        </div>
      </div>

      <div className="flex flex-col divide-y divide-[#E4E1D8]">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="grid grid-cols-4 items-center gap-4 px-5 py-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
            <div className="ml-auto flex gap-2">
              <Skeleton className="h-7 w-7 rounded-lg" />
              <Skeleton className="h-7 w-7 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
