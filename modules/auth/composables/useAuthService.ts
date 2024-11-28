import type { User } from '~/modules/user/entities/interfaces/User';
import type { ILoginFormFields } from '~/entities/interfaces/forms/login/ILoginFormFields';
import type { IRegisterFormFields } from '~/entities/interfaces/forms/register/IRegisterFormFields';
import { RequestMethodEnum } from '~/entities/enums/RequestMethodEnum';
import type { BaseResponse } from '~/entities/interfaces/responses/BaseResponse';
import type { IProfileFormFields } from '~/entities/interfaces/forms/profile/IProfileFormFields';
import type { IResetPasswordFormFields } from '~/entities/interfaces/forms/reset-password/IResetPasswordFormFields';

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

    const login = async (fields: ILoginFormFields): Promise<BaseResponse<User>> => {
        return await sendCredentials('login', fields);
    };

    const register = async (fields: IRegisterFormFields): Promise<BaseResponse<User>> => {
        return await sendCredentials('register', fields);
    };

    const update = async (fields: IProfileFormFields): Promise<BaseResponse<User>> => {
        return await $api<BaseResponse<User>>('/v1/users/update', {
            method: RequestMethodEnum.post,
            credentials: 'include',
            body: fields,
        });
    };

    const changePassword = async (fields: IResetPasswordFormFields): Promise<BaseResponse<void>> => {
        return await $api<BaseResponse<void>>('/v1/auth/change-password', {
            method: RequestMethodEnum.post,
            credentials: 'include',
            body: fields,
        });
    };

    const forgotPassword = async (email: string): Promise<BaseResponse<void>> => {
        return await $api<BaseResponse<void>>('/v1/auth/forgot-password', {
            method: RequestMethodEnum.post,
            credentials: 'include',
            body: {
                email,
            },
        });
    };

    const sendCredentials = async (
        path: 'login' | 'register',
        fields: ILoginFormFields | IRegisterFormFields,
    ): Promise<BaseResponse<User>> => {
        return await $api<BaseResponse<User>>(`/v1/auth/${path}`, {
            method: RequestMethodEnum.post,
            credentials: 'include',
            body: fields,
        });
    };

    // helpers
    const isXsrfCookieExpired = (): boolean => {
        return useCookie('XSRF-TOKEN').value === undefined;
    };

    const fetchUser = async (): Promise<BaseResponse<User>> => {
        return await $api<BaseResponse<User>>('/v1/users/me', {
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

    return { setXsrfHeader, login, register, update, changePassword, forgotPassword, fetchUser };
};
