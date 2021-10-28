import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import MathUtil from '../../../common/utils/MathUtil';
import ModelManager from '../../../common/managers/ModelManager';
import RelicModel, { RelicCityInfo, RelicMapType } from '../model/RelicModel';
import RoleModel from '../../../common/models/RoleModel';
import TimerUtils from '../../../common/utils/TimerUtils';
import { Relic_mainCfg, Relic_mapCfg, Relic_pointCfg } from '../../../a/config';
import { RelicEventId } from '../enum/RelicEventId';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-12-28 10:26:03 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/relic/RelicHoldCityPointCtrl")
export default class RelicHoldCityPointCtrl extends cc.Component {
    @property(cc.Node)
    cityIcon: cc.Node = null;

    @property(cc.Label)
    ownerNameLab: cc.Label = null;

    @property(cc.Node)
    guildAServerNode: cc.Node = null;

    @property(cc.Label)
    guildNameLab: cc.Label = null;

    @property(cc.Node)
    progressNode: cc.Node = null;

    @property(cc.Label)
    helpNumLab: cc.Label = null;

    @property(cc.Label)
    tipsLab: cc.Label = null;

    @property(cc.Node)
    stateNode: cc.Node = null;

    get RelicModel(): RelicModel { return ModelManager.get(RelicModel); }
    get RoleModel(): RoleModel { return ModelManager.get(RoleModel); }

    cityInfo: RelicCityInfo;
    cityData: icmsg.RelicPoint;
    mapType: RelicMapType;
    onEnable() {
        this.mapType = ConfigManager.getItemById(Relic_mapCfg, this.RelicModel.mapId).mapType;
        if (this.cityInfo) {
            this.updateView();
            this.visibleState();
        }
        gdk.e.on(RelicEventId.MAP_CITY_INFO_CHANGE, this._onMapCityInfoChange, this);
    }

    onDisable() {
        gdk.e.targetOff(this);
        this.unscheduleAllCallbacks();
    }

    visibleState() {
        this.node.active = this.cityInfo.numType <= this.RelicModel.mapNumId || !!this.cityData;
    }

    initInfo(info: RelicCityInfo) {
        this.cityInfo = info;
        this.updateView();
        this.visibleState();
    }

    updateView() {
        this.cityData = this.RelicModel.cityDataMap[this.mapType][this.cityInfo.cityId] || null;
        let pointCfg = ConfigManager.getItemById(Relic_pointCfg, this.cityInfo.pointType);
        GlobalUtil.setSpriteIcon(this.node, this.cityIcon, `view/guild/texture/icon/${pointCfg.skin}`);
        if (!this.cityData || this.cityData.defenderNum <= 0) {
            this.ownerNameLab.node.active = false;
            this.guildAServerNode.active = false;
            this.progressNode.active = false;
            this.helpNumLab.node.active = false;
            this.tipsLab.node.active = !this.RelicModel.curExploreCity || this.RelicModel.curExploreCity.length <= 0;
            this.stateNode.children.forEach((n, idx) => {
                n.active = idx == 0 && (!this.RelicModel.curExploreCity || this.RelicModel.curExploreCity.length <= 0);
            });
        }
        else {
            this.ownerNameLab.node.active = true;
            this.guildAServerNode.active = true;
            this.progressNode.active = true;
            this.helpNumLab.node.active = true;
            this.tipsLab.node.active = false;
            this.ownerNameLab.string = `${this.cityData.guildName.length > 0 ? ` ${this.cityData.guildName}` : ''}`;
            let isEnemy = this.cityData.ownerName !== this.RoleModel.name && (!this.RoleModel.guildId || this.RoleModel.guildName !== this.cityData.guildName);
            this.guildNameLab.string = `S${this.cityData.serverId}${gdk.i18n.t("i18n:RELIC_TIP1")}` + ` ${this.cityData.ownerName}`;
            this.guildNameLab.node.color = cc.color().fromHEX(isEnemy ? '#FF0000' : '#00FF00');
            this.helpNumLab.string = '1'.repeat(this.cityData.defenderNum) + '0'.repeat(this.cityInfo.cfg.helper_num + 1 - this.cityData.defenderNum);
            // let mainCfg = ConfigManager.getItemById(Relic_mainCfg, 1);
            let isFightting = this.cityData.fightTime && (GlobalUtil.getServerTime() - this.cityData.fightTime * 1000 < 5 * 60 * 1000);
            this.stateNode.children.forEach((n, idx) => {
                if (idx == 2) {
                    n.active = !isFightting && ((!this.RelicModel.curExploreCity || this.RelicModel.curExploreCity.length <= 0) || this.cityData.ownerName == this.RoleModel.name && this.cityData.guildName == this.RoleModel.guildName);
                } else if (idx == 1) {
                    n.active = isFightting;
                }
                else {
                    n.active = false;
                }
            });
        }
        if (this.cityData) {
            this.progressNode.active = true;
            cc.find('layout', this.node).getComponent(cc.Layout).updateLayout();
            this._updateTime();
            this.schedule(this._updateTime, 1);
        }
        this._showStateIconAni();
    }

    // @gdk.binding("RelicModel.curExploreCity")
    // _updateIdleState() {
    //     if(this.RelicModel.)
    // }

    _showStateIconAni() {
        this.stateNode.children.forEach((n, idx) => {
            if (n.active) {
                if (n.getNumberOfRunningActions() >= 1) return;
                else {
                    if (idx == 0) {
                        n.runAction(cc.repeatForever(
                            cc.sequence(
                                cc.moveBy(1, 0, -20),
                                cc.moveBy(1, 0, 20)
                            )
                        ))
                    } else if (idx == 1) {
                        let left = n.getChildByName('left');
                        let right = n.getChildByName('right');
                        if (left.getNumberOfRunningActions() <= 0) {
                            left.angle = 30;
                            left.runAction(cc.repeatForever(
                                cc.sequence(
                                    cc.rotateBy(.5, -30),
                                    cc.rotateBy(.5, 30)
                                )
                            ));
                        }
                        if (right.getNumberOfRunningActions() <= 0) {
                            right.angle = -30;
                            right.runAction(cc.repeatForever(
                                cc.sequence(
                                    cc.rotateBy(.5, 30),
                                    cc.rotateBy(.5, -30)
                                )
                            ));
                        }
                    }
                    else {
                        let param1 = 6.0
                        let param2 = 2.0
                        let width = 40;
                        let to = cc.v2(35, 0);
                        let from = cc.v2(-5, 0)
                        let dis = MathUtil.distance(from, to);
                        let pts1: cc.Vec2[] = [
                            cc.v2(
                                width * (1 - param1 / 10),
                                dis / 2 * (1 - param1 / 10),
                            ),
                            cc.v2(
                                width * (1 - param2 / 10),
                                dis / 2 * (1 - param2 / 10),
                            ),
                            cc.v2(width, to.y - from.y),
                        ];

                        let pts2: cc.Vec2[] = [
                            cc.v2(
                                -width * (1 - param1 / 10),
                                -dis / 2 * (1 - param1 / 10),
                            ),
                            cc.v2(
                                -width * (1 - param2 / 10),
                                -dis / 2 * (1 - param2 / 10),
                            ),
                            cc.v2(-width, from.y - to.y),
                        ];
                        n.setPosition(-10, 0);
                        n.runAction(cc.repeatForever(
                            cc.sequence(
                                cc.bezierBy(1, pts1),
                                cc.bezierBy(1, pts2)
                            )
                        ))
                    }
                }
            }
            else {
                if (idx == 1) {
                    let left = n.getChildByName('left');
                    let right = n.getChildByName('right');
                    left.angle = 30;
                    right.angle = -30;
                    left.stopAllActions();
                    right.stopAllActions();
                } else {
                    n.stopAllActions();
                }
            }
        });
    }

    _updateTime() {
        if (!this.cityData) {
            this.unschedule(this._updateTime);
            return;
        }
        let bar = cc.find('progress/bar', this.progressNode);
        let num = cc.find('label', this.progressNode).getComponent(cc.Label);
        let leftTime = this.cityData.freezeTime > 0 ? this.cityData.outputTime * 1000 : Math.max(0, Math.floor((this.cityData.outputTime * 1000 - GlobalUtil.getServerTime()) * (this.cityData.exploreRate / 100)));
        let totalTime = this.cityInfo.cfg.time * 1000;
        bar.width = Math.min(129, leftTime / totalTime * 129);
        GlobalUtil.setAllNodeGray(bar, this.cityData.freezeTime > 0 ? 1 : 0);
        num.string = TimerUtils.format2(leftTime / 1000);
        let cfg = ConfigManager.getItemById(Relic_mainCfg, 1);
        if (leftTime <= 0 ||
            (this.cityData.freezeTime > 0 && (cfg.cache_time * 1000 - (GlobalUtil.getServerTime() - this.cityData.freezeTime * 1000) <= 0))) {
            this.unschedule(this._updateTime);
            this.progressNode.active = false;
            //以防后端未广播最新信息
            let point = new icmsg.RelicPoint();
            point.pointId = this.cityData.pointId;
            point.serverId = null;
            point.ownerName = null;
            point.guildName = null;
            point.defenderNum = 0;
            point.exploreRate = 0;
            point.outputTime = 0;
            point.fightTime = 0;
            point.freezeTime = 0;
            let info = new icmsg.RelicBroadcastPointRsp();
            info.mapType = this.mapType;
            info.point = point;
            gdk.e.emit(RelicEventId.MAP_CITY_INFO_CHANGE_BACK_UP_FOR_NOT_BROAD_CAST, info);
        }
    }

    _onMapCityInfoChange(e) {
        let [mapType, cityId] = e.data;
        if (this.mapType == mapType && this.cityInfo.cityId == cityId) {
            this.updateView();
        }
        if (!this.cityData || this.cityData.freezeTime > 0) {
            this.tipsLab.node.active = !this.RelicModel.curExploreCity || this.RelicModel.curExploreCity.length <= 0;
            this.stateNode.children.forEach((n, idx) => {
                if (idx == 0) {
                    n.active = !this.RelicModel.curExploreCity || this.RelicModel.curExploreCity.length <= 0;
                    cc.find('layout', this.node).getComponent(cc.Layout).updateLayout();
                }
            });
        }
        else {
            let isFightting = this.cityData.fightTime && (GlobalUtil.getServerTime() - this.cityData.fightTime * 1000 < 5 * 60 * 1000);
            this.stateNode.children.forEach((n, idx) => {
                if (idx == 2) {
                    n.active = !isFightting && ((!this.RelicModel.curExploreCity || this.RelicModel.curExploreCity.length <= 0) || this.cityData.ownerName == this.RoleModel.name && this.cityData.guildName == this.RoleModel.guildName);
                }
            });
        }
        this.visibleState();
    }
}
