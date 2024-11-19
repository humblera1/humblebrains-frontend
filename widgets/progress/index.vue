<template>
    <div class="progress">
        <template v-if="$user.isRunCheckpoint">
            <WidgetProgressCheckpoint />
        </template>
        <template v-else>
            <WidgetProgressProgram />
        </template>
    </div>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
.progress {
    display: flex;
    width: 100%;
}
</style>