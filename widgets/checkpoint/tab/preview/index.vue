<template>
    <div>
        <p>checkpoint preview page</p>
        <UiButton @click="selectGameplayTab">Go To Gameplay</UiButton>
    </div>
</template>

<script setup lang="ts">
import { CheckpointTabEnum } from '~/entities/enums/checkpoint/CheckpointTabEnum';

const currentTab = useState<CheckpointTabEnum>('checkpoint');

const selectGameplayTab = (): void => {
    currentTab.value = CheckpointTabEnum.gameplay;
};
</script>

<style scoped lang="scss"></style>
