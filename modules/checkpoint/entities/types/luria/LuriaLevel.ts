export type LuriaLevel = {
    /**
     * Количество символов/слов, которые будут показаны пользователю для запоминания.
     */
    readonly totalItemsToRemember: number;

    /**
     * Количество символов/слов, которые будут показаны пользователю на втором этапе тестового упражнения.
     */
    readonly totalItemsToGuess: number;
};
