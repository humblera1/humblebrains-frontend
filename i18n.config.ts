export default defineI18nConfig(() => ({
    legacy: false,
    locale: 'ru',
    messages: {
        ru: {
            signUp: 'Регистрация',
            signIn: 'Вход',
            pause: 'Пауза',

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

            // Categories
            memory: 'Память',
            logic: 'Логика',
            attention: 'Внимание',
        },
        en: {
            signUp: 'Sign Up',
            signIn: 'Sign In',
            pause: 'Pause',

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

            // Categories
            memory: 'Memory',
            logic: 'Logic',
            attention: 'Attention',
        },
    },
}));
