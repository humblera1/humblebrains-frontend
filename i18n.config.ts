export default defineI18nConfig(() => ({
    legacy: false,
    locale: 'ru',
    messages: {
        ru: {
            signUp: 'Регистрация',
            signIn: 'Вход',

            // Sidebar:
            home: 'Главная',
            profile: 'Профиль',
            games: 'Игры',
            settings: 'Настройки',

            gamesList: 'Список упражнений',

            usermail: 'Имя пользователя или почта',
            password: 'Пароль',

            // Games
            levelDown: 'Уровень понижен',
            levelUp: 'Новый уровень!',

            // Matrix
            remember: 'Запомнил',
        },
        en: {
            signUp: 'Sign Up',
            signIn: 'Sign In',

            // Sidebar:
            home: 'Home',
            profile: 'Profile',
            games: 'Games',
            settings: 'Settings',

            gamesList: 'Games List',

            usermail: 'Username or E-mail',
            password: 'Password',

            // Games
            levelDown: 'Your level is down',
            levelUp: 'Level Up!',

            // Matrix
            remember: 'Remember',
        },
    },
}));
