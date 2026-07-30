import { SLOT_STATUS, WEEKDAY_LABELS, type DaySlots, type WeekdayKey } from "../../types/schedule";
import { formatShortDate } from "../../lib/schedule";
import { toDateStr } from "../../lib/date";
import { SlotTimeline } from "./SlotTimeline";

type DayScheduleCardProps = {
  weekday: WeekdayKey;
  daySlots: DaySlots;
  onToggleSlot: (index: number) => void;
  onMarkAll: (status: typeof SLOT_STATUS.AVAILABLE | typeof SLOT_STATUS.UNAVAILABLE) => void;
};

export function DayScheduleCard({
  weekday,
  daySlots,
  onToggleSlot,
  onMarkAll,
}: DayScheduleCardProps) {
  const isToday = daySlots.day === toDateStr(new Date());

  return (
    <div className="rounded-2xl border border-[#E4E1D8] bg-white p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-[#12201E]">{WEEKDAY_LABELS[weekday]}</h3>
          <span className="text-xs text-[#5C6B68]">{formatShortDate(daySlots.day)}</span>
          {isToday && (
            <span className="rounded-full bg-[#0F5C56]/10 px-2 py-0.5 text-[0.65rem] font-medium text-[#0F5C56]">
              Hoje
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onMarkAll(SLOT_STATUS.AVAILABLE)}
            className="rounded-lg border border-[#E4E1D8] px-2.5 py-1 text-xs font-medium text-[#12201E] hover:bg-[#12201E]/5"
          >
            Marcar dia como disponível
          </button>
          <button
            type="button"
            onClick={() => onMarkAll(SLOT_STATUS.UNAVAILABLE)}
            className="rounded-lg border border-[#E4E1D8] px-2.5 py-1 text-xs font-medium text-[#5C6B68] hover:bg-[#12201E]/5"
          >
            Limpar dia
          </button>
        </div>
      </div>

      <div className="mt-4">
        <SlotTimeline slots={daySlots.slots} onToggle={onToggleSlot} />
      </div>
    </div>
  );
}
