<template>
    <div class="cell">
        {{ number }}
    </div>
</template>

<script setup lang="ts">
import type { NumbersCellProps } from '~/modules/checkpoint/widgets/memory/numbers/cell/numbers-cell.types';

defineProps<NumbersCellProps>();
</script>

<style scoped lang="scss">
.cell {
}
</style>
