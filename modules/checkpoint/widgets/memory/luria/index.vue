<template>
    <div class="luria">
        <UiButton @click="luria.showItemsToRememberSequentially">show</UiButton>
        <div class="luria__field">
            <Transition name="scale" mode="out-in">
                <WidgetCheckpointMemoryLuriaItem v-if="luria.currentItem" :key="luria.currentItem.id" :item="luria.currentItem" />
            </Transition>
        </div>

        <div class="luria__controls"></div>
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

<style scoped lang="scss">
.luria {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    &__field {
        height: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    &__controls {
        height: 50%;
    }
}

.scale-enter-active,
.scale-leave-active {
    transition: transform 250ms;
}
.scale-enter-from,
.scale-leave-to {
    transform: scale(0);
}
</style>
