<template>
    <div :class="cellClasses" @click="matrix.handleCellOpening(number)">
        <div class="cell__inner" :style="innerStyles">
            <div class="cell__front" :style="frontStyles">
                <span v-show="showCellFrontNumber" :style="iconStyles">
                    {{ cellOrderedNumber }}
                </span>
            </div>
            <div :class="backClasses">
                <div :class="iconClasses" :style="iconStyles">
                    <template v-if="matrix.showCorrectlyOpenedCell(number)">
                        <span v-if="cellOrderedNumber !== -1"> {{ cellOrderedNumber }} </span>
                        <IconGameSuccess v-else />
                    </template>
                    <IconGameError v-else-if="matrix.showIncorrectlyOpenedCell(number)" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { MatrixCellProps } from '~/widgets/games/matrix/cell/matrix-cell.types';

const { number } = defineProps<MatrixCellProps>();

const game = useGameStore();
const matrix = useMatrixStore();

const frontStyles = computed(() => {
    return matrix.showColorizedCell(number) ? `background-color: ${matrix.getCellColor(number)}` : '';
});

const cellOrderedNumber = computed((): number => {
    return matrix.getCellOrder(number);
});

const showCellFrontNumber = computed((): boolean => {
    if (game.isInContemplationState() || game.isInRoundPreparingState()) {
        return cellOrderedNumber.value !== -1;
    }

    return false;
});

const cellClasses = computed(() => {
    return [
        'cell',
        {
            cell_opened: matrix.isCellOpened(number),
            cell_hidden: matrix.isCellHidden(number),
        },
    ];
});

const backClasses = computed(() => {
    return [
        'cell__back',
        {
            cell__back_covered: matrix.coveredCells.includes(number),
            cell__back_success: matrix.showCorrectlyOpenedCell(number),
            cell__back_error: matrix.showIncorrectlyOpenedCell(number),
        },
    ];
});

const iconClasses = computed(() => {
    return [
        'cell__icon',
        {
            cell__icon_visible: matrix.isCellOpened(number) && !matrix.isCellCovered(number),
        },
    ];
});

const innerStyles = computed(() => {
    return matrix.isCellCovered(number) ? '' : 'transition: transform 350ms ease';
});

const iconStyles = computed(() => {
    return `transform: rotate(${0 - matrix.rotationDegree}deg)`;
});
</script>

<style scoped lang="scss" src="./matrix-cell.styles.scss"></style>
