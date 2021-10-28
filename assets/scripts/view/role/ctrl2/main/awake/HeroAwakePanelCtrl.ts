import BagUtils from '../../../../../common/utils/BagUtils';
import ConfigManager from '../../../../../common/managers/ConfigManager';
import CopyModel from '../../../../../common/models/CopyModel';
import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import HeroModel from '../../../../../common/models/HeroModel';
import JumpUtils from '../../../../../common/utils/JumpUtils';
import ModelManager from '../../../../../common/managers/ModelManager';
import NetManager from '../../../../../common/managers/NetManager';
import PanelId from '../../../../../configs/ids/PanelId';
import StarUpdateMaterialsItemCtrl from '../star/StarUpdateMaterialsItemCtrl';
import UiSlotItem from '../../../../../common/widgets/UiSlotItem';
import { Hero_awakeCfg } from '../../../../../a/config';
import { RoleEventId } from '../../../enum/RoleEventId';

/**
 * 英雄觉醒
 * @Author: luoyong
 * @Date: 2020-02-21 17:32:43
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-08-06 12:03:40
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/main/awake/HeroAwakePanelCtrl")
export default class HeroAwakePanelCtrl extends gdk.BasePanel {

    @property(cc.Node)
    stateNodes: cc.Node[] = []

    @property(cc.Label)
    stateLab: cc.Label = null

    @property(cc.Label)
    awakeLab: cc.Label = null

    @property(cc.Node)
    costNode: cc.Node = null

    @property(cc.Node)
    taskNode: cc.Node = null

    @property(cc.Node)
    copyNode: cc.Node = null

    @property(cc.Node)
    btnOk: cc.Node = null

    @property(cc.Node)
    btnFinish: cc.Node = null

    @property([cc.Node])
    materialsItmes: cc.Node[] = [];

    @property([cc.Node])
    extraMaterItems: cc.Node[] = [];

    @property(cc.Node)
    preRedPoint: cc.Node = null

    @property(sp.Skeleton)
    bgSpine: sp.Skeleton = null

    _curAwakeCfg: Hero_awakeCfg
    _curHeroAwakeState: icmsg.HeroAwakeState
    _type = 0 // 0.消耗道具 1 完成任务 2 打副本

    get heroModel(): HeroModel { return ModelManager.get(HeroModel); }


    onEnable() {
        NetManager.on(icmsg.HeroAwakeRsp.MsgType, this._onHeroAwakeRsp, this)
        gdk.e.on("popup#HeroAwakeSuccess#close", this._showAwakeEffect, this);
        gdk.e.on(RoleEventId.UPDATE_ONE_HERO, this._updateAwakeState, this)
        this._curHeroAwakeState = this.heroModel.heroAwakeStates[this.heroModel.curHeroInfo.heroId]
        let heroIds: number[] = GlobalUtil.getCookie("view_awake_heroIds") || []
        this.preRedPoint.active = heroIds.indexOf(this.heroModel.curHeroInfo.heroId) == -1
        this.bgSpine.setAnimation(0, "stand", true)
        this._updateStateNodes()
        this._updateAwakeState()
    }

    _onHeroAwakeRsp(data: icmsg.HeroAwakeRsp) {
        let awakeState = this.heroModel.heroAwakeStates[data.heroId]
        awakeState.heroStar = data.heroStar
        awakeState.awakeLv = data.awakeLv
        awakeState.clear = false
        awakeState.number = 0

        this.heroModel.curHeroInfo.star = data.heroStar;
        this.heroModel.curHeroInfo = this.heroModel.curHeroInfo
        gdk.panel.open(PanelId.HeroAwakeSuccess);
    }

    _showAwakeEffect() {
        this._updateStateNodes(true)
        this._updateAwakeState()
    }

    onDisable() {
        gdk.e.targetOff(this)
        NetManager.targetOff(this)
    }

    _updateStateNodes(isShowEffect: boolean = false) {
        let awakeLv = this._curHeroAwakeState ? this._curHeroAwakeState.awakeLv : 0
        for (let i = 0; i < this.stateNodes.length; i++) {
            if (i < awakeLv) {
                this.stateNodes[i].active = true
                if (isShowEffect) {
                    if (i == awakeLv - 1) {
                        let spine = cc.find("spine", this.stateNodes[i]).getComponent(sp.Skeleton)
                        if (i == 0) {
                            spine.setAnimation(0, "stand2", false)
                        } else if (i == this.stateNodes.length - 1) {
                            spine.setAnimation(0, "stand3", false)
                        } else {
                            spine.setAnimation(0, "stand4", false)
                        }
                    }
                }
            } else {
                this.stateNodes[i].active = false
            }
        }
        this.stateLab.string = `${awakeLv}`
        this.awakeLab.string = `英雄觉醒(${awakeLv}/${this.stateNodes.length})`

        //觉醒完成后关闭界面
        if (awakeLv == this.stateNodes.length) {
            gdk.panel.hide(PanelId.SubHeroAwakePanel)
        }
    }

    _updateAwakeState() {
        this._curHeroAwakeState = this.heroModel.heroAwakeStates[this.heroModel.curHeroInfo.heroId]
        let nextAwakeLv = this._curHeroAwakeState ? this._curHeroAwakeState.awakeLv + 1 : 1//待觉醒的等级
        let typeId = this.heroModel.curHeroInfo.typeId
        let taskNum = this._curHeroAwakeState ? this._curHeroAwakeState.number : 0
        let copyResult = this._curHeroAwakeState ? this._curHeroAwakeState.clear : false
        this._curAwakeCfg = ConfigManager.getItemByField(Hero_awakeCfg, "hero_id", typeId, { awake_lv: nextAwakeLv })
        if (!this._curAwakeCfg) {
            this.taskNode.active = false
            this.copyNode.active = false
            this.costNode.active = false
            this.btnOk.active = false
            this.btnFinish.active = false
            return
        }

        if (this._curAwakeCfg.target) {
            cc.find("lab", this.btnOk).getComponent(cc.Label).string = `前往`
            this._type = 1
            this.taskNode.active = true
            this.copyNode.active = false
            this.costNode.active = false
            let lab = cc.find("lab", this.taskNode).getComponent(cc.RichText)
            let color = "#00ff00"
            if (taskNum < this._curAwakeCfg.number) {
                color = "#ff0000"
            }
            lab.string = `${this._curAwakeCfg.desc}<color=${color}>(${taskNum}/${this._curAwakeCfg.number})</c>`

            if (taskNum >= this._curAwakeCfg.number) {
                this.btnOk.active = false
                this.btnFinish.active = true
            } else {
                this.btnOk.active = true
                this.btnFinish.active = false
            }

        } else if (this._curAwakeCfg.awake_item1 && this._curAwakeCfg.awake_item1.length > 0) {
            cc.find("lab", this.btnOk).getComponent(cc.Label).string = `确定`
            this.btnOk.active = true
            this.btnFinish.active = false
            this._type = 0
            this.costNode.active = true
            this.taskNode.active = false
            this.copyNode.active = false
            this._updateCostItems()
        } else {
            cc.find("lab", this.btnOk).getComponent(cc.Label).string = `挑战`
            this._type = 2
            this.copyNode.active = true
            this.costNode.active = false
            this.taskNode.active = false

            let lab = cc.find("lab", this.copyNode).getComponent(cc.Label)
            lab.string = `${this._curAwakeCfg.desc}`
            let finish = cc.find("bg/finish", this.copyNode)
            finish.active = copyResult
            if (copyResult) {
                this.btnOk.active = false
                this.btnFinish.active = true
            } else {
                this.btnOk.active = true
                this.btnFinish.active = false
            }
        }

    }

    _updateCostItems() {
        cc.js.clear(ModelManager.get(HeroModel).selectHeroMap);
        this.materialsItmes.forEach((item, idx) => {
            let info: number[] = this._curAwakeCfg[`awake_item${idx + 1}`];
            if (info && info.length == 3) {
                item.active = true;
                let ctrl = item.getComponent(StarUpdateMaterialsItemCtrl);
                ctrl.updateView({
                    targetHeroId: this.heroModel.curHeroInfo.heroId,
                    materials: {
                        type: info[0], //0-任意 1-同id 2-同阵营
                        star: info[1],
                        num: info[2]
                    },
                    idx: idx // 材料idx
                })
            }
            else {
                item.active = false;
            }
        });

        let item = this._curAwakeCfg.awake_item3
        this.extraMaterItems.forEach((n, idx) => {
            let info = item;
            n.active = !!info;
            if (n.active) {
                let ctrl = n.getComponent(UiSlotItem);
                ctrl.updateItemInfo(info[0]);
                ctrl.itemInfo = {
                    series: null,
                    itemId: info[0],
                    itemNum: info[1],
                    type: BagUtils.getItemTypeById(info[0]),
                    extInfo: null
                };
                let num = cc.find('barBg/numLab', n).getComponent(cc.Label);
                let has = BagUtils.getItemNumById(info[0]);
                num.string = `${GlobalUtil.numberToStr(has, true)}/${GlobalUtil.numberToStr(info[1], true)}`;
                num.node.color = cc.color().fromHEX(has >= info[1] ? '#FFFFFF' : '#FF0000');
                cc.find('lab', n).getComponent(cc.Label).string = BagUtils.getConfigById(info[0]).name;
            }
        });
    }


    onOkBtn() {
        switch (this._type) {
            case 0://道具消耗
                let items = this.materialsItmes;
                let heroList: any = {};
                for (let i = 0; i < items.length; i++) {
                    if (items[i].active) {
                        let ctrl = items[i].getComponent(StarUpdateMaterialsItemCtrl);
                        if (!ctrl.checkConditions()) {
                            GlobalUtil.showMessageAndSound(gdk.i18n.t("i18n:HERO_TIP41"))
                            return;
                        }
                        else {
                            heroList[i + 1] = [];
                            ctrl.selectHeroList.forEach(id => {
                                if (id.toString().length > 6) {
                                    heroList[i + 1].push(-parseInt(id.toString().slice(0, 6))); //替代材料 ,后端要求传入负值 -id
                                }
                                else {
                                    heroList[i + 1].push(id);
                                }
                            });
                        }
                    }
                }
                let itemCost = this._curAwakeCfg.awake_item3
                if (itemCost) {
                    if (BagUtils.getItemNumById(itemCost[0]) < itemCost[1]) {
                        gdk.gui.showMessage(`${BagUtils.getConfigById(itemCost[0]).name}不足`);
                        return;
                    }
                }
                // if (HeroUtils.upStarLimit(this.heroModel.curHeroInfo.star + 1)) {
                //     return;
                // }
                let msg = new icmsg.HeroAwakeReq()
                msg.heroId = this.heroModel.curHeroInfo.heroId
                msg.materials1 = heroList[1] || [];
                msg.materials2 = heroList[2] || [];
                NetManager.send(msg)
                break
            case 1:
                if (this._curAwakeCfg.forward) {
                    gdk.panel.hide(PanelId.SubHeroAwakePanel)
                    JumpUtils.openView(parseInt(this._curAwakeCfg.forward))
                }
                break
            case 2:
                let copyModel = ModelManager.get(CopyModel)
                copyModel.heroAwakeHeroBaseId = this.heroModel.curHeroInfo.typeId
                copyModel.heroAwakeHeroId = this.heroModel.curHeroInfo.heroId
                copyModel.openHeroAwake = false;
                JumpUtils.openInstancePvePanel(this._curAwakeCfg.copy_id)
                break
        }
    }

    onFinishClick() {
        let msg = new icmsg.HeroAwakeReq()
        msg.heroId = this.heroModel.curHeroInfo.heroId
        msg.materials1 = [];
        msg.materials2 = [];
        NetManager.send(msg)
    }

    onOpenPreView() {
        gdk.panel.open(PanelId.HeroAwakePreView)

        let heroIds: number[] = GlobalUtil.getCookie("view_awake_heroIds") || []
        if (heroIds.indexOf(this.heroModel.curHeroInfo.heroId) == -1) {
            this.preRedPoint.active = false
            heroIds.push(this.heroModel.curHeroInfo.heroId)
            GlobalUtil.setCookie("view_awake_heroIds", heroIds)
        }

    }
}