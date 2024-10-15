<template>
    <div class="gorbov-schulte">
        <div class="gorbov-schulte__field">
            <div v-for="i in gorbovSchulte.dimension" :key="i" class="gorbov-schulte__row">
                <WidgetCheckpointMemoryGorbovSchulteCell
                    v-for="j in gorbovSchulte.dimension"
                    :key="i * gorbovSchulte.dimension - j + 1"
                    :number="i * gorbovSchulte.dimension - j + 1"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useGorbovSchulteStore } from '~/modules/checkpoint/stores/memory/gorbovSchulteStore';

const gorbovSchulte = useGorbovSchulteStore();

onMounted(() => {
    gorbovSchulte.$setup();
});

onUnmounted(() => {
    gorbovSchulte.$reset();
});
</script>

<style scoped lang="scss">
.gorbov-schulte {
    &__field {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    &__row {
        display: flex;
        flex-direction: row-reverse;
        gap: 4px;
    }
}
</style>
