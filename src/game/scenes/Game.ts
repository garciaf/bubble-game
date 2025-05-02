import { Scene, GameObjects, Math, Geom } from 'phaser';
import BubbleController from './BubbleController';
import CountdownController from './CountdownController';
import EventBus from '../utils/EventBus';

export class Game extends Scene
{   
    private bubbles: BubbleController[];
    private pointer?: Phaser.Input.Pointer;
    private bubbleSpawnRate = 500; // 1 second 
    private countdown?: CountdownController;
    private score = 0;

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
        this.score = 0;
    }

    preload ()
    {
        this.load.setPath('assets');
        this.load.image('sphere', 'sphere.png');
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
                // const color = this.colors[Math.Between(0, this.colors.length - 1)];
                const bubble = this.add.sprite(x, y, 'sphere',)
                bubble.setDisplaySize(50*2, 50*2)
                
                this.bubbles.push(new BubbleController(bubble, this.pointer!, this.input, 50));

            },
            loop: true               // Keep repeating the event
        });
        this.scene.launch('ui');
        this.countdown = new CountdownController(this, 10, () => {
            this.scene.stop('ui');
            this.scene.stop();
            EventBus.off('bubble.popped');
            this.scene.start('GameOver', { score: this.score });
        });

        EventBus.on('bubble.popped', (score: number) => {
            if (score <= 0) {
                return;
            }
            this.score  += score
        });
    }

    update(_time: number, delta: number): void {
        this.bubbles.forEach(bubble => { 
            bubble.update(delta);
        });

        this.countdown?.update(delta);
    }
}
