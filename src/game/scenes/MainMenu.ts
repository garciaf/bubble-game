import { Scene } from 'phaser';

export class MainMenu extends Scene
{
    private bubble: Phaser.GameObjects.Sprite;
    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {

        this.bubble = this.add.sprite(this.cameras.main.centerX, 200, 'sphere')
        this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, 'Bubbles SURVIVOR', {
            fontFamily: 'Arial Black', fontSize: 70, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 100, 'click to start', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        this.input.once('pointerdown', () => {
            this.scene.start('Game');
        });
    }

    update(_time: number, delta: number): void {
        this.bubble.angle += 0.5;
    }
}
