import Phaser from 'phaser';

import GameScene from './scenes/GameScene'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 640,
	height: 512,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 200 },
			debug: true
		}
	},
	scene: [GameScene]
}

export default new Phaser.Game(config)
