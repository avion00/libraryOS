import { Mail } from "lucide-react";
import { useToast } from "../../context/ToastContext";

export function ReminderButton({ studentName, className }: { studentName: string; className?: string }) {
  const { notify } = useToast();
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        notify(`Reminder for ${studentName} isn't sent — email/SMS isn't connected yet.`, "info");
      }}
      title="Send reminder"
      aria-label={`Send reminder to ${studentName}`}
      className={
        className ??
        "flex h-8 w-8 items-center justify-center rounded-lg border border-paper-700 text-slate-400 transition-colors hover:bg-brand-50 hover:text-brand-600"
      }
    >
      <Mail className="h-[15px] w-[15px]" strokeWidth={2} />
    </button>
  );
}
