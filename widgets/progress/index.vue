<template>
    <div class="progress">
        <Transition name="fade" mode="out-in">
            <template v-if="user.isCheckpointCompleted">
                <WidgetProgressProgram />
            </template>
            <template v-else>
                <WidgetProgressCheckpoint />
            </template>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { useUserStore } from '~/modules/user/stores/userStore';

const user = useUserStore();
</script>

<style scoped lang="scss">
.progress {
    display: flex;
    width: 100%;
}
</style>