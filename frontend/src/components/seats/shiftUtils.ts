import type { Shift } from "../../api/types";

export function computeCoveredHoursLabel(shifts: Shift[]): string {
  const covered = new Array(1440).fill(false);
  for (const shift of shifts) {
    const [sh, sm] = shift.start_time.split(":").map(Number);
    const [eh, em] = shift.end_time.split(":").map(Number);
    const start = sh * 60 + sm;
    const end = eh * 60 + em;
    if (end > start) {
      for (let m = start; m < end; m++) covered[m] = true;
    } else if (end < start) {
      for (let m = start; m < 1440; m++) covered[m] = true;
      for (let m = 0; m < end; m++) covered[m] = true;
    }
  }
  const totalCovered = covered.filter(Boolean).length;
  if (totalCovered >= 1440) return "24/7";
  const hours = Math.round((totalCovered / 60) * 10) / 10;
  return `${hours}/24`;
}
