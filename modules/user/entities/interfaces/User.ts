import type { UserPersonalData } from '~/modules/user/entities/interfaces/UserPersonalData';
import type { ICheckpoint } from '~/modules/checkpoint/entities/interfaces/ICheckpoint';
import type { IProgram } from '~/entities/interfaces/program/IProgram';

export interface User {
    // top-level properties common to all users,
    id: number;
    isAnonymous: boolean;

    // full-fledged user's data
    data?: UserPersonalData;

    // checkpoint data
    checkpoint: ICheckpoint;

    // program data
    program?: IProgram;
}
