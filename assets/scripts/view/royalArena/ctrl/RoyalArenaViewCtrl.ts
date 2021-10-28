import { ItemCfg, Royal_challengeCfg, Royal_divisionCfg, Royal_globalCfg, Royal_sceneCfg } from "../../../a/config";
import ConfigManager from "../../../common/managers/ConfigManager";
import ModelManager from "../../../common/managers/ModelManager";
import NetManager from "../../../common/managers/NetManager";
import RoleModel from "../../../common/models/RoleModel";
import RoyalModel from "../../../common/models/RoyalModel";
import BagUtils from "../../../common/utils/BagUtils";
import GlobalUtil from "../../../common/utils/GlobalUtil";
import JumpUtils from "../../../common/utils/JumpUtils";
import { RedPointEvent } from "../../../common/utils/RedPointUtils";
import StringUtils from "../../../common/utils/StringUtils";
import RewardItem from "../../../common/widgets/RewardItem";
import PanelId from "../../../configs/ids/PanelId";
import ActUtil from "../../act/util/ActUtil";
import SubInsSweepViewCtrl from "../../instance/ctrl/SubInsSweepViewCtrl";
import UIScrollSelect from "../../lottery/ctrl/UIScrollSelect";
import RoyalArenaViewDivisionItemCtrl from "./RoyalArenaViewDivisionItemCtrl";

/** 
 * @Description: 皇家竞技场View
 * @Author: yaozu.hu
 * @Date: 2021-02-23 10:37:28
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-05-17 17:36:51
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/royalArena/RoyalArenaViewCtrl")
export default class RoyalArenaViewCtrl extends gdk.BasePanel {


    @property(cc.Label)
    curScore: cc.Label = null;
    @property(cc.Label)
    iconName: cc.Label = null;
    @property(cc.Sprite)
    icon: cc.Sprite = null;

    @property(cc.Label)
    attackNum: cc.Label = null;
    @property(cc.Label)
    buyNum: cc.Label = null;
    @property(cc.Node)
    mapNode: cc.Node = null;
    @property(cc.Node)
    rewardNode: cc.Node = null;

    @property(cc.Label)
    endTimeLb: cc.Label = null;
    @property(cc.Node)
    mapSp: cc.Node = null;
    @property(cc.Label)
    mapName: cc.Label = null;

    @property(cc.Node)
    rewardTipsNode: cc.Node = null;
    @property(cc.Node)
    rewardTipsCloseNode: cc.Node = null;
    @property(cc.Node)
    rewardTipsLayoutNode: cc.Node = null;
    @property(cc.Prefab)
    rewardItem: cc.Prefab = null;


    @property(cc.Node)
    leftBtn: cc.Node = null;
    @property(cc.Node)
    rightBtn: cc.Node = null;

    @property(cc.Node)
    divisionContent: cc.Node = null;

    @property(cc.Prefab)
    divisionPrefab: cc.Prefab = null;

    @property(UIScrollSelect)
    scrollSelect: UIScrollSelect = null;

    @property(cc.Sprite)
    boxReward: cc.Sprite = null;
    @property(cc.Sprite)
    boxMap: cc.Sprite = null;

    actId: number = 133

    reward_type: number = 1;
    endTime: number = 0;
    get royalModel() { return ModelManager.get(RoyalModel); }

    curIndex: number = 0;

    cfgs: Royal_divisionCfg[] = []

    curCfg: Royal_divisionCfg;
    myDivisionCfg: Royal_divisionCfg

    maxBuyNum: number;
    attackNumber: number = 0;

    onEnable() {

        if (!ActUtil.ifActOpen(this.actId)) {
            this.close()
            return;
        }
        this.cfgs = ConfigManager.getItems(Royal_divisionCfg);
        this.reward_type = ActUtil.getActRewardType(this.actId);
        // this.endTime = ActUtil.getActEndTime(this.actId);
        let temStartTime = ActUtil.getActStartTime(this.actId)
        let temEndTime = ActUtil.getActEndTime(this.actId) - 5000
        let startTime = new Date(temStartTime);
        let endTime = new Date(temEndTime);
        this.endTimeLb.string = gdk.i18n.t("i18n:ACTIVITY_TIME_TIP2") + `${startTime.getFullYear()}.${startTime.getMonth() + 1}.${startTime.getDate()}-${endTime.getFullYear()}.${endTime.getMonth() + 1}.${endTime.getDate()}`;
        let temCfgs = ConfigManager.getItems(Royal_challengeCfg)
        this.maxBuyNum = temCfgs[temCfgs.length - 1].id

        //this._updateTime();
        let msg = new icmsg.RoyalInfoReq()
        NetManager.send(msg, (rsp: icmsg.RoyalInfoRsp) => {
            this.royalModel.score = rsp.score;
            this.royalModel.mapIds = rsp.mapIds;
            this.royalModel.rank = rsp.rank;
            this.royalModel.division = rsp.div ? rsp.div : 1;
            this.royalModel.matchNum = rsp.matchNum;
            this.royalModel.serverNum = rsp.serverNum;
            this.royalModel.divFlag = rsp.divFlag;
            this.royalModel.enterNum = rsp.enterNum;
            this.royalModel.buyNum = rsp.buyNum;

            this.initMyInfo()
        }, this);
    }



    onDisable() {
        NetManager.targetOff(this);
        gdk.Timer.clearAll(this)
    }

    initMyInfo() {

        this.cfgs.forEach((cfg, i) => {
            if (cfg.division == this.royalModel.division) {
                this.curIndex = i;
            }
        })
        this.curScore.string = this.royalModel.score + '';
        this.myDivisionCfg = ConfigManager.getItemByField(Royal_divisionCfg, 'division', this.royalModel.division);
        GlobalUtil.setSpriteIcon(this.node, this.icon, 'view/act/texture/peak/' + this.myDivisionCfg.icon)
        this.iconName.string = this.myDivisionCfg.name;
        this.curCfg = this.myDivisionCfg
        this.refreshMapData()
        this._initPageItem(this.curIndex)
        this.refreshAttackNum();

        //判断是否出现新场地
        let showDivUp = GlobalUtil.getLocal('Royal_showDivUpView');
        if (showDivUp) {
            gdk.panel.open(PanelId.RoyalArenaUpDivisionView)
        }
    }


    _initPageItem(index: number) {
        //this.pageIndex = [];
        this.divisionContent.removeAllChildren();
        this.cfgs.forEach((data, idx) => {
            let toggle = cc.instantiate(this.divisionPrefab);
            toggle.parent = this.divisionContent;
            let ctrl = toggle.getComponent(RoyalArenaViewDivisionItemCtrl);
            let lock = data.division > this.royalModel.division + 1;
            let isNext = data.division == this.royalModel.division + 1;
            let info = {
                isNext: isNext, curScore: this.royalModel.score, lock: lock
            }
            ctrl.updataView(data, info)
            toggle.name = `toggle${idx}`;
        });
        //let ctrl = this.divisionContent.getComponent(UIScrollSelect);
        this.scrollSelect.enabled = true;
        this.divisionContent.width = 640;
        if (index == 0) {
            this.divisionContent.children[this.cfgs.length - 1].active = false
            this.leftBtn.active = false;
        } else if (index == this.cfgs.length - 1) {
            this.divisionContent.children[0].active = false
            this.rightBtn.active = false;
        } else {
            this.divisionContent.children[this.cfgs.length - 1].active = true
            this.divisionContent.children[0].active = true
            this.leftBtn.active = true;
            this.rightBtn.active = true;
        }
        this.scrollSelect.updateChilds();
        this.scrollSelect.scrollTo(index, false);
    }

    clickState: boolean = false;
    ChangeBtnClick(e, data) {
        //let ctrl = this.divisionContent.getComponent(UIScrollSelect);
        if (this.clickState) return;
        this.clickState = true;
        gdk.Timer.once(500, this, () => {
            this.clickState = false;
        })
        let idx = this.curIndex;
        if (data == 'left') {
            if (this.curIndex == 0) {
                idx = this.cfgs.length - 1
            } else {
                idx = this.curIndex - 1
            }
            this.scrollSelect._toMoveX = 1
        } else if (data == 'right') {
            if (this.curIndex == this.cfgs.length - 1) {
                idx = 0
            } else {
                idx = this.curIndex + 1
            }
            this.scrollSelect._toMoveX = -1
        }

        this.scrollSelect.scrollTo(idx, true);
        this.curIndex = idx;
        this.curCfg = this.cfgs[idx]
        this.refreshMapData()
        if (idx == 0) {
            this.divisionContent.children[this.cfgs.length - 1].active = false
            this.leftBtn.active = false;
        } else if (idx == this.cfgs.length - 1) {
            this.divisionContent.children[0].active = false
            this.rightBtn.active = false;
        } else {
            this.divisionContent.children[this.cfgs.length - 1].active = true
            this.divisionContent.children[0].active = true
            this.leftBtn.active = true;
            this.rightBtn.active = true;
        }

    }


    curmapIndex: number = 0;
    curMapStageIds: number[] = []
    refreshMapData() {

        this.rewardTipsLayoutNode.removeAllChildren();
        let state = this.curCfg.division <= this.royalModel.division && (this.royalModel.divFlag & 1 << (this.curCfg.division - 1)) > 0;
        this.curCfg.rewards.forEach((data, i) => {
            let node = cc.instantiate(this.rewardItem);
            let ctrl = node.getComponent(RewardItem);
            let temData = { index: i, typeId: data[0], num: data[1], delayShow: false, effct: false, isGet: state }
            ctrl.data = temData;
            ctrl.updateView();
            node.setParent(this.rewardTipsLayoutNode)
        })

        this.mapNode.active = !cc.js.isString(this.curCfg.stage_id)
        this.rewardNode.active = cc.js.isString(this.curCfg.stage_id)
        this.rewardTipsNode.active = cc.js.isString(this.curCfg.stage_id)
        let itemCfg = ConfigManager.getItemById(ItemCfg, this.curCfg.item_id)
        let iconPath = 'icon/item/' + itemCfg.icon;
        this.rewardTipsCloseNode.active = false;
        if (this.mapNode.active) {

            this.curMapStageIds = cc.js.isNumber(this.curCfg.stage_id) ? [this.curCfg.stage_id] : this.curCfg.stage_id;
            let sceneCfg = ConfigManager.getItemById(Royal_sceneCfg, this.curMapStageIds[0])
            this.mapName.string = sceneCfg.scene_name;
            let mapPath = 'view/royalArena/texture/bg/' + sceneCfg.picture
            GlobalUtil.setSpriteIcon(this.node, this.mapSp, mapPath);
            this.curmapIndex = 0;
            if (this.curMapStageIds.length > 1) {
                gdk.Timer.loop(3000, this, this.changeMapSp)
            } else {
                gdk.Timer.clear(this, this.changeMapSp);
            }

            this.rewardTipsNode.active = false;
            GlobalUtil.setSpriteIcon(this.node, this.boxMap, iconPath)
            let state: 0 | 1 = this.curCfg.division <= this.royalModel.division ? 0 : 1;
            GlobalUtil.setGrayState(this.mapSp, state)
        }
        if (this.rewardNode.active) {
            GlobalUtil.setSpriteIcon(this.node, this.boxReward, iconPath)
        }
    }

    changeMapSp() {
        if (this.curmapIndex >= this.curMapStageIds.length - 1) {
            this.curmapIndex = 0;
        } else {
            this.curmapIndex += 1;
        }
        let sceneCfg = ConfigManager.getItemById(Royal_sceneCfg, this.curMapStageIds[this.curmapIndex])
        this.mapName.string = sceneCfg.scene_name;
        let mapPath = 'view/royalArena/texture/bg/' + sceneCfg.picture
        GlobalUtil.setSpriteIcon(this.node, this.mapSp, mapPath);
    }

    /**页签滚动 活动数量>=3时 有效*/
    onUIScrollSelect(event: any) {
        let toggle = event.target;
        let index = event.index;
        if (!toggle.parent) return;
        let containerName = toggle.parent.name;
        if (containerName != 'divisionNode') return;
        let toggleName = toggle.name;
        let idx = toggleName.charAt(toggleName.length - 1);
        //let ctrl = this.divisionContent.getComponent(UIScrollSelect);
        //this.curSkinState = this.skinStates[idx]
        this.curIndex = idx;

        if (parseInt(idx) != index) {
            if (event.direction < 0) this.scrollSelect._toMoveX = -1;
            else this.scrollSelect._toMoveX = 1;
            this.scrollSelect.scrollTo(idx, true);
            //toggle.getComponent(cc.Toggle).check();
            // this.divisionContent.children.forEach((child, idx) => {
            //     let ctrl = child.getComponent(RoyalArenaViewDivisionItemCtrl);
            //     ctrl.updateView(this.skinStates[idx], idx, this.curIndex);
            // })
            this.curCfg = this.cfgs[idx]
            this.refreshMapData()

            if (idx == 0) {
                this.divisionContent.children[this.cfgs.length - 1].active = false;
                this.leftBtn.active = false;
            } else if (idx == this.cfgs.length - 1) {
                this.divisionContent.children[0].active = false
                this.rightBtn.active = false;
            } else {
                this.divisionContent.children[this.cfgs.length - 1].active = true
                this.divisionContent.children[0].active = true
                this.leftBtn.active = true;
                this.rightBtn.active = true;
            }
        }

    }

    refreshAttackNum() {

        let freeNum = ConfigManager.getItemByField(Royal_globalCfg, 'key', 'free_challenge').value[0];
        this.attackNumber = freeNum + this.royalModel.buyNum - this.royalModel.enterNum
        this.attackNum.string = this.attackNumber + ''
        this.buyNum.string = (this.maxBuyNum - this.royalModel.buyNum) + ''
    }


    //打开搜索界面
    searchBtnClick() {

        if (this.attackNumber > 0) {
            //打开上阵列表界面
            gdk.panel.setArgs(PanelId.RoleSetUpHeroSelector, 0, 8);
            gdk.panel.open(PanelId.RoleSetUpHeroSelector);
        } else {
            gdk.gui.showMessage(gdk.i18n.t('i18n:ROYAL_TIP5'))
        }

    }

    //购买挑战次数
    buyNumBtnClick() {

        if (this.royalModel.buyNum < this.maxBuyNum) {
            //判断是否有足够的钻石购买
            let curNum = BagUtils.getItemNumById(2);
            let costNum = 0;
            let mainCfg = ConfigManager.getItemByField(Royal_challengeCfg, 'id', this.royalModel.buyNum + 1);
            if (!mainCfg) {
                gdk.gui.showMessage(gdk.i18n.t('i18n:ROYAL_TIP4'))
            }
            costNum = mainCfg.consumption[1]
            if (costNum > curNum) {
                if (!GlobalUtil.checkMoneyEnough(costNum, 2, null, [PanelId.RoyalArenaView])) {
                    return
                }
            } else {
                let descStr = StringUtils.format(gdk.i18n.t('i18n:ROYAL_TIP3'), costNum)//`是否消耗<color=#C7E835>${costNum}</c>钻石购买一次挑战次数？`
                let sureCb = () => {
                    NetManager.send(new icmsg.RoyalBuyReq(), (rsp: icmsg.RoyalBuyRsp) => {
                        this.royalModel.buyNum = rsp.buyNum;

                        gdk.gui.showMessage(gdk.i18n.t('i18n:PEAK_TIP11'))
                        //刷新挑战次数
                        this.refreshAttackNum();

                    }, this)
                };
                gdk.panel.open(PanelId.SubInsSweepView, (node: cc.Node) => {
                    let ctrl = node.getComponent(SubInsSweepViewCtrl);
                    ctrl.updateView(descStr, '', sureCb);
                });
            }

        } else {
            gdk.gui.showMessage(gdk.i18n.t('i18n:ROYAL_TIP4'))
        }
    }


    //英雄库按钮点击事件
    onHeroListBtnClick() {
        // gdk.panel.setArgs(PanelId.PeakSetUpHeroSelector, 0)
        // gdk.panel.open(PanelId.PeakSetUpHeroSelector)
        gdk.panel.setArgs(PanelId.RoleSetUpHeroSelector, 1, 8);
        gdk.panel.open(PanelId.RoleSetUpHeroSelector);
        let type = ActUtil.getActRewardType(133)
        let hasShow = GlobalUtil.getLocal(`royal_set_defence#${type}`) || false
        if (!hasShow) {
            GlobalUtil.setLocal(`royal_set_defence#${type}`, true)
            gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE)
        }
    }

    //战场总览按钮点击事件
    onMapListBtnClick() {
        gdk.panel.open(PanelId.RoyalArenaMapView)
    }

    //段位奖励按钮点击事件
    ondzjlBtnClick() {
        gdk.panel.open(PanelId.RoyalArenaRankGetReward)
    }

    //战报按钮点击事件
    onAtkList() {
        //gdk.gui.showMessage('战报功能即将开放，敬请期待')
        gdk.panel.open(PanelId.RoyalArenaReportView)
    }

    //排行榜按钮点击事件
    onRankBtnClick() {
        gdk.panel.open(PanelId.RoyalArenaRank)
    }


    //练习模式按钮点击事件
    onlianxiBtnClick() {
        if (this.curCfg.division > this.royalModel.division) {
            gdk.gui.showMessage('段位未达到，练习模式暂未开放，请提升段位')
            return;
        }
        //gdk.gui.showMessage('练习模式即将开放，敬请期待')
        let stage_id = this.curMapStageIds[this.curmapIndex]
        let model = this.royalModel
        model.curFightNum = 0;
        let sceneCfg = ConfigManager.getItemById(Royal_sceneCfg, stage_id)
        model.winElite = {};
        sceneCfg.victory.forEach(data => {
            switch (data[0]) {
                case 1:
                case 2:
                case 3:
                    model.winElite[data[0]] = data[1];
                    break
                case 4:
                case 5:
                    model.winElite[data[0]] = true;
                    break;
                case 6:
                    model.winElite[data[0]] = [data[1], data[2]];
            }
        })
        model.testSceneId = stage_id
        model.addSkillId = 0;
        //let brief: icmsg.RoleBrief = this.royalModel.playerData.brief
        let rmodel = ModelManager.get(RoleModel)
        let player = new icmsg.ArenaPlayer()
        player.name = 'test'
        player.head = rmodel.head
        player.frame = rmodel.frame
        player.power = 0//brief.power
        JumpUtils.openPveArenaScene([1, 0, player], 'test', "ROYAL_TEST");

    }


    //段位奖励预览按钮点击事件
    onRewardBtnClick() {
        if (cc.js.isString(this.curCfg.stage_id)) {
            return;
        }
        this.rewardTipsCloseNode.active = true
        this.rewardTipsNode.active = true
    }

    //
    onCloseTipBtnClick() {
        this.rewardTipsCloseNode.active = false;
        this.rewardTipsNode.active = false;
    }

}
