import { Scene, GameObjects, Math, Geom } from 'phaser';
import BubbleController from '../controllers/BubbleController';
import CountdownController from '../controllers/CountdownController';
import StopWatchController from '../controllers/StopWatchController';
import SpawnWaveController from '../controllers/SpawnWaveController';
import EventBus from '../utils/EventBus';

export class Game extends Scene
{   
    private bubbles: BubbleController[];
    private countdown?: CountdownController;
    private spawnWaveController?: SpawnWaveController;
    private stopWatch?: StopWatchController;
    private score = 0;
    private touched = false;
    private health = 100;

    constructor ()
    {
        super('Game');
    }

    init ()
    {
        this.bubbles = [];
        this.score = 0;
    }

    create ()
    {   
        // very light blue
        this.cameras.main.setBackgroundColor(0x028af8);
        
        this.scene.launch('ui');
        
        this.stopWatch = new StopWatchController(this);
        this.spawnWaveController = new SpawnWaveController(this, 1000, 10);

        this.input.on('pointerdown', (pointer: { x: number; y: number; }) => {
            if(this.touched) {
                return;
            }

            this.spawnWaveController?.touch(pointer.x, pointer.y)
            
            this.touched = true;
        });

        this.input.on('pointerup', () => {
            this.touched = false;
            this.cameras.main.shake(100, 0.01); // Shake for 500ms with intensity 0.01
        });


        EventBus.on('score.marked', (score: number) => {
            if (score <= 0) {
                return;
            }
            this.score  += score
        });

        EventBus.on('bubble.destroyed', (bubble: BubbleController) => {
            this.cameras.main.shake(100, 0.01); // Shake for 500ms with intensity 0.01
            this.cameras.main.flash(50, 0xFF0000); // Flash red for 500ms

            this.health -= bubble.damage;
            
            if (this.health <= 0) {
                this.scene.stop('ui');
                this.scene.stop();
                EventBus.off('bubble.popped');
                EventBus.off('score.marked');
                this.scene.start('GameOver', { score: this.score });
            }
        });
    }

    update(time: number, delta: number): void {
        this.bubbles.forEach(bubble => { 
            bubble.update(delta);
        });
        this.spawnWaveController?.update(time, delta);
        this.countdown?.update(delta);
        this.stopWatch?.update(time, delta);
    }
}   
