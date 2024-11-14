import type { ChartData } from '~/entities/types/ChartData';

export type GameUiChartTypes = {
    title: string;
    data: ChartData;
    withFilter?: boolean;
    theme?: 'blue' | 'purple';
};
