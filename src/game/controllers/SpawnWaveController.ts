import Phaser from 'phaser';

import BubbleController from './BubbleController';
import EventBus from '../utils/EventBus';

export default class SpawnWaveController {
    private scene: Phaser.Scene;
    public bubbles: BubbleController[];
    private spawnWave: Phaser.GameObjects.Group;
    private spawnTime: number = 0;
    private spawnTimeInterval: number = 1; // Initial spawn time interval
    private spawnTimeDecreseRate: number;
    private changeSpawnTimeInterval: number = 3; // Time in seconds to change the spawn time interval
    private changeSpawnTime: number = 0;
    private spawnTimeMin: number;
    private spawnWaveCount: number;
    private spawnWaveCountMax: number;
    private spawnWaveCountMin: number;
    private spawnWaveCountMaxLimit: number;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.spawnWave = scene.add.group();
        this.spawnTime = 0;
        this.spawnTimeInterval = 1; // Initial spawn time interval
        this.spawnTimeDecreseRate = 0.1; // Decrease the time by 0.1 seconds every second
        this.spawnTimeMin = 0.10; // Minimum time between spawns
        this.spawnWaveCount = 0;
        this.spawnWaveCountMax = 10; // Maximum bubbles in a wave
        this.spawnWaveCountMin = 1; // Minimum bubbles in a wave
        this.spawnWaveCountMaxLimit =  10; // Maximum bubbles in a wave
        this.bubbles = [];

        EventBus.on('bubble.popped', (bubble: BubbleController) => {
            const index = this.bubbles.indexOf(bubble);
            if (index > -1) {
                this.bubbles.splice(index, 1);
            }
        });

        EventBus.on('bubble.destroyed', (bubble: BubbleController) => {
            const index = this.bubbles.indexOf(bubble);
            if (index > -1) {
                this.bubbles.splice(index, 1);
            }
        });
    }
    public update(t: number, dt: number) {
        this.spawnTime += dt / 1000; // Convert milliseconds to seconds
        this.spawnWaveCount += dt / 1000; // Convert milliseconds to seconds
        this.changeSpawnTime += dt / 1000; // Convert milliseconds to seconds

        if (this.spawnTime >= this.spawnTimeInterval) {
            this.spawnWaveCount = Math.max(this.spawnWaveCountMin, this.spawnWaveCountMax - Math.floor(this.spawnWaveCount / this.spawnWaveCountMaxLimit));
            this.spawnTime = 0;
            this.createBubbleWave();
        }

        if(this.changeSpawnTime >= this.changeSpawnTimeInterval ){
            this.changeSpawnTime = 0;
            this.spawnTimeInterval -= this.spawnTimeDecreseRate;
            this.spawnTimeInterval = Math.max(this.spawnTimeMin, this.spawnTimeInterval);
        }

        this.bubbles.forEach(bubble => { 
            bubble.update(dt);
        });
    }
    public touch(x: number, y: number) {
        Promise.all(this.bubbles.map(bubble => { bubble.touch(x, y); }));
    }
        
    private createBubbleWave() {    
        const x = Phaser.Math.Between(50, this.scene.scale.width - 50);  // Random x within game width
        const y = Phaser.Math.Between(1000, this.scene.scale.height); // Random y within game height
        const bubble = this.scene.add.sprite(x, y, 'sphere')
        
        bubble.setDisplaySize(50*2, 50*2)
        this.bubbles.push(new BubbleController(bubble));
    }
}