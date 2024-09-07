import { defineStore } from 'pinia';

export const useUserStore = defineStore('userStorage', () => {
    const user = ref<object>({});
    const isAnonymous = ref<boolean>(false);

    const setUser = (userData: object) => {
        user.value = userData;
    };

    const getUser = (): object => {
        return user.value;
    };

    return { setUser, getUser };
});
