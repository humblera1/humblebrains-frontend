// export interface IGameStatistics {
//     /**
//      * Серийные номера сыгранных игр.
//      */
//     xAsis: number[];
//
//     /**
//      * Значения счёта.
//      */
//     yAsis: number[];
// }

export interface IGameStatistics {
    /**
     * Серийные номера сыгранных игр.
     */
    games: number[];

    /**
     * Значения счёта.
     */
    scores: number[];

    /**
     * Значение точности.
     */
    accuracy: number[];
}
