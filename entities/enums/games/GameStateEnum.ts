export enum GameStateEnum {
    /**
     * Этап установки игрового стора.
     */
    gamePreparing,

    /**
     * Этап предварительной генерации элементов на поле, свойственным некоторым играм.
     */
    roundPreparing,

    /**
     * Один из возможных этапов, следующих за interactive. Устанавливается в случае завершения раунда, в котором был дан неверный ответ.
     * В это время очищается игровое поле, после чего устанавливается состояние roundPreparing - начало нового раунда.
     */
    failedRoundFinishing,

    /**
     * Второй возможный этап, следующий за interactive. Устанавливается в случае завершения раунда, в котором не было неверных ответов.
     * В это время очищается игровое поле, после чего устанавливается состояние roundPreparing - начало нового раунда.
     */
    successfulRoundFinishing,

    /**
     * Подготовка нового уровня.
     * Может понадобиться для реализации анимации перехода на новый уровень (изменениее игрвого поля, введение новой механики)
     */
    levelPreparing,

    /**
    * Состояние понижения уровня.
    */
    levelDemotion,

    /**
    * Состояние повышения уровня.
    */
    levelPromotion,

    /**
     * На данном этапе не принимаются никакие ответы, интерактивные игровые элементы не реагируют на действия игрока.
     * Задача пользователя - запомнить информацию, которая потребуется на следующем этапе для правильного ответа.
     *
     * В этом состоянии таймер отсчитывает время, отведенное пользователю на запоминание.
     */
    contemplation,

    /**
     * Этап завершения игры
     */
    gameFinishing,

    /**
     * Этап, на котором происходит взаимодействие пользователя с игровым полем - принимаются ответы.
     * Элементы остаются интерактивными, прослушиваются и обрабатываются действия пользователя.
     * Свойственен всем играм.
     *
     * В этом состоянии таймер отсчитывает время, отведенное пользователю на ответ.
     */
    interactive,

    /**
     * На данном этапе пользователю показываются подсказки касательно механики игры.
     * Этап может устанавливаться после обновления уровня (при повышении, чтобы объявить новые особенности игрового процесса) или при определенном количестве неправильных ответов.
     */
    prompt,

    /**
     * Пауза.
     */
    pause,
}
