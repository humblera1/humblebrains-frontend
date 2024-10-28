<template>
    <NuxtLayout>
        <UiButton @click="fetch">fetch</UiButton>
        <div v-if="icons.length">
            <img v-for="(icon, idx) in icons" :key="idx" :src="icon.path" :alt="icon.name" />
        </div>
    </NuxtLayout>
</template>

<script setup lang="ts">
import { useCheckpointService } from '#imports';

const service = useCheckpointService();

const icons = ref<string[]>([]);

const fetch = async () => {
    icons.value = await service.fetchIcons(5);
};
</script>

<style scoped></style>
