import { Scene, Geom } from 'phaser';

export class GameOver extends Scene
{
    private score: number;
    constructor ()
    {
        super('GameOver');
    }
    init(data: { score: number; }) {
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        this.score = data.score;
    }

    private formatNumber(number: number): string {
        return new Intl.NumberFormat('fr-FR', { style: "currency", currency: "EUR" }).format(number);
    }

    create ()
    {
        this.cameras.main.setBackgroundColor(0x028af8);
        this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 100, 'Game Over', {
            fontFamily: 'Arial Black', fontSize: 64, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, `Score: ${this.formatNumber(this.score)}`, {
            fontFamily: 'Arial Black', fontSize: 50, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        const centerX = this.scale.width / 2;
        const centerY = this.scale.height / 2 + 100;

        const restartButton = this.add.container(centerX, centerY).setVisible(false);
        
        const buttonWidth = 200;
        const buttonHeight = 100;
        const text = this.add.text(0, 0, 'Restart', {
            fontSize: '24px',
            color: '#ffffff',
            fontFamily: 'Arial'
          }).setOrigin(0.5);
        
          
        const button = this.add.rectangle(centerX, centerY, buttonWidth, buttonHeight, 0xffffff, 1)
            .setOrigin(0.5)
           
        restartButton.setInteractive(new Geom.Rectangle(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight), Geom.Rectangle.Contains);

        restartButton.on('pointerdown', () => {
            this.scene.start('Game');
        });
        
        restartButton.add([button, text]);

        // 
        restartButton.setVisible(true);
    }
}
