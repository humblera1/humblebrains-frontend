<template>
    <div class="numbers">
        <WidgetCheckpointMemoryNumbersCell v-for="number in numbers.visibleNumbers" :key="number" :number="number" />
    </div>
</template>

<script setup lang="ts">
import { useNumbersStore } from '~/modules/checkpoint/stores/memory/numbersStore';

const numbers = useNumbersStore();

onMounted(() => {
    numbers.$setup();
});

onUnmounted(() => {
    numbers.$reset();
});
</script>

<style scoped lang="scss">
.number {
    display: flex;
    gap: 16px;
}
</style>
