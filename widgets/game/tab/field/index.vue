<template>
    <div>
        <WidgetGameUiLayout>
            <component :is="gameComponent" key="gameComponent" />
        </WidgetGameUiLayout>
    </div>
</template>

<script setup lang="ts">
import { GameEnum } from '~/entities/enums/games/GameEnum';
import { GameMatrix } from '#components';

const page = useGamePageStore();

const gameComponent = computed(() => {
    switch (true) {
        case page.game === GameEnum.matrix:
            return GameMatrix;
    }
});
</script>

<style scoped lang="scss"></style>
