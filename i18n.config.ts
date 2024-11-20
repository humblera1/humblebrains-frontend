export default defineI18nConfig(() => ({
    legacy: false,
    locale: 'ru',
    messages: {
        ru: {
            signUp: 'Регистрация',
            signIn: 'Вход',
            pause: 'Пауза',
            yes: 'Да',
            no: 'Нет',
            description: 'Описание',
            filters: 'Фильтры',
            goTo: 'Перейти',
            confirm: 'Подтвердить',
            finish: 'Завершить',
            selectCategory: 'Выберите категорию',
            selectOption: 'Выберите значение',
            saved: 'Сохранено!',

            // Sidebar:
            home: 'Главная',
            profile: 'Профиль',
            games: 'Игры',
            settings: 'Настройки',
            progress: 'Прогресс',
            time: 'Время',

            gamesList: 'Список упражнений',

            usermail: 'Имя пользователя или почта',
            password: 'Пароль',

            // Games
            level: 'Уровень',
            levelDown: 'Уровень понижен',
            levelUp: 'Новый уровень!',
            lastRound: 'Последний раунд',
            gameFinishing: 'Завершение...',
            showRules: 'Показать обучение',
            quit: 'Выйти',
            continue: 'Продолжить',
            warmUp: 'Разминка',
            ok: 'Ок',
            start: 'Начать!',
            showTutorial: 'Показать обучение',
            totalAchievements: 'Достижения',
            startGettingTotalAchievements: 'Начните игру, чтобы заработать свои первые достижения!',
            thereWillBeStatistics: 'Здесь будет отображаться статистика ваших игр',
            all: 'Всё время',
            week: 'Неделя',
            month: 'Месяц',
            year: 'Год',
            rules: 'Правила',
            play: 'Играть!',
            infinityMode: 'Бесконечный режим',
            withinSession: 'Игра в рамках сессии',
            letsGo: 'Поехали!',
            gameCompleted: 'Упражнение завершено',
            score: 'Счёт',
            repeat: 'Повторить',
            nextOne: 'К следующему',
            gameStatistics: 'Статистика упражнения',
            meanReactionTime: 'Среднее время вашей реакции за игру',
            ms: 'мс',
            scores: 'Очки и прогресс',
            accuracy: 'Точность ответов',
            gamesAmount: 'Количество игр',
            targetCompleted: 'Цель достигнута!',
            gameSaving: 'Сохраняем результаты игры...',
            gameSavingError: 'Не удалось сохранить результаты',
            yourAccuracy: 'Ваша точность',
            yourReaction: 'Среднее время вашей реакции',
            yourScore: 'Очки, заработанные за игру',
            notEnoughDataForSelectedPeriod: 'Отсутствует информация за выбранный период...',
            sessionCompleted: 'Сессия завершена!',
            programCompleted: 'Программа завершена!',
            sessionCompletedInfo: 'Вы завершили текущую сессию вашей программы! Перейдите в профиль, чтобы посмотреть новые упражнения',
            programCompletedInfo: 'Вы завершили текущую программу! Перейдите в раздел оценки, чтобы пройти контрольную точку.',

            // Matrix
            remember: 'Запомнил',

            // Checkpoint
            checkpoint: 'Контрольная точка',
            step: 'Шаг',
            warmUpPrompt: 'Вам будет представлено несколько разминочных раундов',
            gameStartPrompt: 'Теперь играем серьезно',
            warmUpCompleted: 'Разминка завершена!',
            remembered: 'Запомнил!',
            stageCompleted: 'Этап завершён!',
            result: 'Результат',
            restAndContinue: 'Дайте себе 5 минут отдыха прежде, чем приступать к следующему',
            restAndCompleteCheckpoint: 'Все этапы завершены!\n' + 'Завершите контрольную точку и выберите новую программу',
            welcomeToCheckpoint: 'Добро пожаловать на контрольную точку!',
            checkpointBannerDescription:
                'Мы используем контрольные точки, чтобы отслеживать ваш прогресс и корректировать программы развития.\n' +
                'Завершите все этапы, чтобы мы могли создать вам новый план!',
            choosePriority: 'Выберите приоритет ',
            choosePriorityDescription: 'Вы набрали одинаковые баллы в разных категориях и можете выбрать приоритет самостоятельно',
            yourPriorityIs: 'Приоритет развития',
            yourPriorityIsDescription: 'Вы можете подтвердить выбор или выбрать другой приоритет самостоятельно',

            'checkpoint:memoryDescription':
                'Память — это когнитивная функция, которая позволяет нам сохранять, удерживать и извлекать информацию. Она играет ключевую роль в обучении и повседневной жизни, помогая нам запоминать важные события, навыки и знания.\n' +
                '\n' +
                'Память необходима для выполнения повседневных задач, таких как запоминание маршрута до работы, выполнение рабочих обязанностей, изучение нового материала и даже для общения с другими людьми.\n' +
                '\n' +
                'Развивать память можно с помощью различных упражнений, таких как запоминание списков, изучение новых языков, решение головоломок и регулярные тренировки мозга.',
            'checkpoint:logicDescription':
                'Логика — это способность рассуждать, анализировать информацию и делать выводы. Она помогает решать проблемы и принимать обоснованные решения.\n' +
                '\n' +
                'Логика важна для решения повседневных проблем, таких как планирование бюджета, принятие решений на работе, анализ информации и даже для участия в дискуссиях.\n' +
                '\n' +
                'Развивать логику можно с помощью решения математических задач, участия в дебатах, изучения шахмат и других стратегических игр, а также выполнения логических головоломок.',
            'checkpoint:attentionDescription':
                'Внимание — это способность сосредотачиваться на определенной задаче, игнорируя отвлекающие факторы. Эта когнитивная способность имеет важное значение, потому что мы используем её ежедневно.\n' +
                '\n' +
                'Внимание необходимо для выполнения задач, требующих концентрации, таких как вождение автомобиля, чтение, работа с документами и участие в совещаниях.\n' +
                '\n' +
                'Развивать внимание можно с помощью медитации, выполнения упражнений на концентрацию, таких как чтение с пониманием, и игр, требующих сосредоточенности.',

            'thorndike:findNumbers': 'Найдите следующие числа:',

            'symbols:rememberSymbols': 'Запомните показанные символы',
            'symbols:fillCell': 'Какой символ находился в ячейке?',
            'symbols:fillAllCells': 'Расставьте символы по их ячейкам',

            'numbers:rememberNumbers': 'Запомните показанные числа',
            'numbers:fillCell': 'Какое число находилось в ячейке?',
            'numbers:fillAllCells': 'Расставьте числа по их ячейкам',

            'luria:timeToReproduce': 'Теперь вам предстоит воспроизвести слова и символы из продемонстрированного набора.',
            'luria:wasSymbolInTheSet?': 'Символ был в предыдущем наборе?',
            'luria:wasWordInTheSet?': 'Слово было в предыдущем наборе?',

            // Categories
            memory: 'Память',
            logic: 'Логика',
            attention: 'Внимание',
        },
        en: {
            signUp: 'Sign Up',
            signIn: 'Sign In',
            pause: 'Pause',
            yes: 'Yes',
            no: 'No',
            description: 'Description',
            filters: 'Filters',
            goTo: 'Go to',
            confirm: 'Confirm',
            finish: 'Finish',
            selectCategory: 'Select category',
            selectOption: 'Select option',
            saved: 'Saved!',

            // Sidebar:
            home: 'Home',
            profile: 'Profile',
            games: 'Games',
            settings: 'Settings',
            progress: 'Progress',
            time: 'Time',

            gamesList: 'Games List',

            usermail: 'Username or E-mail',
            password: 'Password',

            // Games
            level: 'Level',
            levelDown: 'Your level is down',
            levelUp: 'Level Up!',
            lastRound: 'Last round',
            gameFinishing: 'Ending the game...',
            showRules: 'Show rules',
            quit: 'Quit',
            continue: 'Continue',
            warmUp: 'Warming-Up',
            ok: 'Ok',
            start: 'Start!',
            showTutorial: 'Show tutorial',
            totalAchievements: 'Achievements',
            startGettingTotalAchievements: 'Start the game to earn your first achievements!',
            thereWillBeStatistics: 'Your game statistics will be displayed here',
            all: 'All Along',
            week: 'Week',
            month: 'Month',
            year: 'Year',
            rules: 'Rules',
            play: 'Play!',
            infinityMode: 'Infinity mode',
            withinSession: 'Game within a session',
            letsGo: 'Let\'s go!',
            gameCompleted: 'Exercise completed',
            score: 'Score',
            repeat: 'Repeat',
            nextOne: 'Next One',
            gameStatistics: 'Statistics',
            ms: 'ms',
            scores: 'Points and progress',
            accuracy: 'Answer accuracy',
            gamesAmount: 'Number of games',
            targetCompleted: 'Target completed!',
            gameSaving: 'Saving the game results...',
            gameSavingError: 'Failed to save results',
            yourAccuracy: 'Your accuracy',
            yourReaction: 'Your average reaction time',
            yourScore: 'Points earned for the game',
            notEnoughDataForSelectedPeriod: 'There is no information for selected period...',
            sessionCompleted: 'Session completed!',
            programCompleted: 'Program completed!',
            sessionCompletedInfo: 'You have completed the current session of your program! Go to the profile to see new exercises.',
            programCompletedInfo: 'You have completed the current program! Go to the assessment section to take the checkpoint.',

            // Matrix
            remember: 'Remember',

            // Checkpoint
            checkpoint: 'Checkpoint',
            step: 'Step',
            warmUpPrompt: '',
            gameStartPrompt: '',
            warmUpCompleted: 'Warm-up completed!',
            remembered: 'Remembered!',
            stageCompleted: 'Stage completed!',
            result: 'Result',
            restAndContinue: 'Give yourself 5 minutes of rest before starting the next one',
            restAndCompleteCheckpoint: 'All stages completed!\n' + 'Complete the checkpoint and select a new program',
            welcomeToCheckpoint: 'Welcome to the checkpoint!',
            checkpointBannerDescription:
                'We use checkpoints to track your progress and adjust programs.\n' +
                'Complete all stages so we can create a new plan for you!',
            choosePriority: 'Choose priority',
            choosePriorityDescription: 'You have scored equally in different categories and can choose the priority yourself',
            yourPriorityIs: 'Development priority',
            yourPriorityIsDescription: 'You can confirm the choice or select another priority yourself',

            'checkpoint:memoryDescription':
                'Memory is a cognitive function that allows us to store, retain, and retrieve information. It plays a crucial role in learning and everyday life, helping us remember important events, skills, and knowledge.\n' +
                '\n' +
                'Memory is essential for performing daily tasks such as remembering the route to work, fulfilling job responsibilities, learning new material, and even communicating with others.\n' +
                '\n' +
                'Memory can be developed through various exercises such as memorizing lists, learning new languages, solving puzzles, and regular brain training.',
            'checkpoint:logicDescription':
                'Logic is the ability to reason, analyze information, and draw conclusions. It helps solve problems and make informed decisions.\n' +
                '\n' +
                'Logic is important for solving everyday problems such as budgeting, making decisions at work, analyzing information, and even participating in discussions.\n' +
                '\n' +
                'Logic can be developed by solving mathematical problems, participating in debates, studying chess and other strategic games, and completing logical puzzles.',
            'checkpoint:attentionDescription':
                'Attention is the ability to focus on a specific task while ignoring distractions. This cognitive ability is important because we use it daily.\n' +
                '\n' +
                'Attention is necessary for tasks that require concentration, such as driving, reading, working with documents, and attending meetings.\n' +
                '\n' +
                'Attention can be developed through meditation, concentration exercises such as reading comprehension, and games that require focus.',

            'thorndike:findNumbers': 'Find the following numbers:',

            'symbols:rememberSymbols': 'Remember these symbols',
            'symbols:fillCell': 'What symbol was in the cell?',
            'symbols:fillAllCells': 'Place symbols in cells',

            'numbers:rememberNumbers': 'Remember these numbers',
            'numbers:fillCell': 'What number was in the cell?',
            'numbers:fillAllCells': 'Place numbers in cells',

            'luria:timeToReproduce': 'Now you have to reproduce the words and symbols from the demonstrated set.',
            'luria:wasSymbolInTheSet?': 'Was this symbol in the previous set?',
            'luria:wasWordInTheSet?': 'Was this word in the previous set?',

            // Categories
            memory: 'Memory',
            logic: 'Logic',
            attention: 'Attention',
        },
    },
}));
