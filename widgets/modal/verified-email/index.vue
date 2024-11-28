<template>
    <UiModal>
        <div class="verified-email">
            <Transition name="fade" mode="out-in">
                <div v-if="isSuccess" class="verified-email__content">
                    <div class="verified-email__check">
                        <IconCheckCircle />
                    </div>
                    <p class="verified-email__subtitle">{{ $t('emailVerifiedSuccessfully') }}</p>
                </div>
                <UiPreloader v-else />
            </Transition>
        </div>
    </UiModal>
</template>

<script setup lang="ts">
import { useUserStore } from '~/modules/user/stores/userStore';

const service = useAuthService();

const user = useUserStore();

const route = useRoute();
const router = useRouter();

const { closeModal } = useHumbleModal();

const isSuccess = ref<boolean>(false);

const url = route.query.url;

let timerId: ReturnType<typeof setTimeout> | null = null;

const resetTimer = () => {
    if (timerId) {
        clearTimeout(timerId);
        timerId = null;
    }
};

const verifyEmail = async () => {
    if (url && typeof url === 'string') {
        try {
            const response = await service.verifyEmail(url);

            if (response.data && response.data.personalData) {
                user.setPersonalData(response.data.personalData);
            }

            isSuccess.value = true;

            await router.replace({ path: '/' });

            timerId = setTimeout(() => {
                closeModal();
            }, 3000);
        } catch {
            // todo: error handling
            console.log('error');
        }
    }
};

onMounted(() => {
    verifyEmail();
});

onUnmounted(() => {
    resetTimer();
});
</script>

<style scoped lang="scss" src="./verified-email.styles.scss" />
