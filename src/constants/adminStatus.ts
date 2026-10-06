import type { BookingStatus, SlotStatus } from '@/types/booking';
import type { LeadTemperature, SubmissionStatus } from '@/types/submission';

export const SUBMISSION_STATUS_META: Record<SubmissionStatus, { label: string; className: string }> = {
    submission_pending: { label: 'Form started', className: 'bg-slate-100 text-slate-700' },
    booking_pending: { label: 'Awaiting booking', className: 'bg-amber-100 text-amber-800' },
    booked: { label: 'Booked', className: 'bg-green-100 text-green-800' },
    converted: { label: 'Converted', className: 'bg-purple-100 text-purple-800' },
    cancelled: { label: 'Cancelled', className: 'bg-red-100 text-red-800' },
};

export const SUBMISSION_TABS: { key: SubmissionStatus | 'all'; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'submission_pending', label: 'Form started' },
    { key: 'booking_pending', label: 'Awaiting booking' },
    { key: 'booked', label: 'Booked' },
    { key: 'converted', label: 'Converted' },
    { key: 'cancelled', label: 'Cancelled' },
];

export const TEMPERATURE_META: Record<LeadTemperature, { label: string; pillClassName: string; barClassName: string }> = {
    hot: { label: 'Hot', pillClassName: 'bg-orange-100 text-orange-800', barClassName: 'bg-orange-600' },
    warm: { label: 'Warm', pillClassName: 'bg-yellow-100 text-yellow-800', barClassName: 'bg-yellow-600' },
    cold: { label: 'Cold', pillClassName: 'bg-blue-100 text-blue-800', barClassName: 'bg-blue-600' },
};

export const TEMPERATURE_FILTERS: { key: LeadTemperature | 'all'; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'hot', label: 'Hot' },
    { key: 'warm', label: 'Warm' },
    { key: 'cold', label: 'Cold' },
];

export const BOOKING_STATUS_META: Record<BookingStatus, { label: string; className: string }> = {
    confirmed: { label: 'Confirmed', className: 'bg-green-100 text-green-800' },
    initiated: { label: 'Slot held', className: 'bg-amber-100 text-amber-800' },
    cancelled: { label: 'Cancelled', className: 'bg-red-100 text-red-800' },
    completed: { label: 'Completed', className: 'bg-blue-100 text-blue-800' },
};

export const SLOT_STATUS_META: Record<SlotStatus, { label: string; className: string }> = {
    available: { label: 'Open', className: 'border border-slate-300 bg-white hover:border-(--builder-blue)' },
    booked: { label: 'Booked', className: 'border border-blue-600 bg-blue-600' },
    reserved: { label: 'Held', className: 'border border-amber-600 bg-amber-400' },
    blocked: {
        label: 'Blocked',
        className:
            'border border-slate-400 bg-[repeating-linear-gradient(45deg,#e2e8f0,#e2e8f0_3px,#f8fafc_3px,#f8fafc_6px)] hover:border-(--builder-blue)',
    },
};

export const DATE_RANGE_OPTIONS = [
    { key: '7d', label: 'Last 7 days' },
    { key: 'today', label: 'Today' },
    { key: '30d', label: 'Last 30 days' },
    { key: 'all', label: 'All time' },
] as const;

export const DEFAULT_PAGE_SIZE = 10;

// Lead score thresholds, same as candidate-form-details-service.
export const HOT_SCORE_THRESHOLD = 75;
export const WARM_SCORE_THRESHOLD = 50;

export const FORM_OPTIONS = [
    { slug: 'job-switch', name: 'Product Company Readiness Check' },
    { slug: 'salary-stagnation', name: 'AI Era Market Value Check' },
    { slug: 'ai-fear', name: 'AI-Proof Engineer Readiness Check' },
] as const;
