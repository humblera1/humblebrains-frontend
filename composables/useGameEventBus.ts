import mitt from 'mitt';
import type { GameEventEnum } from '~/entities/enums/games/GameEventEnum';

const emitter = mitt<GameEventEnum>();

export const useEmitGameEvent = emitter.emit;
export const useListenGameEvent = emitter.on;
