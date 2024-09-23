import type { IGameLevel } from '~/entities/interfaces/games/IGameLevel';

export interface IMatrixLevel extends IGameLevel {
    /**
     * Сторона квадрта для построения поля.
     */
    squareSide: number;

    /**
     * Количество ячеек, которые пользователю предстоит запомнить и воспроизвести.
     */
    cellsAmountToReproduce: number;

    /**
     * Количество цветов todo: валидация cellsAmountToReproduce * colorsAmount <= squareSide^2
     */
    colorsAmount: number;

    /**
     * Важно ли направление открытия ячеек.
     */
    hasDirection: boolean;

    /**
     * Количество поворотов, которое необходимо совершить полю после того, как пользователь запомнил расположение ячеек.
     * Число 0 означает, что элемент поворота отсутствует на уровне.
     * todo: reflections???
     */
    rotationIterations: number;
}
