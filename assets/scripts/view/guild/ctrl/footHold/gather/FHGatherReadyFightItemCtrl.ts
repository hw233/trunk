import ConfigManager from '../../../../../common/managers/ConfigManager';
import FootHoldModel, { FhPointInfo } from '../FootHoldModel';
import MilitaryRankUtils from '../../militaryRank/MilitaryRankUtils';
import ModelManager from '../../../../../common/managers/ModelManager';
import RoleModel from '../../../../../common/models/RoleModel';
import UiListItem from '../../../../../common/widgets/UiListItem';
import { Foothold_pointCfg } from '../../../../../a/config';
import { ListView, ListViewDir } from '../../../../../common/widgets/UiListview';
import { MRPrivilegeType } from '../../militaryRank/MilitaryRankViewCtrl';

/**
 * @Description: 据点 集结队伍信息
 * @Author: yaozu.hu
 * @Date: 2021-02-01 16:39:37
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-03-23 15:54:49
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/footHold/gather/FHGatherReadyFightItemCtrl")
export default class FHGatherReadyFightItemCtrl extends UiListItem {

    @property(cc.Label)
    nameLb: cc.Label = null;
    @property(cc.Label)
    powerLb: cc.Label = null;
    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;
    @property(cc.Node)
    content: cc.Node = null;
    @property(cc.Prefab)
    heroItem: cc.Prefab = null;
    @property(cc.Node)
    hideNode: cc.Node = null;

    @property(cc.Node)
    hpNode: cc.Node = null;
    @property(cc.ProgressBar)
    hpBar: cc.ProgressBar = null;
    @property(cc.Label)
    hpLab: cc.Label = null;

    info: icmsg.FootholdTeamFighter
    show: boolean = true;
    heroListView: ListView;

    get footHoldModel(): FootHoldModel { return ModelManager.get(FootHoldModel); }

    updateView() {
        this.info = this.data.data;
        this.nameLb.string = this.info.name;
        this.updateScroll();
    }

    updateScroll() {
        this._initListView();
        let listData = [];
        let powerNum = 0;
        this.info.heroList.forEach(data => {
            let tem = { hero: data, playerId: this.info.id };
            listData.push(tem);
            powerNum += data.heroPower;
        })
        this.powerLb.string = powerNum + '';
        this.heroListView.set_data(listData);

        if (this.hpNode) {
            let pos = this.footHoldModel.pointDetailInfo.pos
            let pointInfo: FhPointInfo = this.footHoldModel.warPoints[`${pos.x}-${pos.y}`]
            let targetPos = pointInfo.fhPoint.pos
            if (pointInfo.fhPoint.gather) {
                targetPos = pointInfo.fhPoint.gather.targetPos
            }
            let tagetPointInfo: FhPointInfo = this.footHoldModel.warPoints[`${targetPos.x}-${targetPos.y}`]
            let pointCfg = ConfigManager.getItemByField(Foothold_pointCfg, "map_id", this.footHoldModel.curMapData.mapId, { world_level: this.footHoldModel.worldLevelIndex, point_type: tagetPointInfo.type, map_type: this.footHoldModel.curMapData.mapType })

            let targetLv = MilitaryRankUtils.getMilitaryRankLvByExp(this.footHoldModel.pointDetailInfo.titleExp)
            let isSelf = tagetPointInfo.fhPoint.playerId == this.info.id ? true : false
            let maxHp = pointCfg.HP
            if (isSelf) {
                maxHp += MilitaryRankUtils.getPrivilegeCommon(MRPrivilegeType.p4, targetLv)
            } else {
                maxHp = pointCfg.guard_HP
            }
            this.hpBar.progress = this.info.hp / maxHp
            this.hpLab.string = `${this.info.hp}/${maxHp}`
        }
    }

    _initListView() {
        if (this.heroListView) {
            return
        }
        this.heroListView = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.heroItem,
            cb_host: this,
            column: 3,
            gap_x: 10,
            gap_y: 5,
            async: true,
            direction: ListViewDir.Vertical,
        })
    }

    onDisable() {
        if (this.heroListView) {
            this.heroListView.destroy()
            this.heroListView = null;
        }
    }

}