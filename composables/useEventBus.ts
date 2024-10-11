import mitt from 'mitt';
import type { TestEventEnum } from '~/modules/checkpoint/entities/enums/TestEventEnum';

const emitter = mitt<TestEventEnum>();

export const useEmitEvent = emitter.emit;
export const useListenEvent = emitter.on;
