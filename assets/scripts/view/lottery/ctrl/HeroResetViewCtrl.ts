import BagUtils from '../../../common/utils/BagUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import JumpUtils from '../../../common/utils/JumpUtils';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import UiTabMenuCtrl from '../../../common/widgets/UiTabMenuCtrl';
import { Hero_globalCfg } from '../../../a/config';
import { LotteryEventId } from '../enum/LotteryEventId';

/**
 * 英雄重置界面
 * @Author: luoyong
 * @Description:
 * @Date: 2019-08-29 19:43:48
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-10-11 14:03:17
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/lottery/HeroResetViewCtrl")
export default class HeroResetViewCtrl extends gdk.BasePanel {

    @property(UiTabMenuCtrl)
    uiTabMenu: UiTabMenuCtrl = null;

    @property(cc.Node)
    panelParent: cc.Node = null;

    @property({ type: cc.String })
    _panelNames: string[] = [];

    @property(cc.Node)
    panelTitles: cc.Node[] = [];

    @property(cc.Node)
    runeScoreNode: cc.Node = null;

    @property(cc.Node)
    heroTransScoreNode: cc.Node = null;

    @property(cc.Node)
    heroGoBackScoreNode: cc.Node = null;

    @property(cc.Node)
    heroRebirthScoreNode: cc.Node = null;

    @property(cc.Node)
    uniqueEquipBtn: cc.Node = null;

    @property({ type: gdk.PanelId, tooltip: "子界面，如果没可选值，请先配置gdk.PanelId" })
    get panels() {
        let ret = [];
        for (let i = 0; i < this._panelNames.length; i++) {
            ret[i] = gdk.PanelId[this._panelNames[i]] || 0;
        }
        return ret;
    }
    set panels(value) {
        this._panelNames = [];
        for (let i = 0; i < value.length; i++) {
            this._panelNames[i] = gdk.PanelId[value[i]];
        }
    }

    // 0英雄重置 1英雄分解 2符文分解 3神装分解 4英雄置换 5守护者分解 6守护者装备分解 7英雄回退 8能量石分解 9英雄重生 10守护者回退
    // 0能量石(0能量石分解) 1守护者(0守护者分解 1守护者装备分解 2守护者回退) 2符文(0符文分解) 3神装(0神装分解) 4英雄（0英雄重置 1英雄分解 2英雄置换 3英雄回退 4英雄重生)

    // heroIndexs = [0, 1, 4, 7];
    // guardianIndexs = [5, 6];
    // runeIndexs = [2];
    // costumeIndexs = [3];

    oldPanelIndex: number = -1;

    panelIndex: number = -1;    // 当前打开的界面索引
    panelArg: number = 0;


    typeIndexs: number[][] = [[8], [5, 6, 10], [2], [3], [0, 1, 4, 7, 9], [11]]



    onEnable() {
        let arg = this.args;
        let idx;
        if (arg) {
            if (arg instanceof Array) idx = arg[0];
            else idx = arg;
        }
        if (!idx) idx = 0;

        //英雄回退特殊处理
        // if (JumpUtils.ifSysOpen(2918)) {
        //     this.uiTabMenu.node.children[7].active = true;
        // } else {
        //     this.uiTabMenu.node.children[7].active = false;
        // }

        this.selectPanel(idx);
        NetManager.on(icmsg.ItemUpdateRsp.MsgType, this._updateScore, this);
        gdk.e.on(LotteryEventId.HERO_RESET_TYPE_CHANGE, this._onTypeChange, this);

        this.uniqueEquipBtn.active = JumpUtils.ifSysOpen(2956)
    }

    onDisable() {
        NetManager.targetOff(this);
        gdk.e.targetOff(this);
        // this.panelParent.removeAllChildren();
        // 关闭打开或打开中的子界面
        for (let i = 0, n = this._panelNames.length; i < n; i++) {
            let panelId = gdk.PanelId.getValue(this._panelNames[i]);
            if (panelId) {
                gdk.panel.hide(panelId);
            }
        }
        this.panelIndex = -1;
    }

    selectPanel(idx: number) {
        //if (idx > this.uiTabMenu.itemNames.length - 1) idx = 0;
        idx = Math.max(0, idx);

        this.oldPanelIndex = idx;
        let temIdx = 0;
        for (let i = 0, n = this.typeIndexs.length; i < n; i++) {
            let numbers = this.typeIndexs[i];
            if (numbers.indexOf(idx) >= 0) {
                temIdx = i;
                this.panelArg = numbers.indexOf(idx);
                break;
            }
        }

        this.uiTabMenu.setSelectIdx(temIdx, true);
    }

    onTabMenuSelect(e, data) {
        if (!e) return;

        if (data == 1) {
            if (!JumpUtils.ifSysOpen(2897, true)) {
                this.uiTabMenu.showSelect(this.panelIndex);
                return;
            }
        } else if (data == 10) {
            if (!JumpUtils.ifSysOpen(2939, true)) {
                this.uiTabMenu.showSelect(this.panelIndex);
                return;
            }
        } else if (data == 11) {
            if (!JumpUtils.ifSysOpen(2956, true)) {
                this.uiTabMenu.showSelect(this.panelIndex);
                return;
            }
        }
        let panelId = gdk.PanelId.getValue(this._panelNames[this.panelIndex]);
        if (panelId) gdk.panel.hide(panelId);
        this.panelIndex = data;
        this._updateScore();


        // if (data == 3) {
        //     if (!JumpUtils.ifSysOpen(2866, true)) {
        //         this.uiTabMenu.showSelect(this.panelIndex);
        //         return;
        //     }
        // }
        // else if (data == 4) {
        //     if (!JumpUtils.ifSysOpen(2864, true)) {
        //         this.uiTabMenu.showSelect(this.panelIndex);
        //         return;
        //     }
        // } else if (data == 5) {
        //     if (!JumpUtils.ifSysOpen(2897, true)) {
        //         this.uiTabMenu.showSelect(this.panelIndex);
        //         return;
        //     }
        // } else if (data == 6) {
        //     if (!JumpUtils.ifSysOpen(2904, true)) {
        //         this.uiTabMenu.showSelect(this.panelIndex);
        //         return;
        //     }
        // } else if (data == 7) {
        //     if (!JumpUtils.ifSysOpen(2918, true)) {
        //         this.uiTabMenu.showSelect(this.panelIndex);
        //         return;
        //     }
        // }

        gdk.panel.setArgs(this._panelNames[data], this.panelArg)
        gdk.panel.open(this._panelNames[data], null, null, {
            parent: this.panelParent
        });
        this.panelArg = 0;

    }

    _onTypeChange(e) {
        let temData = e.data;
        this.oldPanelIndex = this.typeIndexs[temData[0]][temData[1]];
        this._updateScore();
    }

    _updateScore() {
        this.updateRuneScore();
        this.updateHeroTransScore();
        this.updateHeroGoBackScore();
        this.updateHeroRebirthScore();

        for (let i = 0; i < this.panelTitles.length; i++) {
            this.panelTitles[i].active = false
        }
        this.panelTitles[this.oldPanelIndex].active = true
    }

    updateRuneScore() {
        if (this.oldPanelIndex == 2) {
            this.runeScoreNode.active = true;
            this.runeScoreNode.getChildByName('number').getComponent(cc.Label).string = `${GlobalUtil.numberToStr2(BagUtils.getItemNumById(110010), true)}`;
        }
        else {
            this.runeScoreNode.active = false;
        }
    }

    updateHeroTransScore() {
        if (this.oldPanelIndex == 4) {
            this.heroTransScoreNode.active = true;
            GlobalUtil.setSpriteIcon(this.node, this.heroTransScoreNode.getChildByName('main_itemmoney01'), GlobalUtil.getIconById(140012));
            this.heroTransScoreNode.getChildByName('number').getComponent(cc.Label).string = `${GlobalUtil.numberToStr2(BagUtils.getItemNumById(140012), true)}`;
        }
        else {
            this.heroTransScoreNode.active = false;
        }
    }

    updateHeroGoBackScore() {
        if (this.oldPanelIndex == 7) {
            this.heroGoBackScoreNode.active = true;
            //let itemId = 130115
            let itemId = ConfigManager.getItemByField(Hero_globalCfg, 'key', 'fallback_item').value[0]
            GlobalUtil.setSpriteIcon(this.node, this.heroGoBackScoreNode.getChildByName('main_itemmoney01'), GlobalUtil.getIconById(itemId));
            this.heroGoBackScoreNode.getChildByName('number').getComponent(cc.Label).string = `${GlobalUtil.numberToStr2(BagUtils.getItemNumById(itemId), true)}`;
        }
        else {
            this.heroGoBackScoreNode.active = false;
        }
    }

    updateHeroRebirthScore() {
        if (this.oldPanelIndex == 9) {
            this.heroRebirthScoreNode.active = true;
            //let itemId = 130115
            let itemId = ConfigManager.getItemByField(Hero_globalCfg, 'key', 'rebirth_item').value[0]
            GlobalUtil.setSpriteIcon(this.node, this.heroRebirthScoreNode.getChildByName('main_itemmoney01'), GlobalUtil.getIconById(itemId));
            this.heroRebirthScoreNode.getChildByName('number').getComponent(cc.Label).string = `${GlobalUtil.numberToStr2(BagUtils.getItemNumById(itemId), true)}`;
        }
        else {
            this.heroRebirthScoreNode.active = false;
        }
    }
    onRuneScoreBtnClick() {
        JumpUtils.openView(716);
    }

    onHeroTransScoreBtnClick() {
        PanelId.Recharge.onHide = {
            func: () => {
                gdk.panel.setArgs(PanelId.HeroResetView, 4);
                gdk.panel.open(PanelId.HeroResetView);
            }
        };
        JumpUtils.openRechargetLBPanel([3, 11009]);
    }

    onHeroGoBackScoreBtnClick() {
        //JumpUtils.openView(716);
        let itemId = ConfigManager.getItemByField(Hero_globalCfg, 'key', 'fallback_item').value[0]
        GlobalUtil.openGainWayTips(itemId);
    }

    onHeroRebirthScoreBtnClick() {
        //JumpUtils.openView(716);
        let itemId = ConfigManager.getItemByField(Hero_globalCfg, 'key', 'rebirth_item').value[0]
        GlobalUtil.openGainWayTips(itemId);
    }

}

