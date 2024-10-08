<template>
    <div>
        <p>preview of specific test</p>
        <UiButton @click="page.selectGameplayTab()">Start Test</UiButton>
    </div>
</template>

<script setup lang="ts">
import { useCheckpointPageStore } from '~/modules/checkpoint/stores/checkpointPageStore';

const page = useCheckpointPageStore();
</script>

<style scoped lang="scss"></style>
