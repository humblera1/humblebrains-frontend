<template>
    <div class="luria">
        <div class="luria__field">
            <Transition name="scale" mode="out-in">
                <WidgetCheckpointMemoryLuriaItem v-if="luria.currentItem" :key="luria.currentItem.id" :item="luria.currentItem" />
            </Transition>
        </div>
        <div :class="controlsClasses">
            <p class="luria__message">{{ luria.currentItem ? $t(promptMessage) : '' }}</p>
            <div class="luria__buttons">
                <UiButton @click="luria.makeAnswer(true)">{{ $t('yes') }}</UiButton>
                <UiButton @click="luria.makeAnswer(false)">{{ $t('no') }}</UiButton>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useLuriaStore } from '~/modules/checkpoint/stores/memory/luriaStorage';
import { useCheckpointStore } from '~/modules/checkpoint/stores/checkpointStore';
import { LuriaItemTypeEnum } from '~/modules/checkpoint/entities/enums/luria/LuriaItemTypeEnum';

const luria = useLuriaStore();
const checkpoint = useCheckpointStore();

const promptMessage = computed((): string => {
    if (luria.currentItem && checkpoint.isInInteractiveState()) {
        return luria.currentItem.type === LuriaItemTypeEnum.icon ? 'luria:wasSymbolInTheSet?' : 'luria:wasWordInTheSet?';
    }

    return '';
});

const controlsClasses = computed(() => {
    return [
        'luria__controls',
        {
            luria__controls_visible: checkpoint.isInInteractiveState(),
        },
    ];
});

onMounted(() => {
    luria.$setup();
});

onUnmounted(() => {
    luria.$reset();
});
</script>

<style scoped lang="scss" src="./luria.styles.scss" />
