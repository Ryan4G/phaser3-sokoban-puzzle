export type MoveOrientation = 'left' | 'right' | 'up' | 'down';

export type SokobanLevelInfo = { 
    level: number,
    data: number[][], 
    mixin: boolean,
    title: string,
    pixin: number | undefined,
    mode : number | undefined
 };