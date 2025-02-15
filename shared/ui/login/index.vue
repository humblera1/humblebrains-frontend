<template>
    <div class="login">
        <div class="login__container">
            <div class="login__content">
                <div class="login__icon">
                    <IconFingerprint />
                </div>
                <p class="login__title">
                    {{ $t('getFullAccess') }}
                </p>
            </div>
            <div class="login__button">
                <UiButton @click="openSignin">
                    {{ $t('signIn') }}
                </UiButton>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { WidgetModalAuth } from '#components';

const authState = useState('authState');

const { openModal } = useHumbleModal();

const openSignin = () => {
    authState.value = 'signin';

    openModal(WidgetModalAuth);
};
</script>

<style scoped lang="scss" src="./login.styles.scss" />
