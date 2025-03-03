<template>
    <div :class="itemClasses" @click="thorndike.handleNumberSelection(number)">
        {{ number }}
    </div>
</template>

<script setup lang="ts">
import type { thorndikeItemProps } from '~/modules/checkpoint/widgets/attention/thorndike/item/thorndike-item.types';
import { useThorndikeStore } from '~/modules/checkpoint/stores/attention/thorndikeStore';

const { number, withBadge = false } = defineProps<thorndikeItemProps>();

const thorndike = useThorndikeStore();

const itemClasses = computed(() => {
    return [
        'thorndike-item',
        {
            'thorndike-item_badged': withBadge,
            'thorndike-item_selected': thorndike.isNumbersSelected(number) && !withBadge,
            'thorndike-item_visible': thorndike.isNumberVisible(number),
        },
    ];
});
</script>

<style scoped lang="scss" src="./thorndike-item.styles.scss" />
