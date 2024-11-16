import type { IBaseGameLevel } from '~/entities/interfaces/games/IBaseGameLevel';

export interface IMatrixLevel extends IBaseGameLevel {
    /**
     * Сторона квадрата.
     */
    squareSide: number;

    /**
     * Количество различных цветов на игровом поле.
     */
    colorsAmount: number;

    /**
     * Проверка порядка.
     * Следует ли дополнительно проверять соответствие порядка открытия ячеек порядку их показа пользователю.
     *
     */
    hasOrder: boolean;

    /**
     * Количество поворотов.
     * Количество поворотов, которое совершает игровое поле.
     */
    rotationIterations: number;
}
