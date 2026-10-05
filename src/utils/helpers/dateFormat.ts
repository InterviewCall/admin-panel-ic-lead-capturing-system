// The admin team works in IST, so every date is rendered in IST regardless of the browser time zone.
const TIME_ZONE = 'Asia/Kolkata';
const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

const timeFormatter = new Intl.DateTimeFormat('en-IN', {
    timeZone: TIME_ZONE,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
});

const weekdayShortFormatter = new Intl.DateTimeFormat('en-IN', { timeZone: TIME_ZONE, weekday: 'short' });
const weekdayLongFormatter = new Intl.DateTimeFormat('en-IN', { timeZone: TIME_ZONE, weekday: 'long' });
const dayFormatter = new Intl.DateTimeFormat('en-IN', { timeZone: TIME_ZONE, day: 'numeric' });
const monthShortFormatter = new Intl.DateTimeFormat('en-IN', { timeZone: TIME_ZONE, month: 'short' });
const monthLongFormatter = new Intl.DateTimeFormat('en-IN', { timeZone: TIME_ZONE, month: 'long' });
const ymdFormatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
});

const noon = (ymd: string): Date => new Date(`${ymd}T12:00:00+05:30`);

export function toYmd(value: string | number | Date): string {
    return ymdFormatter.format(new Date(value));
}

// "4:00 PM"
export function formatTime(iso: string): string {
    return timeFormatter.format(new Date(iso)).replace(/\s?(am|pm)/i, (_, meridiem: string) => ` ${meridiem.toUpperCase()}`);
}

// "Mon 5 Oct"
export function formatShortDay(value: string | number | Date): string {
    const date = new Date(value);
    return `${weekdayShortFormatter.format(date)} ${dayFormatter.format(date)} ${monthShortFormatter.format(date)}`;
}

// "Mon 5 Oct · 4:00 PM"
export function formatSlot(iso: string): string {
    return `${formatShortDay(iso)} · ${formatTime(iso)}`;
}

// "Monday 5 October"
export function formatLongDay(ymd: string): string {
    const date = noon(ymd);
    return `${weekdayLongFormatter.format(date)} ${dayFormatter.format(date)} ${monthLongFormatter.format(date)}`;
}

// "Mon 5"
export function formatDayHeader(ymd: string): string {
    const date = noon(ymd);
    return `${weekdayShortFormatter.format(date)} ${dayFormatter.format(date)}`;
}

// "5 Oct"
export function formatDayMonth(ymd: string): string {
    const date = noon(ymd);
    return `${dayFormatter.format(date)} ${monthShortFormatter.format(date)}`;
}

export function addDaysToYmd(ymd: string, days: number): string {
    return toYmd(noon(ymd).getTime() + days * DAY_MS);
}

// Monday of the week (IST) that contains the given date.
export function getWeekStart(value: string | number | Date): string {
    const ymd = toYmd(value);
    const dayOfWeek = noon(ymd).getUTCDay(); // 0 = Sunday
    return addDaysToYmd(ymd, -((dayOfWeek + 6) % 7));
}

// Wall-clock time in IST -> ISO string. dayOffset is relative to today in IST.
export function istToIso(dayOffset: number, hour: number, minute = 0): string {
    const nowIst = new Date(Date.now() + IST_OFFSET_MS);
    const utc = Date.UTC(nowIst.getUTCFullYear(), nowIst.getUTCMonth(), nowIst.getUTCDate() + dayOffset, hour, minute);
    return new Date(utc - IST_OFFSET_MS).toISOString();
}

export function minutesAgoIso(minutes: number): string {
    return new Date(Date.now() - minutes * 60 * 1000).toISOString();
}

function dayDifferenceFromToday(iso: string): number {
    return Math.round((noon(toYmd(iso)).getTime() - noon(toYmd(Date.now())).getTime()) / DAY_MS);
}

// "Today, 1:47 PM", "Yesterday, 9:05 PM", "Tomorrow, 11:00 AM", "Sun 4 Oct, 8:10 PM"
export function formatDayTime(iso: string): string {
    const diff = dayDifferenceFromToday(iso);

    if (diff === 0) return `Today, ${formatTime(iso)}`;
    if (diff === -1) return `Yesterday, ${formatTime(iso)}`;
    if (diff === 1) return `Tomorrow, ${formatTime(iso)}`;
    return `${formatShortDay(iso)}, ${formatTime(iso)}`;
}

// "12 min ago", "1 hr ago", "Today, 11:20 AM", "Yesterday, 9:05 PM", "Sun 4 Oct"
export function formatRelative(iso: string): string {
    const diffMin = Math.round((Date.now() - new Date(iso).getTime()) / 60000);

    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin} min ago`;
    if (diffMin < 120) return '1 hr ago';

    const diff = dayDifferenceFromToday(iso);
    if (diff === 0) return `Today, ${formatTime(iso)}`;
    if (diff === -1) return `Yesterday, ${formatTime(iso)}`;
    return formatShortDay(iso);
}

// "in 55 minutes", "in 3 hours", "in 2 days", "Happening now", "Call ended"
export function formatUntil(iso: string): string {
    const diffMin = Math.round((new Date(iso).getTime() - Date.now()) / 60000);

    if (diffMin < -30) return 'Call ended';
    if (diffMin <= 0) return 'Happening now';
    if (diffMin < 60) return `in ${diffMin} minutes`;
    if (diffMin < 24 * 60) {
        const hours = Math.round(diffMin / 60);
        return `in ${hours} hour${hours === 1 ? '' : 's'}`;
    }
    const days = Math.round(diffMin / (24 * 60));
    return `in ${days} day${days === 1 ? '' : 's'}`;
}

export function isPast(iso: string): boolean {
    return new Date(iso).getTime() <= Date.now();
}
