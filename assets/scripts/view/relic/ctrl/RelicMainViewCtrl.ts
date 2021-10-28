import ActUtil from '../../act/util/ActUtil';
import ConfigManager from '../../../common/managers/ConfigManager';
import JumpUtils from '../../../common/utils/JumpUtils';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import RedPointUtils, { RedPointEvent } from '../../../common/utils/RedPointUtils';
import RelicMainListItemCtrl from './RelicMainListItemCtrl';
import RelicModel from '../model/RelicModel';
import RelicUtils from '../utils/RelicUtils';
import RoleModel from '../../../common/models/RoleModel';
import StringUtils from '../../../common/utils/StringUtils';
import { Relic_mapCfg, Relic_pointCfg, VipCfg } from '../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-12-28 14:36:34 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/relic/RelicMainViewCtrl")
export default class RelicMainViewCtrl extends gdk.BasePanel {
    @property(cc.Node)
    safeAreaNode: cc.Node = null;

    @property(cc.Node)
    pkAreaNode: cc.Node = null;

    @property(cc.Node)
    pk2AreaNode: cc.Node = null;

    @property(cc.Node)
    costNode: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    @property(cc.Node)
    CServerBtn: cc.Node = null;

    get RelicModel(): RelicModel { return ModelManager.get(RelicModel); }
    vaildMapTypes: number[] = [];
    onEnable() {
        if (this.RelicModel.isFirstInView) {
            this.RelicModel.isFirstInView = false;
            gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE);
        }

        //判断跨服狂欢按钮显示按钮
        let showCsBtn = false
        if (ActUtil.ifActOpen(65) || ActUtil.ifActOpen(67)) {
            showCsBtn = true
        }
        this.CServerBtn.active = showCsBtn;
        this.vaildMapTypes = RelicUtils.getOpenMapTypeByCrossServerId(ModelManager.get(RoleModel).crossId);
        [this.safeAreaNode, this.pkAreaNode, this.pk2AreaNode].forEach((n, idx) => { n.active = this.vaildMapTypes.indexOf(idx + 1) !== -1; })
        //
        let rewardCheckCb = () => {
            //查询是否有奖励领取
            NetManager.send(new icmsg.RelicQueryRewardsReq(), () => {
                if (!cc.isValid(this.node)) return;
                if (!this.node.activeInHierarchy) return;
                this._updateRedpoint();
                if (this.RelicModel.jumpArgs && this.RelicModel.jumpArgs.length > 0) {
                    let str = this.RelicModel.jumpArgs;
                    let mapType = str ? parseInt(str.split('-')[0]) : null;
                    this.onEnterBtnClick(null, mapType);
                }
            }, this);
        };
        NetManager.send(new icmsg.RelicPointListReq({
            mapType: this.vaildMapTypes[0],
            needPoints: true
        }), (resp: icmsg.RelicPointListRsp) => {
            if (!cc.isValid(this.node)) return;
            if (!this.node.activeInHierarchy) return;
            this._updateView(this.vaildMapTypes[0], resp);
            if (this.vaildMapTypes.length > 1) {
                //同时开放两个区
                NetManager.send(new icmsg.RelicPointListReq({
                    mapType: this.vaildMapTypes[1],
                    needPoints: true
                }), (resp: icmsg.RelicPointListRsp) => {
                    if (!cc.isValid(this.node)) return;
                    if (!this.node.activeInHierarchy) return;
                    this._updateView(this.vaildMapTypes[1], resp);
                    rewardCheckCb();
                }, this);
            }
            else {
                rewardCheckCb();
            }
        }, this);
    }

    onDisable() {
        NetManager.targetOff(this);
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
            currId: this.node,
            panelArgs: {
                args: 2
            }
        });
    }

    onEnterBtnClick(e, type) {
        let mapType = parseInt(type);
        let mapId = [1001, 1002, 1003][mapType - 1];
        let mapCfg = ConfigManager.getItemById(Relic_mapCfg, mapId);
        if (ModelManager.get(RoleModel).level < mapCfg.lv) {
            gdk.gui.showMessage(StringUtils.format(gdk.i18n.t("i18n:RELIC_TIP6"), mapCfg.lv));
            return;
        }
        this.RelicModel.mapId = mapId;
        JumpUtils.openPanel({
            panelId: PanelId.RelicMapView,
            currId: this.node
        })
    }

    _updateView(mapType: number, info: icmsg.RelicPointListRsp) {
        this._updateCostNode();
        let mapId = [1001, 1002, 1003][mapType - 1];
        let node = [this.safeAreaNode, this.pkAreaNode, this.pk2AreaNode][mapType - 1];
        let scrollView = cc.find('scrollview', node).getComponent(cc.ScrollView);
        let content = cc.find('scrollview/content', node);
        let titleLab = cc.find('title/lab', node).getComponent(cc.Label);
        let map: { [type: number]: number } = {}; //已被探索使用的据点数map
        let extraMap: { [type: number]: number } = {}; //昨日已被探索使用的据点数map 但因昨日跨服登陆人数不足 导致今日该据点未开放
        titleLab.string = ConfigManager.getItemById(Relic_mapCfg, mapId).map_name;
        info.pointList.forEach(d => {
            let type = RelicUtils.getTypeByCityId(mapId, d.pointId);
            // let type = this.RelicModel.cityMap[d.pointId].pointType;
            let numType = RelicUtils.getNumTypeByCityId(mapId, d.pointId);
            if (d.ownerName && d.ownerName.length > 0) {
                if (!map[type]) map[type] = 0;
                map[type] += 1;

                if (numType > this.RelicModel.mapNumId) {
                    if (!extraMap[type]) extraMap[type] = 0;
                    extraMap[type] += 1;
                }
            }
        });
        let types = RelicUtils.getCityTypesByMapId(mapId);
        types.sort((a, b) => { return ConfigManager.getItemById(Relic_pointCfg, a).sorting - ConfigManager.getItemById(Relic_pointCfg, b).sorting; });
        if (mapType !== 3) {
            if (types.length >= 3) {
                types = [types[0], types[types.length - 1], ...types.slice(1, types.length - 1)];
            }
            content.removeAllChildren();
        }
        else {
            [types[types.length - 1], types[types.length - 2]] = [types[types.length - 2], types[types.length - 1]]
        }
        types.forEach((type, idx) => {
            let totalNum = RelicUtils.getCityNumByType(type, mapId);
            if (extraMap[type]) totalNum += extraMap[type];
            let curUseNum = map[type] || 0;
            let info = {
                pointType: type,
                totalNum: totalNum,
                curUseNum: curUseNum,
                mapType: mapType,
                maxShow: types.length < 3 || idx == 1 ? 3 : 2
            };
            let item = content.children[idx];
            if (!item) {
                item = cc.instantiate(this.itemPrefab);
                item.parent = content;
            }
            item.active = true;
            let ctrl = item.getComponent(RelicMainListItemCtrl);
            ctrl.updateView(info);
        });
        if (scrollView) {
            if (types.length > 3) {
                scrollView.node.width = 640;
                scrollView.enabled = true;
            }
            else {
                scrollView.node.width = content.width;
                scrollView.enabled = false;
            }
        }
    }

    @gdk.binding("RelicModel.exploreTimes")
    @gdk.binding("RelicModel.extraExploreTimes")
    _updateCostNode() {
        let num = this.costNode.getChildByName('num').getComponent(cc.Label);
        num.string = `${this.RelicModel.totalExploreTime + this.RelicModel.extraExploreTimes - this.RelicModel.exploreTimes}/${this.RelicModel.totalExploreTime}`;
    }

    _updateRedpoint() {
        cc.find('enterBtn/RedPoint', this.safeAreaNode).active = this.updateRedpoint(1);
        cc.find('enterBtn/RedPoint', this.pkAreaNode).active = this.updateRedpoint(2);
        cc.find('enterBtn/RedPoint', this.pk2AreaNode).active = this.updateRedpoint(3);
    }

    updateRedpoint(type) {
        if (this.vaildMapTypes.indexOf(type) == -1) return false;
        if (RedPointUtils.has_relic_pass_port_reward() || RedPointUtils.has_relic_task_reward(1) || RedPointUtils.has_relic_task_reward(2)) {
            return true
        }
        let mapType = type;
        let b = RedPointUtils.is_relic_point_update();
        if (b) {
            let str = this.RelicModel.curExploreCity;
            if (!str || str.length <= 0) {
                return false;
            }
            let t = parseInt(str.split('-')[0]);
            return t == mapType;
        }
        else {
            return RedPointUtils.has_relic_reward() && this.RelicModel.curExploreReward && mapType == this.RelicModel.curExploreReward.mapType;
        }
    }

    bottomBtnClicl(event: cc.Event, indexS: string) {
        let index = parseInt(indexS)
        if (index == 1) {
            this.close()
            gdk.panel.open(PanelId.VaultEnterView)
        } else if (index == 0) {
            this.close()
            gdk.panel.open(PanelId.CServerActivityMainView);
        }
    }

}
