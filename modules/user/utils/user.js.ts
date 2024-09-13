import type { IUserProxyContext } from '~/modules/user/entities/interfaces/IUserProxyContext';
import type { User } from '~/modules/user/entities/interfaces/User';

class UserProxy {
    readonly _user: User;

    constructor(user: User) {
        this._user = user;
    }
}

export function getUserProxy(user: User): IUserProxyContext {
    // Names of user properties for which secure proxies will be created
    // todo: put it into module config?
    const dataKeys: string[] = ['id', 'username', 'email', 'firstName', 'secondName'];

    const userProxy = new UserProxy(user);

    // Added proxies to data properties
    for (const name of dataKeys) {
        Object.defineProperty(userProxy, name, {
            get(): string {
                // return this._user?.data?.[name] ?? '';
                return this._user?.[name] ?? '';
            },
        });
    }

    // Added proxy to the top-level 'isAnonymous' property
    Object.defineProperty(userProxy, 'isAnonymous', {
        get(): boolean {
            return Boolean(this._user?.isAnonymous);
        },
    });

    // Will be continued ...

    // Return proxy
    return userProxy;
}
