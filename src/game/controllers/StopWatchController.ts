import { formatTime } from '../utils/FormatHelper';

export default class StopWatchController {
    private stopwatch: Phaser.GameObjects.Text;
    private time: number;

    constructor(scene: Phaser.Scene) {
        this.time = 0;
        
        this.stopwatch = scene.add.text(scene.scale.width - 60, 70, '0', {
            fontSize: '30px',
            color: '#ffffff',
            stroke: '#000000', 
            strokeThickness: 4
        }).setOrigin(0.5);
    }

    public update(t: number, dt: number) {
        this.time += dt / 1000; // Convert milliseconds to seconds
        this.stopwatch.setText(formatTime(this.time));
    }
}