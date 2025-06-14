export function getNowDateTimeString(): string {
  const date = new Date();
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
}

export function formatDate(d: string | Date): string {
  const dateObj = typeof d === 'string' ? new Date(d) : d;
  return dateObj.toISOString().slice(0, 10);
}

export function isToday(date: string): boolean {
  const today = formatDate(new Date());
  const rowDate = formatDate(date);
  return today === rowDate;
}
