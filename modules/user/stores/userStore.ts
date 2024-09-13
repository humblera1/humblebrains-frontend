import { defineStore } from 'pinia';
import type { User } from '~/modules/user/entities/interfaces/User';

export const useUserStore = defineStore('userStorage', () => {
    const user = ref<User>({} as User);

    const authService = useAuthService();

    const setUserData = (userData: User) => {
        console.log(userData);
        user.value = userData;
    };

    const setUser = async () => {
        const user = await authService.fetchUser();

        setUserData(user);
    };

    return { setUser, setUserData, user };
});
