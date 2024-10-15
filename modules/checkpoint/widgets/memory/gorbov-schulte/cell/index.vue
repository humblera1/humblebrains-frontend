<template>
    <div :class="cellClasses" @click="gorbovSchulte.handleCellOpening(number)">
        <div class="cell__badge" />
        <p class="cell__number">
            {{ gorbovSchulte.getCellIndex(number) }}
        </p>
    </div>
</template>

<script setup lang="ts">
import type { gorbovSchulteCellProps } from '~/modules/checkpoint/widgets/memory/gorbov-schulte/cell/gorbov-schulte-cell.types';
import { useGorbovSchulteStore } from '~/modules/checkpoint/stores/memory/gorbovSchulteStore';

const { number } = defineProps<gorbovSchulteCellProps>();

const gorbovSchulte = useGorbovSchulteStore();

const cellClasses = computed(() => {
    return [
        'cell',
        `cell_${gorbovSchulte.getCellType(number)}`,
        {
            cell_hidden: gorbovSchulte.isCellHidden(number),
        },
    ];
});
</script>

<style scoped lang="scss">
.cell {
    position: relative;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 1;
    visibility: visible;
    transition: all 250ms ease;

    &:hover {
        .cell__badge {
            opacity: 0.7;
        }
    }

    &__badge {
        width: 60px;
        min-width: 60px;
        aspect-ratio: 1;
        border-radius: 12px;
        background-color: var(--badge-bg);

        transition: opacity 250ms ease;

        @include boxShadow(-5, 5, 5, 0, var(--main-shadow));
    }

    &__number {
        z-index: 11;
        position: absolute;

        transition: color 250ms ease;

        @include mainFont(500, 20, var(--primary-subtitle));
    }

    &_primary {
        &:hover {
            .cell__number {
                color: var(--primary-title);
            }
        }
    }

    &_secondary {
        .cell__badge {
            background-color: var(--gs-secondary-bg);
        }

        .cell__number {
            color: var(--gs-secondary-text);
        }

        &:hover {
            .cell__badge {
                opacity: 0.85;
            }

            .cell__number {
                color: var(--gs-secondary-text-hovered);
            }
        }
    }

    &_hidden {
        opacity: 0;
        visibility: hidden;
    }
}
</style>
