import { defineStore } from 'pinia';
import { useCheckpointStore } from '~/modules/checkpoint/stores/checkpointStore';
import { useCheckpointPageStore } from '~/modules/checkpoint/stores/checkpointPageStore';
import type { Icon } from '~/modules/checkpoint/entities/types/Icon';
import type { LuriaItem } from '~/modules/checkpoint/entities/types/luria/LuriaItem';
import { LuriaItemTypeEnum } from '~/modules/checkpoint/entities/enums/luria/LuriaItemTypeEnum';

export const useLuriaStore = defineStore('luriaStorage', () => {
    const checkpoint = useCheckpointStore();

    const page = useCheckpointPageStore();

    const service = useCheckpointService();

    let iconPool: Icon[] = [];

    let wordPool: string[] = [];

    const sequence: LuriaItem[] = [];

    const testSequence = ref<LuriaItem[]>([]);

    /**
     *
     */
    const startLevel = () => {
        testSequence.value = [...sequence];
        console.log(sequence);
    };

    const generateSequence = () => {
        const itemsAmount = 10;
        const pool = useShuffle([...iconPool, ...wordPool]);

        for (let i = 0; i < itemsAmount; i++) {
            addItem(pool[i]);
        }
    };

    const addItem = (item: string | Icon) => {
        if (typeof item === 'string') {
            addWordItem(item);
        } else if (typeof item === 'object') {
            addIconItem(item);
        }
    };

    const addIconItem = (icon: Icon) => {
        sequence.push({
            id: 1, // TODO: generate id
            type: LuriaItemTypeEnum.icon,
            content: icon,
        });
    };

    const addWordItem = (word: string) => {
        sequence.push({
            id: 1, // TODO: generate id
            type: LuriaItemTypeEnum.word,
            content: word,
        });
    };

    /**
     * Инициализация стора.
     */
    const $setup = async () => {
        checkpoint.setTestPreparingState();
        checkpoint.setWarmUpMode();

        // checkpoint.setLevelsAmount(Object.keys(levelsToWarmUp).length);

        [iconPool, wordPool] = await Promise.all([service.fetchIcons(5), service.fetchWords(5)]);

        generateSequence();

        await checkpoint.showPrompt('warmUpPrompt');
        startLevel();
    };

    /**
     * Очистка стора.
     */
    const $reset = () => {
        checkpoint.$reset();
    };

    return {
        testSequence,

        $setup,
        $reset,
    };
});
