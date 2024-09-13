import { addImports, createResolver, defineNuxtModule } from 'nuxt/kit';

export default defineNuxtModule({
    meta: {
        name: 'auth',
    },
    setup() {
        const { resolve } = createResolver(import.meta.url);

        addImports({
            name: 'useAuthService', // name of the composable to be used
            from: resolve('./composables/useAuthService') // path of composable
        })
    },
});
