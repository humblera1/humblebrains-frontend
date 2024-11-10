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

            // Matrix
            remember: 'Запомнил',

            // Tests
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

            // Matrix
            remember: 'Remember',

            // Tests
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
