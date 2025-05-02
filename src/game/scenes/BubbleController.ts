import StateMachine from '../utils/StateMachine';
import EventBus from '../utils/EventBus';

export default class BubbleController {
    private stateMachine: StateMachine;
    private bubble: Phaser.GameObjects.Sprite;
    private input: Phaser.Input.InputPlugin;
    private point: number;
    private radius: number;
    private pointer: Phaser.Input.Pointer;
    private growthRate = 0.1;
    private pointDeceaseRate = 1;

    constructor(bubble: Phaser.GameObjects.Sprite, pointer: Phaser.Input.Pointer, input: Phaser.Input.InputPlugin, radius: number, point: number = 1000, pointDeceaseRate: number = 1) {
        this.bubble = bubble;
        this.pointer = pointer;
        this.point = point;
        this.input = input;
        this.radius = radius;
        this.pointDeceaseRate = pointDeceaseRate;
        
        this.stateMachine = new StateMachine(this)

        this.stateMachine.addState('idle', {
            onEnter: this.idleOnEnter
        }).addState('growing', {
            onUpdate: this.growingOnUpdate,
        }).addState('popped', {
            onEnter: this.poppedOnEnter
        })
        this.bubble.setInteractive({ useHandCursor: true });
        
        this.input.on('pointerup', (pointer: { x: number; y: number; }) => {
            if (this.stateMachine.isCurrentState('growing') && this.bubble.getBounds().contains(pointer.x, pointer.y)) {
                this.stateMachine.setState('popped');
            }
        });
        this.stateMachine.setState('idle'); 
    }

    
    update(dt: number) {
        this.stateMachine.update(dt);
    }


    private idleOnEnter() {
        this.stateMachine.setState('growing');
    }

    private growingOnUpdate(dt: number) {
        if(this.pointer.isDown && this.bubble.getBounds().contains(this.pointer.x, this.pointer.y)) {
            this.stateMachine.setState('popped');
            return;
        } else {
            // const currentRadius = this.bubble.radius;
            this.radius += this.growthRate * dt ;
            this.bubble.setDisplaySize(this.radius * 2, this.radius * 2);

            this.point = this.point - (this.pointDeceaseRate * dt);
        }

        if (this.point <= 0) {
            this.point = 0;
            this.stateMachine.setState('popped');
            return;
        }
        
    }

    private poppedOnEnter() {
        EventBus.emit('bubble.popped', this);
        EventBus.emit('score.marked', this.point);
        this.bubble.setVisible(false);
        this.bubble.setActive(false);
        this.bubble.destroy();
    }
}