import { addComponentsDir, createResolver, defineNuxtModule } from 'nuxt/kit';

export default defineNuxtModule({
    meta: {
        name: 'checkpoint',
    },
    setup(_, nuxt) {
        const resolver = createResolver(import.meta.url);

        addComponentsDir({
            path: resolver.resolve('widgets'),
            prefix: 'WidgetCheckpoint',
        });
    },
});
