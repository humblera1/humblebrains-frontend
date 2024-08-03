// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-04-03',
    devtools: {enabled: true},
    modules: ["@nuxt/eslint", "@nuxtjs/google-fonts"],
    components: [
        {path: '~/shared/ui', prefix: 'Ui', extensions: ['.vue']},
        {path: '~/shared/icons', prefix: 'Icon'},
        {path: '~/features', prefix: 'Feature', extensions: ['.ts']},
        {path: '~/widgets', prefix: 'Widget', extensions: ['.vue']},
    ],
    runtimeConfig: {
        public: {
            api: process.env.API_URL ?? '',
        },
    },
})