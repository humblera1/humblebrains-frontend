<template>
    <div :class="cellClasses">
        <div class="cell__badge" />
        <p class="cell__number">
            {{ number }}
        </p>
    </div>
</template>

<script setup lang="ts">
import type { gorbovSchulteCellProps } from '~/modules/checkpoint/widgets/memory/gorbov-schulte/cell/gorbov-schulte-cell.types';

defineProps<gorbovSchulteCellProps>();

const cellClasses = computed(() => {
    return [
        'cell',
        {
            cell_primary: false,
            cell_secondary: true,
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
    transition: all 250ms ease;

    &:hover {
        .cell__badge {
            opacity: 0.75;
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
                color: red;
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
                opacity: 0.95;
            }

            .cell__number {
                color: var(--gs-secondary-text-hovered);
            }
        }
    }
}
</style>
