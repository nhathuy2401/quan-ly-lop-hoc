/**
 * Tiện ích xử lý ngày tháng và tuần học
 */

export function parseDate(dateStr: string): Date {
  // YYYY-MM-DD
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function formatDateVN(date: Date | string): string {
  const d = typeof date === 'string' ? parseDate(date) : date;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

export function formatDateISO(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
}

/**
 * Lấy danh sách 6 ngày (Thứ 2 đến Thứ 7) của tuần tương ứng
 * @param startDateStr Ngày bắt đầu tuần 1 (YYYY-MM-DD)
 * @param weekNumber Số thứ tự tuần (1-38)
 */
export function getWeekDates(startDateStr: string, weekNumber: number): { dayOfWeek: number; dateStr: string; label: string }[] {
  const start = parseDate(startDateStr);
  // Tuần 1 bắt đầu từ startDateStr. Tuần n bắt đầu sau (n - 1) * 7 ngày.
  const weekStart = new Date(start);
  weekStart.setDate(start.getDate() + (weekNumber - 1) * 7);

  const days = [];
  const dayLabels = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

  for (let i = 0; i < 6; i++) {
    const curDate = new Date(weekStart);
    curDate.setDate(weekStart.getDate() + i);
    days.push({
      dayOfWeek: i + 2, // 2 = Thứ 2, 7 = Thứ 7
      dateStr: formatDateISO(curDate),
      label: `${dayLabels[i]} (${formatDateVN(curDate).slice(0, 5)})`
    });
  }

  return days;
}

/**
 * Lấy tháng chính của tuần dựa trên ngày giữa tuần (Thứ 4)
 */
export function getMonthOfDate(dateStr: string): number {
  const d = parseDate(dateStr);
  return d.getMonth() + 1; // 1 - 12
}

/**
 * Danh sách tháng trong năm học từ tháng 8 đến tháng 5 năm sau
 */
export const academicMonths = [
  { value: 8, label: 'Tháng 8' },
  { value: 9, label: 'Tháng 9' },
  { value: 10, label: 'Tháng 10' },
  { value: 11, label: 'Tháng 11' },
  { value: 12, label: 'Tháng 12' },
  { value: 1, label: 'Tháng 1' },
  { value: 2, label: 'Tháng 2' },
  { value: 3, label: 'Tháng 3' },
  { value: 4, label: 'Tháng 4' },
  { value: 5, label: 'Tháng 5' },
];

