<template>
    <div class="profile">
        <div class="profile__details">
            <WidgetProfileDetails />
        </div>
        <div class="profile__program">
            <UiInDevelopment />
<!--            <h1 class="title">{{ $t('currentProgram') + ': ' }}</h1>-->
<!--            <div class="profile__content">-->

                <!-- если нет активных программ -->
                <!-- <WidgetActionCompleteCheckpoint />-->

                <!-- при наличии активных программ -->
<!--                <WidgetProfileStatistics />-->
<!--                <WidgetGameRow :games="user.games" />-->
<!--            </div>-->
        </div>
    </div>
</template>

<script setup lang="ts">
import { useUserStore } from '~/modules/user/stores/userStore';

const user = useUserStore();
</script>

<style scoped lang="scss">
.profile {
    //width: 100%;
    display: flex;

    //flex-wrap: wrap;
    gap: 24px;

    @include mobile {
        flex-direction: column;
    }

    &__details {
        width: 100%;
        max-width: 350px;
        flex-shrink: 0;
    }

    &__program {
        flex-grow: 1;
        overflow: hidden;

        //display: block;
        //display: flex;
        //flex-direction: column;


        //flex-wrap: wrap;
        width: 100%;
        display: flex;
        flex-direction: column;
    }

    &__content {
        display: flex;
        flex-direction: column;
        justify-content: center;
        overflow: hidden;
    }
}
</style>
