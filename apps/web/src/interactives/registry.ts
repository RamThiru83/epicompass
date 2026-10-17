import type { InteractiveMeta } from './types';
import { UNIT_A } from './unitA';
import { UNIT_B } from './unitB';
export const INTERACTIVES: Record<string, InteractiveMeta> = Object.fromEntries([...UNIT_A, ...UNIT_B].map(m => [m.id, m]));
