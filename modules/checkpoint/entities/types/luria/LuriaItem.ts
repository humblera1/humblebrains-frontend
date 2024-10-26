import { LuriaItemTypeEnum } from '~/modules/checkpoint/entities/enums/luria/LuriaItemTypeEnum';
import type { Icon } from '~/modules/checkpoint/entities/types/Icon';

export type LuriaItem = {
    id: number;
    type: LuriaItemTypeEnum;
    content: string | Icon;
    color: string;
};
