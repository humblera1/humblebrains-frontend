<template>
    <div class="total-achievement">
        <div class="total-achievement__badge" :class="badgeClass">
            <div class="total-achievement__icon">
                <component :is="achievementIcon" />
            </div>
        </div>
        <p class="total-achievement__text">
            {{ text }}
        </p>
    </div>
</template>

<script setup lang="ts">
import type { GameUiTotalAchievementProps } from '~/widgets/game/ui/total-achievement/game-ui-total-achievement.types';
import { TotalAchievementEnum } from '~/entities/enums/games/TotalAchievementEnum';
import { IconAchievementChart, IconAchievementCup, IconAchievementStar, IconAchievementFinishingFlag } from '#components';

const { type } = defineProps<GameUiTotalAchievementProps>();

const achievementIcon = computed((): Component => {
    switch (type) {
        case TotalAchievementEnum.openedLevel:
            return IconAchievementStar;
        case TotalAchievementEnum.gamesPlayed:
            return IconAchievementCup;
        case TotalAchievementEnum.lowerScorePercentage:
            return IconAchievementChart;
        default:
            return IconAchievementFinishingFlag;
    }
});

const badgeClass = computed((): string => {
    switch (type) {
        case TotalAchievementEnum.openedLevel:
            return 'ocher ocher-bg';
        case TotalAchievementEnum.gamesPlayed:
            return 'pink pink-bg';
        case TotalAchievementEnum.lowerScorePercentage:
            return 'violet violet-bg';
        default:
            return 'blue blue-bg';
    }
});
</script>

<style scoped lang="scss" src="./game-ui-total-achievement.styles.scss" />
