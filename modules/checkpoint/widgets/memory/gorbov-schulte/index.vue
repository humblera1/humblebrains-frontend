<template>
    <div class="gorbov-schulte">
        <div class="gorbov-schulte__field">
            <div v-for="i in side" :key="i" class="gorbov-schulte__row">
                <WidgetCheckpointMemoryGorbovSchulteCell v-for="j in side" :key="i * side - j + 1" :number="i * side - j + 1" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const side = 5;
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
