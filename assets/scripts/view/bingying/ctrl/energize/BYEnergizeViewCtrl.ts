import BagUtils from '../../../../common/utils/BagUtils';
import BYModel from '../../model/BYModel';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import JumpUtils from '../../../../common/utils/JumpUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import StoreModel from '../../../store/model/StoreModel';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { AskInfoCacheType } from '../../../../common/widgets/AskPanel';
import { Tech_energizeCfg, Tech_globalCfg } from '../../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-07-13 17:42:48 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/bingying/energize/BYEnergizeViewCtrl")
export default class BYEnergizeViewCtrl extends gdk.BasePanel {
    @property([cc.Node])
    rewardItems: cc.Node[] = [];

    @property(cc.Node)
    progressNode: cc.Node = null;

    @property(cc.Node)
    moneyNode: cc.Node = null;

    @property(cc.Node)
    skipAniFlag: cc.Node = null;

    @property(cc.Node)
    confirmBtn: cc.Node = null;

    @property(cc.Node)
    drawNode: cc.Node = null;

    @property(cc.Label)
    freeTimeLab: cc.Label = null;

    @property(sp.Skeleton)
    diamondSpine: sp.Skeleton = null;

    @property(cc.Node)
    lightSpine: cc.Node = null;

    @property(cc.RichText)
    tips: cc.RichText = null;

    get byModel(): BYModel { return ModelManager.get(BYModel); }

    skipAni: boolean = false;
    inAni: boolean = false;
    onEnable() {
        this.inAni = false;
        this.skipAni = GlobalUtil.getLocal('energizeSkipAni', true) || false;
        this.skipAniFlag.active = this.skipAni;
        this._updateMoney();
        NetManager.on(icmsg.ItemUpdateRsp.MsgType, this._updateMoney, this);
        NetManager.on(icmsg.EnergizeStateRsp.MsgType, this._updateView, this); //状态
        NetManager.send(new icmsg.EnergizeStateReq());
        //ani
        this.lightSpine.active = false;
        this.diamondSpine.setCompleteListener(null);
        this.diamondSpine.setAnimation(0, 'stand2', true);
    }

    onDisable() {
        NetManager.targetOff(this);
        gdk.Timer.clearAll(this);
    }

    onCostAddBtnClick() {
        JumpUtils.openRechargetLBPanel([3, 11017]);
    }

    onPreViewBtnClick() {
        gdk.panel.open(PanelId.BYEnergizePreView);
    }

    onSkillPreViewBtnClick() {
        gdk.panel.open(PanelId.BYEStoneSkillBookView);
    }

    onSkipBtnClick() {
        this.skipAni = !this.skipAni;
        this.skipAniFlag.active = this.skipAni;
        GlobalUtil.setLocal('energizeSkipAni', this.skipAni, true);
    }

    onConfirmBtnClick() {
        if (this.inAni) return;
        let cb = () => {
            NetManager.send(new icmsg.EnergizeGetReq(), (resp: icmsg.EnergizeGetRsp) => {
                if (!cc.isValid(this.node)) return;
                if (!this.node.activeInHierarchy) return;
                GlobalUtil.openRewadrView(resp.items);
                this._updateView();
            }, this);
        }
        let cfg = ConfigManager.getItemById(Tech_energizeCfg, this.byModel.energizeRound);
        if (!cfg) {
            let c = ConfigManager.getItems(Tech_energizeCfg);
            cfg = c[c.length - 1];
        }
        if (this.byModel.energizeDrawProgress < cfg.times) {
            GlobalUtil.openAskPanel({
                descText: `您的注能能量未满<br/>确定领取当前注能奖励?<br/>注:继续注能将获得更多奖励`,
                sureCb: cb,
                isShowTip: true,
                tipSaveCache: AskInfoCacheType.by_energize_tip,
            })
        } else {
            cb();
        }
    }

    onDrawBtnClick() {
        if (this.inAni) return;
        let cfg = ConfigManager.getItemById(Tech_energizeCfg, this.byModel.energizeRound);
        if (!cfg) {
            let c = ConfigManager.getItems(Tech_energizeCfg);
            cfg = c[c.length - 1];
        }
        if (this.byModel.energizeDrawProgress >= cfg.times) {
            gdk.gui.showMessage(gdk.i18n.t('i18n:BINGYING_TIP8'));
            return;
        }

        let cb = () => {
            if (!this.skipAni) this.inAni = true;
            // if (!this.skipAni) gdk.Timer.once(2000, this, () => { this.inAni = false; }) //防止协议返回出错
            NetManager.send(new icmsg.EnergizeDrawReq(), (resp: icmsg.EnergizeDrawRsp) => {
                // gdk.Timer.clearAll(this);
                if (!cc.isValid(this.node)) return;
                if (!this.node.activeInHierarchy) return;
                // if (!this.skipAni) this.inAni = true;
                this._updatePlace(resp.place.place);
                this._updateProgress();
            }, this);
        }

        let maxFree = ConfigManager.getItemByField(Tech_globalCfg, 'key', 'energize_free').value[0];
        if (this.byModel.energizeTodayNum >= maxFree) {
            let v = ConfigManager.getItemByField(Tech_globalCfg, 'key', 'energize_cost').value;
            if (BagUtils.getItemNumById(v[0]) < v[1]) {
                ModelManager.get(StoreModel).giftJumpId = 11017;
                GlobalUtil.openGainWayTips(v[0]);
            } else {
                cb();
            }
        }
        else {
            cb();
        }
    }

    _updateView() {
        if (!cc.isValid(this.node)) return;
        if (!this.node.activeInHierarchy) return;
        //reward
        this.rewardItems.forEach((n, idx) => {
            let info = this.byModel.energizeDrawMap[idx];
            let spine = n.getChildByName('spine');
            let slot = n.getChildByName('UiSlotItem');
            spine.active = false;
            slot.active = !!info;
            if (slot.active) {
                let ctrl = slot.getComponent(UiSlotItem);
                ctrl.updateItemInfo(info.items.typeId, info.items.num);
                ctrl.itemInfo = {
                    series: null,
                    itemId: info.items.typeId,
                    itemNum: info.items.num,
                    type: BagUtils.getItemTypeById(info.items.typeId),
                    extInfo: null
                };
            }
        });
        //progress
        this._updateProgress();
    }

    _updateMoney() {
        let v = ConfigManager.getItemByField(Tech_globalCfg, 'key', 'energize_cost').value;
        GlobalUtil.setSpriteIcon(this.node, this.moneyNode.getChildByName('icon'), GlobalUtil.getIconById(v[0]));
        this.moneyNode.getChildByName('num').getComponent(cc.Label).string = BagUtils.getItemNumById(v[0]) + '';
        GlobalUtil.setSpriteIcon(this.node, cc.find('layout/icon', this.drawNode), GlobalUtil.getIconById(v[0]));
        cc.find('layout/icon/num', this.drawNode).getComponent(cc.Label).string = v[1] + '';
    }

    _updateProgress() {
        let cfg = ConfigManager.getItemById(Tech_energizeCfg, this.byModel.energizeRound);
        if (!cfg) {
            let c = ConfigManager.getItems(Tech_energizeCfg);
            cfg = c[c.length - 1];
        }
        let r = this.byModel.energizeDrawProgress / cfg.times;
        this.progressNode.getChildByName('bar').width = Math.min(565, 565 * r);
        this.progressNode.getChildByName('num').getComponent(cc.Label).string = `聚能进度 ${this.byModel.energizeDrawProgress}/${cfg.times}`;
        this.tips.string = '本轮' + cfg.desc;
    }

    @gdk.binding("byModel.energizeDrawMap")
    _updateBtns() {
        let keys = Object.keys(this.byModel.energizeDrawMap);
        this.confirmBtn.active = keys.length > 0;
        cc.find('layout/lab', this.drawNode).getComponent(cc.Label).string = keys.length > 0 ? gdk.i18n.t('i18n:BINGYING_TIP9') : gdk.i18n.t('i18n:BINGYING_TIP10');
    }

    @gdk.binding("byModel.energizeTodayNum")
    _updateFreeTime() {
        let maxFree = ConfigManager.getItemByField(Tech_globalCfg, 'key', 'energize_free').value[0];
        this.freeTimeLab.node.active = this.byModel.energizeTodayNum < maxFree;
        if (this.freeTimeLab.node.active) {
            this.freeTimeLab.string = `${gdk.i18n.t('i18n:BINGYING_TIP11')}(${maxFree - this.byModel.energizeTodayNum}/${maxFree})`;
        }
    }

    _updatePlace(place: number) {
        let info = this.byModel.energizeDrawMap[place];
        let cb = () => {
            let spine = this.rewardItems[place].getChildByName('spine').getComponent(sp.Skeleton);
            spine.setCompleteListener(null);
            spine.node.active = true;
            spine.setCompleteListener(() => {
                spine.setCompleteListener(null);
                spine.node.active = false;
            })
            spine.setAnimation(0, 'stand4', true);
            let slot = this.rewardItems[place].getChildByName('UiSlotItem');
            slot.active = true;
            let ctrl = slot.getComponent(UiSlotItem);
            ctrl.updateItemInfo(info.items.typeId, info.items.num);
            ctrl.itemInfo = {
                series: null,
                itemId: info.items.typeId,
                itemNum: info.items.num,
                type: BagUtils.getItemTypeById(info.items.typeId),
                extInfo: null
            };
        }
        if (this.skipAni) {
            cb();
        } else {
            //ani
            this.diamondSpine.setCompleteListener(() => {
                this.diamondSpine.setCompleteListener(null);
                this.diamondSpine.setAnimation(0, 'stand2', true);
            });
            gdk.Timer.once(300, this, () => {
                let startPos = this.diamondSpine.node.parent.getPosition();
                let endPos = this.rewardItems[place].getPosition();
                let angle = cc.v2(1, 0).signAngle(cc.v2(endPos.x - startPos.x, endPos.y - startPos.y)) * 180 / Math.PI;
                this.lightSpine.active = true;
                this.lightSpine.stopAllActions();
                this.lightSpine.setPosition(startPos);
                this.lightSpine.angle = angle;
                this.lightSpine.runAction(cc.sequence(
                    cc.moveTo(.5, endPos),
                    cc.callFunc(() => {
                        this.inAni = false;
                        this.lightSpine.active = false;
                        cb();
                    })
                ))
            })
            this.diamondSpine.setAnimation(0, 'stand', true);
        }
    }
}
