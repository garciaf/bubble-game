export default class CountdownController {
    private countdown: Phaser.GameObjects.Text;
    private countdownTime: number;
    private gameOverCallback: () => void;

    constructor(scene: Phaser.Scene, countdownTime: number, gameOverCallback: () => void) {
        this.countdownTime = countdownTime;
        this.gameOverCallback = gameOverCallback;

        this.countdown = scene.add.text(scene.cameras.main.centerX, scene.cameras.main.centerY - 300, `${this.formatTime(this.countdownTime)}`, {
            fontSize: '64px',
            color: '#ffffff'
        }).setOrigin(0.5);
    }

    public update(dt: number) {
        this.countdownTime -= dt / 1000;
        this.countdown.setText(this.formatTime(this.countdownTime));

        if (this.countdownTime <= 0) {
            this.gameOverCallback();
        }
    }   

    private formatTime(time: number): string {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        const milliseconds = Math.floor((time % 1) * 100);
        if (minutes > 0) {
            return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        } else if (seconds > 0) {
            return `${seconds}:${milliseconds}`;
        } else if (milliseconds > 0) {
            return `${milliseconds}`;   
        } else {
            return '0';
        }
    }
}