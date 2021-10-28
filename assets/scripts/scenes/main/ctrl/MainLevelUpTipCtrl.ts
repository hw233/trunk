import ButtonSoundId from '../../../configs/ids/ButtonSoundId';
import ConfigManager from '../../../common/managers/ConfigManager';
import CopyModel from '../../../common/models/CopyModel';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import GuideUtil from '../../../common/utils/GuideUtil';
import MainLevelUpSysItemCtrl from './MainLevelUpSysItemCtrl';
import ModelManager from '../../../common/managers/ModelManager';
import PanelId from '../../../configs/ids/PanelId';
import RoleModel from '../../../common/models/RoleModel';
import TriggerEliteTipsViewCtrl from '../../../view/map/ctrl/TriggerEliteTipsViewCtrl';
import { GlobalCfg, SystemCfg } from '../../../a/config';

/** 
 * 升级提示特效
 * @Author: sthoo.huang  
 * @Date: 2019-10-25 20:31:11 
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-12-11 11:59:50
 */const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/main/MainLevelUpTipCtrl")
export default class MainLevelUpTipCtrl extends gdk.BasePanel {

    data: { newLv: number, oldLv: number };

    @property(cc.Node)
    itemContent: cc.Node = null;

    @property(cc.Prefab)
    preSysItem: cc.Prefab = null;

    onEnable() {
        this.data = this.args[0];
        this._showLevelUpEffect();
    }

    onDisable() {
        gdk.Timer.clearAll(this);
        let roleModel = ModelManager.get(RoleModel);
        if (gdk.panel.isOpenOrOpening(PanelId.MonthCard) || GuideUtil.getCurGuide()) return;
        if (!GlobalUtil.getLocal('isShowDiamondCard')) {
            let diamondCardCfg = ConfigManager.getItemByField(GlobalCfg, 'key', 'diamond_card');
            if (roleModel.level >= diamondCardCfg.value[0]) {
                gdk.panel.setArgs(PanelId.MonthCard, 0);
                gdk.panel.open(PanelId.MonthCard);
                GlobalUtil.setLocal('isShowDiamondCard', true);
                return;
            }
        }
        if (!GlobalUtil.getLocal('isShowSweepCard')) {
            let sweepCardCfg = ConfigManager.getItemByField(GlobalCfg, 'key', 'scouring_coupon_card');
            if (roleModel.level >= sweepCardCfg.value[0]) {
                gdk.panel.setArgs(PanelId.MonthCard, 1);
                gdk.panel.open(PanelId.MonthCard);
                GlobalUtil.setLocal('isShowSweepCard', true);
                return;
            }
        }
    }

    // 显示等级提升提示效果
    _showLevelUpEffect() {
        let ani: cc.Animation = this.node.getComponent(cc.Animation)
        ani.once('finished', this._onAniFinished, this);

        let spine: sp.Skeleton = this.node.getChildByName('bg').getComponent(sp.Skeleton);
        spine.setCompleteListener(() => {
            spine.setCompleteListener(null);
            spine.setAnimation(0, 'stand4', true);
        });

        let lvLabel1 = this.node.getChildByName("levelNode").getChildByName("label1").getComponent(cc.Label)
        let lvLabel2 = this.node.getChildByName("levelNode").getChildByName("label2").getComponent(cc.Label)
        let lvLabel3 = this.node.getChildByName("levelNode").getChildByName("label3").getComponent(cc.Label)
        let str = this.data.newLv.toString();
        lvLabel2.node.active = str.length >= 2;
        lvLabel3.node.active = str.length >= 3;
        lvLabel1.string = `${str.charAt(0)}`;
        lvLabel2.string = str.length >= 2 ? `${str.charAt(1)}` : '';
        lvLabel3.string = str.length >= 3 ? `${str.charAt(2)}` : '';
        // console.log(this.data.newLv, str.charAt(0), str.charAt(1));

        let oldLabel = this.node.getChildByName("layout").getChildByName("shuxing1").getChildByName("shuxing1_2").getComponent(cc.Label)
        let newLabel = this.node.getChildByName("layout").getChildByName("shuxing1").getChildByName("shuxing1_3").getComponent(cc.Label)
        oldLabel.string = `${this.data.oldLv}`
        newLabel.string = `${this.data.newLv}`

        // let heroLvOldLabel = this.node.getChildByName("shuxing2").getChildByName("shuxing1_2").getComponent(cc.Label)
        // let heroLvNewLabel = this.node.getChildByName("shuxing2").getChildByName("shuxing1_3").getComponent(cc.Label)
        // heroLvOldLabel.string = `${this.data.oldLv * 5}`;
        // heroLvNewLabel.string = `${this.data.newLv * 5}`;
        // let labNode: cc.Node = this.node.getChildByName("shuxing2").getChildByName("shuxing1_5")
        // let openSysLabel: cc.RichText = labNode.getComponent(cc.RichText)

        // let strArr = this._getOpenSysStr(this.data.newLv)
        // if (strArr.length > 0) {
        //     openSysLabel.string = strArr[0]

        //     if (strArr.length > 1) {
        //         for (let i = 1; i < strArr.length; i++) {
        //             let addLab = cc.instantiate(labNode)
        //             addLab.parent = this.node.getChildByName("shuxing2")
        //             addLab.anchorX = 0
        //             addLab.x = labNode.x - labNode.width / 2
        //             addLab.y = labNode.y - 45
        //             addLab.getComponent(cc.RichText).string = strArr[i]
        //         }
        //     }
        // } else {
        //     openSysLabel.string = ""
        // }
        // ani.play("UI_shengji");
        let copyModel = ModelManager.get(CopyModel)
        let cfgs = ConfigManager.getItems(SystemCfg, { show: 1 })
        let showArr = []

        GlobalUtil.sortArray(cfgs, (a, b) => {
            return a.fbId - b.fbId
        })

        //关卡符合的
        for (let i = 0; i < cfgs.length; i++) {
            if (cfgs[i].fbId > 0 && cfgs[i].fbId > copyModel.lastCompleteStageId) {
                showArr.push(cfgs[i])
                break
            }
        }

        GlobalUtil.sortArray(cfgs, (a, b) => {
            return a.openLv - b.openLv
        })

        //等级符合的
        for (let i = 0; i < cfgs.length; i++) {
            if (cfgs[i].openLv > 0 && cfgs[i].openLv > this.data.newLv) {
                showArr.push(cfgs[i])
                break
            }
        }

        this.itemContent.parent.active = false
        if (showArr.length > 0) {
            this.itemContent.parent.active = true
            showArr.forEach(element => {
                let item = cc.instantiate(this.preSysItem)
                let ctrl = item.getComponent(MainLevelUpSysItemCtrl)
                ctrl.updateViewInfo(element)
                this.itemContent.addChild(item)
            });
        }

        spine.setAnimation(0, 'stand3', true);
        gdk.Timer.once(500, this, () => {
            ani && ani.play("UI_shengji");
        });
        gdk.Timer.once(3000, this, this.close);

        if (GlobalUtil.isSoundOn) {
            gdk.sound.play(gdk.Tool.getResIdByNode(this.node), ButtonSoundId.levelup)
        }
    }

    _onAniFinished() {
        let ani: cc.Animation = this.node.getComponent(cc.Animation);
        ani && ani.off('finished', this._onAniFinished, this);
        // ani.play("UI_shengji", 0.8);
    }

    // _getOpenSysStr(lv: number) {
    //     let str = ""
    //     let strArr = []
    //     let tempList = ConfigManager.getItems(SystemCfg)
    //     let all: SystemCfg[] = []
    //     let selectCfg: SystemCfg = null;
    //     tempList.forEach(element => {
    //         if (element.openLv > 0 && element.show) {
    //             all.push(element)
    //         }
    //     });
    //     GlobalUtil.sortArray(all, (a, b) => {
    //         return a.openLv - b.openLv
    //     })

    //     for (let i = 0; i < all.length; i++) {
    //         if (all[i].openLv > lv) {
    //             selectCfg = all[i]
    //             break;
    //         }
    //     }
    //     if (selectCfg) {
    //         let count = 0
    //         for (let i = 0; i < all.length; i++) {
    //             if (selectCfg.openLv == all[i].openLv) {
    //                 if (count == 0) {
    //                     str = `${all[i].openLv}级开启<color=#0fffff>${all[i].name}</color><br/>`
    //                 } else {
    //                     if (all[i].openLv < 10) {
    //                         str = `       <color=#0fffff>${all[i].name}</color><br/>`
    //                     } else {
    //                         str = `        <color=#0fffff>${all[i].name}</color><br/>`
    //                     }
    //                 }
    //                 strArr.push(str)
    //                 count++
    //             }
    //         }
    //     }
    //     return strArr
    // }
}