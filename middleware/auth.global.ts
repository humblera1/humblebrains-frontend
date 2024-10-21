// middleware/auth.js
// todo: place it in the auth module... maybe...
import { useUserStore } from '~/modules/user/stores/userStore';
import { useAuthService } from '~/modules/auth/composables/useAuthService';
import type { User } from '~/modules/user/entities/interfaces/User';

export default defineNuxtRouteMiddleware(() => {
    const store = useUserStore();
    const { fetchUser } = useAuthService();

    if (import.meta.client && store.user.id === undefined) {
        fetchUser()
            .then((user: User) => store.setUserData(user.data))
            .catch((error) => console.log(error.data));
    }
});
