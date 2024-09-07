export const useAuthService = () => {
    const config = useRuntimeConfig();

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

    const login = async () => {
        // login user by provided credentials
    };

    const register = async () => {
        // register new user (not anonymous!)
    };

    // helpers

    const setUser = async () => {
        // fetch user data from the server and store it
    };

    const isXsrfCookieExpired = (): boolean => {
        return useCookie('XSRF-TOKEN').value === undefined;
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

    return { setXsrfHeader, login, register };
};
