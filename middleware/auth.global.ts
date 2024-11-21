import { useUserStore } from '~/modules/user/stores/userStore';
import { useAuthService } from '~/modules/auth/composables/useAuthService';

export default defineNuxtRouteMiddleware(() => {
    const store = useUserStore();
    const { fetchUser } = useAuthService();

    if (import.meta.client && store.user.id === undefined) {
        const userPromise = fetchUser()
            .then((response) => store.setUserData(response.data))
            .catch((error) => console.log(error.data));

        store.setSetupPromise(userPromise);
    }
});
