<template>
    <div class="profile">
        <div class="profile__details">
            <WidgetProfileDetails />
        </div>
        <div class="profile__program">
            <h1 class="title">{{ $t('currentProgram') + ': ' }}</h1>
            <div class="profile__content">
                <WidgetProfileStatistics />
                <template v-if="user.isCheckpointCompleted">
                    <WidgetGameRow :games="user.games" />
                </template>
                <template v-else>
                    <WidgetActionCompleteCheckpoint />
                </template>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useUserStore } from '~/modules/user/stores/userStore';

const user = useUserStore();
</script>

<style scoped lang="scss">
.profile {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 48px;

    @include tablet {
        grid-template-columns: unset;
        justify-items: center;
    }

    &__details {
        width: 100%;
        max-width: 350px;
        flex-shrink: 0;
    }

    &__program {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 42px;
    }

    &__content {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 24px;

        @include tablet {
            align-items: center;
        }
    }
}
</style>
