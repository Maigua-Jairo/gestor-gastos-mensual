export function formatMonthLabel(year: number, month: number) {
  const monthName = new Intl.DateTimeFormat('es-EC', { month: 'long' }).format(
    new Date(year, month - 1, 1),
  );
  return `${monthName.charAt(0).toLocaleUpperCase('es-EC')}${monthName.slice(1)} ${year}`;
}

export function formatDateLabel(value: string) {
  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  const date = dateOnly
    ? new Date(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3]))
    : new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('es-EC', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}
