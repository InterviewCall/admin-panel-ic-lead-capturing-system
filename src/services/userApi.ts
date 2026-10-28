import { userApiClient } from '@/lib/userApiClient';
import type { CreateUserFormValues } from '@/schemas/createUserSchema';
import type { CreateUserRequest } from '@/types/request';
import type { ApiSuccessResponse } from '@/types/response';
import type { CreateUserResponseData } from '@/types/user';

// POST /users: create an ADMIN or MANAGER account.
export async function createUserApi(
    payload: CreateUserFormValues,
): Promise<CreateUserResponseData> {
    const requestData: CreateUserRequest = {
        name: payload.fullName,
        email: payload.email,
        phoneNo: payload.phoneNo,
        role: payload.role,
    };

    const response = await userApiClient.post<
        ApiSuccessResponse<CreateUserResponseData>
    >('/users', requestData);

    return response.data.data;
}