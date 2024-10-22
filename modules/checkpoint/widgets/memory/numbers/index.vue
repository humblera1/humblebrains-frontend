<template>
    <div class="numbers">
        <div class="numbers__field">
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
</template>

<script setup lang="ts">
import { useNumbersStore } from '~/modules/checkpoint/stores/memory/numbersStore';

const numbers = useNumbersStore();

const onDrop = () => {
    numbers.handleNumberDrop();
};

const variantsClasses = computed(() => {
    return [
        'numbers__variants',
        {
            'numbers__variants_drag-entered': numbers.isNumberDragged,
        },
    ];
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

    // todo:
    gap: 60px;

    &__field {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 4px;
        width: fit-content;
    }

    &__variants {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 4px;
        border-radius: 12px;
        padding: 16px 8px;
        border: 2px dashed transparent;

        transition: all 250ms ease;

        &_drag-entered {
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
