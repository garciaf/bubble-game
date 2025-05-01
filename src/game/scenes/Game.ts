import { Scene, GameObjects, Math, Geom } from 'phaser';
import BubbleController from './BubbleController';

export class Game extends Scene
{   
    private bubbles: BubbleController[];
    private pointer?: Phaser.Input.Pointer;
    private bubbleSpawnRate = 500; // 1 second 

    private colors = [
        0xff0000,
        0x00ff00,
        0x0000ff,
        0xffff00,
        0xff00ff,
        0x00ffff,
        0xff8800,
        0x00ff88,
        0x8800ff,
        0x888800,
        0x880088,
        0x008888,
        0x888888,
        0x000000
    ];

    constructor ()
    {
        super('Game');
    }

    init ()
    {
        this.bubbles = [];
        this.pointer = this.input.activePointer;
    }

    preload ()
    {
        this.load.setPath('assets');
    }

    create ()
    {   
        // very light blue
        this.cameras.main.setBackgroundColor(0x028af8);

        this.time.addEvent({
            delay: this.bubbleSpawnRate,            // Time in milliseconds (5000 ms = 5 seconds)
            callback: () => {
                const x = Math.Between(50, this.scale.width - 50);  // Random x within game width
                const y = Math.Between(50, this.scale.height - 50); // Random y within game height
                const color = this.colors[Math.Between(0, this.colors.length - 1)];
                const bubble = this.drawCircle(x, y, 10, color);
                
                this.bubbles.push(new BubbleController(bubble, this.pointer!, this.input));

            },
            loop: true               // Keep repeating the event
        });
        this.scene.launch('ui');
    }

    private drawCircle (x: number, y: number, radius: number, color: number)
    {
        return(this.add.circle(x, y, radius, color, 1));
    }
    
    update(_time: number, delta: number): void {
        this.bubbles.forEach(bubble => { 
            bubble.update(delta);
        });
    }
}
