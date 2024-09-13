import user from './vue/user';

export default defineNuxtPlugin({
    setup(nuxtApp) {
        nuxtApp.vueApp.use(user, { properties: ['id', 'name', 'email'] });
    },
});
