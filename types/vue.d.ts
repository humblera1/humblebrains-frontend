import type { IUserProxyContext } from '~/modules/user/entities/interfaces/IUserProxyContext';

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $user: IUserProxyContext
    }
}