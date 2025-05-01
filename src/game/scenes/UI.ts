import { Scene } from 'phaser';
import EventBus from '../utils/EventBus';

export class UI extends Scene {
    private coinLabel!: Phaser.GameObjects.Text
	private score = 0


    constructor() {
        super({
            key: 'ui'
        })
    }
    init() {
        this.score = 0
    }
    create () {
        this.coinLabel = this.add.text(36, 36, 'Score : 0', {
            fontSize: 32
        })

        EventBus.on('bubble.popped', (score: number) => {
            this.score  += score

            this.coinLabel.setText('Score : ' + Math.floor(this.score))
        });
    }
}