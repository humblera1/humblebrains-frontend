<template>
    <NuxtLayout></NuxtLayout>
</template>

<script setup lang="ts">
import { WidgetModalResetPassword, WidgetModalVerifiedEmail } from '#components';

const route = useRoute();

const { openModal } = useHumbleModal();

const token = route.query.token;
const email = route.query.email;

const url = route.query.url;

const checkPasswordReset = () => {
    if (token && email && typeof email === 'string' && typeof token === 'string') {
        openModal(WidgetModalResetPassword);
    }
};

const checkEmailVerification = () => {
    if (url && typeof url === 'string') {
        openModal(WidgetModalVerifiedEmail);
    }
};

onMounted(() => {
    checkPasswordReset();
    checkEmailVerification();
});
</script>

<style scoped></style>
