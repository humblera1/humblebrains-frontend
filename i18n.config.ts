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
            ready: 'Готов',
            sectionInDevelopment: 'Раздел находится в разработке',
            goHome: 'На главную',
            currentProgram: 'Текущая программа',
            youAreHere: 'Вы здесь!',
            latestAssessment: 'Последняя оценка',
            sessionsToNextAssessment: 'Сессий до следующей оценки',
            programProgress: 'Прогресс в программе',
            sessionProgress: 'Прогресс в сессии',
            dragOrUploadFile: 'Перетащите изображение сюда или выберите файл для загрузки',
            uploading: 'Загрузка...',
            saveAfterEditing: 'Нажмите, когда будете готовы сохранить изменения',
            saving: 'Сохраняем...',
            select: 'Выбрать',
            save: 'Сохранить',
            completedProgramsAmount: 'Завершённых программ',
            name: 'Имя',
            email: 'Почта',
            birthday: 'Дата рождения',
            username: 'Логин',
            age: 'Возраст',
            changePassword: 'Сменить пароль',
            mo: 'Пн',
            tu: 'Вт',
            we: 'Ср',
            th: 'Чт',
            fr: 'Пт',
            sa: 'Сб',
            su: 'Вс',
            jan: 'Янв',
            feb: 'Фев',
            mar: 'Мар',
            apr: 'Апр',
            may: 'Май',
            jun: 'Июн',
            jul: 'Июл',
            aug: 'Авг',
            sep: 'Сен',
            oct: 'Окт',
            nov: 'Ноя',
            dec: 'Дек',

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
            instruction: 'Инструкция',
            preparingNextStep: 'Отлично! Готовим следующий этап...',

            'checkpoint:memoryDescription':
                'Память — это когнитивная функция, которая позволяет нам сохранять, удерживать и извлекать информацию. Она играет ключевую роль в обучении и повседневной жизни, помогая нам запоминать важные события, навыки и знания.\n' +
                'Память необходима для выполнения повседневных задач, таких как запоминание маршрута до работы, выполнение рабочих обязанностей, изучение нового материала и даже для общения с другими людьми.\n' +
                'Развивать память можно с помощью различных упражнений, таких как запоминание списков, изучение новых языков, решение головоломок и регулярные тренировки мозга.',
            'checkpoint:logicDescription':
                'Логика — это способность рассуждать, анализировать информацию и делать выводы. Она помогает решать проблемы и принимать обоснованные решения.\n' +
                'Логика важна для решения повседневных проблем, таких как планирование бюджета, принятие решений на работе, анализ информации и даже для участия в дискуссиях.\n' +
                'Развивать логику можно с помощью решения математических задач, участия в дебатах, изучения шахмат и других стратегических игр, а также выполнения логических головоломок.',
            'checkpoint:attentionDescription':
                'Внимание — это способность сосредотачиваться на определенной задаче, игнорируя отвлекающие факторы. Эта когнитивная способность имеет важное значение, потому что мы используем её ежедневно.\n' +
                'Внимание необходимо для выполнения задач, требующих концентрации, таких как вождение автомобиля, чтение, работа с документами и участие в совещаниях.\n' +
                'Развивать внимание можно с помощью медитации, выполнения упражнений на концентрацию, таких как чтение с пониманием, и игр, требующих сосредоточенности.',

            'points:openCells': 'Откройте все ячейки, где ранее находились точки',
            'points:instruction':
                'В следующем упражнении вам будет представлено игровое поле, состоящее из 16 клеток. \n' +
                'На первом этапе в произвольных клетках данного поля на короткое время появятся точки.\n' +
                'Вам необходимо внимательно рассмотреть демонстрируемое поле и постараться запомнить, сколько точек появилось на поле и в каких клетках они разместились.\n' +
                'На втором этапе вам предстоит воспроизвести расположение всех точек.\n' +
                'Чтобы отметить ячейку, в которой ранее находилась точка, просто нажмите на неё. Если вы передумаете оставлять отмеченную клетку, нажмите на неё ещё раз.\n' +
                'Может случиться, что Вы запомните, сколько точек было только что продемонстрировано, но не сможете вспомнить точное расположение некоторых из этих точек.\n' +
                'Например, вы помните, что на карточке было 8 точек, расположение 6 из них вы запомнили и отметили соответствующие клетки поля. Если вы не можете вспомнить, где находились остальные точки, просто нажимайте кнопку “Далее” и переходите к следующему раунду.\n' +
                'Готовы начать?',
            'gorbov-schulte:instruction':
                'В следующем упражнении вам будет представлена таблица с двумя наборами чисел. Каждый набор имеет свой цвет.\n' +
                'Ваша задача - как можно быстрее найти все числа одного цвета в возрастающей последовательности и другого - в убывающей, причем сделать это попеременно.\n' +
                'Например, на поле в случайном порядке будут размещены белые числа от 1 до 25 и синие числа от 1 до 24. Вы начинаете с возрастающей последовательности белых чисел и отмечаете белую клетку с цифрой 1. Теперь необходимо переключиться на синие числа в убывающей последовательности и найти синюю клетку с цифрой 24. И так далее, порядок открытия ячеек получится следующим: 1-белая, 24-синяя, 2-белая, 23-синяя, 3-белая…\n' +
                'На поле также будет вспомогательный виджет, информирующий о текущем правиле. Например, белая клеточка со стрелкой вверх означает возрастающую последовательность белых чисел, и наоборот: если вы видите синюю клетку со стрелочкой вниз, значит, вам необходимо найти синее число в убывающей последовательности.\n' +
                'Готовы начать?',

            'thorndike:findNumbers': 'Найдите следующие числа:',
            'thorndike:instruction':
                'В следующем упражнении вам будет продемонстрировано два набора трехзначных чисел. Числа из верхнего ряда - это набор эталонов, которые необходимо найти в числах нижнего ряда.\n' +
                'Ваша задача - отыскать все эталоны во втором наборе чисел так быстро, как сможете. Чтобы отметить найденное число, нажмите на него. Если вы случайно выберите число, которое отсутствует в эталоне, нажмите на него еще раз, чтобы отменить выбор.\n' +
                'Будьте внимательны, так как время прохождения теста ограничено.\n' +
                'Готовы начать?',

            'symbols:rememberSymbols': 'Запомните показанные символы',
            'symbols:fillCell': 'Какой символ находился в ячейке?',
            'symbols:fillAllCells': 'Расставьте символы по их ячейкам',
            'symbols:instruction':
                'В следующем упражнении вам будет продемонстрирован поле, в каждой клетке которого находится символ. За отведенное время, вам необходимо как можно лучше запомнить расположение символов в соответствующих ячейках поля.\n' +
                'На втором этапе символы исчезнут с поля, а вам будет дан некоторый набор символов. Все символы, присутствующие на поле, будут представлены в наборе, однако, набор также будет содержать несколько лишних символов, которых на поле не было.\n' +
                'Ваша задача - расставить все символы по их ячейкам. Если вы не помните, какой символ находился в ячейке, вы можете оставить ячейку пустой. Также вы сможете отменить или поменять свой выбор.\n' +
                'Готовы начать?',

            'numbers:rememberNumbers': 'Запомните показанные числа',
            'numbers:fillCell': 'Какое число находилось в ячейке?',
            'numbers:fillAllCells': 'Расставьте числа по их ячейкам',
            'numbers:instruction':
                'В следующем упражнении вам будет продемонстрирован поле, в каждой клетке которого находится двухзначное число. За отведенное время, вам необходимо как можно лучше запомнить расположение чисел в соответствующих ячейках поля.\n' +
                'На втором этапе числа исчезнут с поля, а вам будет дан некоторый набор двухзначных чисел. Все числа, присутствующие на поле, будут представлены в наборе, однако, набор также будет содержать несколько лишних чисел, которых на поле не было.\n' +
                'Ваша задача - расставить все числа по их ячейкам. Если вы не помните, какое число находилось в ячейке, вы можете оставить ячейку пустой. Также вы сможете отменить или поменять свой выбор.\n' +
                'Готовы начать?',

            'luria:timeToReproduce': 'Теперь вам предстоит воспроизвести слова и символы из продемонстрированного набора.',
            'luria:wasSymbolInTheSet?': 'Символ был в предыдущем наборе?',
            'luria:wasWordInTheSet?': 'Слово было в предыдущем наборе?',
            'luria:instruction':
                'Следующее упражнение представлено двумя этапами. На первом этапе вам будет продемонстрирован набор карточек, на каждой из которых записано слово или нарисован случайный символ. Карточки будут демонстрироваться последовательно, одна за другой.\n' +
                'Вам необходимо запомнить как можно больше продемонстрированных карточек.\n' +
                'На втором этапе вам будет продемонстрирован другой набор карточек. Ваша задача заключается в следующем: для каждой карточки из второго набора необходимо определить, встречалась ли она вам раннее в первом наборе.\n' +
                'Готовы начать?',

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
            ready: 'Ready',
            sectionInDevelopment: 'Section is under development',
            goHome: 'Home',
            currentProgram: 'Current program',
            youAreHere: 'You are here!',
            latestAssessment: 'Latest assessment',
            sessionsToNextAssessment: 'Sessions to next assessment',
            programProgress: 'Program progress',
            sessionProgress: 'Session progress',
            dragOrUploadFile: 'Drag the image here or select a file to upload',
            uploading: 'Uploading...',
            saveAfterEditing: 'Click when you are ready to save changes',
            saving: 'Saving...',
            select: 'Select',
            save: 'Save',
            completedProgramsAmount: 'Programs completed',
            name: 'Name',
            email: 'Email',
            birthday: 'Birthday',
            username: 'Login',
            changePassword: 'Change password',
            age: 'Age',
            mo: 'Mo',
            tu: 'Tu',
            we: 'We',
            th: 'Th',
            fr: 'Fr',
            sa: 'Sa',
            su: 'Su',
            jan: 'Jan',
            feb: 'Feb',
            mar: 'Mar',
            apr: 'Apr',
            may: 'May',
            jun: 'Jun',
            jul: 'Jul',
            aug: 'Aug',
            sep: 'Sep',
            oct: 'Oct',
            nov: 'Nov',
            dec: 'Dec',

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
            instruction: 'Instructions',
            preparingNextStep: '',

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
                'Memory is essential for performing daily tasks such as remembering the route to work, fulfilling job responsibilities, learning new material, and even communicating with others.\n' +
                'Memory can be developed through various exercises such as memorizing lists, learning new languages, solving puzzles, and regular brain training.',
            'checkpoint:logicDescription':
                'Logic is the ability to reason, analyze information, and draw conclusions. It helps solve problems and make informed decisions.\n' +
                'Logic is important for solving everyday problems such as budgeting, making decisions at work, analyzing information, and even participating in discussions.\n' +
                'Logic can be developed by solving mathematical problems, participating in debates, studying chess and other strategic games, and completing logical puzzles.',
            'checkpoint:attentionDescription':
                'Attention is the ability to focus on a specific task while ignoring distractions. This cognitive ability is important because we use it daily.\n' +
                'Attention is necessary for tasks that require concentration, such as driving, reading, working with documents, and attending meetings.\n' +
                'Attention can be developed through meditation, concentration exercises such as reading comprehension, and games that require focus.',

            'points:openCells': 'Open all cells where points were located',
            'points:instruction':
                'In the next exercise, you will be presented with a game board consisting of 16 cells.\n' +
                'In the first stage, dots will appear in random cells of this board for a short time.\n' +
                'You need to carefully observe the displayed board and try to remember how many dots appeared on the board and in which cells they were placed.\n' +
                'In the second stage, you will need to reproduce the placement of all the dots.\n' +
                'To mark a cell where a dot was previously located, simply click on it. If you change your mind about leaving a marked cell, click on it again.\n' +
                'It may happen that you remember how many dots were just demonstrated, but cannot recall the exact location of some of these dots.\n' +
                'For example, you remember that there were 8 dots on the card, you remembered the location of 6 of them and marked the corresponding cells on the board. If you cannot remember where the remaining dots were, just click the "Next" button and move on to the next round.\n' +
                'Ready to start?',
            'gorbov-schulte:instruction':
                'In the next exercise, you will be presented with a table containing two sets of numbers. Each set has its own color.\n' +
                'Your task is to find all the numbers of one color in ascending order and the other in descending order as quickly as possible, alternating between them.\n' +
                'For example, white numbers from 1 to 25 and blue numbers from 1 to 24 will be placed randomly on the field. You start with the ascending sequence of white numbers and mark the white cell with the number 1. Now you need to switch to the blue numbers in descending order and find the blue cell with the number 24. And so on, the order of opening cells will be as follows: 1-white, 24-blue, 2-white, 23-blue, 3-white...\n' +
                'There will also be an auxiliary widget on the field, informing you of the current rule. For example, a white cell with an upward arrow indicates an ascending sequence of white numbers, and vice versa: if you see a blue cell with a downward arrow, you need to find a blue number in descending order.\n' +
                'Ready to start?',

            'thorndike:findNumbers': 'Find the following numbers:',
            'thorndike:instruction':
                'In the next exercise, you will be shown two sets of three-digit numbers. The numbers in the top row are the reference set that you need to find in the numbers of the bottom row.\n' +
                'Your task is to locate all the reference numbers in the second set as quickly as you can. To mark a found number, click on it. If you accidentally select a number that is not in the reference set, click on it again to deselect it.\n' +
                'Be attentive, as the time to complete the test is limited.\n' +
                'Ready to start?',

            'symbols:rememberSymbols': 'Remember these symbols',
            'symbols:fillCell': 'What symbol was in the cell?',
            'symbols:fillAllCells': 'Place symbols in cells',
            'symbols:instruction':
                'In the next exercise, you will be shown a grid where each cell contains a symbol. Within the allotted time, you need to memorize the placement of the symbols in the corresponding cells of the grid as best as you can.\n' +
                'In the second stage, the symbols will disappear from the grid, and you will be given a set of symbols. All the symbols that were present on the grid will be included in the set, but the set will also contain a few extra symbols that were not on the grid.\n' +
                'Your task is to place all the symbols back into their cells. If you do not remember which symbol was in a cell, you can leave the cell empty. You will also be able to undo or change your selection.\n' +
                'Ready to start?',

            'numbers:rememberNumbers': 'Remember these numbers',
            'numbers:fillCell': 'What number was in the cell?',
            'numbers:fillAllCells': 'Place numbers in cells',
            'numbers:instruction':
                'In the next exercise, you will be shown a grid where each cell contains a two-digit number. Within the allotted time, you need to memorize the placement of the numbers in the corresponding cells of the grid as best as you can.\n' +
                'In the second stage, the numbers will disappear from the grid, and you will be given a set of two-digit numbers. All the numbers that were present on the grid will be included in the set, but the set will also contain a few extra numbers that were not on the grid.\n' +
                'Your task is to place all the numbers back into their cells. If you do not remember which number was in a cell, you can leave the cell empty. You will also be able to undo or change your selection.\n' +
                'Ready to start?',

            'luria:timeToReproduce': 'Now you have to reproduce the words and symbols from the demonstrated set.',
            'luria:wasSymbolInTheSet?': 'Was this symbol in the previous set?',
            'luria:wasWordInTheSet?': 'Was this word in the previous set?',
            'luria:instruction':
                'The next exercise consists of two stages. In the first stage, you will be shown a set of cards, each containing a word or a random symbol. The cards will be displayed sequentially, one after another.\n' +
                'You need to remember as many of the displayed cards as possible.\n' +
                'In the second stage, you will be shown a different set of cards. Your task is to determine whether each card from the second set was previously encountered in the first set.\n' +
                'Ready to start?',

            // Categories
            memory: 'Memory',
            logic: 'Logic',
            attention: 'Attention',
        },
    },
}));
