export interface IBaseGameLevel {
    /**
     * Количество верных ответов, необходимых для завершения раунда.
     * Это общее число верных ответов, которое ожидается от пользователя в текущем раунде игры.
     */
    correctAnswersBeforeFinish: number;

    /**
     * Количество неверных ответов, после которых раунд будет завершен автоматически.
     * После данного числа неверных ответов раунд автоматически завершается.
     */
    incorrectAnswersBeforeFinish: number;

    /**
     * Допустимое количество неверных ответов.
     * После данного количества неверных ответов раунд будет засчитан как неуспешный, но не будет завершен автоматически.
     */
    incorrectAnswersToFail: number;

    /**
     * Количество успешных раундов до повышения уровня.
     * После указанного количества успешно завершенных раундов, идущих подряд, уровень будет повышен.
     */
    successfulRoundsBeforePromotion: number;

    /**
     * Количество неудачных раундов до понижения уровня.
     * После указанного количества раундов, завершенных с ошибкой, уровень будет понижен до предыдущего.
     */
    failedRoundsBeforeDemotion: number;

    /**
     * Количество очков за каждый правильный ответ.
     */
    pointsPerAnswer: number;

    /**
     * Максимальное количество времени, отведенного на запоминание (в секундах).
     */
    timeToContemplate: number;

    /**
     * Максимальное количество времени, отведенного на ответ (в секундах).
     */
    timeToAnswer: number;
}
