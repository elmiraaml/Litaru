import db from "@/lib/db";

// SERVER ONLY

export async function getSettings() {
  const [rows] = await db.query("SELECT `key`, `value` FROM settings");
  const map = {};
  rows.forEach((r) => {
    map[r.key] = r.value;
  });

  return {
    pickupDeadlineHours: Number(map.pickup_deadline_hours ?? 48),
    loanDurationDays: Number(map.loan_duration_days ?? 7),
    finePerDay: Number(map.fine_per_day ?? 1000),
    fineDamaged: Number(map.fine_damaged ?? 25000),
    fineLost: Number(map.fine_lost ?? 75000),
  };
}