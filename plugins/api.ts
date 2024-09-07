import { RequestMethodEnum } from '~/entities/enums/RequestMethodEnum';

export default defineNuxtPlugin({
    setup() {
        const config = useRuntimeConfig();

        const baseUrl = config.public.api;

        const api = $fetch.create({
            baseURL: baseUrl,
            async onRequest({ options }) {
                if (options.method === RequestMethodEnum.post) {
                    const headers = (options.headers ||= {});
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
