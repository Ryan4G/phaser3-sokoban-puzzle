
import Phaser from 'phaser';

type MoveOrientation = 'left' | 'right' | 'up' | 'down';

export default class GameScene extends Phaser.Scene {

    private readonly SIZE:{w:number, h:number} = {w: 64, h: 64};
    private player?: Phaser.GameObjects.Sprite;
    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
    private boxes?: Array<Phaser.GameObjects.Sprite>;
    private optState?: boolean = false;


    constructor() {
        super('GameScene');
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
            [100,   0,   0,   0,   0,   0,   0,   0,   0, 100],
            [100,   0,   0,  51,   8,   0,   0,  52,   0, 100],
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

        const tiles = map.addTilesetImage('tiles');
        const layer = map.createLayer(0, tiles, 0, 0);

        this.player = layer.createFromTiles(52, 0, { key: 'tiles', frame: 52}).pop();
        this.player?.setOrigin(0);

        this.cursors = this.input.keyboard.createCursorKeys();

        this.createPlayerAnimation();
        
        this.boxes = layer.createFromTiles(8, 0, { key: 'tiles', frame: 8 })
        .map(box => box.setOrigin(0));

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

        if (this.optState){
            return;
        }

        if (justDownHandle.left) {
            this.actionPlayerMoved('left');
        }
        else if (justDownHandle.right) {
            this.actionPlayerMoved('right');
        }
        else if (justDownHandle.up) {
            this.actionPlayerMoved('up');
        }
        else if (justDownHandle.down) {
            this.actionPlayerMoved('down');
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

    private findPlayerCollideBox(x: number, y: number){
        return this.boxes?.find(box => {
            const rect = box.getBounds();
            console.log(rect.x, rect.y, rect.width, rect.height);
            console.log(x, y, rect.contains(x, y));
            return rect.contains(x, y);
        });
    }

    private actionPlayerMoved(orientation: MoveOrientation){
        if (!this.player){
            return;
        }

        this.optState = true;

        let box: Phaser.GameObjects.Sprite | undefined;

        let tweenConfig = {
            duration: 500
        };

        switch(orientation){
            case 'up':{

                this.player.anims.play('up', true);

                box = this.findPlayerCollideBox(this.player.x + this.SIZE.w / 2, this.player.y - this.SIZE.h / 2);
                
                tweenConfig = Object.assign(tweenConfig, {
                    y: `-=${this.SIZE.h}`
                });

                break;
            }
            case 'down':{

                this.player.anims.play('down', true);

                box = this.findPlayerCollideBox(this.player.x + this.SIZE.w * 0.5, this.player.y + this.SIZE.h * 1.5);
                
                tweenConfig = Object.assign(tweenConfig, {
                    y: `+=${this.SIZE.h}`
                });

                break;
            }
            case 'left':{

                this.player.anims.play('left', true);

                box = this.findPlayerCollideBox(this.player.x - this.SIZE.w * 0.5, this.player.y + this.SIZE.h * 0.5);

                tweenConfig = Object.assign(tweenConfig, {
                    x: `-=${this.SIZE.w}`
                });

                break;
            }
            case 'right':{

                this.player.anims.play('right', true);

                box = this.findPlayerCollideBox(this.player.x + this.SIZE.w * 1.5, this.player.y + this.SIZE.h * 0.5);
                
                tweenConfig = Object.assign(tweenConfig, {
                    x: `+=${this.SIZE.w}`
                });

                break;
            }
        }

        if (box){
            this.tweens.add(Object.assign(tweenConfig, {
                targets: box,
            }));
        }
        
        this.tweens.add(Object.assign(tweenConfig, {
            targets: this.player,
            onComplete: ()=>{
                this.optState = false;
            }
        }));

    }
}
