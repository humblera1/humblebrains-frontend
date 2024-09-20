<template>
    <div :class="cellClasses" @click="store.handleCellOpening(number)">
        <div class="cell__inner">
            <div class="cell__front" :style="frontStyles" />
            <div :class="backClasses">
                <div :class="iconClass">
                    <IconGameSuccess v-show="showCorrectCell" />
                    <IconGameError v-show="showWrongCell" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useMatrixStore } from '~/stores/matrixStore';

const { number } = defineProps<{ number: number }>();

const store = useMatrixStore();

// Открыта ли текущая ячейка пользователем
const isCellOpened = computed(() => {
    return store.isCellOpened(number);
});

// Является ли текущая ячейка верным ответом
const isCellCorrect = computed((): boolean => {
    return store.isCellCorrect(number);
});

// Стоит ли показывать правильный ответ: да, если правильная ячейка открыта пользователем
const showCorrectCell = computed((): boolean => {
    return isCellOpened.value && isCellCorrect.value;
});

// Стоит ли показывать правильный ответ: да, если неправильная ячейка открыта пользователем
const showWrongCell = computed((): boolean => {
    return isCellOpened.value && !isCellCorrect.value;
});

const cellClasses = computed(() => {
    return [
        'cell',
        {
            cell_opened: isCellOpened.value,
        },
    ];
});

const frontStyles = computed(() => {
    return store.showColorizedCell(number) ? `background-color: ${store.getCellColor(number)}` : '';
})

const backClasses = computed(() => {
    return [
        'cell__back',
        {
            cell__back_success: showCorrectCell.value,
            cell__back_error: showWrongCell.value,
        },
    ];
});

const iconClass = computed(() => {
    return [
        'cell__icon',
        {
            cell__icon_visible: isCellOpened.value,
        },
    ];
});
</script>

<style lang="scss">
.cell {
    aspect-ratio: 1/ 1;
    perspective: 1000px;
    overflow: hidden;
    //background-color: var(--matrix-cell);
    transition: color 1000ms linear;

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
        //transition: background-color 200ms ease-in-out;

        &:hover {
            background-color: var(--matrix-cell-hovered);
        }
    }

    &__front {
        background-color: var(--matrix-cell);
        transition: background-color 100ms ease-in-out;

        //&_colorized {
        //    background-color: coral;
        //}
    }

    &__back {
        transform: rotateY(180deg);
        &_success {
            background-color: var(--matrix-cell-valid);

            &:hover {
                background-color: var(--matrix-cell-valid);
            }
        }

        &_error {
            background-color: var(--matrix-cell-invalid);

            &:hover {
                background-color: var(--matrix-cell-invalid);
            }
        }
    }

    &_opened {
        .cell__inner {
            transform: rotateY(180deg);
        }
    }

    &__icon {
        visibility: hidden;
        opacity: 0;

        &_visible {
            visibility: visible;
            opacity: 1;
        }
    }
}
</style>
