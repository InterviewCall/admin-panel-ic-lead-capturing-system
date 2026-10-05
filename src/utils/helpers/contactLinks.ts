export function toWhatsAppLink(phone: string): string {
    const digits = phone.replace(/\D/g, '');
    const withCountryCode = digits.length === 10 ? `91${digits}` : digits;
    return `https://wa.me/${withCountryCode}`;
}

export function toTelLink(phone: string): string {
    return `tel:+${phone.replace(/\D/g, '')}`;
}
