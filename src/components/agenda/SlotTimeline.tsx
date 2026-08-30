import { SLOT_STATUS, type SlotStatusValue } from "../../types/schedule";
import {
  SLOTS_PER_DAY,
  slotIndexToTime,
  slotRangeLabel,
} from "../../lib/schedule";
import { cn } from "../../lib/utils";

type SlotTimelineProps = {
  slots: SlotStatusValue[];
  onToggle?: (index: number) => void;
};

const GRID_STYLE = { gridTemplateColumns: `repeat(${SLOTS_PER_DAY}, minmax(14px, 1fr))` };

function slotClassName(status: SlotStatusValue) {
  switch (status) {
    case SLOT_STATUS.AVAILABLE:
      return "bg-[#F2A93B] hover:bg-[#DB8F1F]";
    case SLOT_STATUS.OCCUPIED:
      return "bg-[#0F5C56] cursor-not-allowed";
    default:
      return "border border-[#E4E1D8] bg-white hover:border-[#0F5C56]/40 hover:bg-[#0F5C56]/5";
  }
}

function slotStatusLabel(status: SlotStatusValue) {
  if (status === SLOT_STATUS.AVAILABLE) return "Disponível";
  if (status === SLOT_STATUS.OCCUPIED) return "Ocupado";
  return "Indisponível";
}

export function SlotTimeline({ slots, onToggle }: SlotTimelineProps) {
  return (
    <div className="w-full min-w-0">
      <div className="grid grid-cols-4 gap-1 min-[400px]:grid-cols-6 sm:grid-cols-8 lg:grid-cols-12 xl:grid-cols-[repeat(48,minmax(14px,1fr))] xl:gap-[2px]">
          {slots.map((status, index) => (
            <button
              key={index}
              type="button"
              disabled={!onToggle || status === SLOT_STATUS.OCCUPIED}
              onClick={() => onToggle?.(index)}
              title={`${slotRangeLabel(index)} · ${slotStatusLabel(status)}`}
              aria-label={`${slotRangeLabel(index)}, ${slotStatusLabel(status)}`}
              className={cn(
                "h-9 rounded text-[0.6rem] transition-colors xl:h-7 xl:text-transparent",
                slotClassName(status),
              )}
            >
              <span className="xl:hidden">{slotIndexToTime(index)}</span>
            </button>
          ))}
      </div>

        <div className="mt-1.5 hidden gap-[2px] xl:grid" style={GRID_STYLE}>
          {slots.map((_, index) => (
            <span
              key={index}
              className="text-center text-[0.6rem] leading-none text-[#5C6B68]"
            >
              {index % 4 === 0 ? slotIndexToTime(index) : ""}
            </span>
          ))}
        </div>
    </div>
  );
}
