import ConfigManager from '../../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import GroupItemCtrl from '../camp/GroupItemCtrl';
import GuardianModel from '../../../model/GuardianModel';
import HeroModel from '../../../../../common/models/HeroModel';
import HeroUtils from '../../../../../common/utils/HeroUtils';
import JumpUtils from '../../../../../common/utils/JumpUtils';
import ModelManager from '../../../../../common/managers/ModelManager';
import NetManager from '../../../../../common/managers/NetManager';
import PanelId from '../../../../../configs/ids/PanelId';
import ResonatingModel from '../../../../resonating/model/ResonatingModel';
import RoleViewCtrl2 from '../RoleViewCtrl2';
import UiSlotItem from '../../../../../common/widgets/UiSlotItem';
import {
    Costume_globalCfg,
    GlobalCfg,
    Hero_undersand_levelCfg,
    HeroCfg
    } from '../../../../../a/config';
import { RoleEventId } from '../../../enum/RoleEventId';

/**
 * 角色界面上方面板控制
 * @Author: sthoo.huang
 * @Date: 2020-02-21 18:31:30
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-08-24 19:51:25
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/main/common/RoleUpCtrl2")
export default class RoleUpCtrl2 extends cc.Component {


    @property(cc.Node)
    bg: cc.Node = null;

    @property(cc.Label)
    heroNameLab: cc.Label = null;

    @property(cc.Label)
    starLabel: cc.Label = null;
    @property(cc.Node)
    maxStarNode: cc.Node = null;
    @property(cc.Label)
    maxStarLb: cc.Label = null;

    @property(sp.Skeleton)
    mysticBgSpine: sp.Skeleton = null;

    @property(sp.Skeleton)
    spine: sp.Skeleton = null;

    @property(cc.Toggle)
    lockNode: cc.Toggle = null

    @property(cc.Node)
    unLockIcon: cc.Node = null

    @property(cc.Node)
    groupLayout: cc.Node = null // 存放阵营图标的

    @property(cc.Prefab)
    groupItem: cc.Prefab = null;

    @property(cc.Node)
    btnShare: cc.Node = null

    @property(cc.Node)
    btnGuardian: cc.Node = null

    @property(cc.Node)
    btnLayout: cc.Node = null

    get model() { return ModelManager.get(HeroModel); }
    get heroInfo() { return this.model.curHeroInfo; }
    _lastHeroTypeId = 0

    onEnable() {
        gdk.e.on(RoleEventId.SHOW_HERO_UP_EFFECT, this._showHeroUpEffectFunc, this)
        // gdk.e.on(RoleEventId.REMOVE_ONE_HERO, this._onRemoveOneHero, this);
        gdk.e.on(RoleEventId.UPDATE_ONE_HERO, this._updateLockState, this)
        NetManager.on(icmsg.HeroUpdateRsp.MsgType, this._onRemoveOneHero, this);
        gdk.gui.onPopupChanged.on(this._onPopupChanged, this);
    }

    onDisable() {
        NetManager.targetOff(this);
        gdk.e.targetOff(this);
        gdk.gui.onPopupChanged.targetOff(this);
        gdk.sound.stop();
    }

    _onPopupChanged() {
        if (gdk.panel.isOpenOrOpening(PanelId.SubEquipPanel2)) {
            this.btnLayout.y = -375
        } else {
            this.btnLayout.y = -325
        }
    }


    /**更新英雄信息 */
    @gdk.binding("model.curHeroInfo")
    updateHero(curHero: icmsg.HeroInfo) {
        if (!curHero) return;
        let heroConfig = ConfigManager.getItemById(HeroCfg, curHero.typeId);

        this.heroNameLab.string = heroConfig.name;
        this.heroNameLab.node.color = cc.color(GlobalUtil.getHeroNameColor(curHero.color))
        let laboutline = this.heroNameLab.getComponent(cc.LabelOutline)
        laboutline.color = cc.color(GlobalUtil.getHeroNameColor(curHero.color, true))
        let mysticSkillLv: number = 0;
        if (heroConfig.group[0] == 6) {
            let totalLv = curHero.mysticSkills[0] + curHero.mysticSkills[1] + curHero.mysticSkills[2] + curHero.mysticSkills[3];
            mysticSkillLv = ConfigManager.getItemByField(Hero_undersand_levelCfg, 'mystery_skill', totalLv).undersand_level;
        }
        this.mysticBgSpine.node.active = false;
        if (mysticSkillLv >= 4) {
            let str = HeroUtils.getMysticBgActName(mysticSkillLv);
            if (str && str.length > 0) {
                this.mysticBgSpine.node.active = true;
                this.mysticBgSpine.setAnimation(0, str, true);
            }
        }
        HeroUtils.setSpineData(this.node, this.spine, HeroUtils.getHeroSkin(curHero.typeId, curHero.star, mysticSkillLv), true, false);
        let bgPath = ["yx_bg04", "yx_bg05", "yx_bg"]
        let idx = 0;
        if (curHero.star >= 5) idx = 2;
        else if (curHero.star > 3) idx = 1;
        else idx = 0;
        GlobalUtil.setSpriteIcon(this.node, this.bg, `view/role/texture/bg/${bgPath[idx]}`)
        this._playHeroSound();
        this._updateStar(curHero);
        this.lockNode.isChecked = curHero.switchFlag == 1// switch_flag;//0 解锁，1是锁定
        this._updateLockState()
        this._updateGroupInfo(curHero);
        this._updateGuardian(curHero)
        this._onPopupChanged()
    }

    _updateGuardian(curHero: icmsg.HeroInfo) {
        let guardian_open = ConfigManager.getItemById(GlobalCfg, "guardian_open").value[0]
        if (curHero.star < guardian_open) {
            this.btnGuardian.active = false
            return
        }
        this.btnGuardian.active = true
        let add = cc.find("bg/add", this.btnGuardian)
        let slot = cc.find("bg/UiSlotItem", this.btnGuardian).getComponent(UiSlotItem)
        if (curHero.guardian && curHero.guardian.id > 0) {
            add.active = false
            slot.node.active = true
            let lv = cc.find("bg/UiSlotItem/lv", this.btnGuardian).getComponent(cc.Label)
            gdk.Timer.callLater(this, () => {
                slot.updateItemInfo(curHero.guardian.type)
                slot.updateStar(curHero.guardian.star)
                lv.string = `.${curHero.guardian.level}`
            })
        } else {
            add.active = true
            slot.node.active = false
        }
    }

    onGuardianClick() {
        if (!JumpUtils.ifSysOpen(2897, true)) {
            return;
        }
        ModelManager.get(GuardianModel).curHeroId = this.heroInfo.heroId;
        let guardian = this.heroInfo.guardian;
        if (guardian && guardian.id > 0) {
            gdk.panel.setArgs(PanelId.GuardianInfoTip, guardian)
            gdk.panel.open(PanelId.GuardianInfoTip,)
        } else {
            if (ModelManager.get(GuardianModel).guardianItems.length > 0) {
                gdk.panel.setArgs(PanelId.GuardianList, 0)
                gdk.panel.open(PanelId.GuardianList)
            } else {
                JumpUtils.openPanel({
                    panelId: PanelId.GuardianView,
                    currId: this.node,
                });
            }
        }
    }
    // 是否锁定
    onSwitchClikc() {
        let state = this.lockNode.isChecked ? 1 : 0;
        if (state != this.model.curHeroInfo.switchFlag) {
            gdk.gui.showMessage(state == 1 ? gdk.i18n.t("i18n:HERO_TIP28") : gdk.i18n.t("i18n:HERO_TIP29"))
            let msg = new icmsg.HeroStatusLockReq()
            msg.heroId = this.heroInfo.heroId
            msg.switchFlag = state
            NetManager.send(msg)
        }
    }

    _updateLockState() {
        this.unLockIcon.active = this.model.curHeroInfo.switchFlag == 1 ? false : true
    }

    /**上一个英雄 */
    leftFunc() {
        this._changHero(-1);
    }

    /**下一个英雄 */
    rightFunc() {
        this._changHero(1);
    }

    /**
     * 点击英雄播放idle动作
     */
    _isClickHero = false;
    playHeroIdleAni() {
        if (this.spine && this.spine.skeletonData) {
            if (!this._isClickHero) {
                this._isClickHero = true
                // 播放声音
                this._playHeroSound();
                // 英雄动画
                this.spine.setAnimation(0, "idle", false);
                this.spine.setCompleteListener(() => {
                    if (!cc.isValid(this.node)) return;
                    this._isClickHero = false;
                    this.spine.setCompleteListener(null);
                    this.spine.setAnimation(0, "stand", true);
                });
            }
        }
    }

    /**更新阵营图标 */
    _updateGroupInfo(curHero: icmsg.HeroInfo) {
        if (!curHero) return;
        if (this._lastHeroTypeId == curHero.typeId) {
            return
        }
        let heroConfig = ConfigManager.getItemById(HeroCfg, curHero.typeId);
        if (heroConfig) {
            let hero = heroConfig
            if (hero.group && hero.group.length > 0) {
                this.groupLayout.removeAllChildren()
                for (let index = 0; index < hero.group.length; index++) {
                    let item = cc.instantiate(this.groupItem)
                    item.active = false
                    this.groupLayout.addChild(item)
                }
                for (let i = 0; i < hero.group.length; i++) {
                    let item = this.groupLayout.children[i]
                    item.active = true;
                    let ctrl = item.getComponent(GroupItemCtrl)
                    ctrl.setGruopDate(hero.group[i], hero.id)
                }
            }
        }
        this._lastHeroTypeId = curHero.typeId
    }

    _onRemoveOneHero(resp: icmsg.HeroUpdateRsp) {
        let delList = resp.deleteList;
        delList.forEach(id => {
            for (let i = 0; i < this.model.selectHeros.length; i++) {
                if ((<icmsg.HeroInfo>this.model.selectHeros[i].data.extInfo).heroId == id) {
                    this.model.selectHeros.splice(i, 1);
                    return;
                }
            }
        })
    }

    // 英雄音效
    _speech: string;
    _playHeroSound() {
        if (!GlobalUtil.isSoundOn) return;
        gdk.sound.stop();
        let resId = gdk.Tool.getResIdByNode(this.node);
        let speech: string;
        let heroCfg = ConfigManager.getItemById(HeroCfg, this.heroInfo.typeId);
        if (this.heroInfo.color >= 3) {
            speech = HeroUtils.getHeroSpeech(heroCfg.id);
            if (speech) {
                gdk.sound.play(resId, speech, true);
            }
        }
        if (speech != this._speech) {
            // 销毁上一个音效资源
            if (this._speech) {
                let url = `${gdk.sound.prefix}${this._speech}`;
                gdk.rm.releaseRes(resId, url, cc.AudioClip);
            }
            this._speech = speech;
        }
    }

    /**更新星星 */
    _updateStar(curHero: icmsg.HeroInfo) {
        if (!curHero) return;
        if (curHero.star >= 12 && this.maxStarNode) {
            this.starLabel.node.active = false;
            this.maxStarNode.active = true;
            this.maxStarLb.string = (curHero.star - 11) + ''
        } else {
            this.starLabel.node.active = true;
            this.maxStarNode ? this.maxStarNode.active = false : 0;
            this.starLabel.string = curHero.star > 5 ? '2'.repeat(curHero.star - 5) : '1'.repeat(curHero.star);
        }
    }

    /**左右切换当前选择英雄 */
    _changHero(dir: number) {
        let items = this.model.selectHeros;
        let len = items.length;
        if (len == 0) {
            return;
        }
        let heroIdx = -1;
        let curr = this.model.curHeroInfo;
        curr && items.some((item, i) => {
            let info = <icmsg.HeroInfo>item.data.extInfo;
            if (info && info.heroId == curr.heroId) {
                heroIdx = i;
                return true;
            }
            return false;
        });
        let nextIdx = heroIdx + dir;
        if (nextIdx < 0) {
            nextIdx = len - 1;
        } else if (nextIdx >= len) {
            nextIdx = 0;
        }
        if (heroIdx == nextIdx) {
            return;
        }

        this.model.curHeroInfo = items[nextIdx].data.extInfo as icmsg.HeroInfo;

        let costume_star = ConfigManager.getItemById(Costume_globalCfg, "costume_star").value[0]
        if (this.model.curHeroInfo.star < costume_star) {
            let node = gdk.panel.get(PanelId.RoleView2)
            if (node) {
                let ctrl = node.getComponent(RoleViewCtrl2)
                if (ctrl.panelIndex == 2) {
                    ctrl.selectFunc(null, 0)
                }
            }
        }
    }

    _showHeroUpEffectFunc() {
        if (this.spine && this.spine.skeletonData) {
            if (!this._isClickHero) {
                this._isClickHero = true
                // 英雄动画
                this.spine.setAnimation(0, "idle", false);
                this.spine.setCompleteListener(() => {
                    if (!cc.isValid(this.node)) return;
                    this._isClickHero = false;
                    this.spine.setCompleteListener(null);
                    this.spine.setAnimation(0, "stand", true);
                });
            }
        }
    }


    /**英雄重置 */
    openResetFunc() {
        if (!JumpUtils.ifSysOpen(2804, true)) {
            return
        }
        //符合条件的进入
        if (this.heroInfo.level >= 2) {
            if (!ModelManager.get(ResonatingModel).getHeroInUpList(this.heroInfo.heroId)) {
                this.model.resetHeroId = this.heroInfo.heroId
            }
            let heroInfo = this.heroInfo;
            JumpUtils.openPanel({
                panelId: PanelId.HeroResetView,
                currId: PanelId.RoleView2,
                callback: () => {
                    ModelManager.get(HeroModel).curHeroInfo = heroInfo;
                }
            });
        } else {
            GlobalUtil.showMessageAndSound(gdk.i18n.t("i18n:HERO_TIP30"))
        }
    }

    shareFunc() {
        let btns = [12, 13]
        GlobalUtil.openBtnMenu(this.btnShare, btns, {
            id: 0,
            level: 1,
            extInfo: this.heroInfo
        })
    }

    commentFunc() {
        gdk.panel.open(PanelId.SubHeroCommentPanel)
    }

    getWayFunc() {
        let cfg = ConfigManager.getItemById(HeroCfg, this.model.curHeroInfo.typeId);
        if (!cfg.new_get || cfg.new_get.length <= 0) {
            gdk.gui.showMessage('暂无获取途径');
        }
        else {
            GlobalUtil.openGainWayTips(this.model.curHeroInfo.typeId);
        }
    }
}
