import type { UserPersonalData } from '~/modules/user/entities/interfaces/UserPersonalData';

export interface User {
    // top-level properties common to all users,
    id: number;
    isAnonymous: boolean;

    // full-fledged user's data
    data?: UserPersonalData;
}
