import GlobalUtil from '../../../../common/utils/GlobalUtil';
import GuideBind from '../../../../guide/ctrl/GuideBind';
import GuideUtil from '../../../../common/utils/GuideUtil';
import HeroModel from '../../../../common/models/HeroModel';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import PveFsmEventId from '../../enum/PveFsmEventId';
import PveSceneBaseAction from '../base/PveSceneBaseAction';
import PveSceneState from '../../enum/PveSceneState';
import PveTool from '../../utils/PveTool';
import RoleModel from '../../../../common/models/RoleModel';
import VaultModel from '../../../vault/model/VaultModel';
import { AskInfoCacheType, AskInfoType } from '../../../../common/widgets/AskPanel';
import { CopyType } from '../../../../common/models/CopyModel';

/** 
 * Pve场景开始战斗前数据验证
 * @Author: sthoo.huang  
 * @Date: 2019-08-26 11:51:22 
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-06-22 10:43:04
 */

@gdk.fsm.action("PveSceneValidateAction", "Pve/Scene")
export default class PveSceneValidateAction extends PveSceneBaseAction {

    onEnter() {
        super.onEnter();
        // 判断是否有英雄上阵
        let m = this.model;
        let l = m.heros.length;
        if (m.stageConfig.copy_id == CopyType.NONE &&
            m.arenaSyncData &&
            ['CHAMPION_GUESS', 'PIECES_CHESS'].indexOf(m.arenaSyncData.fightType) !== -1) {
            this.finish();
            return;
        }
        if (m.stageConfig.copy_id == CopyType.NONE &&
            m.arenaSyncData &&
            m.arenaSyncData.fightType == 'VAULT') {
            let vaultModel = ModelManager.get(VaultModel)
            let smsg = new icmsg.VaultFightStartReq();
            smsg.positionId = vaultModel.curPos + 1;
            smsg.difficulty = vaultModel.curDifficulty + vaultModel.addNum[vaultModel.curNum]
            NetManager.send(smsg, (rmsg: icmsg.VaultFightStartRsp) => {
                if (rmsg.startSucc) {
                    this.finish();
                } else {
                    this.model.ctrl.close(-1);
                }
                this.finish();
            }, this);
            return;
        }

        if (l == 0) {
            gdk.gui.showMessage(gdk.i18n.t('i18n:PLS_SELECT_FIGHTING_HEROS'));
            this.sendEvent(PveFsmEventId.PVE_SCENE_ERROR);
            return;
        }
        // 当前关卡玩家等级不足
        if (m.stageConfig.player_lv > ModelManager.get(RoleModel).level) {
            gdk.gui.showMessage(gdk.i18n.t('i18n:PVE_LIMIT_LEVEL'));
            this.sendEvent(PveFsmEventId.PVE_SCENE_ERROR);
            return;
        }

        // 检测塔座上的英雄和推荐是否匹配
        let check = false;
        let activeCondition = ""
        this.model.towers.forEach(buildTower => {
            if (buildTower.isSoldierType) {
                if (!buildTower.hero || buildTower.hero.model.soldierType != buildTower.soldierTypeNum) {
                    //cc.log('塔座(' + buildTower.id + ')-----没有反正推荐的类型：' + buildTower.soldierTypename[buildTower.soldierTypeNum + ''])
                    let guide = buildTower.node.getComponent(GuideBind);
                    if (!guide) {
                        guide = buildTower.node.addComponent(GuideBind)
                    }
                    let number = 1400 + buildTower.id;
                    guide.guideIds = [number]
                    check = true;
                    guide.bindBtn()
                    if (activeCondition == "") {
                        activeCondition = "buildTower#" + buildTower.id;
                    }
                }
            }
        });

        // 有剩余的英雄没上阵，并且英雄塔位还有空余
        let num = PveTool.getMaxHeroNum(this.model);
        let copyType = this.model.stageConfig.copy_id == CopyType.RookieCup ||
            this.model.stageConfig.copy_id == CopyType.ChallengeCup
        if (this.model.stageConfig.copy_id == CopyType.NONE && (this.model.arenaSyncData.fightType == 'ARENATEAM' ||
            this.model.arenaSyncData.fightType == 'ARENAHONOR_GUESS'
            || this.model.arenaSyncData.fightType == 'WORLDHONOR_GUESS')) {
            copyType = true;
        }
        if (m.state === PveSceneState.Ready && l < num && !copyType) {
            // 英雄总量比塔位多，则显示一键上阵提示，否则显示抽卡提示
            let t = m.isBounty ? m.bountyMission.heroList.length : ModelManager.get(HeroModel).heroInfos.length;
            let b = l < t;
            gdk.gui.showAskAlert(
                gdk.i18n.t(b ? "i18n:PVE_ONEKEY_TIP" : 'i18n:PVE_GET_MORE_HERO_TIP'),
                gdk.i18n.t("i18n:TIP_TITLE"), "PVE_ENTER_TIP",
                (index: number) => {
                    if (index === 1) {
                        // 不需要
                        if (check) {

                            let info: AskInfoType = {
                                title: gdk.i18n.t("i18n:TIP_TITLE"),
                                sureText: gdk.i18n.t("i18n:PVE_TOWER_CHECK_CANCEL"),
                                sureCb: () => {
                                    this.sendEvent(PveFsmEventId.PVE_SCENE_ERROR);
                                    !m.isBounty && activeCondition && GuideUtil.activeGuide(activeCondition);
                                },
                                closeText: gdk.i18n.t("i18n:PVE_TOWER_CHECK_OK"),
                                closeCb: () => {
                                    this.finish();
                                },
                                closeBtnCb: () => {
                                    this.sendEvent(PveFsmEventId.PVE_SCENE_ERROR);
                                },
                                descText: gdk.i18n.t("i18n:PVE_TOWER_CHECK_TITLE"),
                                thisArg: this,
                                isShowTip: true,
                                tipSaveCache: AskInfoCacheType.tower_check_tip,
                            }
                            GlobalUtil.openAskPanel(info)
                        } else {
                            this.finish();
                        }

                    } else if (index === 0) {
                        // 一键上阵
                        if (b) {
                            // this.sendEvent(PveFsmEventId.PVE_SCENE_ONE_KEY);
                            if (this.model.stageConfig.copy_id == CopyType.Survival && this.model.stageConfig.subtype == 1) {
                                gdk.panel.open(PanelId.SurvivalSetUpHeroSelector);
                                this.sendEvent(PveFsmEventId.PVE_SCENE_ERROR);
                            } else {
                                gdk.panel.open(PanelId.RoleSetUpHeroSelector);
                                this.sendEvent(PveFsmEventId.PVE_SCENE_ERROR);
                            }
                        } else {
                            // 前往抽卡界面
                            gdk.panel.setArgs(PanelId.Lottery, 0)
                            gdk.panel.open(PanelId.Lottery);
                        }
                    } else {
                        // 返回准备界面
                        this.sendEvent(PveFsmEventId.PVE_SCENE_ERROR);
                    }
                }, this, {
                cancel: gdk.i18n.t("i18n:PVE_DONT_NEED_LABEL"),
                ok: gdk.i18n.t(b ? "i18n:PVE_SETUP_HERO_LABEL" : "i18n:PVE_GET_MORE_HERO_LABEL")
            });
            return;
        }

        if (check) {
            let info: AskInfoType = {
                title: gdk.i18n.t("i18n:TIP_TITLE"),
                sureText: gdk.i18n.t("i18n:PVE_TOWER_CHECK_CANCEL"),
                sureCb: () => {
                    this.sendEvent(PveFsmEventId.PVE_SCENE_ERROR);
                    !m.isBounty && activeCondition && GuideUtil.activeGuide(activeCondition);
                },
                closeText: gdk.i18n.t("i18n:PVE_TOWER_CHECK_OK"),
                closeCb: () => {
                    this.finish();
                },
                closeBtnCb: () => {
                    this.sendEvent(PveFsmEventId.PVE_SCENE_ERROR);
                },
                descText: gdk.i18n.t("i18n:PVE_TOWER_CHECK_TITLE"),
                thisArg: this,
                isShowTip: true,
                tipSaveCache: AskInfoCacheType.tower_check_tip,
            }
            GlobalUtil.openAskPanel(info)
            return;
        }

        this.finish();
    }
    onExit() {
        NetManager.targetOff(this);
        super.onExit();
    }
}