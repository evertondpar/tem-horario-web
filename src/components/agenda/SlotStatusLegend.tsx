const LEGEND_ITEMS = [
  { label: "Disponível", swatchClassName: "bg-[#F2A93B]" },
  { label: "Indisponível", swatchClassName: "border border-[#E4E1D8] bg-white" },
  { label: "Ocupado (somente leitura)", swatchClassName: "bg-[#0F5C56]" },
];

export function SlotStatusLegend() {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
      {LEGEND_ITEMS.map((item) => (
        <div key={item.label} className="flex items-center gap-2 text-xs text-[#5C6B68]">
          <span className={`h-3 w-3 shrink-0 rounded-sm ${item.swatchClassName}`} aria-hidden="true" />
          {item.label}
        </div>
      ))}
    </div>
  );
}
