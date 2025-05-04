import { Scene, Geom } from 'phaser';

export class GameOver extends Scene
{
    private score: number;
    private bubble: Phaser.GameObjects.Sprite;
    constructor ()
    {
        super('GameOver');
    }
    init(data: { score: number; }) {
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        this.score = data.score;
    }

    private formatNumber(number: number): string {
        return new Intl.NumberFormat('fr-FR').format(number);
    }

    create ()
    {
        this.cameras.main.setBackgroundColor(0x028af8);
        this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 100, 'Game Over', {
            fontFamily: 'Arial Black', fontSize: 60, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);
        

        this.bubble = this.add.sprite(0, 0, 'sphere').setScale(0.5);
        const scoreText = this.add.text( - (this.bubble.displayWidth/2) - 20, 0, this.formatNumber(this.score), {
            fontFamily: 'Arial Black', fontSize: 50, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8
        }).setOrigin(0, 0.5);;


        this.add.container(this.cameras.main.centerX, this.cameras.main.centerY, [scoreText, this.bubble]);


        const buttonX = this.cameras.main.centerX;
        const buttonY = 50;

        const restartButton = this.add.container(buttonX, buttonY).setVisible(false);
        
        const buttonWidth = 200;
        const buttonHeight = 100;
        const text = this.add.text(0, 0, 'Restart', {
            fontSize: '24px',
            color: '#ffffff',
            fontFamily: 'Arial'
          }).setOrigin(0.5);
        
        
        restartButton.setInteractive(new Geom.Rectangle(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight), Geom.Rectangle.Contains);

        restartButton.on('pointerdown', () => {
            this.scene.start('Game');
        });
        
        restartButton.add([text]);

        // 
        restartButton.setVisible(true);
    }

    update(): void {
        this.bubble.angle += 0.5;
        this.bubble.setScale(0.18 + Math.sin(this.bubble.angle * Math.PI / 180) * 0.02);
    }

    
}
