import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import ExpeditionModel from './ExpeditionModel';
import ExpeditionUtils from './ExpeditionUtils';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import GuideUtil from '../../../../common/utils/GuideUtil';
import HeroModel from '../../../../common/models/HeroModel';
import HeroUtils from '../../../../common/utils/HeroUtils';
import JumpUtils from '../../../../common/utils/JumpUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import UiListItem from '../../../../common/widgets/UiListItem';
import { HeroCfg } from '../../../../a/config';

/** 
 * @Description: 
 * @Author: yaozu.hu
 * @Date: 2020-12-23 10:28:06
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-06-22 17:00:27
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/expedition/ExpeditionHeroListItemCtrl")
export default class ExpeditionHeroListItemCtrl extends UiListItem {

    @property(cc.Node)
    selectNode: cc.Node = null

    @property(cc.Label)
    lvLab: cc.Label = null;

    @property(cc.Sprite)
    icon: cc.Sprite = null;

    @property(cc.Label)
    starLab: cc.Label = null;
    @property(cc.Node)
    maxStarNode: cc.Node = null;
    @property(cc.Label)
    maxStarLb: cc.Label = null;

    @property(cc.Node)
    careerIcon: cc.Node = null;

    @property(cc.Node)
    groupIcon: cc.Node = null;

    @property(cc.Sprite)
    colorBg: cc.Sprite = null

    @property(cc.Node)
    battleIcon: cc.Node = null;

    heroInfo: icmsg.HeroInfo = null
    heroCfg: HeroCfg = null
    quality: number = 0
    get model(): HeroModel { return ModelManager.get(HeroModel); }

    onEnable() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEnd, this, true);
    }

    onDisable() {
        this.node.targetOff(this);
        gdk.Timer.clearAll(this);
    }

    //触摸开始 
    touchStart() {
        gdk.Timer.clearAll(this);
        if (ModelManager.get(ExpeditionModel).isHeroListScrolling) {
            return
        }
        gdk.Timer.once(800, this, () => {
            if (!ModelManager.get(ExpeditionModel).isHeroListScrolling) {
                JumpUtils.openExpeditionHeroDetailView(this.heroInfo.heroId)
            }
        });

    }
    //触摸结束
    touchEnd(e: cc.Event.EventTouch) {
        let d = e.getLocationY() - e.getStartLocation().y
        if (Math.abs(d) >= 0) {
            gdk.Timer.clearAll(this);
        }
    }


    updateView() {
        this.heroInfo = this.data;
        let icon = HeroUtils.getHeroHeadIcon(this.heroInfo.typeId, this.heroInfo.star, false)//`icon/hero/${cfg.icon}`;
        GlobalUtil.setSpriteIcon(this.node, this.icon, icon);
        let level = this.heroInfo.level || 1;
        this.lvLab.string = `${level}`;
        this.heroCfg = ConfigManager.getItemById(HeroCfg, this.heroInfo.typeId);
        GlobalUtil.setSpriteIcon(this.node, this.groupIcon, `common/texture/role/select/group_${this.heroCfg.group[0]}`);
        //let careerType = ConfigManager.getItemByField(Hero_careerCfg, 'career_id', this.heroInfo.careerId).career_type;
        let type = Math.floor(this.heroInfo.soldierId / 100);
        GlobalUtil.setSpriteIcon(this.node, this.careerIcon, `common/texture/role/select/career_${type}`);
        GlobalUtil.setSpriteIcon(this.node, this.colorBg, `common/texture/role/select/quality_bg_0${this.heroInfo.color}`);
        this._updateStar();

        let isBattle = ExpeditionUtils.getHeroGirdByHeroId(this.heroInfo.heroId) > 0
        this.battleIcon.active = isBattle


        let b = GlobalUtil.getLocal(`_expedition_guide_state_`) || false
        if (!b) {
            if (this.curIndex == 0 && !isBattle) {
                GuideUtil.bindGuideNode(22003, this.icon.node)
                GuideUtil.setGuideId(216003)
            }
        }
    }

    _itemSelect() {
        if (this.battleIcon.active) {
            return
        }
        this.selectNode.active = this.ifSelect;
    }

    /**更新星星数量 */
    _updateStar() {
        let starNum = this.heroInfo.star;
        if (starNum >= 12 && this.maxStarNode) {
            this.starLab.node.active = false;
            this.maxStarNode.active = true;
            this.maxStarLb.string = (starNum - 11) + ''
        } else {
            this.starLab.node.active = true;
            this.maxStarNode ? this.maxStarNode.active = false : 0;
            let starTxt = "";
            if (starNum > 5) {
                starTxt = '1'.repeat(starNum - 5);
            }
            else {
                starTxt = '0'.repeat(starNum);
            }
            this.starLab.string = starTxt;
        }
    }
}
