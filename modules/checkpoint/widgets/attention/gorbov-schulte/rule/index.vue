<template>
    <Transition name="fade">
        <div v-show="checkpoint.isInInteractiveState()" class="rule" :class="ruleClass">
            <div class="rule__outer">
                <div class="rule__inner">
                    <IconArrow />
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { useGorbovSchulteStore } from '~/modules/checkpoint/stores/attention/gorbovSchulteStore';
import { useCheckpointStore } from '~/modules/checkpoint/stores/checkpointStore';

const gorbovSchulte = useGorbovSchulteStore();
const checkpoint = useCheckpointStore();

const ruleClass = computed((): string => {
    return gorbovSchulte.isSecondaryRuleActive() ? 'rule_secondary' : 'rule_primary';
});
</script>

<style scoped lang="scss" src="./gorbov-schulte-rule.scss" />
