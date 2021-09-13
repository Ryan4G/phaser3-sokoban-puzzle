import { AnchorColors, BoxColors, TargetColors } from "~enums/SokobanEnums";

import { SokobanLevel } from '~enums/SokobanEnums';

import { SokobanLevelInfo } from '~types/SokobanTypes';

function GetBoxTargetColor(boxColor: BoxColors): TargetColors | undefined {

    let targetColor: TargetColors | undefined;

    switch(boxColor){
        case BoxColors.BoxOrange:{
            targetColor = TargetColors.TargetOrange;
            break;
        }
        case BoxColors.BoxRed:{
            targetColor = TargetColors.TargetRed;
            break;
        }
        case BoxColors.BoxBlue:{
            targetColor = TargetColors.TargetBlue;
            break;
        }
        case BoxColors.BoxGreen:{
            targetColor = TargetColors.TargetGreen;
            break;
        }
        case BoxColors.BoxGrey:{
            targetColor = TargetColors.TargetGrey;
            break;
        }
        default:{
            break;
        }
    }
    return targetColor;
}


function GetBoxAnchorColor(boxColor: BoxColors): AnchorColors | undefined {

    let anchorColor: AnchorColors | undefined;

    switch(boxColor){
        case BoxColors.BoxOrange:{
            anchorColor = AnchorColors.AnchorOrange;
            break;
        }
        case BoxColors.BoxRed:{
            anchorColor = AnchorColors.AnchorRed;
            break;
        }
        case BoxColors.BoxBlue:{
            anchorColor = AnchorColors.AnchorBlue;
            break;
        }
        case BoxColors.BoxGreen:{
            anchorColor = AnchorColors.AnchorGreen;
            break;
        }
        case BoxColors.BoxGrey:{
            anchorColor = AnchorColors.AnchorGrey;
            break;
        }
        default:{
            break;
        }
    }
    return anchorColor;
}

function GetSokobanTileMixinMap(data: number[][]): {[key: number]: Array<number>}{
    let map:{[key: number]: Array<number>} = {};
    let mixinArray = new Array<number>();
    
    for(let i = 0; i < data.length; i++){
        for(let j = 0; j < data[i].length; j++){
            let num = data[i][j];
            if (num > 105 && mixinArray.indexOf(num) === -1){
                mixinArray.push(num);
            }
        }
    }

    for(let val of mixinArray){
        let boxid = Math.floor(val / 100);
        let targetid = val - boxid * 100;

        if (!map[boxid]){
            map[boxid] = new Array<number>();
        }

        map[boxid].push(targetid);
    }

    return map;
}

function GetBrowserMobileMode():boolean{
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

export {
    GetBoxAnchorColor,
    GetBoxTargetColor,
    GetBrowserMobileMode,
    GetSokobanTileMixinMap
}