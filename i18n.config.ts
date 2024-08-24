export default defineI18nConfig(() => ({
    legacy: false,
    locale: 'ru',
    messages: {
        ru: {
            signUp: 'Регистрация',
            signIn: 'Вход',
            gamesList: 'Список упражнений',
        },
        en: {
            signUp: 'Sign Up',
            signIn: 'Sign In',
            gamesList: 'Games List',
        },
    },
}));
