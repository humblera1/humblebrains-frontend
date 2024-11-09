export type GameEventEnum = {
    /**
     * Событие инициируется по истечении времени на игру.
     */
    'game:timeIsOver'?: number;

    /**
     * Событие инициируется по истечении времени на запоминание
     */
    'game:contemplationTimeIsOver'?: number;

    /**
     * Событие инициируется по истечении времени на ответ.
     */
    'game:answeringTimeIsOver'?: number;
};
