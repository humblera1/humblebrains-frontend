import { defineStore } from 'pinia';

export const useMatrixStore = defineStore('matrixStorage', () => {
    const openedCells = ref<Set<number>>(new Set());
    const coloredCells = ref();

    const coloredNumbers = [1, 2, 3];

    const gameStore = useGameStore();

    const setMatrixStore = () => {
        // prompt maybe
        gameStore.setContemplationState();

        // Установка состояния...
    }

    const openCell = (cellNumber: number): void => {
        if (gameStore.isInteractiveState()) {
            openedCells.value.add(cellNumber);

            if (!isCellCorrect(cellNumber)) {
                setTimeout(() => closeCell(cellNumber), 1000);
            }
        }
    };

    const closeCell = (cellNumber: number): void => {
        openedCells.value.delete(cellNumber);
    };

    const isCellOpened = (cellNumber: number): boolean => {
        return openedCells.value.has(cellNumber);
    };

    const isCellCorrect = (cellNumber: number): boolean => {
        return coloredNumbers.includes(cellNumber);
    };

    return { setMatrixStore, isCellCorrect, openCell, closeCell, isCellOpened };
});
