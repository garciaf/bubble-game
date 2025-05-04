import StateMachine from '../utils/StateMachine';
import EventBus from '../utils/EventBus';

export default class BubbleController {
    public damage: number = 10;
    private stateMachine: StateMachine;
    private bubble: Phaser.GameObjects.Sprite;
    private point: number;
    private speedUp: number = 0.5;
    private radius: number;
    private growthRate = 0.05;

    constructor(bubble: Phaser.GameObjects.Sprite, radius: number = 20, point: number = 1) {
        this.bubble = bubble;
        this.point = point;
        this.radius = radius;
        
        this.stateMachine = new StateMachine(this)

        this.stateMachine.addState('idle', {
            onEnter: this.idleOnEnter
        }).addState('growing', {
            onUpdate: this.growingOnUpdate,
        }).addState('popped', {
            onEnter: this.poppedOnEnter
        }).addState('destroyed', {
            onEnter: this.destroyedOnEnter
        });
        this.stateMachine.setState('idle'); 
    }

    
    update(dt: number) {
        this.stateMachine.update(dt);
    }

    touch(x: number, y: number) {
        new Promise((resolve) => {
            if (this.stateMachine.isCurrentState('growing') && this.bubble.getBounds().contains(x, y)) {
                this.stateMachine.setState('popped');
            }
            resolve(true);
        });
    }

    private idleOnEnter() {
        this.stateMachine.setState('growing');
    }

    private growingOnUpdate(dt: number) {
        // const currentRadius = this.bubble.radius;
        this.radius += this.growthRate * dt ;
        this.bubble.y -= this.speedUp * dt;
        this.bubble.setDisplaySize(this.radius * 2, this.radius * 2);

        if ((this.bubble.y + this.radius)< 0) {
            this.stateMachine.setState('destroyed');
        }
        
    }

    private poppedOnEnter() {
        EventBus.emit('bubble.popped', this);
        EventBus.emit('score.marked', this.point);
        this.bubble.setVisible(false);
        this.bubble.setActive(false);
        this.bubble.destroy();
    }

    private destroyedOnEnter() {
        EventBus.emit('bubble.destroyed', this);
        this.bubble.setVisible(false);
        this.bubble.setActive(false);
        this.bubble.destroy();
    }
}