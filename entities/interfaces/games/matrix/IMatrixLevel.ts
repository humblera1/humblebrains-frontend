import type { IGameLevel } from '~/entities/interfaces/games/IGameLevel';

export interface IMatrixLevel extends IGameLevel {
    // Сторона квадрта для построения поля
    squareSide: number;

    // Количество ячеек, которые пользователю предстоит запомнить и воспроизвести
    cellsAmountToReproduce: number;

    // Количество цветов todo: валидация cellsAmountToReproduce * colorsAmount <= squareSide^2
    colorsAmount: number;

    // Важно ли направление открытия ячеек
    hasDirection: boolean;

    // Задан ли переворот игрового поля
    hasRotation: boolean;
}