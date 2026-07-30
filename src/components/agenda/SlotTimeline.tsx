import { SLOT_STATUS, type SlotStatusValue } from "../../types/schedule";
import { SLOTS_PER_DAY, slotIndexToTime, slotRangeLabel } from "../../lib/schedule";
import { cn } from "../../lib/utils";

type SlotTimelineProps = {
  slots: SlotStatusValue[];
  onToggle: (index: number) => void;
};

const GRID_STYLE = { gridTemplateColumns: `repeat(${SLOTS_PER_DAY}, minmax(14px, 1fr))` };

function slotClassName(status: SlotStatusValue) {
  switch (status) {
    case SLOT_STATUS.AVAILABLE:
      return "bg-[#F2A93B] hover:bg-[#DB8F1F]";
    case SLOT_STATUS.BOOKED:
      return "bg-[#0F5C56] cursor-not-allowed";
    default:
      return "border border-[#E4E1D8] bg-white hover:border-[#0F5C56]/40 hover:bg-[#0F5C56]/5";
  }
}

function slotStatusLabel(status: SlotStatusValue) {
  if (status === SLOT_STATUS.AVAILABLE) return "Disponível";
  if (status === SLOT_STATUS.BOOKED) return "Ocupado";
  return "Indisponível";
}

export function SlotTimeline({ slots, onToggle }: SlotTimelineProps) {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[720px]">
        <div className="grid gap-[2px]" style={GRID_STYLE}>
          {slots.map((status, index) => (
            <button
              key={index}
              type="button"
              disabled={status === SLOT_STATUS.BOOKED}
              onClick={() => onToggle(index)}
              title={`${slotRangeLabel(index)} · ${slotStatusLabel(status)}`}
              aria-label={`${slotRangeLabel(index)}, ${slotStatusLabel(status)}`}
              className={cn("h-7 rounded-[3px] transition-colors", slotClassName(status))}
            />
          ))}
        </div>

        <div className="mt-1.5 grid gap-[2px]" style={GRID_STYLE}>
          {slots.map((_, index) => (
            <span key={index} className="text-center text-[0.6rem] leading-none text-[#5C6B68]">
              {index % 4 === 0 ? slotIndexToTime(index) : ""}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
