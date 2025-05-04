import { formatTime } from '../utils/FormatHelper';

export default class StopWatchController {
    private stopwatch: Phaser.GameObjects.Text;
    private time: number;
    private isRunning: boolean = false;
    private onTimeUpdate: (time: number) => void;

    constructor(scene: Phaser.Scene) {
        this.time = 0;

        this.stopwatch = scene.add.text(scene.cameras.main.centerX, scene.cameras.main.centerY - 300, '0', {
            fontSize: '64px',
            color: '#ffffff'
        }).setOrigin(0.5);
    }

    public update(t: number, dt: number) {
        this.time += dt / 1000; // Convert milliseconds to seconds
        this.stopwatch.setText(formatTime(this.time));
    }
}