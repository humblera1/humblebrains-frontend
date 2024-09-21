<template>
    <div :class="cellClasses" @click="store.handleCellOpening(number)">
        <div class="cell__inner">
            <div class="cell__front" :style="frontStyles" />
            <div :class="backClasses">
                <div :class="iconClasses" :style="iconStyles">
                    <IconGameSuccess v-show="store.showCorrectlyOpenedCell(number)" />
                    <IconGameError v-show="store.showIncorrectlyOpenedCell(number)" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useMatrixStore } from '~/stores/matrixStore';
import type { MatrixCellProps } from '~/widgets/game/matrix/cell/matrix-cell.types';

const { number } = defineProps<MatrixCellProps>();

const store = useMatrixStore();

const frontStyles = computed(() => {
    return store.showColorizedCell(number) ? `background-color: ${store.getCellColor(number)}` : '';
});

const cellClasses = computed(() => {
    return [
        'cell',
        {
            cell_opened: store.isCellOpened(number),
        },
    ];
});

const backClasses = computed(() => {
    return [
        'cell__back',
        {
            cell__back_success: store.showCorrectlyOpenedCell(number),
            cell__back_error: store.showIncorrectlyOpenedCell(number),
        },
    ];
});

const iconClasses = computed(() => {
    return [
        'cell__icon',
        {
            cell__icon_visible: store.isCellOpened(number),
        },
    ];
});

const iconStyles = computed(() => {
    return `transform: rotate(${0 - store.rotationDegree}deg)`;
});
</script>

<style lang="scss" src="./matrix-cell.styles.scss"></style>
