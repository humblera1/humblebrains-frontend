<template>
    <div :class="cellClasses" @click="handleCellOpening(number)">
        <div class="cell__inner">
            <div class="cell__front" :style="frontStyles" />
            <div :class="backClasses">
                <div :class="iconClasses">
                    <IconGameSuccess v-show="showCorrectlyOpenedCell(number)" />
                    <IconGameError v-show="showIncorrectlyOpenedCell(number)" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useMatrixStore } from '~/stores/matrixStore';
import type { MatrixCellProps } from '~/widgets/game/matrix/cell/matrix-cell.types';

const { number } = defineProps<MatrixCellProps>();

const { handleCellOpening, isCellOpened, showCorrectlyOpenedCell, showIncorrectlyOpenedCell, showColorizedCell, getCellColor } =
    useMatrixStore();

const frontStyles = computed(() => {
    return showColorizedCell(number) ? `background-color: ${getCellColor(number)}` : '';
});

const cellClasses = computed(() => {
    return [
        'cell',
        {
            cell_opened: isCellOpened(number),
        },
    ];
});

const backClasses = computed(() => {
    return [
        'cell__back',
        {
            cell__back_success: showCorrectlyOpenedCell(number),
            cell__back_error: showIncorrectlyOpenedCell(number),
        },
    ];
});

const iconClasses = computed(() => {
    return [
        'cell__icon',
        {
            cell__icon_visible: isCellOpened(number),
        },
    ];
});
</script>

<style lang="scss" src="./matrix-cell.styles.scss"></style>
