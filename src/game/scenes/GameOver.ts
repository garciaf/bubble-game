import { Scene } from 'phaser';

export class GameOver extends Scene
{
    private score: number;
    constructor ()
    {
        super('GameOver');
    }
    init(data: { score: number; }) {
        this.score = data.score;
    }

    private formatNumber(number: number): string {
        return new Intl.NumberFormat('fr-FR', { style: "currency", currency: "EUR" }).format(number);
    }

    create ()
    {
        this.cameras.main.setBackgroundColor(0x000000);

        this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 100, 'Game Over', {
            fontFamily: 'Arial Black', fontSize: 64, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, `Score: ${this.formatNumber(this.score)}`, {
            fontFamily: 'Arial Black', fontSize: 32, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);
        

        this.input.once('pointerdown', () => {

            this.scene.start('Game');

        });
    }
}
