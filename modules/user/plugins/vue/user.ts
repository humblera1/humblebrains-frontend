import type { VueAppInstance } from '@vue/devtools-kit';
import { useUserStore } from '~/modules/user/stores/userStore';
import { getUserProxy } from '~/modules/user/utils/user.js';

export default {
    install: (app: VueAppInstance) => {
        const { user } = useUserStore();

        app.config.globalProperties.$user = getUserProxy(user);
    },
};
