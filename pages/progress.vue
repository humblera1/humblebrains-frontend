<template>
    <NuxtLayout>
        <div>
            <UiButton to="/checkpoint/memory"> memory </UiButton>
            <UiButton to="/checkpoint/logic"> logic </UiButton>
            <UiButton to="/checkpoint/attention"> attention </UiButton>
        </div>
    </NuxtLayout>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
div {
    display: flex;
    gap: 8px;
    width: 100px;
}
</style>
