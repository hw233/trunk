import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import JumpUtils from '../../../../common/utils/JumpUtils';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import StoreViewCtrl, { StoreBaseScoreTabType } from '../../../store/ctrl/StoreViewCtrl';
import { RewardType } from '../../../../common/widgets/RewardCtrl';
import { Unique_lotteryCfg } from '../../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-09-13 14:36:52 
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-10-18 18:20:05
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('qszc/view/lottery/gene/EquipLotteryViewCtrl')
export default class EquipLotteryViewCtrl extends gdk.BasePanel {
    @property(cc.Node)
    skipAniNode: cc.Node = null;

    @property(cc.Node)
    moneyNode: cc.Node = null;

    @property(cc.Node)
    icon: cc.Node = null;

    @property(sp.Skeleton)
    spine: sp.Skeleton = null;

    iconUrl: string[] = ['01', '02', '03', '04', '05', '06', '07', '08'];
    curUrlIdx: number = -1;
    onEnable() {
        this.skipAniNode.getChildByName('select').active = GlobalUtil.getLocal('equipSkipAni', true) || false;
        this._updateMoney();
        NetManager.on(icmsg.ItemUpdateRsp.MsgType, this._updateMoney, this);
        this.schedule(this._changeIcon, 5);
        this.icon.stopAllActions();
        this.icon.setPosition(0, 185);
        this.icon.runAction(cc.repeatForever(
            cc.sequence(
                cc.moveBy(1, 0, -20),
                cc.moveBy(1, 0, 20)
            )
        ));
        this.spine.node.active = false;
        this._updateRedpoint();
        NetManager.on(icmsg.ItemUpdateRsp.MsgType, this._updateRedpoint, this);
    }

    onDisable() {
        NetManager.targetOff(this);
        this.unscheduleAllCallbacks();
        this.icon.stopAllActions();
    }

    onDrawBtnClick(e, utype) {
        let cfg = ConfigManager.getItemById(Unique_lotteryCfg, 1);
        let type = parseInt(utype);
        if (GlobalUtil.checkMoneyEnough(type, cfg.item)) {
            if (GlobalUtil.getLocal('equipSkipAni', true)) {
                this._drawReq(type);
            } else {
                gdk.gui.lockScreen();
                this.icon.opacity = 0;
                this.spine.node.active = true;
                this.spine.setCompleteListener(() => {
                    this.spine.setCompleteListener(null);
                    this.spine.node.active = false;
                    this._drawReq(type);
                });
                this.spine.setAnimation(0, 'stand', true);
            }
        }
    }

    _drawReq(n: number) {
        let req = new icmsg.UniqueEquipDrawReq();
        req.id = 1;
        req.type = n == 1 ? 0 : 1;
        NetManager.send(req, (resp: icmsg.UniqueEquipDrawRsp) => {
            gdk.gui.unLockScreen();
            if (!cc.isValid(this.node)) return;
            if (!this.node.activeInHierarchy) return;
            // let cfg = ConfigManager.getItemById(Unique_lotteryCfg, 1);
            // let g = new icmsg.GoodsInfo();
            // g.typeId = cfg.add_drop[0][0];
            // g.num = cfg.add_drop[0][1] * n;
            // GlobalUtil.openRewadrView([...resp.list, g]);
            PanelId.Reward.onHide = {
                func: () => {
                    if (cc.isValid(this.node)) {
                        this.icon.opacity = 255;
                    }
                }
            }
            gdk.panel.setArgs(PanelId.Reward, 5);
            GlobalUtil.openRewadrView(resp.list, RewardType.NORMAL, {}, [], false);
        }, this);
    }

    onSkipAniBtnClick() {
        let b = GlobalUtil.getLocal('equipSkipAni', true) || false;
        this.skipAniNode.getChildByName('select').active = !b;
        GlobalUtil.setLocal('equipSkipAni', !b, true);
    }

    onStoreBtnClick() {
        JumpUtils.openPanel({
            panelId: PanelId.Store,
            panelArgs: { args: [0] },
            hideArgs: {
                func: () => {
                    gdk.panel.setArgs(PanelId.GeneView, 0);
                    gdk.panel.open(PanelId.GeneView);
                }
            },
            callback: (panel) => {
                let comp = panel.getComponent(StoreViewCtrl)
                comp.typeBtnSelect(null, StoreBaseScoreTabType.Uniqu)
                gdk.Timer.once(10, this, () => {
                    comp.typeBtnSelect(null, StoreBaseScoreTabType.Uniqu)
                })
            }
        });
    }

    onWeightBtnClick() {
        gdk.panel.open(PanelId.EquipWeightView);
    }

    onBookBtnClick() {
        gdk.panel.open(PanelId.UniqueBookView);
    }

    onWishListBtnClick() {
        gdk.panel.open(PanelId.UniqueWishListView);
    }

    _updateMoney() {
        let cfg = ConfigManager.getItemById(Unique_lotteryCfg, 1);
        GlobalUtil.setSpriteIcon(this.node, cc.find('layout/icon', this.moneyNode), GlobalUtil.getIconById(cfg.item));
        cc.find('layout/num', this.moneyNode).getComponent(cc.Label).string = `${BagUtils.getItemNumById(cfg.item)}`;
    }

    _changeIcon() {
        this.curUrlIdx += 1;
        if (this.curUrlIdx < 0) this.curUrlIdx = 0;
        if (this.curUrlIdx >= this.iconUrl.length) this.curUrlIdx = 0;
        GlobalUtil.setSpriteIcon(this.node, this.icon, `view/lottery/texture/bg/${this.iconUrl[this.curUrlIdx]}`);
    }

    _updateRedpoint() {
        let cfg = ConfigManager.getItemById(Unique_lotteryCfg, 1);
        let hasNum = BagUtils.getItemNumById(cfg.item);
        cc.find('btn1/RedPoint', this.node).active = hasNum >= 1;
        cc.find('btn2/RedPoint', this.node).active = hasNum >= 10;
    }
}
