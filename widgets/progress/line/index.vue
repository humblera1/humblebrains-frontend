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
        return ++index < 2;
        // return ++index < user.program.completedSessionsAmount;
    }

    return false;
};

const isFinal = (index: number): boolean => {
    if (user.program) {
        return ++index === 3;
        // return ++index === user.program.sessionsAmount;
    }

    return false;
};

const isActive = (index: number): boolean => {
    if (user.program) {
        return index === 1;
        // return index === user.program.completedSessionsAmount;
    }

    return false;
};
</script>

<style scoped lang="scss">
.progress-line {
    display: flex;
    justify-content: center;

    &__container {
        position: relative;
        display: flex;
        align-items: center;
    }

    &__item {
        position: relative;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 80px;
        height: 80px;
        border-radius: 100px;
        background-color: var(--blue-badge);
        color: var(--primary-subtitle);

        &_completed {
            background-color: var(--blue);
            color: var(--accent-white);
        }

        &_active {
            position: relative;
            width: 90px;
            height: 90px;
            background-color: transparent;
            color: var(--accent-white);
            border: 3px solid var(--blue);
        }

        svg {
            width: 28px;
            height: 20px;
        }
    }

    &__inner {
        position: absolute;
        top: 50%;
        left: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 75px;
        height: 75px;
        transform: translate(-50%, -50%);
        border-radius: 100px;
        background-color: var(--blue);
    }

    &__connector {
        width: 48px;
        height: 3px;
        background-color: var(--blue-badge);

        &_active {
            background-color: var(--blue);
        }
    }

    &-node {
        z-index: 10;
        position: absolute;
        top: 50%;
        width: 15px;
        height: 15px;
        border-radius: 100px;
        background-color: var(--primary-bg);
        transform: translate(-50%, -50%);

        &__content {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 10px;
            height: 10px;
            border-radius: 100px;
            background-color: var(--blue-badge);
            transform: translate(-50%, -50%);

            &_active {
                background-color: var(--blue);
            }
        }

        &_left {
            left: 0;
        }

        &_right {
            left: 100%;
        }
    }
}
</style>
