import { defineStore } from 'pinia';
import type { User } from '~/entities/interfaces/user/User';

export const useUserStore = defineStore('userStorage', () => {
    const user = ref<User>({} as User);
    const isAnonymous = ref<boolean>(false);

    const authService = useAuthService();

    const setUserData = (userData: User) => {
        user.value = userData;
    };

    const setUser = async () => {
        const userResponse = await authService.fetchUser();

        setUserData(userResponse);
    };

    return { setUser, setUserData, user };
});
