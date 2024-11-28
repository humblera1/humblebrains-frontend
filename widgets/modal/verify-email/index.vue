<template>
    <UiModal>
        <div class="verify-email">
            <Transition name="fade" mode="out-in">
                <div v-if="isSuccess" class="verify-email__success">
                    <IconCheckCircle />
                    <p>{{ $t('verificationMailSent') }}</p>
                </div>
                <UiPreloader v-else-if="isPending" />
                <div v-else class="verify-email__content">
                    <div class="verify-email__envelope">
                        <IconEnvelope />
                    </div>
                    <p class="verify-email__title">{{ $t('confirmEmail') }}</p>
                    <p class="verify-email__subtitle">{{ $t('confirmEmailInstructions') }}</p>
                    <UiButton class="verify-email__button" @click="onSend">{{ $t('send') }}</UiButton>
                </div>
            </Transition>
        </div>
    </UiModal>
</template>

<script setup lang="ts">
const service = useAuthService();

const isPending = ref<boolean>(false);
const isSuccess = ref<boolean>(false);

const onSend = async () => {
    isPending.value = true;

    try {
        await service.sendVerificationNotification();

        isSuccess.value = true;
    } catch {
        // todo: error handling
        console.log('error');
    }
};
</script>

<style scoped lang="scss" src="./verify-email.styles.scss" />
