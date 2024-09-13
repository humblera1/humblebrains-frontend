import type { User } from '~/modules/user/entities/interfaces/User';
import type { ILoginFormFields } from '~/entities/interfaces/forms/login/ILoginFormFields';
import type { IRegisterFormFields } from '~/entities/interfaces/forms/register/IRegisterFormFields';
import { RequestMethodEnum } from '~/entities/enums/RequestMethodEnum';

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

    const login = async (fields: ILoginFormFields): Promise<User> => {
        return await sendCredentials('login', fields);
    };

    const register = async (fields: IRegisterFormFields) => {
        return await sendCredentials('register', fields);
    };

    const sendCredentials = async (path: 'login' | 'register', fields: ILoginFormFields | IRegisterFormFields): Promise<User> => {
        return await $api<User>(`/v1/users/${path}`, {
            method: RequestMethodEnum.post,
            credentials: 'include',
            body: fields,
        });
    };

    // helpers
    const isXsrfCookieExpired = (): boolean => {
        return useCookie('XSRF-TOKEN').value === undefined;
    };

    const fetchUser = async (): Promise<User> => {
        return await $api<User>('/v1/users/me?XDEBUG_SESSION=XDEBUG_ECLIPSE', {
            method: RequestMethodEnum.post,
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
