<template>
    <div class="achievement">
        <div class="achievement__badge" :class="badgeClass">
            <div class="achievement__icon">
                <component :is="achievementIcon" />
            </div>
        </div>
        <p class="achievement__text">
            {{ text }}
        </p>
    </div>
</template>

<script setup lang="ts">
import {
    IconAchievementChart,
    IconAchievementCup,
    IconAchievementStar,
    IconAchievementFinishingFlag,
    IconAchievementArrowUp,
    IconAchievementWreath,
    IconAchievementTarget,
} from '#components';
import { AchievementEnum } from '~/entities/enums/games/AchievementEnum';
import type { GameUiAchievementProps } from '~/widgets/game/ui/achievement/game-ui-achievement.types';

const { type } = defineProps<GameUiAchievementProps>();

const achievementIcon = computed((): Component => {
    switch (type) {
        case AchievementEnum.NewLevelUnlocked:
            return IconAchievementArrowUp;
        case AchievementEnum.MaxLevelUnlocked:
            return IconAchievementWreath;
        case AchievementEnum.LowerScorePercentage:
            return IconAchievementChart;
        case AchievementEnum.NewRecord:
            return IconAchievementCup;
        case AchievementEnum.NoMistakes:
            return IconAchievementTarget;
        case AchievementEnum.GamesPlayed:
            return IconAchievementFinishingFlag;

        default:
            return IconAchievementStar;
    }
});

const badgeClass = computed((): string => {
    switch (type) {
        case AchievementEnum.NewLevelUnlocked:
            return 'pink pink-bg';
        case AchievementEnum.MaxLevelUnlocked:
            return 'green green-bg';
        case AchievementEnum.LowerScorePercentage:
            return 'cyan cyan-bg';
        case AchievementEnum.NewRecord:
            return 'violet violet-bg';
        case AchievementEnum.NoMistakes:
            return 'purple purple-bg';
        case AchievementEnum.GamesPlayed:
            return 'iris iris-bg';
        default:
            return 'ocher ocher-bg';
    }
});
</script>

<style scoped lang="scss" src="./game-ui-achievement.styles.scss" />
