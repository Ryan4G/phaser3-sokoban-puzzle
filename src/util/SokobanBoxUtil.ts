import { AnchorColors, BoxColors, TargetColors } from "~enums/SokobanEnums";

import { SokobanLevel } from "~enums/SokobanEnums";

function GetBoxTargetColor(boxColor: BoxColors): TargetColors {

    let targetColor: TargetColors = TargetColors.TargetBlue;

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


function GetBoxAnchorColor(boxColor: BoxColors): AnchorColors {

    let anchorColor: AnchorColors = AnchorColors.AnchorBlue;

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

function GetSokobanLevelData(level: SokobanLevel) : number[][]{

    let levelData = [
        [  0,   0, 100, 100, 100,   0,   0,   0,   0,   0],
        [  0,   0, 100,  51, 100,   0,   0,   0,   0,   0],
        [  0,   0, 100,   0, 100, 100, 100, 100,   0,   0],
        [100, 100, 100,   8,   0,   8,  51, 100,   0,   0],
        [100,  51,   0,   8,  52, 100, 100, 100,   0,   0],
        [100, 100, 100, 100,   8, 100,   0,   0,   0,   0],
        [  0,   0,   0, 100,  51, 100,   0,   0,   0,   0],
        [  0,   0,   0, 100, 100, 100,   0,   0,   0,   0]
    ];

    switch(level){
        case SokobanLevel.Level1: {
            levelData = [
                [  0,   0, 100, 100, 100,   0,   0,   0,   0,   0],
                [  0,   0, 100,  51, 100,   0,   0,   0,   0,   0],
                [  0,   0, 100,   0, 100, 100, 100, 100,   0,   0],
                [100, 100, 100,   8,   0,   8,  51, 100,   0,   0],
                [100,  51,   0,   8,  52, 100, 100, 100,   0,   0],
                [100, 100, 100, 100,   8, 100,   0,   0,   0,   0],
                [  0,   0,   0, 100,  51, 100,   0,   0,   0,   0],
                [  0,   0,   0, 100, 100, 100,   0,   0,   0,   0]
            ];
            break;
        }
        case SokobanLevel.Level2: {
            levelData = [
                [  0,   0, 100, 100, 100,   0,   0,   0,   0,   0],
                [  0, 100, 100,  51, 100,   0,   0,   0,   0,   0],
                [  0, 100,   0,   8, 100, 100, 100, 100,   0,   0],
                [100, 100,   0,   0,   0,   8,  52, 100,   0,   0],
                [100,  51,   0,   8,   8,  51, 100, 100,   0,   0],
                [100, 100, 100, 100,   0, 100,   0,   0,   0,   0],
                [  0,   0,   0, 100,  51, 100,   0,   0,   0,   0],
                [  0,   0,   0, 100, 100, 100,   0,   0,   0,   0]
            ];
            break;
        }
        case SokobanLevel.Level3: {
            levelData = [
                [100, 100, 100,   0,   0,   0,   0,   0,   0,   0],
                [100,  51, 100, 100, 100, 100, 100,   0,   0,   0],
                [100,  51,  51,   0,   0,   0, 100,   0,   0,   0],
                [100,   0,   8,   8,   8,  52, 100,   0,   0,   0],
                [100,   0,   0,   0,   0, 100,   0,   0,   0,   0],
                [100, 100, 100, 100, 100, 100,   0,   0,   0,   0]
            ];
            break;
        }
        case SokobanLevel.Level4: {
            levelData = [
                [100, 100, 100, 100, 100, 100,   0,   0,   0,   0],
                [100,  51,  51,  51,  51, 100, 100, 100, 100,   0],
                [100,   0,   0,   8, 100, 100,   0,   0, 100,   0],
                [100,   0,   8,   8,   0,   0,   0,   0, 100,   0],
                [100,  52,   8,   0,   0,   0,   0,   0, 100,   0],
                [100, 100,   0,   0, 100, 100, 100, 100, 100,   0],
                [  0, 100, 100, 100, 100,   0,   0,   0,   0,   0]
            ];
            break;
        }
        case SokobanLevel.Level5: {
            levelData = [
                [  0,   0, 100, 100, 100, 100,   0,   0,   0,   0],
                [  0,   0, 100,   0,  52, 100, 100, 100,   0,   0],
                [  0,   0, 100,   8,   8,   0,   0, 100,   0,   0],
                [100, 100, 100,   0,   8,  51,   0, 100,   0,   0],
                [100,  51,  51,  51,   0, 100, 100, 100,   0,   0],
                [100, 100, 100,   8,   0, 100,   0,   0,   0,   0],
                [  0,   0, 100,   0,   0, 100,   0,   0,   0,   0],
                [  0,   0, 100, 100, 100, 100,   0,   0,   0,   0]
            ];
            break;
        }
        case SokobanLevel.Level6: {
            levelData = [
                [  0,   0, 100, 100, 100,   0,   0,   0,   0,   0],
                [  0, 100, 100,  51, 100,   0,   0,   0,   0,   0],
                [  0, 100,   0,   8, 100, 100, 100, 100,   0,   0],
                [100, 100,   0,   0,   0,   8,  52, 100,   0,   0],
                [100,  51,   0,   8,   8,  51, 100, 100,   0,   0],
                [100, 100, 100, 100,   0, 100,   0,   0,   0,   0],
                [  0,   0,   0, 100,  51, 100,   0,   0,   0,   0],
                [  0,   0,   0, 100, 100, 100,   0,   0,   0,   0]
            ];
            break;
        }
        case SokobanLevel.Level7: {
            levelData = [
                [  0,   0, 100, 100, 100,   0,   0,   0,   0,   0],
                [  0, 100, 100,  51, 100,   0,   0,   0,   0,   0],
                [  0, 100,   0,   8, 100, 100, 100, 100,   0,   0],
                [100, 100,   0,   0,   0,   8,  52, 100,   0,   0],
                [100,  51,   0,   8,   8,  51, 100, 100,   0,   0],
                [100, 100, 100, 100,   0, 100,   0,   0,   0,   0],
                [  0,   0,   0, 100,  51, 100,   0,   0,   0,   0],
                [  0,   0,   0, 100, 100, 100,   0,   0,   0,   0]
            ];
            break;
        }
        case SokobanLevel.Level8: {
            levelData = [
                [  0,   0, 100, 100, 100,   0,   0,   0,   0,   0],
                [  0, 100, 100,  51, 100,   0,   0,   0,   0,   0],
                [  0, 100,   0,   8, 100, 100, 100, 100,   0,   0],
                [100, 100,   0,   0,   0,   8,  52, 100,   0,   0],
                [100,  51,   0,   8,   8,  51, 100, 100,   0,   0],
                [100, 100, 100, 100,   0, 100,   0,   0,   0,   0],
                [  0,   0,   0, 100,  51, 100,   0,   0,   0,   0],
                [  0,   0,   0, 100, 100, 100,   0,   0,   0,   0]
            ];
            break;
        }
        case SokobanLevel.Level9: {
            levelData = [
                [  0,   0, 100, 100, 100,   0,   0,   0,   0,   0],
                [  0, 100, 100,  51, 100,   0,   0,   0,   0,   0],
                [  0, 100,   0,   8, 100, 100, 100, 100,   0,   0],
                [100, 100,   0,   0,   0,   8,  52, 100,   0,   0],
                [100,  51,   0,   8,   8,  51, 100, 100,   0,   0],
                [100, 100, 100, 100,   0, 100,   0,   0,   0,   0],
                [  0,   0,   0, 100,  51, 100,   0,   0,   0,   0],
                [  0,   0,   0, 100, 100, 100,   0,   0,   0,   0]
            ];
            break;
        }
        case SokobanLevel.Level10: {
            levelData = [
                [  0,   0, 100, 100, 100,   0,   0,   0,   0,   0],
                [  0, 100, 100,  51, 100,   0,   0,   0,   0,   0],
                [  0, 100,   0,   8, 100, 100, 100, 100,   0,   0],
                [100, 100,   0,   0,   0,   8,  52, 100,   0,   0],
                [100,  51,   0,   8,   8,  51, 100, 100,   0,   0],
                [100, 100, 100, 100,   0, 100,   0,   0,   0,   0],
                [  0,   0,   0, 100,  51, 100,   0,   0,   0,   0],
                [  0,   0,   0, 100, 100, 100,   0,   0,   0,   0]
            ];
            break;
        }
        default:{
            break;
        }
    }
    
    return levelData;
}

function GetBrowserMobileMode():boolean{
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

export {
    GetBoxAnchorColor,
    GetBoxTargetColor,
    GetSokobanLevelData,
    GetBrowserMobileMode
}