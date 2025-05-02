import { Scene } from 'phaser';
import EventBus from '../utils/EventBus';

export class UI extends Scene {
    private coinLabel!: Phaser.GameObjects.Text
	private score = 0;

    private formatNumber(number: number): string {
        return new Intl.NumberFormat('fr-FR', { style: "currency", currency: "EUR" }).format(number);
    }
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

        EventBus.on('score.marked', (score: number) => {
            if (score <= 0) {
                return;
            }
            this.score  += score
            this.showPointScored(this.formatNumber(score))
            this.coinLabel.setText('Score : ' + this.formatNumber(this.score));
        });
    }

    private showPointScored(point: string) {
        const pointText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, `+${point}`, {
            fontSize: 64,
            color: '#00ff00'
        }).setOrigin(0.5);

        this.tweens.add({
            targets: pointText,
            y: pointText.y - 50,
            alpha: 0,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => {
                pointText.destroy();
            }
        });
    }

}