import GlobalUtil from '../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import PveSceneCtrl from '../PveSceneCtrl';
import PveSceneModel from '../../model/PveSceneModel';
import RoleModel from '../../../../common/models/RoleModel';
import { HurtInfoStatistics } from '../../utils/PveBattleInfoUtil';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/pve/view/DamageStatisticeCtrl")
export default class DamageStatisticeCtrl extends gdk.BasePanel {

    @property(cc.Node)
    titleNode: cc.Node = null;
    @property(cc.Label)
    titleLb: cc.Label = null;

    @property(cc.Node)
    winNode: cc.Node = null;
    @property(cc.Sprite)
    winIcon: cc.Sprite = null;
    @property(cc.Label)
    winName: cc.Label = null;
    @property(cc.ScrollView)
    winScroll: cc.ScrollView = null;
    @property(cc.Node)
    winContent: cc.Node = null;

    @property(cc.Node)
    loseNode: cc.Node = null;
    @property(cc.Sprite)
    loseIcon: cc.Sprite = null;
    @property(cc.Label)
    loseName: cc.Label = null;
    @property(cc.ScrollView)
    loseScroll: cc.ScrollView = null;
    @property(cc.Node)
    loseContent: cc.Node = null;

    @property(cc.Node)
    tipsNode: cc.Node = null;
    @property(cc.Label)
    tipLabel: cc.Label = null;

    @property(cc.Prefab)
    DamageStatisticsItem: cc.Prefab = null

    winList: ListView = null;
    loseList: ListView = null;
    sceneType: string = '';
    _initListView() {

        if (!this.winList) {
            this.winList = new ListView({
                scrollview: this.winScroll,
                mask: this.winScroll.node,
                content: this.winContent,
                item_tpl: this.DamageStatisticsItem,
                cb_host: this,
                async: true,
                column: 1,
                gap_x: 0,
                gap_y: 0,
                direction: ListViewDir.Vertical,
            })
        }
        if (!this.loseList) {
            this.loseList = new ListView({
                scrollview: this.loseScroll,
                mask: this.loseScroll.node,
                content: this.loseContent,
                item_tpl: this.DamageStatisticsItem,
                cb_host: this,
                async: true,
                column: 1,
                gap_x: 0,
                gap_y: 0,
                direction: ListViewDir.Vertical,
            })
        }
    }

    initDamageStatisticeData(type: string, args: any[]) {
        let view = gdk.gui.getCurrentView();
        let model = view.getComponent(PveSceneCtrl).model;
        this._initListView();
        let isWin = args[0]
        this.titleNode.active = true;
        this.titleLb.node.active = false;
        let roleModel = ModelManager.get(RoleModel);
        let isArena = model.arenaSyncData ? true : false
        if (isArena) {
            //对战模式
            this.winNode.active = true
            this.loseNode.active = true

            let path = `${GlobalUtil.getHeadIconById(roleModel.head)}`;
            let player = model.arenaSyncData.args[2] as icmsg.ArenaPlayer
            let miorrorPath = `${GlobalUtil.getHeadIconById(player.head)}`;
            if (isWin) {
                let winList = model.battleInfoUtil.HeroList;
                let winShowData = this.getDamageInfoData("PVE", false, winList, model);
                GlobalUtil.setSpriteIcon(this.node, this.winIcon, path);
                this.winName.string = roleModel.name
                this.winList.set_data(winShowData);
                this.winScroll.node.height = winShowData.length > 6 ? 360 : winShowData.length * 60;

                let loseList = model.arenaSyncData.mirrorModel.battleInfoUtil.HeroList
                let loseShowData = this.getDamageInfoData("PVE", true, loseList, model.arenaSyncData.mirrorModel);
                GlobalUtil.setSpriteIcon(this.node, this.loseIcon, miorrorPath);
                this.loseName.string = player.name
                this.loseList.set_data(loseShowData);
                this.loseScroll.node.height = loseShowData.length > 6 ? 360 : loseShowData.length * 60;

            } else {
                let winList = model.arenaSyncData.mirrorModel.battleInfoUtil.HeroList
                let winShowData = this.getDamageInfoData("PVE", true, winList, model.arenaSyncData.mirrorModel);
                GlobalUtil.setSpriteIcon(this.node, this.winIcon, miorrorPath);
                this.winName.string = player.name
                this.winList.set_data(winShowData);
                this.winScroll.node.height = winShowData.length > 6 ? 360 : winShowData.length * 60;

                let loseList = model.battleInfoUtil.HeroList;
                let loseShowData = this.getDamageInfoData("PVE", false, loseList, model);
                GlobalUtil.setSpriteIcon(this.node, this.loseIcon, path);
                this.loseName.string = roleModel.name
                this.loseList.set_data(loseShowData);
                this.loseScroll.node.height = loseShowData.length > 6 ? 360 : loseShowData.length * 60;
            }

        } else {
            //非对战模式
            this.winNode.active = isWin;
            this.loseNode.active = !isWin;
            let heroList = model.battleInfoUtil.HeroList;
            let showData = this.getDamageInfoData("PVE", false, heroList, model);
            let path = `${GlobalUtil.getHeadIconById(roleModel.head)}`;
            if (isWin) {
                GlobalUtil.setSpriteIcon(this.node, this.winIcon, path);
                this.winName.string = roleModel.name
                this.winList.set_data(showData);
                this.winScroll.node.height = showData.length * 60;//showData.length > 6 ? 360 : showData.length * 60;
            } else {
                GlobalUtil.setSpriteIcon(this.node, this.loseIcon, path);
                this.loseName.string = roleModel.name
                this.loseList.set_data(showData);
                this.loseScroll.node.height = showData.length * 60;//showData.length > 6 ? 360 : showData.length * 60;
            }
        }
    }

    getDamageInfoData(type: string, isMirror: boolean, list: number[], model: PveSceneModel): damageShowData[] {
        let showData: damageShowData[] = [];
        for (let i = 0; i < list.length; i++) {
            let data = new damageShowData();
            let tem = list[i];
            data.type = type;
            data.isMirror = isMirror
            let temData = model.battleInfoUtil.BattleInfo[tem] as HurtInfoStatistics
            data.baseId = temData.baseId;
            data.fightId = temData.fightId;
            data.heroDamage = temData.OutputAllDamage;
            data.recover = temData.OutputRecoverAllHp;
            data.time = temData.fightTime;
            if (type == "PVP") {
                data.time = temData.SufferAllDamage
            }
            let callData = model.battleInfoUtil.getHeroCallDamage(tem);
            callData.forEach(call => {
                data.heroDamage += call.OutputAllDamage;
                data.recover += call.OutputRecoverAllHp;
                if (type == "PVP") {
                    data.time += temData.SufferAllDamage
                }
            })
            let soldierData = model.battleInfoUtil.getHeroSoldierDamage(tem);
            soldierData.forEach(soldier => {
                data.heroDamage += soldier.OutputAllDamage;
                data.recover += soldier.OutputRecoverAllHp;
                if (type == "PVP") {
                    data.time = temData.SufferAllDamage
                } else {
                    data.time += soldier.fightTime;
                }
            })
            showData.push(data);
        }
        let allHeroDamage = 0;
        let allSoldierDamage = 0;
        let allTime = 0;
        let allRecover = 0;
        showData.forEach(data => {
            if (allHeroDamage < data.heroDamage) {
                allHeroDamage = data.heroDamage;
            }
            if (allSoldierDamage < data.soldierDamage) {
                allSoldierDamage = data.soldierDamage;
            }
            if (allTime < data.time) {
                allTime = data.time;
            }
            if (allRecover < data.recover) {
                allRecover = data.recover;
            }
        })
        let maxDamage = allHeroDamage > allSoldierDamage ? allHeroDamage : allSoldierDamage;
        showData.forEach(data => {
            data.allHeroDamage = maxDamage
            data.allSoldierDamage = maxDamage;
            data.allTime = allTime;
            data.allRecover = allRecover;
        })
        return showData
    }

    onDestroy() {
        if (this.winList != null) {
            this.winList.destroy()
        }
        if (this.loseList != null) {
            this.loseList.destroy()
        }
    }

    typePveTips: string[] = [gdk.i18n.t("i18n:PVE_DAMAGESTATISTICE_TIP1"), gdk.i18n.t("i18n:PVE_DAMAGESTATISTICE_TIP2"), gdk.i18n.t("i18n:PVE_DAMAGESTATISTICE_TIP3"), gdk.i18n.t("i18n:PVE_DAMAGESTATISTICE_TIP4")]
    typePvpTips: string[] = [gdk.i18n.t("i18n:PVE_DAMAGESTATISTICE_TIP1"), gdk.i18n.t("i18n:PVE_DAMAGESTATISTICE_TIP2"), gdk.i18n.t("i18n:PVE_DAMAGESTATISTICE_TIP3"), gdk.i18n.t("i18n:PVE_DAMAGESTATISTICE_TIP4")]
    DamageTypeBtnClick(e: cc.Event.EventTouch, param: string) {
        let idx: number = parseInt(param);
        let pos = (e.target as cc.Node).getPos();
        let temPos = (e.target as cc.Node).convertToWorldSpaceAR(cc.v2(0, 55))
        let temPos2 = this.node.convertToNodeSpaceAR(temPos);
        this.tipsNode.setPosition(cc.v2(temPos2.x, temPos2.y))
        gdk.Timer.clearAll(this)
        this.tipsNode.active = true;
        this.tipLabel.string = this.sceneType == "PVE" ? this.typePveTips[idx] : this.typePvpTips[idx];
        gdk.Timer.once(1000, this, () => {
            this.tipsNode.active = false;
        })
    }
}

export class damageShowData {
    type: string = ''
    isMirror: boolean = false
    baseId: number = 0;
    fightId: number = 0;
    heroDamage: number = 0;
    allHeroDamage: number;
    soldierDamage: number = 0;
    allSoldierDamage: number = 0;
    time: number = 0;
    allTime: number = 0;
    recover: number = 0;
    allRecover: number = 0;
}