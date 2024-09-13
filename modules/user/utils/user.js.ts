import type { IUserProxyContext } from '~/modules/user/entities/interfaces/IUserProxyContext';
import { useUserStore } from '~/modules/user/stores/userStore';
import type { UserPersonalData } from '~/modules/user/entities/interfaces/UserPersonalData';
import type { ComputedRef } from 'vue';

export class UserProxy implements IUserProxyContext {
    username!: ComputedRef<string>;
    email!: ComputedRef<string>;
    firstName!: ComputedRef<string>;
    secondName!: ComputedRef<string>;
    isAnonymous!: ComputedRef<boolean>;

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
        })
    }
}
