import type { Role } from '@/constants/roles';

export type CreatedUser = {
    publicId: string;
    name: string;
    email: string;
    phoneNo: string | null;
    role: Role;
    isActive: boolean;
    passwordResetRequired: boolean;
};

export type CreateUserResponseData = {
    user: CreatedUser;
};