import { Scene } from 'phaser';
import EventBus from '../utils/EventBus';

export class UI extends Scene {
	private score = 0;
    private health = 100;
    private scoreText: Phaser.GameObjects.Text;
    private graphics!: Phaser.GameObjects.Graphics


    private formatNumber(number: number): string {
        return new Intl.NumberFormat('fr-FR').format(number);
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
        EventBus.on('score.marked', (score: number) => {
            if (score <= 0) {
                return;
            }
            this.score  += score
            this.showPointScored(this.formatNumber(score))
            this.refreshScore();
        });

        EventBus.on('bubble.destroyed', (bubble: any) => {
            this.showDamage(bubble.damage);
            this.setHealthBar(this.health -= bubble.damage);
        });
        

        const bubble = this.add.sprite(0, 0, 'sphere').setScale(0.20);
        this.scoreText = this.add.text( - (bubble.displayWidth) - 20, 0, this.formatNumber(this.score), {
            fontFamily: 'Arial Black', fontSize: 50, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8
        }).setOrigin(0, 0.5);;

        this.add.container(120, 70, [this.scoreText, bubble]);


        this.graphics = this.add.graphics()
        this.setHealthBar(100)
    }   

    private refreshScore() {
        this.scoreText.setText(this.formatNumber(this.score));
    }

    private showDamage(damage: number) {
        const damageText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, `-${damage}`, {
            fontSize: 64,
            color: '#ff0000'
        }).setOrigin(0.5);
        this.tweens.add({
            targets: damageText,
            y: damageText.y - 50,
            alpha: 0,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => {
                damageText.destroy();
            }
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

    private setHealthBar(value: number)
	{
		const width = this.cameras.main.width - 20
		const percent = Phaser.Math.Clamp(value, 0, 100) / 100

		this.graphics.clear()
		this.graphics.fillStyle(0x808080)
		this.graphics.fillRoundedRect(10, 10, width, 20, 5)
		if (percent > 0)
		{
			this.graphics.fillStyle(0x00ff00)
			this.graphics.fillRoundedRect(10, 10, width * percent, 20, 5)
		}
	}

}