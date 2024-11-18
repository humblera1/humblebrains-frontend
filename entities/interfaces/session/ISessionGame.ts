export interface ISessionGame {
    game: {
        id: number;
        name: string;
        label: string;
        image: string;
        maxLevel: number;
        userLevel: number;
    };
    isCompleted: boolean;
}
