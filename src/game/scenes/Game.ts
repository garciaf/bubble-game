import { Scene, GameObjects, Math, Geom } from 'phaser';
import BubbleController from './BubbleController';
import CountdownController from './CountdownController';
import EventBus from '../utils/EventBus';

export class Game extends Scene
{   
    private bubbles: BubbleController[];
    private bubbleSpawnRate = 300; // 0.2 second 
    private goldBubbleSpawnRate = 1000; // 5 seconds
    private goldBubblePointValue = 10000;
    private bubblePointValue = 1000;
    private countdown?: CountdownController;
    private pointDeceaseRate = 1;
    private goldPointDeceaseRate = 8;
    private GameLength = 10;
    private radius = 10;
    private score = 0;
    private touched = false;

    constructor ()
    {
        super('Game');
    }

    init ()
    {
        this.bubbles = [];
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
            callback: this.spwawnRegularBubble.bind(this), // Bind the context to the current scene
            loop: true               // Keep repeating the event
        });
        
        this.scene.launch('ui');
        
        this.countdown = new CountdownController(this, this.GameLength, () => {
            this.scene.stop('ui');
            this.scene.stop();
            EventBus.off('bubble.popped');
            EventBus.off('score.marked');
            this.scene.start('GameOver', { score: this.score });
        });

        this.time.addEvent({
            delay: this.goldBubbleSpawnRate,            // Time in milliseconds (5000 ms = 5 seconds)
            callback: this.SpawnGoldBubble.bind(this), // Bind the context to the current scene
            loop: true               // Keep repeating the event
        });

        this.input.on('pointerdown', (pointer: { x: number; y: number; }) => {
            if(this.touched) {
                return;
            }
            
            Promise.all(this.bubbles.map(bubble => { bubble.touch(pointer.x, pointer.y); }));
            
            this.touched = true;
        });

        this.input.on('pointerup', () => {
            this.touched = false;
            this.cameras.main.shake(100, 0.01); // Shake for 500ms with intensity 0.01
        });

        EventBus.on('bubble.popped', (bubble: BubbleController) => {
            const index = this.bubbles.indexOf(bubble);
            if (index > -1) {
                this.bubbles.splice(index, 1);
            }
        });

        EventBus.on('score.marked', (score: number) => {
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

    /**
     * Spawns a bubble at a random position within the game area.
     * The bubble is added to the bubbles array for tracking.
     */
    private spwawnRegularBubble() {
        this.spwanBubble();
    }

    private SpawnGoldBubble() {
        this.spwanBubble(0xFFD700, this.goldBubblePointValue, this.goldPointDeceaseRate);
    }

    private spwanBubble(color?: number, point: number = this.bubblePointValue, pointDeceaseRate: number = this.pointDeceaseRate) { 
        const x = Math.Between(50, this.scale.width - 50);  // Random x within game width
        const y = Math.Between(1000, this.scale.height); // Random y within game height
        const bubble = this.add.sprite(x, y, 'sphere')
        if (color) {
            bubble.setTint(color);
        }
        
        bubble.setDisplaySize(50*2, 50*2)
        this.bubbles.push(new BubbleController(bubble, this.radius, point, pointDeceaseRate));
    }
}   
