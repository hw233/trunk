import ConfigManager from '../../../../common/managers/ConfigManager';
import ExpeditionModel, { ExpeditionPointInfo } from './ExpeditionModel';
import ExpeditionUtils from './ExpeditionUtils';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import GuildUtils from '../../utils/GuildUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import PanelId from '../../../../configs/ids/PanelId';
import RoleModel from '../../../../common/models/RoleModel';
import StringUtils from '../../../../common/utils/StringUtils';
import { Expedition_forcesCfg } from '../../../../a/config';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/expedition/ExpeditionPointCtrl")
export default class ExpeditionPointCtrl extends cc.Component {

    @property(cc.Node)
    pointIcon: cc.Node = null;

    @property(sp.Skeleton)
    spine: sp.Skeleton = null;

    @property(cc.Node)
    playerLayout: cc.Node = null;

    @property(cc.Node)
    headNode: cc.Node = null;

    @property(cc.Node)
    occupyName: cc.Node = null;

    @property(cc.ProgressBar)
    proBar: cc.ProgressBar = null;

    @property(cc.Label)
    proLab: cc.Label = null;

    get roleModel(): RoleModel { return ModelManager.get(RoleModel); }

    _info: ExpeditionPointInfo

    get expeditionModel(): ExpeditionModel { return ModelManager.get(ExpeditionModel); }

    initInfo(info: ExpeditionPointInfo) {
        this._info = info
        if (this._info.cfg) {
            if (this._info.cfg.skin_type == 1) {
                GlobalUtil.setSpriteIcon(this.node, this.pointIcon, `view/guild/texture/icon/${this._info.cfg.point_skin[0]}`)
                this.pointIcon.scale = this._info.cfg.point_skin[1] / 100
            } else {
                let url: string = StringUtils.format("spine/monster/{0}/{0}", this._info.cfg.point_skin[0]);
                GlobalUtil.setSpineData(this.spine.node, this.spine, url, true, 'stand_s', true);
                this.spine.node.scale = this._info.cfg.point_skin[1] / 100
                this.spine.node.opacity = 255;
            }
        } else {
            //先设置起点 传送门
            if (info.type == 0) {
                let path = `view/guild/texture/icon/gh_judian0${info.type}`
                GlobalUtil.setSpriteIcon(this.node, this.pointIcon, path)
            }
        }
    }

    updateInfo(pointInfo: ExpeditionPointInfo) {
        if (pointInfo.info) {
            this._updatePlayer(pointInfo.info.playerIds)
        }
        this._updateProBar(pointInfo)
        this._updateOccupyName(pointInfo)
    }

    _updatePlayer(playerIds: number[]) {
        for (let index = 0; index < this.playerLayout.childrenCount; index++) {
            let item = this.playerLayout.children[index];
            item.active = false
        }
        //战斗中，才显示头像
        if (this._info.info.status == 1) {
            for (let i = 0; i < playerIds.length; i++) {
                let member = GuildUtils.getMemberInfo(playerIds[i])
                if (member) {
                    let item = this.playerLayout.children[i]
                    if (!item) {
                        item = cc.instantiate(this.headNode)
                        item.parent = this.playerLayout
                    }
                    item.active = true
                    let head = cc.find("mask/head", item)
                    let frame = cc.find("frame", item)
                    GlobalUtil.setSpriteIcon(this.node, head, GlobalUtil.getHeadIconById(member.head))
                    GlobalUtil.setSpriteIcon(this.node, frame, GlobalUtil.getHeadFrameById(member.frame))
                }
            }
        }
    }

    _updateOccupyName(pointInfo: ExpeditionPointInfo) {
        this.occupyName.active = false
        if (pointInfo.info) {
            if (pointInfo.info.progress == pointInfo.cfg.stage_id2.length + 1) {
                this.occupyName.active = true
                let nameLab = this.occupyName.getChildByName("bg").getChildByName("nameLab").getComponent(cc.Label)
                let selfIcon = this.occupyName.getChildByName("selfIcon")
                selfIcon.active = false
                let member = GuildUtils.getMemberInfo(pointInfo.info.playerIds[0])
                if (member) {
                    nameLab.string = `${member.name}`
                    let outline = this.occupyName.getChildByName("bg").getChildByName("nameLab").getComponent(cc.LabelOutline)
                    if (member.id == this.roleModel.id) {
                        nameLab.node.color = cc.color("#00ff00")
                        outline.color = cc.color("#294161")
                        selfIcon.active = true
                    } else {
                        nameLab.node.color = cc.color("#50FDFF")
                        outline.color = cc.color("#294161")
                    }
                } else {
                    this.occupyName.active = false
                }
                //部队外观
                this.spine.node.active = false
                let curCfg = ConfigManager.getItemByField(Expedition_forcesCfg, 'id', this.expeditionModel.armyLv, { type: this.expeditionModel.activityType });
                GlobalUtil.setSpriteIcon(this.node, this.pointIcon, `view/guild/texture/expedition/army/${curCfg.skin}`);
            } else {
                if (pointInfo.info.hasOccupied) {
                    //被占领过
                    if (pointInfo.cfg.occupation_skin && pointInfo.cfg.occupation_skin.length) {
                        this.spine.node.active = false
                        GlobalUtil.setSpriteIcon(this.node, this.pointIcon, `view/guild/texture/icon/${pointInfo.cfg.occupation_skin[0]}`)
                        this.pointIcon.scale = pointInfo.cfg.occupation_skin[1] / 100
                    } else {
                        if (pointInfo.cfg.skin_type == 1) {
                            GlobalUtil.setSpriteIcon(this.node, this.pointIcon, `view/guild/texture/icon/${pointInfo.cfg.point_skin[0]}`)
                            this.pointIcon.scale = pointInfo.cfg.point_skin[1] / 100
                        }
                    }
                }
                this._initPointName()
            }
        } else {
            this._initPointName()
        }
    }

    clickFunc() {
        if (this._info.cfg.before || this._info.cfg.after) {
            let proDatas = ExpeditionUtils.getMapProcess()
            let count = 0
            proDatas.forEach(element => {
                if (element.a == element.b) {
                    count++
                }
            });
            if (count == proDatas.length) {
                gdk.gui.showMessage(this._info.cfg.after)
            } else {
                gdk.gui.showMessage(this._info.cfg.before)
            }
            return
        }

        if (this._info.cfg) {
            gdk.panel.setArgs(PanelId.ExpeditionPointDetail, this._info)
            gdk.panel.open(PanelId.ExpeditionPointDetail)
        } else {
            cc.log("没有据点配置")
        }
    }

    _initPointName() {
        if (this._info.cfg && this._info.cfg.map_name) {
            this.occupyName.active = true
            let nameLab = this.occupyName.getChildByName("bg").getChildByName("nameLab").getComponent(cc.Label)
            let selfIcon = this.occupyName.getChildByName("selfIcon")
            selfIcon.active = false
            let outline = this.occupyName.getChildByName("bg").getChildByName("nameLab").getComponent(cc.LabelOutline)
            nameLab.node.color = cc.color("#ff6464")//红色敌对
            outline.color = cc.color("#441500")
            nameLab.string = `${this._info.cfg.map_name}`
        }
    }

    _updateProBar(pointInfo: ExpeditionPointInfo) {
        if (pointInfo.info && pointInfo.info.progress >= 1 && pointInfo.info.progress < pointInfo.cfg.stage_id2.length + 1) {
            this.proBar.node.parent.active = true
            this.proBar.progress = pointInfo.info.progress / (pointInfo.cfg.stage_id2.length + 1)
            this.proLab.string = `${(pointInfo.info.progress / (pointInfo.cfg.stage_id2.length + 1) * 100).toFixed(1)}%`
        } else {
            this.proBar.node.parent.active = false
        }
    }
}