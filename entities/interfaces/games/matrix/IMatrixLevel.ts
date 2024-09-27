import type { IGameLevel } from '~/entities/interfaces/games/IGameLevel';

export interface IMatrixLevel extends IGameLevel {
    /**
     * Сторона квадрата.
     */
    squareSide: number;

    /**
     * Количество ячеек, которые необходимо запомнить и воспроизвести.
     */
    cellsAmountToReproduce: number;

    /**
     * Количество различных цветов на игровом поле.
     * todo: валидация cellsAmountToReproduce * colorsAmount <= squareSide^2
     */
    colorsAmount: number;

    /**
     * Проверка порядка.
     * Следует ли дополнительно проверять соответствие порядка открытия ячеек порядку их показа пользователю.
     *
     */
    hasDirection: boolean;

    /**
     * Количество поворотов.
     * Количество поворотов, которое совершает игровое поле.
     */
    rotationIterations: number;
}
