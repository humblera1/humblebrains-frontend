<template>
    <div :class="cellClasses" @click="store.handleCellOpening(number)">
        <div class="cell__inner" :style="innerStyles">
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
import type { MatrixCellProps } from '~/widgets/games/matrix/cell/matrix-cell.types';

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
            cell_hidden: store.isCellHidden(number),
        },
    ];
});

const backClasses = computed(() => {
    return [
        'cell__back',
        {
            cell__back_covered: store.coveredCells.includes(number),
            cell__back_success: store.showCorrectlyOpenedCell(number),
            cell__back_error: store.showIncorrectlyOpenedCell(number),
        },
    ];
});

const iconClasses = computed(() => {
    return [
        'cell__icon',
        {
            cell__icon_visible: store.isCellOpened(number) && !store.isCellCovered(number),
        },
    ];
});

const innerStyles = computed(() => {
    return store.isCellCovered(number) ? '' : 'transition: transform 350ms ease';
});

const iconStyles = computed(() => {
    return `transform: rotate(${0 - store.rotationDegree}deg)`;
});
</script>

<style scoped lang="scss" src="./matrix-cell.styles.scss"></style>
