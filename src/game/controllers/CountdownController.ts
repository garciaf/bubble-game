import { formatTime } from '../utils/FormatHelper';

export default class CountdownController {
    private countdown: Phaser.GameObjects.Text;
    private countdownTime: number;
    private gameOverCallback: () => void;

    constructor(scene: Phaser.Scene, countdownTime: number, gameOverCallback: () => void) {
        this.countdownTime = countdownTime;
        this.gameOverCallback = gameOverCallback;

        this.countdown = scene.add.text(scene.cameras.main.centerX, scene.cameras.main.centerY - 300, `${formatTime(this.countdownTime)}`, {
            fontSize: '64px',
            color: '#ffffff'
        }).setOrigin(0.5);
    }

    public update(dt: number) {
        this.countdownTime -= dt / 1000;
        this.countdown.setText(formatTime(this.countdownTime));

        if (this.countdownTime <= 0) {
            this.gameOverCallback();
        }
    }   
}