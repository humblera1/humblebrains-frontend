import { defineStore } from 'pinia';
import type { User } from '~/modules/user/entities/interfaces/User';
import type { ICheckpoint } from '~/modules/checkpoint/entities/interfaces/ICheckpoint';
import type { IProgram } from '~/entities/interfaces/program/IProgram';

export const useUserStore = defineStore('userStorage', () => {
    const user = ref<User>({} as User);

    const authService = useAuthService();

    const setUserData = (userData: User) => {
        user.value = userData;
    };

    const setCheckpointData = (checkpointData: ICheckpoint) => {
        user.value.checkpoint = checkpointData;
    };

    const setProgramData = (programData: IProgram) => {
        user.value.program = programData;
    };

    const setUser = async () => {
        const user = await authService.fetchUser();

        setUserData(user.data);
    };

    return { setUser, setUserData, setCheckpointData, setProgramData, user };
});
