import type { UserPersonalData } from '~/modules/user/entities/interfaces/UserPersonalData';
import type { ICheckpoint } from '~/modules/checkpoint/entities/interfaces/ICheckpoint';

export interface User {
    // top-level properties common to all users,
    id: number;
    isAnonymous: boolean;

    // full-fledged user's data
    data?: UserPersonalData;

    // checkpoint data
    checkpoint: ICheckpoint;
}
