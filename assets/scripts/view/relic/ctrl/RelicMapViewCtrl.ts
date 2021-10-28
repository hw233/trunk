import ActUtil from '../../act/util/ActUtil';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import JumpUtils from '../../../common/utils/JumpUtils';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import RelicModel, { RelicMapType } from '../model/RelicModel';
import RelicTiledMapCtrl from './RelicTiledMapCtrl';
import { Relic_mapCfg, VipCfg } from '../../../a/config';
import { RelicEventId } from '../enum/RelicEventId';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-12-25 17:20:18 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/relic/RelicMapViewCtrl")
export default class RelicMapViewCtrl extends gdk.BasePanel {
    @property(cc.Node)
    titleNode: cc.Node = null;

    @property(cc.Node)
    costNode: cc.Node = null;

    @property(RelicTiledMapCtrl)
    tiledMap: RelicTiledMapCtrl = null;

    @property(cc.Node)
    rewardBtn: cc.Node = null;

    @property(cc.Node)
    passPortBtn: cc.Node = null;

    get RelicModel(): RelicModel { return ModelManager.get(RelicModel); }

    titleSpUrls: string[] = [`view/relic/texture/zzyj_anquanqu`, `view/relic/texture/zzyj_pkqu`, `view/relic/texture/zzyj_gaojipkqu`];
    isInit: boolean = false;
    mapType: RelicMapType;
    // systemIds: number = 1;
    onEnable() {
        this._initMap();
        this.mapType = ConfigManager.getItemById(Relic_mapCfg, this.RelicModel.mapId).mapType;
        GlobalUtil.setSpriteIcon(this.node, this.titleNode, this.titleSpUrls[this.mapType - 1]);
        this._updateCostNode();
        gdk.e.on(RelicEventId.MOVE_TO_TARGET_CITY, this._onGo, this);
        let req = new icmsg.SystemSubscribeReq();
        req.topicId = [1, 2, 4][this.mapType - 1];
        req.cancel = false;
        NetManager.send(req, null, this);

        this.passPortBtn.active = ActUtil.ifActOpen(85)
    }

    onDisable() {
        let req = new icmsg.SystemSubscribeReq();
        req.topicId = [1, 2, 4][this.mapType - 1];
        req.cancel = true;
        NetManager.send(req, null, this);
        gdk.e.targetOff(this);
        NetManager.targetOff(this);
        this.tiledMap.node.stopAllActions();
    }

    onRankBtnClick() {
        gdk.panel.open(PanelId.RelicRankView);
    }

    onCostAddBtnClick() {
        // JumpUtils.openRechargeView([2]);
        let curTimes = this.RelicModel.totalExploreTime;
        let cfgs = ConfigManager.getItems(VipCfg, (cfg: VipCfg) => {
            if (cfg.vip11 > curTimes) return true;
        });
        cfgs.sort((a, b) => { return a.level - b.level; });
        let lv = cfgs[0] ? cfgs[0].level : null;
        gdk.panel.setArgs(PanelId.RechargVIP, lv);
        JumpUtils.openPanel({
            panelId: PanelId.Recharge,
            currId: PanelId.RelicMainView,
            panelArgs: {
                args: 2
            }
        });
    }

    onDropRecordBtnClick() {
        gdk.panel.setArgs(PanelId.RelicDropRecordView, 0);
        gdk.panel.open(PanelId.RelicDropRecordView);
    }
    onDefenderBtnClick() {
        gdk.panel.setArgs(PanelId.RoleSetUpHeroSelector, 1, 3)
        gdk.panel.open(PanelId.RoleSetUpHeroSelector);
    }


    onRewardGetBtnClick() {
        if (!this.isInit) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:RELIC_TIP7"));
            return;
        }
        let req = new icmsg.RelicQueryRewardsReq();
        NetManager.send(req, (resp: icmsg.RelicQueryRewardsRsp) => {
            if (!cc.isValid(this.node)) return;
            if (!this.node.activeInHierarchy) return;
            if (!resp.rewards || resp.rewards.length == 0) {
                gdk.gui.showMessage(gdk.i18n.t("i18n:RELIC_TIP8"));
            }
            else {
                gdk.panel.setArgs(PanelId.RelicRewardView, resp);
                gdk.panel.open(PanelId.RelicRewardView);
            }
        }, this);
    }

    onPointListBtnClick() {
        if (!this.isInit) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:RELIC_TIP7"));
            return;
        }
        gdk.panel.open(PanelId.RelicPointListView);
    }

    onPositionBtnClick() {
        if (!this.isInit) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:RELIC_TIP7"));
            return;
        }
        let str = this.RelicModel.curExploreCity;
        let mapType = str ? parseInt(str.split('-')[0]) : null;
        let cityId = str ? parseInt(str.split('-')[1]) : null;
        if (!mapType || mapType !== this.mapType) {
            // let keys = Object.keys(this.RelicModel.cityMap);
            // keys.sort((a, b) => { return parseInt(a) - parseInt(b); });
            // cityId = MathUtil.rnd(parseInt(keys[0]), parseInt(keys[keys.length - 1]));
            gdk.gui.showMessage(gdk.i18n.t("i18n:RELIC_TIP9"));
            return;
        }
        this.gotoCity(cityId);
    }

    gotoCity(cityId: number, durT: number = 1.5, openCity: boolean = true) {
        let node = this.tiledMap.node;
        if (node.getNumberOfRunningActions() >= 1) { return };
        let info = this.RelicModel.cityMap[cityId];
        let pos = cc.v2(-info.cityPos.x * 0.8, -info.cityPos.y * 0.8)
        if (pos.x == node.x && pos.y == node.y) {
            durT = 0;
        }
        node.stopAllActions();
        node.runAction(
            cc.sequence(
                cc.moveTo(durT, pos),
                cc.callFunc(() => {
                    if (openCity) {
                        gdk.panel.setArgs(PanelId.RelicPointDetailsView, cityId);
                        gdk.panel.open(PanelId.RelicPointDetailsView);
                    }
                }),
            )
        );
    }

    _initMap() {
        // 加载并初始化地图
        gdk.rm.loadRes(this.resId, `tileMap/relic/${this.RelicModel.mapId}`, cc.TiledMapAsset, (tmx: cc.TiledMapAsset) => {
            if (!cc.isValid(this.node)) return;
            if (!this.node.activeInHierarchy) return;
            this.isInit = true;
            this.tiledMap.initMap(this, tmx, () => {
                if (this.RelicModel.jumpArgs && this.RelicModel.jumpArgs.length > 0) {
                    let str = this.RelicModel.jumpArgs;
                    let mapType = str ? parseInt(str.split('-')[0]) : null;
                    let cityId = str ? parseInt(str.split('-')[1]) : null;
                    if (!mapType || mapType !== this.mapType) {
                        this.tiledMap.node.setPosition(-this.tiledMap.node.width / 2 * 0.8, -this.tiledMap.node.height / 2 * 0.8);
                        // gdk.panel.setArgs(PanelId.RelicPointDetailsView, cityId);
                        // gdk.panel.open(PanelId.RelicPointDetailsView);
                    }
                    else {
                        this.gotoCity(cityId, 0);
                    }
                    this.RelicModel.jumpArgs = '';
                }
                else {
                    let str = this.RelicModel.curExploreCity;
                    let mapType = str ? parseInt(str.split('-')[0]) : null;
                    let cityId = str ? parseInt(str.split('-')[1]) : null;
                    if (!mapType || mapType !== this.mapType) {
                        this.tiledMap.node.setPosition(-this.tiledMap.node.width / 2 * 0.8, -this.tiledMap.node.height / 2 * 0.8);
                    }
                    else {
                        this.gotoCity(cityId, 0, false);
                    }
                }
            });
            this.tiledMap.resetSize()
        });
    }

    @gdk.binding("RelicModel.exploreTimes")
    @gdk.binding("RelicModel.extraExploreTimes")
    _updateCostNode() {
        let num = this.costNode.getChildByName('num').getComponent(cc.Label);
        num.string = `${this.RelicModel.totalExploreTime + this.RelicModel.extraExploreTimes - this.RelicModel.exploreTimes}/${this.RelicModel.totalExploreTime}`;
    }

    _onGo(e) {
        this.gotoCity(e.data);
    }

    @gdk.binding("RelicModel.RedPointEventIdMap")
    _updateRewardBtn() {
        this.rewardBtn.active = this.RelicModel.RedPointEventIdMap[51002];
    }

    updateRedPoint() {
        let str = this.RelicModel.curExploreCity;
        if (!str || str.length <= 0) return false;
        let mapType = parseInt(str.split('-')[0]);
        return this.mapType == mapType;
    }
}
