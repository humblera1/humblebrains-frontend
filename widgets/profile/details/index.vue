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
        <div class="details__form">
            <WidgetFormProfile v-model="status" />
        </div>
        <div class="details__password" @click="handlePasswordChanging">
            <IconKey />
            <span>{{ $t('changePassword') }}</span>
        </div>
        <div v-show="status !== undefined" class="details__status">
            <Transition name="fade" mode="out-in">
                <UiPreloader v-if="status === ProfileFormStatusEnum.Updating" size="tiny" />
                <IconCheckCircle v-else-if="status === ProfileFormStatusEnum.Success" class="details__check" />
                <IconExclamationTriangle v-else-if="status === ProfileFormStatusEnum.Failure" class="details__exclamation" />
            </Transition>
        </div>
        <div v-if="!user.isEmailVerified" class="details__verification" @click="handleVerification">
            <IconExclamationCircle />
        </div>
    </section>
</template>

<script setup lang="ts">
import { WidgetModalAvatarUploader, WidgetModalChangePassword, WidgetModalVerifyEmail } from '#components';
import { useUserStore } from '~/modules/user/stores/userStore';
import { ProfileFormStatusEnum } from '~/entities/enums/profile/ProfileFormStatusEnum';

const { openModal } = useHumbleModal();

const user = useUserStore();

const status = ref<ProfileFormStatusEnum | undefined>(undefined);

const handlePasswordChanging = () => {
    openModal(WidgetModalChangePassword);
};

const handleVerification = () => {
    openModal(WidgetModalVerifyEmail);
};
</script>

<style scoped lang="scss" src="./profile-details.styles.scss" />
