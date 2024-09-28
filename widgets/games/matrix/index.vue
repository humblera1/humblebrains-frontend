<template>
    <GameMatrixField />
</template>

<script setup lang="ts">
const { setupStore } = useMatrixStore();

onMounted(() => setupStore());
</script>

<style scoped lang="scss"></style>
