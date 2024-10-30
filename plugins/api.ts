import { RequestMethodEnum } from '~/entities/enums/RequestMethodEnum';

export default defineNuxtPlugin({
    setup() {
        const config = useRuntimeConfig();

        const baseUrl = config.public.api;

        const api = $fetch.create({
            baseURL: baseUrl,
            async onRequest({ options }) {
                const headers = (options.headers);

                headers.set('Accept', 'application/json');

                if (options.method === RequestMethodEnum.post) {
                    const { setXsrfHeader } = useAuthService();

                    await setXsrfHeader(headers);
                }
            },
        });

        return {
            provide: {
                api,
            },
        };
    },
});
