<template>
    <GameMatrixField />
</template>

<script setup lang="ts">
const { $setup, $reset } = useMatrixStore();

onMounted(() => {
    $setup();
});

onUnmounted(() => {
    $reset();
});
</script>

<style scoped lang="scss"></style>
