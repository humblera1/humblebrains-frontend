<template>
    <template v-if="page.currentTestComponent">
        <WidgetCheckpointUiLayout>
            <Transition name="slide" mode="out-in">
                <template v-if="page.isPreviewTabSelected()">
                    <WidgetCheckpointTabGameplayInfo />
                </template>
                <template v-else-if="page.isGameplayTabSelected()">
                    <component :is="page.currentTestComponent.component" :key="page.currentTestComponent.name" />
                </template>
            </Transition>
        </WidgetCheckpointUiLayout>
    </template>
    <UiInDevelopment v-else />
</template>

<script setup lang="ts">
import { useCheckpointPageStore } from '~/modules/checkpoint/stores/checkpointPageStore';

const page = useCheckpointPageStore();
</script>

<style scoped lang="scss" src="./gameplay.styles.scss" />
