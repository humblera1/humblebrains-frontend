export interface IGameLevel {
    // Количество правильных ответов, необходимых для перехода на следующий уровень (может, завязать на количестве очков)
    correctAnswersBeforePromotion: number;

    // Количество неправильных ответов, после которого уровень будет понижен
    incorrectAnswersBeforeDemotion: number;

    // Количество очков за каждый правильный ответ
    pointsForAnswer: number;
}