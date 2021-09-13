import Phaser from 'phaser';

import GameScene from './scenes/GameScene'
import LevelCompleteScene from '~scenes/LevelCompleteScene';
import PreloadScene from '~scenes/PreloadScene';

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	scale:{
		mode: Phaser.Scale.RESIZE,
        parent: 'phaser-main',
	},
	width: 640,
	height: 512,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 },
			debug: false
		}
	},
	scene: [PreloadScene, GameScene, LevelCompleteScene]
}

export default new Phaser.Game(config)
