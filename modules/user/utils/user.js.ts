import type { ComputedRef } from 'vue';
import type { IUserProxyContext } from '~/modules/user/entities/interfaces/IUserProxyContext';
import { useUserStore } from '~/modules/user/stores/userStore';
import type { UserPersonalData } from '~/modules/user/entities/interfaces/UserPersonalData';
import type { ICheckpoint } from '~/modules/checkpoint/entities/interfaces/ICheckpoint';
import type { IProgram } from '~/entities/interfaces/program/IProgram';

export class UserProxy implements IUserProxyContext {
    username!: ComputedRef<string>;
    email!: ComputedRef<string>;
    firstName!: ComputedRef<string>;
    secondName!: ComputedRef<string>;
    isAnonymous!: ComputedRef<boolean>;
    isRunCheckpoint!: ComputedRef<boolean>;
    isRunProgram!: ComputedRef<boolean>;
    checkpoint!: ComputedRef<ICheckpoint | undefined>;
    program!: ComputedRef<IProgram | undefined>;

    constructor() {
        const store = useUserStore();

        // Names of user non-specific data properties for which secure proxies will be created
        // todo: put it into module config?
        const dataKeys: (keyof UserPersonalData)[] = ['username', 'email', 'firstName', 'secondName'];

        // Added proxies to data properties
        for (const name of dataKeys) {
            this[name] = computed((): string => {
                return store.user?.data?.[name] ?? '';
            });
        }

        // Added proxy to the top-level 'isAnonymous' property
        this.isAnonymous = computed((): boolean => {
            if (store.user.isAnonymous === undefined) {
                return true;
            }

            return store.user.isAnonymous;
        });

        this.checkpoint = computed((): ICheckpoint => {
            return store.user.checkpoint;
        });

        /**
         * Возможны два состояния: пользователь проходит программу или пользователь завершил программу и проходит контрольную точку.
         * Данное свойство сигнализирует о том, что пользователь проходит контрольную точку.
         */
        this.isRunCheckpoint = computed((): boolean => {
            if (this.checkpoint && this.checkpoint.value) {
                return !this.checkpoint.value.isCompleted;
            }

            return false;
        });

        /**
         * Возможны два состояния: пользователь проходит программу или пользователь завершил программу и проходит контрольную точку.
         * Данное свойство сигнализирует о том, что пользователь ещё не завершил программу и не может быть допущен к выполнению контрольной точки.
         */
        this.isRunProgram = computed((): boolean => {
            if (this.program && this.program.value) {
                return !this.program.value.isCompleted;
            }

            // todo: method logic
            return false;
        });
    }
}
