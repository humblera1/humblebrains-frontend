<template>
    <div :class="cellClasses" @click="store.handleCellOpening(number)">
        <div class="cell__inner">
            <div class="cell__front">
                <div :class="pointClasses" />
            </div>
            <div class="cell__back" />
        </div>
    </div>
</template>

<script setup lang="ts">
import type { PointsCellProps } from '~/modules/checkpoint/widgets/memory/points/cell/points-cell.types';
import { usePointsStore } from '~/modules/checkpoint/stores/memory/piontsStore';

const { number } = defineProps<PointsCellProps>();

const store = usePointsStore();

const cellClasses = computed(() => {
    return [
        'cell',
        {
            cell_opened: store.isCellOpened(number),
            cell_hidden: store.isCellsHidden,
        },
    ];
});

const pointClasses = computed(() => {
    return [
        'cell__point',
        {
            cell__point_visible: store.isPointVisible(number),
        },
    ];
});
</script>

<style scoped lang="scss">
.cell {
    width: 65px;
    height: 65px;
    border-radius: 16px;
    opacity: 1;
    transition: opacity 0.5s ease;

    &__inner {
        width: 100%;
        height: 100%;
        transition: transform 200ms;
        transform-style: preserve-3d;
        position: relative;
    }

    &__front,
    &__back {
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        position: absolute;
        backface-visibility: hidden;
        border-radius: 16px;
        font-size: 24px;
        color: white;

        &:hover {
            background-color: var(--matrix-cell-hovered);
        }
    }

    &__front {
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: var(--matrix-cell);
        transition: background-color 100ms ease-in-out;
    }

    &__back {
        transform: rotateY(180deg);
        background-color: var(--points-cell-opened);

        &:hover {
            background-color: var(--points-cell-opened);
        }
    }

    &__point {
        width: 15px;
        height: 15px;
        border-radius: 50%;
        background-color: var(--primary-title);
        opacity: 0;
        visibility: hidden;

        &_visible {
            opacity: 1;
            visibility: visible;
        }
    }

    &_opened {
        .cell__inner {
            transform: rotateY(180deg);
        }
    }

    &_hidden {
        opacity: 0;
    }
}
</style>
