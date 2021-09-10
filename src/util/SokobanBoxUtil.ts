import { Materials } from "~enums/SokobanEnums";

export function GetBoxColorTargetMap():{[key: number]: number}{

    let boxColorTargetMap: {[key: number]: number} = {};

    boxColorTargetMap[Materials.BoxOrange] = Materials.TargetOrange;
    boxColorTargetMap[Materials.BoxRed] = Materials.TargetRed;
    boxColorTargetMap[Materials.BoxBlue] = Materials.TargetBlue;
    boxColorTargetMap[Materials.BoxGreen] = Materials.TargetGreen;
    boxColorTargetMap[Materials.BoxGrey] = Materials.TargetGrey;

    return boxColorTargetMap;
}