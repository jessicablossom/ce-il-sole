const ITALIAN_DATE_FORMATTER_OPTIONS: Intl.DateTimeFormatOptions = {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
};

const ISO_DATE_PARTS_FORMATTER_OPTIONS: Intl.DateTimeFormatOptions = {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
};

export function formatItalianDate(
  date: Date | string,
  timeZone = "Europe/Rome",
): string {
  const value = typeof date === "string" ? dateFromIsoDate(date) : date;

  return new Intl.DateTimeFormat("it-IT", {
    ...ITALIAN_DATE_FORMATTER_OPTIONS,
    timeZone,
  }).format(value);
}

export function getIsoDateInTimeZone(date: Date, timeZone = "Europe/Rome"): string {
  const parts = new Intl.DateTimeFormat("en-GB", {
    ...ISO_DATE_PARTS_FORMATTER_OPTIONS,
    timeZone,
  }).formatToParts(date);

  const day = getDatePart(parts, "day");
  const month = getDatePart(parts, "month");
  const year = getDatePart(parts, "year");

  return `${year}-${month}-${day}`;
}

export function getYearStartIsoDate(isoDate: string): string {
  return `${isoDate.slice(0, 4)}-01-01`;
}

function getDatePart(parts: Intl.DateTimeFormatPart[], type: string): string {
  const part = parts.find((value) => value.type === type);

  if (!part) {
    throw new Error(`Missing ${type} date part`);
  }

  return part.value;
}

function dateFromIsoDate(isoDate: string): Date {
  const [year, month, day] = isoDate.split("-").map(Number);

  return new Date(Date.UTC(year, month - 1, day, 12));
}
