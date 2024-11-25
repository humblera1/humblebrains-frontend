<template>
    <section class="details">
        <div class="details__avatar" @click="openModal(WidgetModalAvatarUploader)">
            <IconAstronautOutlined class="details__astronaut" />
            <div class="details__badge">
                <IconPlus />
            </div>
        </div>
        <div class="details__info">
            <p class="details__title">{{ user.name }}</p>
            <p class="details__subtitle">{{ user.email }}</p>
        </div>
        <p class="details__programs">{{ $t('completedProgramsAmount') + ': ' + 4 }}</p>
        <div class="profile__form">
            <WidgetFormProfile v-model="status" />
        </div>
        <div v-show="status !== undefined" class="details__status">
            <Transition name="fade" mode="out-in">
                <UiPreloader v-if="status === ProfileFormStatusEnum.Updating" size="tiny" />
                <IconCheckCircle v-else-if="status === ProfileFormStatusEnum.Success" class="details__check" />
                <IconExclamationTriangle v-else-if="status === ProfileFormStatusEnum.Failure" class="details__exclamation" />
            </Transition>
        </div>
    </section>
</template>

<script setup lang="ts">
import { WidgetModalAvatarUploader } from '#components';
import { useUserStore } from '~/modules/user/stores/userStore';
import { ProfileFormStatusEnum } from '~/entities/enums/profile/ProfileFormStatusEnum';

const { openModal } = useHumbleModal();

const user = useUserStore();

const status = ref<ProfileFormStatusEnum | undefined>(undefined);
</script>

<style scoped lang="scss">
.details {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 300px;
    max-width: 350px;
    padding: 32px 36px;
    border-radius: 36px;
    background-color: var(--primary-bg);

    @include mainShadow();

    &__avatar {
        cursor: pointer;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 120px;
        height: 120px;
        border-radius: 100%;
        background-color: var(--blue-badge);

        margin-bottom: 16px;

        @include tablet {
            margin-bottom: 12px;
        }
    }

    &__info {
        display: flex;
        flex-direction: column;
        gap: 2px;
        margin-bottom: 24px;

        @include tablet {
            margin-bottom: 16px;
        }
    }

    &__astronaut {
        width: 60px;
        height: 70px;
        color: var(--blue);
    }

    &__badge {
        position: absolute;
        top: 12px;
        right: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 24px;
        height: 24px;
        border-radius: 100%;
        background-color: var(--primary-bg);

        @include mainShadow();

        svg {
            width: 8px;
            height: 8px;
            color: var(--primary-subtitle);
        }
    }

    &__programs {
        padding: 8px 12px;
        border-radius: 8px;
        margin-bottom: 32px;
        background-color: var(--purple-bg);
        @include mainFont(500, 12, var(--purple));
    }

    &__status {
        position: absolute;
        left: 32px;
    }

    &__check {
        width: 15px;
        height: 15px;
        color: var(--green);
    }

    &__exclamation {
        width: 15px;
        height: 15px;
        color: var(--input-invalid);
    }

    &__title {
        text-align: center;
        @include lineclamp(1);
        @include mainFont(500, 16, var(--primary-title));
    }

    &__subtitle {
        text-align: center;
        @include lineclamp(1);
        @include mainFont(500, 12, var(--primary-subtitle));
    }
}
</style>
