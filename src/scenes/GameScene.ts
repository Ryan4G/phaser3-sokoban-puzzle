
import Phaser from 'phaser';
import {Materials} from '~enums/SokobanEnums';
import {GetBoxColorTargetMap} from '~util/SokobanBoxUtil';
import {MoveOrientation} from '~types/SokobanTypes';

export default class GameScene extends Phaser.Scene {

    private readonly SIZE: {w:number, h:number};
    private readonly BOXCOLORS: Array<Materials>;
    private readonly BOXCOLOR_TARGET_MAP: {[key:number]:number};

    private player?: Phaser.GameObjects.Sprite;
    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
    private boxes?: { [key: number]: Array<Phaser.GameObjects.Sprite> } = {};
    private layer?: Phaser.Tilemaps.TilemapLayer;
    private scores?: { [key: number]: number } = {};

    private debugPos?: Phaser.GameObjects.Rectangle;

    constructor() {
        super('GameScene');
        this.SIZE = {w: 64, h: 64};
        this.BOXCOLORS = [Materials.BoxOrange, Materials.BoxRed, Materials.BoxBlue, Materials.BoxGreen, Materials.BoxGrey];
        this.BOXCOLOR_TARGET_MAP = GetBoxColorTargetMap();
    }

    preload() {
        this.load.spritesheet('tiles', 'assets/tilesheet/sokoban_tilesheet.png',
            {
                frameWidth: this.SIZE.w,
                startFrame: 0
            });
    }

    create() {
        const level = [
            [100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
            [100,   0,   0,   0,   0,   0,   0,   0,   0, 100],
            [100,   6,   7,   8,   9,  10,   0,   0,   0, 100],
            [100,  25,  38,  51,  64,  77,   0,  52,   0, 100],
            [100,   0,   0,   0,   0,   0,   0,   0,   0, 100],
            [100,   0,   0,   0,   0,   0,   0,   0,   0, 100],
            [100,   0,   0,   0,   0,   0,   0,   0,   0, 100],
            [100, 100, 100, 100, 100, 100, 100, 100, 100, 100]
        ];

        const map = this.make.tilemap({
            data: level,
            tileHeight: this.SIZE.h,
            tileWidth: this.SIZE.w
        });

        map.setCollisionBetween(100, 105);

        const tiles = map.addTilesetImage('tiles');
        this.layer = map.createLayer(0, tiles, 0, 0);

        this.player = this.layer.createFromTiles(52, 0, { key: 'tiles', frame: 52}).pop();

        this.player?.setOrigin(0);

        this.cursors = this.input.keyboard.createCursorKeys();

        this.createPlayerAnimation();
        
        this.makeColorBoxes();

        this.debugPos = this.add.rectangle(0, 0 , 10, 10, 0xff0000);
    }

    update() {
        if (!this.cursors || !this.player) {
            return;
        }
        
        const justDownHandle = {
            left: Phaser.Input.Keyboard.JustDown(this.cursors.left),
            right: Phaser.Input.Keyboard.JustDown(this.cursors.right),
            up: Phaser.Input.Keyboard.JustDown(this.cursors.up),
            down: Phaser.Input.Keyboard.JustDown(this.cursors.down)
        };

        if (this.tweens.isTweening(this.player!)){
            return;
        }

        if (justDownHandle.left) {
            this.tweenMoved('left');
        }
        else if (justDownHandle.right) {
            this.tweenMoved('right');
        }
        else if (justDownHandle.up) {
            this.tweenMoved('up');
        }
        else if (justDownHandle.down) {
            this.tweenMoved('down');
        }
        else {
            if (this.player!.anims.currentAnim) {
                // stop on the first frame
                const currAnimFirstFrame = this.player!.anims.currentAnim.frames[0];
                this.player!.anims.pause(currAnimFirstFrame);
            }
        }
    }

    private createPlayerAnimation(): void{
        
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('tiles', {
                start: 81,
                end: 83
            }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('tiles', {
                start: 78,
                end: 80
            }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('tiles', {
                start: 55,
                end: 57
            }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('tiles', {
                start: 52,
                end: 54
            }),
            frameRate: 10,
            repeat: -1
        });

    }

    private getBoxDataAtPos(x: number, y: number){
        for(let i = 0; i < this.BOXCOLORS.length; i++){
            const color = this.BOXCOLORS[i];
            const box = this.boxes![color].find(item => {
                const rect = item.getBounds();
                // console.log(rect.x, rect.y, rect.width, rect.height);
                // console.log(x, y, rect.contains(x, y));
                return rect.contains(x, y);
            });

            if (!box){
                continue;
            }
            
            return { box, color };
        }

        return undefined;
    }

    private tweenMoved(orientation: MoveOrientation){
        if (!this.player){
            return;
        }

        let boxData: { box: Phaser.GameObjects.Sprite, color: Materials } | undefined;

        let tweenConfig = {
            duration: 500
        };

        let pos: {x: number, y: number, offsetX: number, offsetY: number} 
        = {x: 0, y: 0, offsetX: 0, offsetY: 0};

        switch(orientation){
            case 'up':{

                this.player.anims.play('up', true);

                pos.x = this.player.x + this.SIZE.w / 2;
                pos.y = this.player.y - this.SIZE.h / 2;
                pos.offsetX = 0;
                pos.offsetY = -this.SIZE.h;
                
                if (this.hasDestTileAtPos(pos.x, pos.y, [ Materials.Wall ])){
                    return;
                }

                boxData = this.getBoxDataAtPos(pos.x, pos.y);
                
                tweenConfig = Object.assign(tweenConfig, {
                    y: `-=${this.SIZE.h}`
                });

                break;
            }
            case 'down':{

                this.player.anims.play('down', true);

                pos.x = this.player.x + this.SIZE.w * 0.5;
                pos.y = this.player.y + this.SIZE.h * 1.5;
                pos.offsetX = 0;
                pos.offsetY = this.SIZE.h;

                if (this.hasDestTileAtPos(pos.x, pos.y, [ Materials.Wall ])){
                    return;
                }

                boxData = this.getBoxDataAtPos(pos.x, pos.y);
                
                tweenConfig = Object.assign(tweenConfig, {
                    y: `+=${this.SIZE.h}`
                });

                break;
            }
            case 'left':{

                this.player.anims.play('left', true);

                pos.x = this.player.x - this.SIZE.w * 0.5;
                pos.y = this.player.y + this.SIZE.h * 0.5;
                pos.offsetX = -this.SIZE.w;
                pos.offsetY = 0;

                if (this.hasDestTileAtPos(pos.x, pos.y, [ Materials.Wall ])){
                    return;
                }

                boxData = this.getBoxDataAtPos(pos.x, pos.y);

                tweenConfig = Object.assign(tweenConfig, {
                    x: `-=${this.SIZE.w}`
                });

                break;
            }
            case 'right':{

                this.player.anims.play('right', true);

                pos.x = this.player.x + this.SIZE.w * 1.5;
                pos.y = this.player.y + this.SIZE.h * 0.5;
                pos.offsetX = this.SIZE.w;
                pos.offsetY = 0;

                if (this.hasDestTileAtPos(pos.x, pos.y, [ Materials.Wall ])){
                    return;
                }

                boxData = this.getBoxDataAtPos(pos.x, pos.y);
                
                tweenConfig = Object.assign(tweenConfig, {
                    x: `+=${this.SIZE.w}`
                });

                break;
            }
        }

        this.debugPos?.setPosition(pos.x, pos.y);
        
        if (boxData){
            const box = boxData.box;
            const color = boxData.color;
            const target = this.BOXCOLOR_TARGET_MAP[color];
            // is there a sibling box on the next move position ? 
            // the 'pos' is the player next move position with offset
            const siblingBox = this.getBoxDataAtPos(pos.x + pos.offsetX, pos.y + pos.offsetY);

            this.debugPos?.setPosition(pos.x + pos.offsetX, pos.y + pos.offsetY);

            console.log(siblingBox);
            if (siblingBox || this.hasDestTileAtPos(
                box.x + pos.offsetX, 
                box.y + pos.offsetY, 
                [ Materials.Wall ])){
                return;
            }

            if (!this.scores![color]){
                this.scores![color] = 0;
            }

            this.tweens.add(Object.assign({
                targets: box,
                onComplete: () => {
                    const coverTarget = this.hasDestTileAtPos(box.x, box.y, [ target ]);
                    
                    if (coverTarget){
                        this.scores![color] += 1;
                    }
                    else{
                        this.scores![color] = Math.max(0, this.scores![color] - 1);
                    }

                    //console.log(this.scores![Materials.TargetBlue])
                }
            }, tweenConfig));
        }
        
        this.tweens.add(Object.assign({
            targets: this.player
        }, tweenConfig));

        console.log(this.scores);
    }

    private hasDestTileAtPos(x: number, y: number, m: Materials[]): boolean{
        if(!this.layer){
            return false;
        }

        const tile = this.layer.getTileAtWorldXY(x, y);

        return m.indexOf(tile?.index) != -1;
    }

    private makeColorBoxes(): void{

        if (!this.boxes || !this.layer){
            return;
        }

        this.BOXCOLORS.forEach(i => {
            this.boxes![i] = this.layer!.createFromTiles(i, 0, { key: 'tiles', frame: i })
            .map(box => box.setOrigin(0));
        });

    }
}
