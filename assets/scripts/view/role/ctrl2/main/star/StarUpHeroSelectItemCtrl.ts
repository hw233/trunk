import ConfigManager from '../../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import HeroUtils from '../../../../../common/utils/HeroUtils';
import JumpUtils from '../../../../../common/utils/JumpUtils';
import ModelManager from '../../../../../common/managers/ModelManager';
import PanelId from '../../../../../configs/ids/PanelId';
import ResonatingModel from '../../../../resonating/model/ResonatingModel';
import UiListItem from '../../../../../common/widgets/UiListItem';
import { BagType } from '../../../../../common/models/BagModel';
import { Hero_starCfg, HeroCfg, ItemCfg } from '../../../../../a/config';
/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-08-25 13:43:13 
  */// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/main/star/StarUpHeroSelectItemCtrl")
export default class StarUpHeroSelectItemCtrl extends UiListItem {
    @property(cc.Node)
    heroNode: cc.Node = null;

    @property(cc.Node)
    getHeroNode: cc.Node = null;

    @property(cc.Node)
    qualityBg: cc.Node = null;

    @property(cc.Node)
    icon: cc.Node = null;

    @property(cc.Node)
    group: cc.Node = null;

    @property(cc.Label)
    lv: cc.Label = null;

    @property(cc.Label)
    star: cc.Label = null;
    @property(cc.Node)
    maxStarNode: cc.Node = null;
    @property(cc.Label)
    maxStarLb: cc.Label = null;

    @property(cc.Node)
    checkFlag: cc.Node = null;

    @property(cc.Node)
    progressNode: cc.Node = null;

    @property(cc.Node)
    redPoint: cc.Node = null;

    @property(cc.Node)
    lock: cc.Node = null

    heroInfo: icmsg.HeroInfo;
    selected: boolean;
    pageType: number;  // 1-MaterialsSelectView 2-HeroComposePanel
    itemType: BagType;
    itemId: number;
    get resonatingModel(): ResonatingModel { return ModelManager.get(ResonatingModel); }
    updateView() {
        GlobalUtil.setAllNodeGray(this.node, 0);
        [this.heroInfo, this.selected, this.pageType, this.itemType, this.itemId] = [this.data.heroInfo, this.data.selected, this.data.pageType, this.data.itemType, this.data.itemId];
        if (!this.itemType) {
            this.heroNode.active = false;
            this.getHeroNode.active = true;
        }
        else if (this.itemType == BagType.HERO) {
            this.heroNode.active = true;
            this.getHeroNode.active = false;
            this._updateHero();
        }
        else {
            this.heroNode.active = true;
            this.getHeroNode.active = false;
            this._updateItem();
        }

        if (this.pageType == 1) {
            this.progressNode.active = false;
            this.redPoint.active = false;
            if (this.heroInfo && this.itemType == BagType.HERO) {
                let b = HeroUtils.heroLockCheck(this.heroInfo, false);
                GlobalUtil.setAllNodeGray(this.node, b ? 1 : 0);
                this.lock.active = b;
            }
            else {
                this.lock.active = false;
            }
        }
        else {
            this.progressNode.active = true;
            this._upStarProgressNode();
        }
    }

    onClick() {
        if (!this.itemType) {
            // gdk.gui.showMessage('获取更多英雄');
            gdk.panel.hide(PanelId.StarUpdateView);
            gdk.panel.hide(PanelId.MaterialsSelectView);
            JumpUtils.openLottery(null);
        }
    }

    _updateHero() {
        let cfg = ConfigManager.getItemById(HeroCfg, this.heroInfo.typeId);
        let star = this.pageType == 2 ? this.heroInfo.star + 1 : this.heroInfo.star;
        let color = ConfigManager.getItemById(Hero_starCfg, star).color;
        this.group.active = true;
        GlobalUtil.setSpriteIcon(this.node, this.group, `common/texture/role/select/group_${cfg.group[0]}`);
        GlobalUtil.setSpriteIcon(this.node, this.qualityBg, `common/texture/role/select/quality_bg_0${color}`);
        GlobalUtil.setSpriteIcon(this.node, this.icon, `${cfg.iconPath}`);
        this.lv.string = this.pageType == 1 ? `.${this.heroInfo.level}` : '';

        if (star >= 12) {
            this.star.node.active = false;
            this.maxStarNode.active = true;
            this.maxStarLb.string = (star - 11) + ''
        } else {
            this.star.node.active = true;
            this.maxStarNode.active = false;
            if (star > 5) {
                this.star.string = '1'.repeat(star - 5);
            }
            else {
                this.star.string = '0'.repeat(star);
            }
        }



        if (this.pageType == 2) {
            this.checkFlag.active = this.list['curHeroId'] == this.heroInfo.heroId;
        }
        else {
            this.checkFlag.active = this.selected;
        }
    }

    _updateItem() {
        let itemId = parseInt(this.itemId.toString().slice(0, 6));
        let cfg = ConfigManager.getItemById(ItemCfg, itemId);
        let group = cfg.random_hero_chip[0];
        let star = cfg.random_hero_chip[1];
        let color = ConfigManager.getItemById(Hero_starCfg, star).color;
        this.lv.string = '';
        GlobalUtil.setSpriteIcon(this.node, this.qualityBg, `common/texture/role/select/quality_bg_0${color}`);
        GlobalUtil.setSpriteIcon(this.node, this.icon, GlobalUtil.getIconById(itemId));
        this.star.string = star > 5 ? '1'.repeat(star - 5) : '0'.repeat(star);
        this.group.active = group !== -1;
        if (group !== -1) {
            GlobalUtil.setSpriteIcon(this.node, this.group, GlobalUtil.getGroupIcon(group, false));
        }
        this.checkFlag.active = this.selected;
    }

    check() {
        if (this.pageType == 2) {
            this.checkFlag.active = this.list['curHeroId'] == this.heroInfo.heroId;
        }
        else {
            if (this.itemType) {
                this.data.selected = !this.data.selected;
                this.selected = !this.selected;
                this.checkFlag.active = this.selected;
            }
        }
    }

    /**
     * 更新升星进度显示
     */
    _upStarProgressNode() {
        let bar1 = this.progressNode.getChildByName('bar');
        let num = this.progressNode.getChildByName('num').getComponent(cc.Label);
        this.progressNode.active = true;
        let [hasNum, needNum] = HeroUtils.getProgressOfUpStar(this.heroInfo.typeId, this.heroInfo.star);
        bar1.width = hasNum / needNum * 88;
        num.string = `${hasNum}/${needNum}`;

        if (HeroUtils.upStarLimit(this.heroInfo.star + 1, false)) {
            this.redPoint.active = false;
        }
        else {
            this.redPoint.active = hasNum == needNum;
        }
    }
}
