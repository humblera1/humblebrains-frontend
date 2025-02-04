import type { ChartData } from '~/entities/types/ChartData';

export type ProfileStatisticsItemProps = {
    type: string;
    data: ChartData;
    isActive: boolean;
    isVisible: boolean;
};
