import type { UserPersonalData } from '~/entities/interfaces/user/UserPersonalData';

export interface User {
    id: number;
    isAnonymous: boolean;
    person?: UserPersonalData;
}
