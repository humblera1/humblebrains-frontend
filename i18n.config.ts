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
            levelDown: 'Уровень понижен',
            levelUp: 'Новый уровень!',
            showRules: 'Показать обучение',
            quit: 'Выйти',
            continue: 'Продолжить',
            warmUp: 'Разминка',
            ok: 'Ок',

            // Matrix
            remember: 'Запомнил',

            // Tests
            checkpoint: 'Контрольная точка',
            step: 'Шаг',
            warmUpPrompt: 'Вам будет представлено несколько разминочных раундов',
            gameStartPrompt: 'Теперь играем серьезно',
            warmUpCompleted: 'Разминка завершена!',
            remembered: 'Запомнил!',

            'thorndike:findNumbers': 'Найдите следующие числа:',

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
            levelDown: 'Your level is down',
            levelUp: 'Level Up!',
            showRules: 'Show rules',
            quit: 'Quit',
            continue: 'Continue',
            warmUp: 'Warming-Up',
            ok: 'Ok',

            // Matrix
            remember: 'Remember',

            // Tests
            checkpoint: 'Checkpoint',
            step: 'Step',
            warmUpPrompt: '',
            gameStartPrompt: '',
            warmUpCompleted: 'Warm-up completed!',
            remembered: 'Remembered!',

            'thorndike:findNumbers': 'Find the following numbers:',
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
