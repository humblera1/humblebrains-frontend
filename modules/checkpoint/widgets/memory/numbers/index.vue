<template>
    <div class="numbers">
        <div class="numbers__field">
            <div class="numbers__numbers" :style="numbersGridStyle">
                <TransitionGroup name="fade">
                    <WidgetCheckpointMemoryNumbersCell
                        v-for="(number, index) in numbers.visibleNumbers"
                        :key="number"
                        :number="number"
                        :index="index"
                    />
                </TransitionGroup>
            </div>
            <div :class="variantsClasses" @dragover.prevent @drop="onDrop">
                <TransitionGroup name="scale">
                    <WidgetCheckpointMemoryNumbersVariant
                        v-for="(number, index) in numbers.variants"
                        :key="number"
                        :number="number"
                        :index="index"
                    />
                </TransitionGroup>
            </div>
        </div>
        <div class="numbers__controls">
            <Transition name="fade" mode="out-in">
                <UiButton v-if="checkpoint.isInContemplationState()" @click="numbers.startInteractiveState">
                    {{ $t('remembered') }}
                </UiButton>
                <UiButton v-else-if="checkpoint.isInInteractiveState()" @click="numbers.finishLevel">
                    {{ $t('continue') }}
                </UiButton>
            </Transition>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useNumbersStore } from '~/modules/checkpoint/stores/memory/numbersStore';
import { useCheckpointStore } from '~/modules/checkpoint/stores/checkpointStore';

const checkpoint = useCheckpointStore();
const numbers = useNumbersStore();

const onDrop = () => {
    numbers.handleNumberDrop();
};

const variantsClasses = computed(() => {
    return [
        'numbers__variants',
        {
            numbers__variants_entered: numbers.isNumberDragged,
        },
    ];
});

const numbersGridStyle = computed((): string => {
    return `grid-template-columns: repeat(${numbers.fieldColumnsAmount}, 1fr)`;
});

onMounted(() => {
    numbers.$setup();
});

onUnmounted(() => {
    numbers.$reset();
});
</script>

<style scoped lang="scss" src="./numbers.styles.scss" />
