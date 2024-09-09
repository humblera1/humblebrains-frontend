import { RequestMethodEnum } from '~/entities/enums/RequestMethodEnum';
import type { User } from '~/entities/interfaces/user/User';
import type { BaseResponse } from '~/entities/interfaces/responses/BaseResponse';
import type { LoginForm } from '~/entities/interfaces/forms/login/LoginForm';

export const useAuthService = () => {
    const config = useRuntimeConfig();

    const { $api } = useNuxtApp();

    const baseUrl: string = config.public.api;

    const setXsrfHeader = async (headers: HeadersInit): Promise<void> => {
        const token = await getXsrfToken();

        if (Array.isArray(headers)) {
            headers.push(['X-XSRF-TOKEN', token]);
        } else if (headers instanceof Headers) {
            headers.set('X-XSRF-TOKEN', token);
        } else {
            headers['X-XSRF-TOKEN'] = token;
        }
    };

    const login = async (loginForm: LoginForm): Promise<User> => {
        return await $api('/v1/users/login', {
            method: RequestMethodEnum.post,
            credentials: 'include',
            body: loginForm,
        });
    };

    const register = async () => {
        // register new user (not anonymous!)
    };

    // helpers
    const isXsrfCookieExpired = (): boolean => {
        return useCookie('XSRF-TOKEN').value === undefined;
    };

    const fetchUser = async (): Promise<User> => {
        return await $api<User>('/v1/users/me', {
            method: RequestMethodEnum.get,
            credentials: 'include',
        });
    };

    const setXsrfCookie = async (): Promise<void> => {
        await $fetch(`${baseUrl}/csrf-cookie`, { credentials: 'include' });
    };

    const getXsrfToken = async (): Promise<string> => {
        if (isXsrfCookieExpired()) {
            await setXsrfCookie();
        }

        return useCookie('XSRF-TOKEN').value ?? '';
    };

    return { setXsrfHeader, login, register, fetchUser };
};
