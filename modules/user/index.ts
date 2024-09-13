import { addPlugin, createResolver, defineNuxtModule } from 'nuxt/kit';

export default defineNuxtModule({
    meta: {
        name: 'user',
    },
    setup() {
        const { resolve } = createResolver(import.meta.url);

        addPlugin(resolve('./plugins/user'));
    },
});
