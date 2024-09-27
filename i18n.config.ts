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

            // Matrix
            remember: 'Remember',
        },
    },
}));
