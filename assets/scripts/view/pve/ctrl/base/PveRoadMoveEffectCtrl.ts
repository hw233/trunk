import MathUtil from '../../../../common/utils/MathUtil';

const { ccclass, property, menu } = cc._decorator;
const abs = Math.abs;
const ceil = Math.ceil;
@ccclass
@menu("qszc/scene/pve/other/PveRoadMoveEffectCtrl")
export default class PveRoadMoveEffectCtrl extends cc.Component {


    roadPosList: cc.Vec2[] = []
    roadName: string = '';
    callFun: Function = null;
    thisArgs: any = null;
    speed: number = 500;
    endPos: cc.Vec2;
    isMove: boolean = false;
    gatePosList: cc.Vec2[] = [];
    dalayTime: number = 0;
    initData(name: string, posList: cc.Vec2[], dalayTime: number, gatePosList?: cc.Vec2[], call?: Function, args?: any) {
        this.roadName = name;
        this.roadPosList = posList;
        this.callFun = call;
        this.thisArgs = args;
        this.gatePosList = gatePosList;
        this.dalayTime = dalayTime;
        if (posList.length <= 1) {
            //调用回调函数
            if (this.thisArgs && this.callFun) {
                this.callFun.call(this.thisArgs, this.node, this.roadName)
            }
        } else {
            let fromPos = this.roadPosList.shift();
            this.node.setPosition(fromPos);
            this.endPos = this.roadPosList.shift();
            this.isMove = true;
            this.setRotation();
        }

    }

    update(dt: number) {
        if (this.dalayTime > 0) {
            this.dalayTime -= dt;
            this.node.opacity = 0
            if (this.dalayTime <= 0) {
                this.node.opacity = 255
            }
            return;
        }

        if (this.isMove) {
            let len = dt * this.speed;
            let from = this.node.getPos();
            let dis: number = MathUtil.distance(from, this.endPos);
            let dx: number = (this.endPos.x - from.x) / dis * len;
            let dy: number = (this.endPos.y - from.y) / dis * len;
            if (abs(this.endPos.x - from.x) > ceil(abs(dx)) ||
                abs(this.endPos.y - from.y) > ceil(abs(dy))) {
                // 大于一步时
                this.node.setPosition(this.node.x + dx, this.node.y + dy);
                return;
            }
            this.node.setPosition(this.endPos);
            if (this.roadPosList.length > 0) {
                this.endPos = this.roadPosList.shift();
                this.setRotation();
            } else {
                if (this.gatePosList.length > 0) {
                    let from = this.gatePosList.shift();
                    this.node.setPosition(from);
                    this.endPos = this.gatePosList.shift();
                    this.roadPosList = this.gatePosList.concat();
                    this.gatePosList = []
                } else {
                    this.isMove = false;
                    //调用回调函数
                    if (this.thisArgs && this.callFun) {
                        this.callFun.call(this.thisArgs, this.node, this.roadName)
                    }
                }

            }
        }
    }

    // 计算节点的旋转角度
    setRotation() {

        let from = this.node.getPos();
        // if (MathUtil.distance(from, this.endPos) < 3) {
        //     from = data.from;
        // }
        let angle = Math.atan2(from.y - this.endPos.y, from.x - this.endPos.x);
        let degree = angle * 180 / Math.PI;
        //node.angle = -(degree <= 0 ? -degree : 360 - degree);
        this.node.angle = -(degree <= 0 ? -degree : 360 - degree);

    }

}
