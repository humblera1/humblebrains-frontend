<template>
    <div class="luria">
        <WidgetCheckpointMemoryLuriaItem v-for="(item, idx) in luria.testSequence" :key="idx" :item="item" />
    </div>
</template>

<script setup lang="ts">
import { useLuriaStore } from '~/modules/checkpoint/stores/memory/luriaStorage';

const luria = useLuriaStore();

onMounted(() => {
    luria.$setup();
});

onUnmounted(() => {
    luria.$reset();
});
</script>

<style scoped lang="scss"></style>
