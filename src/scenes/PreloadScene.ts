import Phaser from "phaser";

export default class PreloadScene extends Phaser.Scene{

    constructor(){
        super('PreloadScene');
    }

    preload(){
        
    }

    create(){
        //console.log(this.cache.json.get('levelJson'));
        
        this.scene.start('GameScene');
    }

    update(){

    }
}