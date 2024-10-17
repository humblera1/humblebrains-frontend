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

<style scoped lang="scss" src="./gorbov-schulte-cell.scss" />
