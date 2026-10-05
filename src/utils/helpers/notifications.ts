import type { NotificationItem } from '@/types/booking';

export type NotificationTone = 'ok' | 'warn' | 'muted';

export function getInitials(fullName: string): string {
    return fullName
        .split(' ')
        .filter(Boolean)
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();
}

export function getNotificationLabel(item: NotificationItem): string {
    const channel = item.channel === 'EMAIL' ? 'Email' : 'WhatsApp';
    const type = item.notificationType === 'BOOKING_CONFIRMED' ? 'Booking confirmed' : `Reminder ${item.reminderNumber}`;
    return `${type} · ${channel}`;
}

export function getSendStatusMeta(status: NotificationItem['sendStatus']): { label: string; className: string } {
    if (status === 'SENT') return { label: 'Sent', className: 'bg-green-100 text-green-800' };
    if (status === 'FAILED') return { label: 'Failed', className: 'bg-orange-100 text-orange-800' };
    return { label: 'Sending', className: 'bg-slate-100 text-slate-700' };
}

// One short label for the booking agenda, based on the booking-confirmed messages only.
export function summarizeBookingNotifications(items: NotificationItem[]): { label: string; tone: NotificationTone } {
    const confirmed = items.filter((item) => item.notificationType === 'BOOKING_CONFIRMED');

    if (confirmed.length === 0) {
        return { label: 'Not sent yet', tone: 'muted' };
    }

    const failed = confirmed.find((item) => item.sendStatus === 'FAILED');
    if (failed) {
        return { label: `${failed.channel === 'EMAIL' ? 'Email' : 'WhatsApp'} failed`, tone: 'warn' };
    }

    if (confirmed.some((item) => item.sendStatus === 'PROCESSING')) {
        return { label: 'Sending', tone: 'muted' };
    }

    return { label: 'Email + WhatsApp sent', tone: 'ok' };
}

export const NOTIFICATION_TONE_CLASS: Record<NotificationTone, string> = {
    ok: 'bg-slate-100 text-slate-700',
    warn: 'bg-orange-100 text-orange-800',
    muted: 'bg-slate-100 text-slate-500',
};
