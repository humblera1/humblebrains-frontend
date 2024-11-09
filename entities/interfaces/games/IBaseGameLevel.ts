export interface IBaseGameLevel {
    /**
     * Количество правильных ответов до повышения уровня.
     * После указанного количества правильных ответов, данных подряд, уровень будет повышен.
     */
    correctAnswersBeforePromotion: number;

    /**
     * Количество неправильных ответов до понижения уровня
     * После указанного количества неправильных ответов, данных подряд, уровень будет понижен до предыдущего.
     */
    incorrectAnswersBeforeDemotion: number;

    /**
     * Количество очков за каждый правильный ответ.
     */
    pointsForAnswer: number;

    /**
     * Максимальное количество времени, отведенного на запоминание (в секундах).
     */
    timeToContemplate: number;

    /**
     * Максимальное количество времени, отведенного на ответ (в секундах).
     */
    timeToAnswer: number;
}
