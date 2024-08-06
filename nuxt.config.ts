// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-04-03',
    devtools: {enabled: true},
    modules: [
        "@nuxt/eslint",
        "@nuxtjs/google-fonts",
        "@nuxtjs/color-mode",
        "@nuxt/image",
        "@nuxtjs/i18n"
    ],
    components: [
        {path: '~/shared/ui', prefix: 'Ui', extensions: ['.vue']},
        {path: '~/shared/icons', prefix: 'Icon'},
        {path: '~/features', prefix: 'Feature', extensions: ['.ts']},
        {path: '~/widgets', prefix: 'Widget', extensions: ['.vue']},
    ],
    css: ['~/assets/styles/index.scss'],
    runtimeConfig: {
        public: {
            api: process.env.API_URL ?? '',
        },
    },
    i18n: {
        strategy: 'prefix_except_default',
        defaultLocale: 'ru',
        locales: ['ru', 'en'],
    },
    vite: {
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: '@use "~/assets/styles/collection/index.scss" as *;',
                },
            },
        },
    },
})