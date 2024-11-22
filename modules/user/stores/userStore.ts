import { defineStore } from 'pinia';
import type { User } from '~/modules/user/entities/interfaces/User';
import type { ICheckpoint } from '~/modules/checkpoint/entities/interfaces/ICheckpoint';
import type { IProgram } from '~/entities/interfaces/program/IProgram';
import type { ICheckpointStage } from '~/modules/checkpoint/entities/interfaces/ICheckpointStage';
import type { ISessionGame } from '~/entities/interfaces/session/ISessionGame';

export const useUserStore = defineStore('userStorage', () => {
    const user = ref<User>({} as User);

    const setupPromise = ref<Promise<void> | null>(null);

    const authService = useAuthService();

    const program = computed((): IProgram | undefined => {
        return user.value.program;
    });

    const games = computed((): ISessionGame[] => {
        return user.value.program?.currentSession?.games ?? [];
    });

    const stages = computed((): ICheckpointStage[] => {
        return user.value.checkpoint?.stages ?? [];
    });

    const isCheckpointCompleted = computed((): boolean => {
        if (user.value.checkpoint) {
            return user.value.checkpoint.isCompleted;
        }

        return true;
    });

    const completeCheckpoint = () => {
        if (user.value.checkpoint) {
            user.value.checkpoint.isCompleted = true;
        }
    };

    const setUserData = (userData: User) => {
        user.value = userData;
    };

    const setCheckpointData = (checkpointData: ICheckpoint) => {
        user.value.checkpoint = checkpointData;
    };

    const setCheckpointStageData = (stageData: ICheckpointStage) => {
        const stageIndex = stages.value.findIndex((stage) => stage.id === stageData.id);

        if (stageIndex !== -1) {
            user.value.checkpoint.stages[stageIndex] = stageData;
        }
    };

    const setProgramData = (programData: IProgram) => {
        user.value.program = programData;
    };

    const setUser = async () => {
        const user = await authService.fetchUser();

        setUserData(user.data);
    };

    const setSetupPromise = (promise: Promise<void>) => {
        setupPromise.value = promise;
    };

    const getSetupPromise = () => {
        return setupPromise.value;
    };

    return {
        completeCheckpoint,

        setSetupPromise,
        getSetupPromise,
        setUser,
        setUserData,
        setCheckpointData,
        setCheckpointStageData,
        setProgramData,
        user,
        program,
        games,
        stages,
        isCheckpointCompleted,
    };
});
