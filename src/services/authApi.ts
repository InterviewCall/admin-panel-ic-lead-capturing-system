import { userApiClient } from '@/lib/userApiClient';
import type {
    LoginCredentials,
    LoginResponseData,
    ResetPasswordCredentials,
    ResetPasswordResponseData,
} from '@/types/auth';
import type { ApiSuccessResponse } from '@/types/response';

export async function loginApi(
    credentials: LoginCredentials,
): Promise<LoginResponseData> {
    const response = await userApiClient.post<
        ApiSuccessResponse<LoginResponseData>
    >('/auth/login', credentials);

    return response.data.data;
}


export async function resetPasswordApi(
    credentials: ResetPasswordCredentials,
): Promise<ResetPasswordResponseData> {
    const response = await userApiClient.post<
        ApiSuccessResponse<ResetPasswordResponseData>
    >('/auth/reset-password', credentials);

    return response.data.data;
}