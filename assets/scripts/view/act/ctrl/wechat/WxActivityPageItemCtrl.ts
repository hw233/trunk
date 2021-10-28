import GlobalUtil from '../../../../common/utils/GlobalUtil';
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/wechat/WxActivityPageItemCtrl")
export default class WxActivityPageItemCtrl extends cc.Component {
    @property(cc.Node)
    icon: cc.Node = null;

    @property(cc.Node)
    select: cc.Node = null;

    idx: number;
    redPointCb: Function;
    args: any;

    updateView(idx: number, url: string, cb: Function, args?: any) {
        this.idx = idx;
        this.redPointCb = cb;
        this.args = args;
        GlobalUtil.setSpriteIcon(this.node, this.icon, `view/act/texture/wechat/shareGift/${url}`);
    }

    updateRedpoint() {
        if (this.redPointCb) {
            return this.args !== undefined ? this.redPointCb(this.args) : this.redPointCb();
        }
        return false;
    }
}
