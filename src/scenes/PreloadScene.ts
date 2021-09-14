import Phaser from "phaser";

import {IPlayRecords} from '../interfaces/IPlayerRecord';
import {SokobanLevelInfo} from '../types/SokobanTypes';
import {ILevelBlockInfo} from '../interfaces/ILevelBlockInfo';
import { SokobanLevel } from "~enums/SokobanEnums";

export default class PreloadScene extends Phaser.Scene{

    private levelPicker?:ILevelBlockInfo;
    private levelBlocks?:Array<Phaser.GameObjects.Rectangle>;
    private levelBlockLabels?:Array<Phaser.GameObjects.Text>;
    private nextLevelBtn?:Phaser.GameObjects.Triangle;
    private previousLevelBtn?:Phaser.GameObjects.Triangle;

    constructor(){
        super('PreloadScene');
    }

    preload(){
        this.load.spritesheet('tiles', 'assets/tilesheet/sokoban_tilesheet_extruded.png',
            {
                frameWidth: 64,
                frameHeight: 64,
                margin: 1,
                spacing: 2,
                startFrame: 0
            });
        
        this.load.json('levelJson', 'assets/map/SokobanLevels.json');
    
        this.load.audio('box-drop', 'assets/sounds/effects/box_drop.mp3');

        this.load.audio('hole-fill', 'assets/sounds/effects/hole_fill.ogg');
    }

    create(){

        const width = this.scale.width;
        const height = this.scale.height;

        const gameTitle = this.add.text(width * 0.5, height * 0.2, 'Sokoban Puzzle!',{
            fontSize: '48px',
            color: '#CCCC00',
            fontStyle: 'bolder'
        }).setOrigin(0.5);
        
        let playRecords: IPlayRecords = this.data.get('playRecords') as IPlayRecords;

        if (!playRecords){
            playRecords =  {
                level: 1,
                title: '1-1'
            };
        }

        console.log(playRecords);

        const levels = this.cache.json.get('levelJson') as Array<SokobanLevelInfo>;
        const btnRect = {
            width: 90,
            height: 60
        };

        const rowSetting = {
            maxRowNumber: 5,
            maxPageNumber: 20,
            margin: {
                x: 0,
                y: 0,
                left: 20,
                down: 20,
            }
        };

        rowSetting.margin.x = (width - (btnRect.width + rowSetting.margin.left) * rowSetting.maxRowNumber + rowSetting.margin.left + btnRect.width) * 0.5;
        rowSetting.margin.y = height * 0.4;

        this.levelPicker = {
            currentPage: 1,
            totalPages: 1,
            totalLevels: Math.min(levels.length, SokobanLevel.HighestLevel)
        };

        this.levelPicker.totalPages = Math.ceil(this.levelPicker.totalLevels / rowSetting.maxPageNumber);
        this.levelBlocks = new Array<Phaser.GameObjects.Rectangle>();
        this.levelBlockLabels = new Array<Phaser.GameObjects.Text>();

        for(let i = 0, row = 0, col = 0, visible = true; i < this.levelPicker.totalLevels; i++, col++){

            // prepare next page levels's buttons
            if (i > 0 && i % rowSetting.maxPageNumber === 0){
                col = 0;
                row = 0;
                visible = false;
            }

            let posX = col * (rowSetting.margin.left + btnRect.width) + rowSetting.margin.x;
            let posY = rowSetting.margin.y + row * (rowSetting.margin.down + btnRect.height);
            let levelInfo = levels[i];

            if (i > 0 && ((i+1) % rowSetting.maxRowNumber === 0)){
                col = -1;
                row++;
            }

            const btn = this.add.rectangle(posX, posY, btnRect.width, btnRect.height, 0xffffff)
            .setVisible(visible)
            .setInteractive();

            const btn_label = this.add.text(posX, posY, `LV.${levelInfo.level}`, 
            {
                color: '#000',
                fontStyle: 'bolder'
            })
            .setOrigin(0.5)            
            .setVisible(visible);

            btn.once('pointerup', () => {
                this.scene.start('GameScene', {level: levelInfo.level});
            }, this);

            this.levelBlocks.push(btn);
            this.levelBlockLabels.push(btn_label);
        }


        if (this.levelPicker.totalPages > 1){
            let posX = width * 0.5 + (btnRect.width + rowSetting.margin.left) * 3;
            let posY = rowSetting.margin.y + (btnRect.height + rowSetting.margin.down) * 1.5;
            
            this.nextLevelBtn = this.add.triangle(posX, posY, 
                0, 0,
                0, 64,
                32,32,
                0xffffff)
            .setInteractive();

            this.nextLevelBtn.on('pointerup', ()=>{

                let prePage = this.levelPicker!.currentPage;

                this.levelPicker!.currentPage = Math.min(this.levelPicker!.currentPage + 1, this.levelPicker!.totalPages);

                if (this.levelPicker?.currentPage === this.levelPicker?.totalPages){
                    this.nextLevelBtn?.setVisible(false);
                }

                this.previousLevelBtn?.setVisible(true);

                let i = (prePage - 1) * rowSetting.maxPageNumber;
                let max_i = Math.min(prePage * rowSetting.maxPageNumber, this.levelPicker!.totalLevels);
                for(; i < max_i; i++){
                    this.levelBlocks![i].setVisible(false);
                    this.levelBlockLabels![i].setVisible(false);
                }

                i = (this.levelPicker!.currentPage - 1) * rowSetting.maxPageNumber;
                max_i = Math.min(this.levelPicker!.currentPage * rowSetting.maxPageNumber, this.levelPicker!.totalLevels);
                for(; i < max_i; i++){
                    this.levelBlocks![i].setVisible(true);
                    this.levelBlockLabels![i].setVisible(true);
                }
            }, this);

            posX = width * 0.5 - (btnRect.width + rowSetting.margin.left) * 3;
            
            this.previousLevelBtn = this.add.triangle(posX, posY, 
                32, 0,
                32, 64,
                 0, 32,
                0xffffff)
            .setVisible(false)
            .setInteractive();

            this.previousLevelBtn.on('pointerup', ()=>{

                let prePage = this.levelPicker!.currentPage;

                this.levelPicker!.currentPage = Math.max(this.levelPicker!.currentPage - 1, 1);

                if (this.levelPicker?.currentPage === 1){
                    this.previousLevelBtn?.setVisible(false);
                }

                this.nextLevelBtn?.setVisible(true);

                let i = (prePage - 1) * rowSetting.maxPageNumber;
                let max_i = Math.min(prePage * rowSetting.maxPageNumber, this.levelPicker!.totalLevels);
                for(; i < max_i; i++){
                    this.levelBlocks![i].setVisible(false);
                    this.levelBlockLabels![i].setVisible(false);
                }

                i = (this.levelPicker!.currentPage - 1) * rowSetting.maxPageNumber;
                max_i = Math.min(this.levelPicker!.currentPage * rowSetting.maxPageNumber, this.levelPicker!.totalLevels);
                for(; i < max_i; i++){
                    this.levelBlocks![i].setVisible(true);
                    this.levelBlockLabels![i].setVisible(true);
                }
            }, this);
        }
    }

    update(){

    }
}