
import Phaser from 'phaser';
import { Materials, SokobanLevel, BoxColors } from '~enums/SokobanEnums';
import { GetBoxTargetColor, GetSokobanLevelData, GetBoxAnchorColor, GetBrowserMobileMode } from '~util/SokobanBoxUtil';
import { MoveOrientation } from '~types/SokobanTypes';

export default class GameScene extends Phaser.Scene {

    private readonly SIZE: {w:number, h:number};
    private readonly BOXCOLORS: Array<BoxColors>;
    private readonly MOBILEMODE: boolean;

    private player?: Phaser.GameObjects.Sprite;
    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
    private boxes?: { [key: number]: Array<Phaser.GameObjects.Sprite> } = {};
    private layer?: Phaser.Tilemaps.TilemapLayer;
    private scores?: { [key: number]: number } = {};
    private steps?: number;
    private stepsLabel?: Phaser.GameObjects.Text;

    private debugPos?: Phaser.GameObjects.Rectangle;

    private currentLevel: number = 1;

    private joySticks?: { [key: string]: Phaser.GameObjects.Rectangle } = {};

    private currentJoyStick?: string;

    constructor() {
        super('GameScene');
        this.SIZE = {w: 64, h: 64};
        this.BOXCOLORS = [BoxColors.BoxOrange, BoxColors.BoxRed, BoxColors.BoxBlue, BoxColors.BoxGreen, BoxColors.BoxGrey];
        this.MOBILEMODE = GetBrowserMobileMode();
    }

    init(){
        this.steps = 0;
        this.resetCurrentJoyStick();
    }

    preload() {
        this.load.spritesheet('tiles', 'assets/tilesheet/sokoban_tilesheet.png',
            {
                frameWidth: this.SIZE.w,
                startFrame: 0
            });
    }

    create(data: {level: SokobanLevel}) {

        data = Object.assign({level: SokobanLevel.Level1}, data);

        this.currentLevel = data.level;

        console.log(`level ${data.level}`);

        const level = GetSokobanLevelData(this.currentLevel);

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

        if (this.game.config.physics.arcade?.debug){
            this.debugPos = this.add.rectangle(0, 0 , 10, 10, 0xff0000);
        }

        this.stepsLabel = this.add.text(540, 10, `Steps: ${this.steps}`);

        /*  
         * center the main camera viewpoint
         */
        //console.log(this.scale.gameSize);

        const gameWidth = typeof this.game.config.width === 'number' ? this.game.config.width : 0;
        const gameHeight = typeof this.game.config.height === 'number' ? this.game.config.height : 0;
        const parent = new Phaser.Structs.Size(this.scale.gameSize.width, this.scale.gameSize.height);
        const sizer = new Phaser.Structs.Size(gameWidth, gameHeight, Phaser.Structs.Size.FIT, parent);

        // console.log(parent);
        // console.log(sizer);

        const camera = this.cameras.main;
        camera.centerOn(gameWidth * 0.5, gameHeight * 0.5);

        if (this.MOBILEMODE){

            this.input.addPointer();

            // joystick
            const screenHeight = sizer.height;
            // up-stick
            this.joySticks!['up'] = this.add.rectangle(65, screenHeight - 165, 50, 80, 0x5090c7, 0.6).setInteractive();
            // down-stick
            this.joySticks!['down'] = this.add.rectangle(65, screenHeight - 35, 50, 80, 0x5090c7, 0.6).setInteractive();
            // left-stick
            this.joySticks!['left'] = this.add.rectangle(0, screenHeight - 100, 80, 50, 0x5090c7, 0.6).setInteractive();
            // right-stick
            this.joySticks!['right'] = this.add.rectangle(130, screenHeight - 100, 80, 50, 0x5090c7, 0.6).setInteractive();
        
            this.initJoySticksEvent();
        }
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

        if (this.MOBILEMODE){

            if (this.currentJoyStick !== 'idle'){
                const stick = this.currentJoyStick;

                if (stick == 'left'){
                    justDownHandle.left = true;
                }
                else if (stick == 'right'){
                    justDownHandle.right = true;
                }
                else if (stick == 'up'){
                    justDownHandle.up = true;
                }
                else if (stick == 'down'){
                    justDownHandle.down = true;
                }
            }
        }

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
    
        if (this.MOBILEMODE){
            this.resetCurrentJoyStick();
        }
        
        this.updateGameLabels();
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

        let boxData: { box: Phaser.GameObjects.Sprite, color: BoxColors } | undefined;

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
            const target = GetBoxTargetColor(color);
            const anchor = GetBoxAnchorColor(color);
            // is there a sibling box on the next move position ? 
            // the 'pos' is the player next move position with offset
            const siblingBox = this.getBoxDataAtPos(pos.x + pos.offsetX, pos.y + pos.offsetY);

            this.debugPos?.setPosition(pos.x + pos.offsetX, pos.y + pos.offsetY);

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

                        box.setFrame(anchor)
                    }

                    // when box move out of the target , scores should substract 1 
                    const moveOutTarget = this.hasDestTileAtPos(box.x - pos.offsetX, box.y - pos.offsetY, [ target ]);
                        
                    if (moveOutTarget){
                        this.scores![color] = Math.max(0, this.scores![color] - 1);

                        // when next position is none, the box should restore its perface
                        if (!coverTarget){
                            box.setFrame(color)
                        }
                    }
                }
            }, tweenConfig));
        }
        
        this.tweens.add(Object.assign({
            targets: this.player,
            onComplete: () => {
                this.steps!++;
                
                const levelCompleted = this.checkAllTargetCovered();
                if (levelCompleted){
                    this.scene.start('LevelCompleteScene', {steps: this.steps, level: this.currentLevel});
                }
            }
        }, tweenConfig));

    }

    private hasDestTileAtPos(x: number, y: number, nums: number[]): boolean{
        if(!this.layer){
            return false;
        }

        const tile = this.layer.getTileAtWorldXY(x, y);

        return nums.indexOf(tile?.index) != -1;
    }

    private makeColorBoxes(): void{

        if (!this.boxes || !this.layer){
            return;
        }

        this.BOXCOLORS.forEach(i => {
            // init box tile
            this.boxes![i] = this.layer!.createFromTiles(i, 0, { key: 'tiles', frame: i })
            .map(box => box.setOrigin(0));
            // init scores data
            this.scores![i] = 0;
        });

    }

    private checkAllTargetCovered(): boolean{
        if (!this.layer || !this.boxes || !this.scores){
            return false;
        }

        for(let i = 0; i < this.BOXCOLORS.length; i++){
            const color = this.BOXCOLORS[i];

            const colorBoxes = this.boxes[color];
            const targetScore = this.scores[color];

            //console.log(color, targetScore, colorBoxes.length)
            if (targetScore < colorBoxes.length){
                return false;
            }
        }

        return true;
    }

    private updateGameLabels(){
        if (!this.stepsLabel){
            return;
        }

        this.stepsLabel.text = `Steps: ${this.steps}`;
    }

    private initJoySticksEvent(){
        if (!this.joySticks){
            return;
        }

        const joyStickNames = Object.keys(this.joySticks!);
        for(let i = 0; i < joyStickNames.length; i++){
            const stick = joyStickNames[i];
            this.joySticks[stick].on('pointerup', ()=>{
                this.currentJoyStick = stick;
            }, this);
        }
    }

    private resetCurrentJoyStick(){
        this.currentJoyStick = 'idle';
    }
}
