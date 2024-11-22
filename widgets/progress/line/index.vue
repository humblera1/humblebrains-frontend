<template>
    <div class="progress-line">
        <template v-if="user.program">
            <div v-for="(item, index) of user.program.sessionsAmount" :key="index" class="progress-line__container">
                <div class="progress-line__item" :class="`progress-line__item_${getItemType(index)}`">
                    <div v-if="index !== 0" class="progress-line-node progress-line-node_left">
                        <div
                            class="progress-line-node__content"
                            :class="{ 'progress-line-node__content_active': isCompleted(index) || isActive(index) }"
                        />
                    </div>
                    <template v-if="isCompleted(index)">
                        <IconGameCheck />
                    </template>
                    <template v-else-if="isFinal(index)">
                        <IconFinishingFlag />
                    </template>
                    <template v-else-if="isActive(index)">
                        <div class="progress-line__inner">
                            <span>{{ progress }}</span>
                        </div>
                    </template>
                    <template v-else> 0% </template>
                    <div v-if="index + 1 !== user.program.sessionsAmount" class="progress-line-node progress-line-node_right">
                        <div
                            class="progress-line-node__content"
                            :class="{ 'progress-line-node__content_active': isCompleted(index) || isActive(index) }"
                        />
                    </div>
                </div>
                <div
                    v-if="index + 1 !== user.program.sessionsAmount"
                    class="progress-line__connector"
                    :class="{ 'progress-line__connector_active': isCompleted(index) || isActive(index + 1) }"
                />
                <div class="progress-line__footer">
                    <span v-if="isActive(index)" class="progress-line__title">{{ $t('youAreHere') }}</span>
                </div>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
import { useUserStore } from '~/modules/user/stores/userStore';

const user = useUserStore();

const progress = computed((): string => {
    let percent = 0;

    if (user.program && user.program.currentSession) {
        const gamesAmount = user.program.currentSession.games.length;
        const completedGamesAmount = user.program.currentSession.games.filter((game) => game.isCompleted).length;

        percent = Math.round((completedGamesAmount / gamesAmount) * 100);
    }

    return `${percent}%`;
});

const getItemType = (index: number): string => {
    switch (true) {
        case isCompleted(index):
            return 'completed';
        case isActive(index):
            return 'active';
        case isFinal(index):
            return 'final';
        default:
            return 'uncompleted';
    }
};

const isCompleted = (index: number): boolean => {
    if (user.program) {
        return ++index < user.program.completedSessionsAmount;
    }

    return false;
};

const isFinal = (index: number): boolean => {
    if (user.program) {
        return ++index === user.program.sessionsAmount;
    }

    return false;
};

const isActive = (index: number): boolean => {
    if (user.program) {
        return index === user.program.completedSessionsAmount;
    }

    return false;
};
</script>

<style scoped lang="scss" src="./progress-line.styles.scss" />
