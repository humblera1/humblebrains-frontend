import type { ComputedRef } from 'vue';
import type { ICheckpoint } from '~/modules/checkpoint/entities/interfaces/ICheckpoint';

export interface IUserProxyContext {
    readonly isAnonymous: ComputedRef<boolean>;
    readonly username: ComputedRef<string>;
    readonly email: ComputedRef<string>;
    readonly firstName: ComputedRef<string>;
    readonly secondName: ComputedRef<string>;
    readonly checkpoint: ComputedRef<ICheckpoint | undefined>;
    readonly isRunCheckpoint: ComputedRef<boolean>;
    readonly isRunProgram: ComputedRef<boolean>;
}
