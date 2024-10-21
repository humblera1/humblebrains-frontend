import { addComponentsDir, addImports, createResolver, defineNuxtModule } from 'nuxt/kit';

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

        addImports({
            name: 'useCheckpointService', // name of the composable to be used
            from: resolver.resolve('./composables/useCheckpointService'), // path of composable
        });
    },
});
