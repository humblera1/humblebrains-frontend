<template>
    <NuxtLayout>
        {{ route.params.category }}
    </NuxtLayout>
</template>

<script setup lang="ts">
const route = useRoute();
</script>

<style scoped lang="scss"></style>
