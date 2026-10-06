import type { LeadTemperature } from '@/types/submission';

// 'completed' means the admin marked the counselling call as done.
export type BookingStatus = 'confirmed' | 'initiated' | 'cancelled' | 'completed';

export type SlotStatus = 'available' | 'booked' | 'reserved' | 'blocked';

export type NotificationChannel = 'EMAIL' | 'WHATSAPP';

export type NotificationSendStatus = 'SENT' | 'FAILED' | 'PROCESSING';

export type NotificationType = 'BOOKING_CONFIRMED' | 'BOOKING_REMINDER';

// Mirrors a row of notification-service `notification_deliveries` joined with its `notifications` row.
export type NotificationItem = {
    id: string;
    notificationType: NotificationType;
    reminderNumber: number;
    channel: NotificationChannel;
    sendStatus: NotificationSendStatus;
    failedReason: string | null;
};

export type BookingListItem = {
    bookingId: string;
    slotStartAt: string;
    status: BookingStatus;
    completedAt: string | null;
    submissionId: string;
    formName: string;
    candidate: {
        fullName: string;
        email: string;
        phone: string;
    };
    leadScore: number | null;
    leadTemperature: LeadTemperature | null;
    notifications: NotificationItem[];
    callPrep: {
        experience: string | null;
        currentCtc: string | null;
        mainGap: string | null;
        urgency: string | null;
    };
};

export type WeekSlot = {
    slotId: number;
    slotStartAt: string;
    status: SlotStatus;
};

export type WeekDay = {
    date: string; // YYYY-MM-DD (IST)
    slots: WeekSlot[];
};

export type BookingsWeekSummary = {
    callsToday: number;
    confirmedThisWeek: number;
    completedThisWeek: number;
    // Confirmed calls whose time has come but that nobody marked as done yet.
    callsToMark: number;
    heldThisWeek: number;
    cancelledThisWeek: number;
    capacityUsedPercent: number;
    failedMessages: number;
    nextCallAt: string | null;
};

export type BookingsWeekResponse = {
    weekStart: string; // YYYY-MM-DD (IST), always a Monday
    bookings: BookingListItem[];
    days: WeekDay[];
    summary: BookingsWeekSummary;
    // Set when part of the page could not be filled in, e.g. ['notification-service unavailable'].
    warnings?: string[];
};

// Answer of marking a call done / undoing it.
export type BookingCompletionResponse = {
    bookingId: string;
    status: BookingStatus;
    completedAt: string | null;
};
