// src/components/utils/FormatMonthYear.tsx

function formatMonthYear(timestamp: string | number | null | undefined): string {
  if (!timestamp) return 'N/A';

  const parsed = typeof timestamp === 'string' ? Date.parse(timestamp) : Number(timestamp);
  const date = new Date(parsed);

  return isNaN(date.getTime())
    ? 'Invalid Date'
    : date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
}

export default formatMonthYear;
