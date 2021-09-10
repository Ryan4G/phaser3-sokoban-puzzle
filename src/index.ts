import Phaser from 'phaser';

import GameScene from './scenes/GameScene'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 640,
	height: 512,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 },
			debug: false
		}
	},
	scene: [GameScene]
}

export default new Phaser.Game(config)
