export default defineNuxtConfig({
    compatibilityDate: '2024-04-03',
    app: {
        head: {
            title: 'HB',
            link: [
                {
                    rel: 'icon',
                    type: 'image/png',
                    href: '/favicon.png',
                },
            ],
        },
    },
    devtools: { enabled: true },
    modules: [
        '@nuxt/eslint',
        '@nuxtjs/google-fonts',
        '@nuxtjs/color-mode',
        '@nuxt/image',
        '@nuxtjs/i18n',
        '@pinia/nuxt',
        'nuxt-humble-modal',
        '@nuxtjs/device',
        'nuxt-swiper',
    ],
    components: [
        { path: '~/shared/ui', prefix: 'Ui', extensions: ['.vue'] },
        { path: '~/shared/icons', prefix: 'Icon' },
        { path: '~/features', prefix: 'Feature', extensions: ['.ts'] },
        { path: '~/widgets', prefix: 'Widget', extensions: ['.vue'] },
        { path: '~/widgets/games', prefix: 'Game', extensions: ['.vue'] },
    ],
    css: ['~/assets/styles/index.scss'],
    runtimeConfig: {
        public: {
            api: process.env.API_URL ?? '',
        },
    },
    googleFonts: {
        families: {
            Ubuntu: [400, 500, 600, 700],
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
                    api: 'modern-compiler',
                    additionalData: '@use "~/assets/styles/collection/index.scss" as *;',
                },
            },
        },
    },
    eslint: {
        // Disable automatic config generation
        config: false,
    },
    build: {
        transpile: ['@vuepic/vue-datepicker'],
    },
});
