import type { ComputedRef } from 'vue';

export interface IUserProxyContext {
    readonly isAnonymous: ComputedRef<boolean>;
    readonly username: ComputedRef<string>;
    readonly email: ComputedRef<string>;
    readonly firstName: ComputedRef<string>;
    readonly secondName: ComputedRef<string>;
}
