export interface IGameResult {
    /**
     * Название игры.
     */
    game: string;

    /**
     * Уровень, на котором была завершена игра.
     */
    finishedAtTheLevel: number;

    /**
     * Максимальный открытый уровень.
     */
    maxUnlockedLevel: number;

    /**
     * Среднее время реакции.
     */
    meanReactionTime: number;

    /**
     * Точность ответов (отношение правильных ответов к их общему числу в процентах).
     */
    accuracy: number;

    /**
     * Была ли игра сыграна в рамках текущей сессии.
     */
    withinSession: boolean;
}
