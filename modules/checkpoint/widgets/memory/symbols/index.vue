<template>
    <div class="symbols">
        <div class="symbols__field">
            <div class="symbols__symbols" :style="symbolsGridStyle">
                <TransitionGroup name="fade">
                    <WidgetCheckpointMemorySymbolsCell
                        v-for="(symbol, index) in symbols.visibleSymbols"
                        :key="symbol"
                        :symbol="symbol"
                        :index="index"
                    />
                </TransitionGroup>
            </div>
            <div :class="variantsClasses" @dragover.prevent @drop="onDrop">
                <TransitionGroup name="scale">
                    <WidgetCheckpointMemorySymbolsVariant
                        v-for="(symbol, index) in symbols.variants"
                        :key="symbol"
                        :symbol="symbol"
                        :index="index"
                    />
                </TransitionGroup>
            </div>
        </div>
        <div class="symbols__controls">
            <Transition name="fade" mode="out-in">
                <UiButton v-if="checkpoint.isInContemplationState()" @click="symbols.startInteractiveState">
                    {{ $t('remembered') }}
                </UiButton>
                <UiButton v-else-if="checkpoint.isInInteractiveState()" @click="symbols.finishLevel">
                    {{ $t('continue') }}
                </UiButton>
            </Transition>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useSymbolsStore } from '~/modules/checkpoint/stores/memory/symbolsStore';
import { useCheckpointStore } from '~/modules/checkpoint/stores/checkpointStore';

const checkpoint = useCheckpointStore();
const symbols = useSymbolsStore();

const onDrop = () => {
    symbols.handleDropToVariants();
};

const variantsClasses = computed(() => {
    return [
        'symbols__variants',
        {
            symbols__variants_entered: symbols.isNumberDragged,
        },
    ];
});

const symbolsGridStyle = computed((): string => {
    return `grid-template-columns: repeat(${symbols.fieldColumnsAmount}, 1fr)`;
});

onMounted(() => {
    symbols.$setup();
});

onUnmounted(() => {
    symbols.$reset();
});
</script>

<style scoped lang="scss" src="./symbols.styles.scss" />
