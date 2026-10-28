import axios from 'axios';

// User-Service: authentication and current-user APIs.
export const userApiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_LEAD_ADMIN_AUTH_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
});