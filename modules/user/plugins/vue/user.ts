import type { VueAppInstance } from '@vue/devtools-kit';
import { UserProxy } from '~/modules/user/utils/user.js';

export default {
    install: (app: VueAppInstance) => {
        app.config.globalProperties.$user = new UserProxy();
    },
};
