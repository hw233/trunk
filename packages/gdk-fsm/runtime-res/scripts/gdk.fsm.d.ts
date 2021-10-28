/**
 * 状态机
 * @Author: sthoo.huang 
 * @Date: 2019-02-14 18:07:15
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2019-03-20 21:12:26
 */

declare namespace gdk {

    export namespace fsm {
        export class FsmComponent extends cc.Component {
            fsm: Fsm;
        }
        export class Fsm {

            fsmName: string;
            fsmDescription: string;
            fsmComponent: FsmComponent;
            node: cc.Node;
            events: [string];
            globalTransitions: [FsmTransition];
            startState: string;
            get active(): boolean;
            get activeState(): FsmState;
            get activeStateName(): string;
            get isPause(): boolean;

            /** 所有已实例化的状态机 */
            static fsms: [Fsm];
            /** 第一个实例化的状态机  */
            static main: Fsm;
            static broadcastEvent(eventName: string, excludeSelf: boolean = false): void;
            static sendEventToNode(node: cc.Node, eventName: string, isChildren: boolean = false): void;
            static addAction(customAction: *, type?: string, info?: object): void;
            static getByName(name: string): Fsm;

            start(): void;
            finish(): void;
            pause(): void;
            continue(): void;
            setActive(value: boolean): void;
            setState(stateName: string): void;
            isState(tateName: string): boolean;
            sendEvent(eventName: string): void;
            broadcastEvent(eventName: string): void;
            destroy(): void;
        }
        /**
         * 定义Action修饰符
         * @param name 类名
         * @param type 分类
         * @param info 可选参数
         */
        export function action(name: string, type: string, info: object = null): Function;

        export class FsmState {

            stateName: string;
            sequence: boolean;
            transitions: [FsmTransition];
            get active(): boolean;
            get activeActions(): [FsmStateAction];


        }
        export class FsmStateAction {

            enabled: boolean;
            // actionName:string;
            get finished(): boolean;
            get node(): cc.Node;
            get fsm(): Fsm;
            get state(): FsmState;
            get active(): boolean;
            sendEvent(eventName: string): void;
            broadcastEvent(eventName: string): void;
            finish(): void;
            awake(): void;
            onEnter(): void;
            onExit(): void;
            onDestroy(): void;
            update(dt: number): void;
        }
        export class FsmControllerComponent {

        }
        export class BaseWaitAction extends FsmStateAction {
            isWait: boolean;
        }

        export class ModuleAction extends FsmStateAction {
            moduleName: string;
            on(moduleName: string, eventType: string | Function | number, callback?: Function): void;
            once(moduleName: string, eventType: string | Function | number, callback?: Function): void;
            off(moduleName: string, eventType?: string | number): void;
            emit(eventType: string | number, ...res): any;
            sendEvent(moduleName: string, eventType: string | number, ...res): any;
            reset(): void;
        }
        export var FsmEventId: Enum;
        export class FsmEventButton extends gdk.SoundButton {

        }

        export class PreloadSceneAction extends FsmStateAction {
            scene: any;
            sceneName: string;
        }
        export class LoadSceneAction extends FsmStateAction {
            scene: any;
            sceneName: string;
        }
    }
}