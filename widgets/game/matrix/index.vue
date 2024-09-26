<template>
    <WidgetGameMatrixField />
</template>

<script setup lang="ts">
const { setStore } = useMatrixStore();

onMounted(() => setStore());
</script>

<style scoped lang="scss"></style>
