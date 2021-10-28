import GlobalUtil from '../../../../common/utils/GlobalUtil';
import MineGiftSkillInfoCtrl from './MineGiftSkillInfoCtrl';
import MineModel from '../../model/MineModel';
import MineUtil from '../../util/MineUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import { Activitycave_giftCfg } from '../../../../a/config';
import { ActivityEventId } from '../../enum/ActivityEventId';

/** 
 * @Description: 矿洞大作战天赋Item
 * @Author:yaozu.hu yaozu
 * @Date: 2020-08-04 11:29:25
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-12-22 11:34:45
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/mineCopy/MineGiftItemCtrl")
export default class MineGiftItemCtrl extends cc.Component {

    @property(cc.Node)
    bgNode: cc.Node = null;
    @property(cc.Sprite)
    icon: cc.Sprite = null;
    @property(cc.Label)
    lvLb: cc.Label = null;
    @property(cc.Node)
    numBg: cc.Node = null;
    @property(cc.Label)
    numLb: cc.Label = null;
    @property(cc.Node)
    upBtnNode: cc.Node = null;
    @property(cc.Node)
    lock: cc.Node = null;
    @property(cc.Node)
    maxNode: cc.Node = null;

    cfg: Activitycave_giftCfg;
    model: MineModel;
    lockState: boolean;
    level: number;
    inUpState: boolean = false;
    curGiftNum: number = 0;
    upcall: Function;
    thisAsg: any;

    onDestroy() {
        this.thisAsg = null;
        this.upcall = null;
    }
    initData(cfg: Activitycave_giftCfg, level: number, call: Function, thisAsg: any) {
        this.model = ModelManager.get(MineModel)
        this.cfg = cfg;
        this.upcall = call;
        this.thisAsg = thisAsg;
        this.refreshState(level);
        let path = 'icon/skill/' + cfg.icon;
        GlobalUtil.setSpriteIcon(this.node, this.icon, path);
        //刷新详情界面
        if (gdk.panel.isOpenOrOpening(PanelId.MineGiftSkillInfo)) {
            let node = gdk.panel.get(PanelId.MineGiftSkillInfo);
            let ctrl = node.getComponent(MineGiftSkillInfoCtrl);
            if (ctrl && ctrl.cfg.id == cfg.id) {
                ctrl.showSkillInfo(this.cfg, this.level, this.upBtnClick, this);
            }
        }
    }

    refreshState(level: number) {
        this.level = level;
        this.lockState = level < 0;
        this.curGiftNum = MineUtil.getCurGiftNum();
        if (level < 0) {
            this.lock.active = true;
            GlobalUtil.setAllNodeGray(this.bgNode, 1);
            this.upBtnNode.active = false;
            this.numBg.active = false;
            this.lvLb.node.active = false;
            this.maxNode.active = false;
        } else {
            this.lock.active = false;
            GlobalUtil.setAllNodeGray(this.bgNode, 0);
            let isMax = level == this.cfg.limit;
            this.maxNode.active = isMax;
            this.upBtnNode.active = !isMax;
            this.numBg.active = !isMax;
            this.lvLb.node.active = !isMax;
            this.lvLb.string = '.' + level + '/' + this.cfg.limit;
            //let lvState: 0 | 1 = level == 0 ? 1 : 0
            let color = level == 0 ? cc.color("#BEB7B7") : cc.color("#FFFFFF")
            this.lvLb.node.color = color
            //GlobalUtil.setGrayState(this.lvLb, lvState);
            this.numLb.string = this.cfg.cost + '';
            let color1 = this.curGiftNum >= this.cfg.cost ? cc.color("#FFFFFF") : cc.color("#FF0000")
            this.numLb.node.color = color1
        }

    }

    //升级天赋按钮点击事件
    upBtnClick() {
        if (!this.inUpState) {
            if (this.curGiftNum < this.cfg.cost) {
                gdk.gui.showMessage(gdk.i18n.t("i18n:MINECOPY_GIFT_TIP"))
                return;
            }
            this.inUpState = true;
            let msg = new icmsg.ActivityCaveGiftReq();
            msg.giftId = this.cfg.gift;
            NetManager.send(msg, (rsp: icmsg.ActivityCaveGiftRsp) => {
                let have = false;
                this.model.curCaveSstate.gift.forEach(data => {
                    if (data.giftId == rsp.giftId) {
                        data.level = rsp.level;
                        have = true;
                    }
                })
                if (!have) {
                    let data = new icmsg.ActivityCaveGift();
                    data.giftId = rsp.giftId;
                    data.level = rsp.level;
                    this.model.curCaveSstate.gift.push(data)
                }
                this.refreshState(rsp.level);
                this.inUpState = false;
                let refresh = true;//this.cfg.limit == rsp.level
                if (this.upcall && this.thisAsg) {
                    this.upcall.call(this.thisAsg, refresh);
                }
                gdk.e.emit(ActivityEventId.ACTIVITY_MINE_GIFT_CHANGE);

            })
        }
    }

    //天赋按钮点击事件
    giftItemClick() {
        gdk.panel.open(PanelId.MineGiftSkillInfo, (node) => {
            let ctrl = node.getComponent(MineGiftSkillInfoCtrl);
            if (ctrl) {
                ctrl.showSkillInfo(this.cfg, this.level, this.upBtnClick, this);
            }
        })
    }
}
