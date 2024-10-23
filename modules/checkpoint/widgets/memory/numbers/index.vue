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
                <UiButton v-if="checkpoint.isInContemplationState()" @click="numbers.startInteractiveState">Remember</UiButton>
                <UiButton v-else-if="checkpoint.isInInteractiveState()" @click="numbers.finishLevel">Next one</UiButton>
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

<style scoped lang="scss">
.numbers {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    user-select: none;
    height: 100%;

    &__field {
        display: flex;
        align-items: center;
        flex-direction: column;
        gap: 48px;
    }

    &__numbers {
        display: grid;
        gap: 4px;
        width: fit-content;

        @include tablet {
            gap: 6px;
        }
    }

    &__controls {
        display: flex;
        flex-direction: column;
        gap: 32px;
    }

    &__variants {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        flex-direction: row-reverse;
        gap: 4px;
        border-radius: 12px;
        padding: 16px 8px;
        border: 2px dashed transparent;

        transition: all 250ms ease;

        @include tablet {
            gap: 6px;
        }

        @include mobile {
            gap: 8px;
        }

        &_entered {
            border: 2px dashed var(--primary-subtitle);
        }
    }
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 500ms ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
    opacity: 1;
}

.scale-enter-active,
.scale-leave-active {
    transition:
        opacity 250ms ease,
        transform 250ms ease;
}

.scale-enter-from,
.scale-leave-to {
    opacity: 0;
    transform: scale(0);
}

.scale-enter-to,
.scale-leave-from {
    opacity: 1;
    transform: scale(1);
}
</style>
