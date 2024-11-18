export interface IGameResult {
    /**
     * Название игры.
     */
    game: string;

    /**
     * Уровень, с которого была начата игра.
     */
    startedFromLevel: number;

    /**
     * Уровень, на котором была завершена игра.
     */
    finishedAtLevel: number;

    /**
     * Максимальный открытый уровень.
     */
    maxUnlockedLevel: number;

    /**
     * Среднее время реакции.
     */
    meanReactionTime: string;

    /**
     * Точность ответов (отношение правильных ответов к их общему числу в процентах).
     */
    accuracy: string;

    /**
     * Количество верных ответов, данных за всю игру.
     */
    correctAnswersAmount: number;

    /**
     * Была ли игра сыграна в рамках текущей сессии.
     */
    withinSession: boolean;

    /**
     * Количество очков.
     */
    score: number;

    /**
     * Была ли выполнена поставленная цель.
     */
    isTargetCompleted: boolean;
}
