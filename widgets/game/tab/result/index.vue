<template>
    <div class="result">
        <template v-if="game.gameData.successfullySaved">
            <header class="result__header">
                <h1 class="title">{{ $t('gameCompleted') }}</h1>
                <div class="result__score">
                    <IconStar />
                    <p>{{ $t('score') + ': ' + score }}</p>
                </div>
            </header>
            <div class="result__body">
                <section class="result__games">
                    <WidgetGameTabResultCard :title="game.gameName" :score="score" :image="game.image" />
                    <WidgetGameTabResultCard
                        v-if="nextSessionGame"
                        :title="nextSessionGame.game.label"
                        :current="nextSessionGame.game.userLevel"
                        :max="nextSessionGame.game.maxLevel"
                        :image="nextSessionGame.game.image"
                    />
                </section>
                <section class="result__section" :class="achievementsClass" @animationend="handleAchievementsAnimationEnd">
                    <h2 class="result__subtitle">{{ $t('totalAchievements') }}</h2>
                    <WidgetGameTabResultAchievements @rendered="handleAchievementsRendered" />
                </section>
                <section class="result__section" :class="statisticsClass">
                    <h2 class="result__subtitle">{{ $t('gameStatistics') }}</h2>
                    <WidgetGameTabResultStatistics />
                </section>
            </div>
        </template>
        <template v-else>
            <div class="result__error">
                <IconExclamationTriangle class="result__exclamation" />
                <p class="result__error-message">
                    {{ $t('gameSavingError') }}
                </p>
                <UiButton @click="resendResults">
                    <template #leading>
                        <IconRepeat />
                    </template>
                    {{ $t('repeat') }}
                </UiButton>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
import { WidgetModalCompletion } from '#components';
import { CompletionModalTypeEnum } from '~/entities/enums/games/CompletionModalTypeEnum';
import { useUserStore } from '~/modules/user/stores/userStore';
import type { ISessionGame } from '~/entities/interfaces/session/ISessionGame';

const game = useGameStore();
const service = useGameService();
const user = useUserStore();

const { openModal } = useHumbleModal();

const isAchievementsVisible = ref<boolean>(false);
const isStatisticsVisible = ref<boolean>(false);

const nextSessionGame = computed((): undefined | ISessionGame => {
    const session = user.program?.currentSession;

    if (session && !session.isCompleted) {
        return session.games.find((game) => !game.isCompleted);
    }
});

const score = computed((): number => {
    return game.gameData?.results?.score ?? 0;
});

const achievementsClass = computed((): string => {
    return isAchievementsVisible.value ? 'result__section_bordered' : '';
});

const statisticsClass = computed((): string => {
    return isStatisticsVisible.value ? 'result__section_bordered' : 'result__section_hidden';
});

const handleAchievementsRendered = () => {
    isAchievementsVisible.value = true;
};

const resendResults = async () => {
    try {
        if (game.gameData.results) {
            await service.saveResults(game.gameData.results);
        }

        game.gameData.successfullySaved = true;
    } catch (error) {
        game.gameData.successfullySaved = false;
    }
};

const handleAchievementsAnimationEnd = () => {
    isStatisticsVisible.value = true;

    if (game.gameData.hasGameCompletedSession) {
        setTimeout(() => {
            openModal(WidgetModalCompletion, { type: CompletionModalTypeEnum.session });
        }, 5000);
    } else if (game.gameData.hasGameCompletedProgram) {
        setTimeout(() => {
            openModal(WidgetModalCompletion, { type: CompletionModalTypeEnum.program });
        }, 5000);
    }
};
</script>

<style scoped lang="scss" src="./game-result.styles.scss" />
