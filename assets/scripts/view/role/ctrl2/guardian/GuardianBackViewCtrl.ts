import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import GuardianModel from '../../model/GuardianModel';
import GuardianUtils from './GuardianUtils';
import HeroUtils from '../../../../common/utils/HeroUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { BagItem } from '../../../../common/models/BagModel';
import { Guardian_fallbackCfg, Guardian_globalCfg, GuardianCfg } from '../../../../a/config';
import { RewardType } from '../../../../common/widgets/TaskRewardCtrl';
import { RoleEventId } from '../../enum/RoleEventId';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-07-29 10:59:53 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/guardian/GuardianBackViewCtrl")
export default class GuardianBackViewCtrl extends gdk.BasePanel {
    @property(cc.Node)
    state1: cc.Node = null;

    @property(sp.Skeleton)
    spine: sp.Skeleton = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    slotItemPrefab: cc.Prefab = null;

    @property(cc.Node)
    confirmBtn: cc.Node = null;

    @property(cc.RichText)
    desc: cc.RichText = null;

    get guardianModel(): GuardianModel { return ModelManager.get(GuardianModel); }

    curSelectId: number;
    onEnable() {
        let limit = ConfigManager.getItemByField(Guardian_globalCfg, 'key', 'limit').value;
        this.desc.string = `不高于<color=#ffe300>${limit[0]}星</c>且<color=#ffe300>${limit[1]}级</c>以下的守护者可回退至<color=#ffe300>1星1级</c>,并返回相应的培养材料`
        gdk.e.on(RoleEventId.GUARDIAN_BACK_SELECT, this._onGuardianSelect, this);
        this._updateView();
    }

    onDisable() {
        gdk.e.targetOff(this);
        NetManager.targetOff(this);
    }

    onConfirmBtnClick() {
        let item = GuardianUtils.getGuardianData(this.curSelectId)
        let costCfg = ConfigManager.getItemByField(Guardian_fallbackCfg, 'star', (<icmsg.Guardian>item.extInfo).star);
        if (GlobalUtil.checkMoneyEnough(costCfg.item_id[1], costCfg.item_id[0])) {
            GlobalUtil.openAskPanel({
                descText: '回退操作不可撤销,是否确定操作?',
                sureCb: () => {
                    let req = new icmsg.GuardianFallbackReq();
                    req.id = this.curSelectId;
                    NetManager.send(req, (resp: icmsg.GuardianFallbackRsp) => {
                        let goodsInfo = new icmsg.GoodsInfo();
                        goodsInfo.typeId = resp.guardian.type;
                        goodsInfo.num = 1;
                        let bagItems = [];
                        if (resp.equips && resp.equips.length > 0) {
                            resp.equips.forEach(e => {
                                if (e.id > 0 && e.type > 0) {
                                    let item: BagItem = {
                                        series: e.id,
                                        itemId: e.type,
                                        itemNum: 1,
                                        type: BagUtils.getItemTypeById(e.type),
                                        extInfo: e
                                    };
                                    bagItems.push(item);
                                }
                            });
                        }
                        GlobalUtil.openRewadrView([goodsInfo, ...resp.list], RewardType.NORMAL, {}, bagItems);
                        if (!cc.isValid(this.node)) return;
                        if (!this.node.activeInHierarchy) return;
                        this.curSelectId = null;
                        this._updateView();
                    }, this);
                }
            })
        }
    }

    onSelectBtnClick() {
        gdk.panel.setArgs(PanelId.GuardianBackSelectView, this.curSelectId);
        gdk.panel.open(PanelId.GuardianBackSelectView);
    }

    _onGuardianSelect(e: gdk.Event) {
        let id = parseInt(e.data);
        this.curSelectId = id;
        this._updateView();
    }

    _updateView() {
        if (!this.curSelectId) {
            this.state1.active = true;
            this.spine.node.active = false;
            this.content.removeAllChildren();
            this.confirmBtn.active = false
        } else {
            this.state1.active = false;
            this.spine.node.active = true;
            this.confirmBtn.active = true
            let item = GuardianUtils.getGuardianData(this.curSelectId)
            let cfg = ConfigManager.getItemById(GuardianCfg, item.itemId)
            HeroUtils.setSpineData(this.node, this.spine, cfg.skin, true, false);
            let costCfg = ConfigManager.getItemByField(Guardian_fallbackCfg, 'star', (<icmsg.Guardian>item.extInfo).star);
            GlobalUtil.setSpriteIcon(this.node, cc.find('layout/icon', this.confirmBtn), GlobalUtil.getIconById(costCfg.item_id[0]));
            let costLab = cc.find('layout/num', this.confirmBtn).getComponent(cc.Label);
            costLab.string = `${costCfg.item_id[1]}`;
            costLab.node.color = cc.color().fromHEX(BagUtils.getItemNumById(costCfg.item_id[0]) >= costCfg.item_id[1] ? '#ffffff' : '#ff0000');
            let req = new icmsg.GuardianFallbackPreviewReq();
            req.id = this.curSelectId;
            NetManager.send(req, this._updatePreview, this);
        }
    }

    _updatePreview(resp: icmsg.GuardianFallbackPreviewRsp) {
        if (!cc.isValid(this.node)) return;
        if (!this.node.activeInHierarchy) return;
        this.content.removeAllChildren();
        let goodsInfo = new icmsg.GoodsInfo();
        goodsInfo.typeId = resp.guardian.type;
        goodsInfo.num = 1;
        [goodsInfo, ...resp.list].forEach(r => {
            let item = cc.instantiate(this.slotItemPrefab);
            item.parent = this.content;
            let ctrl = item.getComponent(UiSlotItem);
            ctrl.updateItemInfo(r.typeId, r.num);
            ctrl.itemInfo = {
                series: null,
                itemId: r.typeId,
                itemNum: r.num,
                type: BagUtils.getItemTypeById(r.typeId),
                extInfo: null
            }
        });
        //装备
        if (resp.equips.length > 0) {
            resp.equips.forEach(e => {
                if (e.id > 0 && e.type > 0) {
                    let item = cc.instantiate(this.slotItemPrefab);
                    item.parent = this.content;
                    let ctrl = item.getComponent(UiSlotItem);
                    ctrl.updateItemInfo(e.type, 1);
                    ctrl.updateStar(e.star);
                    ctrl.lvLab.active = true;
                    ctrl.lvLab.getComponent(cc.Label).string = '.' + e.level;
                    ctrl.itemInfo = {
                        series: null,
                        itemId: e.type,
                        itemNum: 1,
                        type: BagUtils.getItemTypeById(e.type),
                        extInfo: e
                    }
                }
            });
        }
    }
}
