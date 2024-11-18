import type { IGameResult } from '~/entities/interfaces/games/IGameResult';

export interface IFinishedGame {
    /**
     * Результаты игры.
     */
    results: IGameResult | undefined;

    /**
     * Переменная, сигнализирующая о том, что игра была успешно сохранена на сервере.
     */
    successfullySaved: boolean;

    /**
     * Переменная, сигнализирующая о том, что сыгранная игра завершила сессию.
     */
    hasGameCompletedSession: boolean;

    /**
     * Переменная, сигнализирующая о том, что сыгранная игра завершила программу.
     */
    hasGameCompletedProgram: boolean;
}
