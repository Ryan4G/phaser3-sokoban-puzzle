import Phaser from 'phaser';

import { SokobanLevel } from "~enums/SokobanEnums";

export default class LevelCompleteScene extends Phaser.Scene{

    constructor(){
        super('LevelCompleteScene');
    }

    preload(){

    }

    create(data: {steps: number, level: SokobanLevel}){

        data = Object.assign({steps: 0, level: SokobanLevel.Level1}, data);

        const width = this.scale.width;
        const height = this.scale.height;

        this.add.text(width * 0.5, height * 0.35, 'Level Complete!',{
            fontSize: '48px',
            color: '#dcdcaa'
        }).setOrigin(0.5);

        this.add.text(width * 0.5, height * 0.45, `Steps: ${data.steps}`,{
            fontSize: '28px'
        }).setOrigin(0.5);

        const retryBtn = this.add.rectangle(width * 0.5, height * 0.6, 120, 60, 0xffffff)
        .setInteractive();

        this.add.text(width * 0.5, height * 0.6, 'Retry', {color: '#000'}).setOrigin(0.5);

        retryBtn.once('pointerup', () => {
            this.scene.start('GameScene', {level: data.level});
        }, this);

        
        if (data.level >= SokobanLevel.Level5){
            return;
        }

        const nextLevelBtn = this.add.rectangle(width * 0.5, height * 0.75, 120, 60, 0x237b8c)
        .setInteractive();

        this.add.text(width * 0.5, height * 0.75, 'Next Level', {color: '#fff'}).setOrigin(0.5);

        nextLevelBtn.once('pointerup', () => {
            
            this.scene.start('GameScene', {level: data.level + 1});
        }, this);
    }

    update(){

    }
}