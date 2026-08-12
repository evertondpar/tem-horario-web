import { useState } from "react";
import { Loader2, Save, Check } from "lucide-react";
import {
  SLOT_STATUS,
  WEEKDAYS,
  type Schedule,
  type WeekSlots,
  type WeekdayKey,
} from "../../types/schedule";
import { DayScheduleCard } from "./DayScheduleCard";

type ScheduleEditorProps = {
  schedule: Partial<Schedule>;
  onSave: (week: WeekSlots) => Promise<void> | void;
};

export function ScheduleEditor({ schedule, onSave }: ScheduleEditorProps) {
  const [week, setWeek] = useState<WeekSlots>(
    () =>
      Object.fromEntries(
        WEEKDAYS.map((key) => [key, schedule[key]]),
      ) as WeekSlots,
  );
  const [isSaving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  function toggleSlot(weekday: WeekdayKey, index: number) {
    setWeek((prev) => {
      const current = prev[weekday].slots[index];
      if (current === SLOT_STATUS.OCCUPIED) return prev; // somente leitura

      const next =
        current === SLOT_STATUS.AVAILABLE
          ? SLOT_STATUS.UNAVAILABLE
          : SLOT_STATUS.AVAILABLE;
      const slots = [...prev[weekday].slots];
      slots[index] = next;

      return { ...prev, [weekday]: { ...prev[weekday], slots } };
    });
    setSavedAt(null);
  }

  function markAllDay(
    weekday: WeekdayKey,
    status: typeof SLOT_STATUS.AVAILABLE | typeof SLOT_STATUS.UNAVAILABLE,
  ) {
    setWeek((prev) => {
      const slots = prev[weekday].slots.map((s) =>
        s === SLOT_STATUS.OCCUPIED ? s : status,
      );
      return { ...prev, [weekday]: { ...prev[weekday], slots } };
    });
    setSavedAt(null);
  }

  async function handleSave() {
    setSaving(true);
    try {
      await onSave(week);
      setSavedAt(
        new Date().toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {WEEKDAYS.map((weekday) => (
        <DayScheduleCard
          key={weekday}
          weekday={weekday}
          daySlots={week[weekday]}
          onToggleSlot={(index) => toggleSlot(weekday, index)}
          onMarkAll={(status) => markAllDay(weekday, status)}
        />
      ))}

      <div className="flex items-center justify-end gap-3 pb-2">
        {savedAt && (
          <span className="flex items-center gap-1.5 text-xs text-[#5C6B68]">
            <Check className="h-3.5 w-3.5 text-[#0F5C56]" strokeWidth={2} />
            Salvo às {savedAt}
          </span>
        )}
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 rounded-xl bg-[#0F5C56] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#0B4842] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
          ) : (
            <Save className="h-4 w-4" strokeWidth={1.75} />
          )}
          Salvar agenda
        </button>
      </div>
    </div>
  );
}
