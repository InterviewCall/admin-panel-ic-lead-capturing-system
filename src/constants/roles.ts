export const ROLE = {
    ADMIN: 'ADMIN',
    MANAGER: 'MANAGER',
} as const;

export const ROLE_OPTIONS = [ROLE.ADMIN, ROLE.MANAGER] as const;

export type Role = (typeof ROLE)[keyof typeof ROLE];