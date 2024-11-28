<template>
    <div>
        <NuxtPage />
        <HumbleModal />
    </div>
</template>

<script setup lang="ts">
import { WidgetModalResetPassword } from '#components';

const route = useRoute();

const { openModal } = useHumbleModal();

const token = route.query.token;
const email = route.query.email;

const checkPasswordReset = () => {
    if (token && email && typeof email === 'string' && typeof token === 'string') {
        openModal(WidgetModalResetPassword);
    }
};

onMounted(() => {
    checkPasswordReset();
});
</script>
