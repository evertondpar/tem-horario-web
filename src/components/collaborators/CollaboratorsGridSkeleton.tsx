import { Skeleton } from "../ui/Skeleton";

function CollaboratorCardSkeleton() {
  return (
    <div className="flex flex-col rounded-2xl border border-[#E4E1D8] bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Skeleton className="h-14 w-14 shrink-0 rounded-full" />
          <div>
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="mt-2 h-3 w-24" />
          </div>
        </div>
        <div className="flex shrink-0 gap-1">
          <Skeleton className="h-7 w-7 rounded-lg" />
          <Skeleton className="h-7 w-7 rounded-lg" />
        </div>
      </div>

      <Skeleton className="mt-4 h-5 w-16 rounded-full" />

      <div className="mt-4 border-t border-[#E4E1D8] pt-4">
        <Skeleton className="h-3 w-28" />
        <div className="mt-2 flex gap-1.5">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function CollaboratorsGridSkeleton() {
  return (
    <div
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      role="status"
      aria-live="polite"
    >
      <span className="sr-only">Carregando colaboradores…</span>
      {Array.from({ length: 3 }).map((_, i) => (
        <CollaboratorCardSkeleton key={i} />
      ))}
    </div>
  );
}
