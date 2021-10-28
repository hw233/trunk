import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import StoreModel from '../../model/StoreModel';
import StoreUtils from '../../../../common/utils/StoreUtils';
import UiListItem from '../../../../common/widgets/UiListItem';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { Pass_weeklyCfg } from '../../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-03-31 10:23:53 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/store/weeklyPassPort/WeeklyPassPortRewardItemCtrl")
export default class WeeklyPassPortRewardItemCtrl extends UiListItem {
    @property(cc.Node)
    freeItem: cc.Node = null;

    @property(cc.Node)
    passPortItem1: cc.Node = null;

    @property(cc.Node)
    passPortItem2: cc.Node = null;

    @property(cc.Node)
    targetNode: cc.Node = null;

    @property(cc.Node)
    received: cc.Node = null;

    @property(cc.Node)
    getBtn: cc.Node = null;

    @property([cc.LabelAtlas])
    dayFonts: cc.LabelAtlas[] = [];

    cfg: Pass_weeklyCfg;
    onEnable() {
        NetManager.on(icmsg.PassWeeklyAwardRsp.MsgType, this._onPassAwardRsp, this);
    }

    onDisable() {
        NetManager.targetOff(this);
    }

    updateView() {
        this.cfg = this.data;
        let b = this.cfg.day <= ModelManager.get(StoreModel).weeklyCurSignDay;
        let dayLab = this.targetNode.getChildByName('dayLab').getComponent(cc.Label);
        let f = this.dayFonts[b ? 0 : 1];
        if (!dayLab.font || f.name !== dayLab.font.name) {
            dayLab.font = f;
        }
        dayLab.string = this.cfg.day + '';
        GlobalUtil.setSpriteIcon(this.node, this.targetNode.getChildByName('dayBg'), `view/store/textrue/weeklyPassPort/${b ? 'thzk_huangsezi' : 'thzk_lusezi'}`);
        GlobalUtil.setSpriteIcon(this.node, this.targetNode.getChildByName('bg'), `view/store/textrue/weeklyPassPort/${b ? 'thzk_biaoqianhuangse' : 'thzk_biaoqianlvse'}`);

        //免费物品
        this.freeItem.getComponent(UiSlotItem).updateItemInfo(this.cfg.reward1[0][0], this.cfg.reward1[0][1]);
        this.freeItem.getComponent(UiSlotItem).itemInfo = {
            series: 0,
            itemId: this.cfg.reward1[0][0],
            itemNum: this.cfg.reward1[0][1],
            type: BagUtils.getItemTypeById(this.cfg.reward1[0][0]),
            extInfo: null,
        }
        //通行证解锁物品
        let passPortItems = [this.passPortItem1, this.passPortItem2];
        passPortItems.forEach((item, idx) => {
            let reward = this.cfg.reward2[idx];
            if (reward) {
                item.active = true;
                item.getComponent(UiSlotItem).updateItemInfo(reward[0], reward[1]);
                item.getComponent(UiSlotItem).itemInfo = {
                    series: 0,
                    itemId: reward[0],
                    itemNum: reward[1],
                    type: BagUtils.getItemTypeById(reward[0]),
                    extInfo: null,
                }
            }
            else {
                item.active = false;
            }
        });

        this.updateRewardState();
    }

    updateRewardState() {
        let recevie1 = StoreUtils.getWeeklyRewardState(this.cfg.id, 1);
        let recevie2 = StoreUtils.getWeeklyRewardState(this.cfg.id, 2);
        this.freeItem.getChildByName('mask').active = recevie1;
        let recived = this.freeItem.getChildByName('sub_lingqu02');
        recived.active = recevie1;
        let passPortItems = [this.passPortItem1, this.passPortItem2];
        passPortItems.forEach((item, idx) => {
            if (item.active) {
                let lock = item.getChildByName('lock');
                let recived = item.getChildByName('sub_lingqu02');
                let mask = item.getChildByName('mask');
                recived.active = recevie2;
                if (!ModelManager.get(StoreModel).isBuyWeeklyPassPort) {
                    lock.active = true;
                    mask.active = true;
                }
                else {
                    lock.active = false;
                    mask.active = recevie2;
                }
            }
        });

        let label = this.getBtn.getChildByName('label').getComponent(cc.Label);
        this.getBtn.active = true;
        if (ModelManager.get(StoreModel).weeklyCurSignDay < this.cfg.day) {
            this.received.active = false;
            this.getBtn.getComponent(cc.Button).interactable = false;
            label.string = gdk.i18n.t('i18n:MINECOPY_PASSPORT_TIP4');
        }
        else {
            this.received.active = false;
            this.getBtn.getComponent(cc.Button).interactable = true;
            if (!recevie1) {
                label.string = gdk.i18n.t('i18n:MINECOPY_PASSPORT_TIP4');
                return;
            }
            if (!recevie2) {
                label.string = gdk.i18n.t('i18n:MINECOPY_PASSPORT_TIP5');
            }
            else {
                this.received.active = true;
                this.getBtn.active = false;
            }
        }
    }

    onGetBtnClick() {
        let recevie1 = StoreUtils.getWeeklyRewardState(this.cfg.id, 1);
        if (recevie1 && !ModelManager.get(StoreModel).isBuyWeeklyPassPort) {
            //TODO
            // gdk.gui.showMessage('购买通行证后可继续领取');
            let cfgs = ConfigManager.getItemsByField(Pass_weeklyCfg, 'cycle', this.cfg.cycle);
            gdk.panel.setArgs(PanelId.BuyWeeklyPassPort, cfgs);
            gdk.panel.open(PanelId.BuyWeeklyPassPort);
        }
        else {
            let req = new icmsg.PassWeeklyAwardReq();
            req.day = this.cfg.id % 7 || 7;
            NetManager.send(req, (resp: icmsg.PassWeeklyAwardRsp) => {
                GlobalUtil.openRewadrView(resp.list);
            });
        }
    }

    _onPassAwardRsp(resp: icmsg.PassWeeklyAwardRsp) {
        if (this.cfg && resp.day % 7 == this.cfg.id % 7) {
            this.updateRewardState();
        }
    }
}
