<template>
    <div class="gorbov-schulte">
        <WidgetCheckpointAttentionGorbovSchulteRule />
        <div class="gorbov-schulte__field">
            <div v-for="i in gorbovSchulte.dimension" :key="i" class="gorbov-schulte__row">
                <WidgetCheckpointAttentionGorbovSchulteCell
                    v-for="j in gorbovSchulte.dimension"
                    :key="i * gorbovSchulte.dimension - j + 1"
                    :number="i * gorbovSchulte.dimension - j + 1"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useGorbovSchulteStore } from '~/modules/checkpoint/stores/attention/gorbovSchulteStore';

const gorbovSchulte = useGorbovSchulteStore();

onMounted(() => {
    gorbovSchulte.$setup();
});

onUnmounted(() => {
    gorbovSchulte.$reset();
});
</script>

<style scoped lang="scss" src="./gorbov-schulte.styles.scss" />
