import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import PanelId from '../../../../configs/ids/PanelId';
import PeakHeroDetailViewCtrl from './PeakHeroDetailViewCtrl';
import PeakModel from '../../model/PeakModel';
import RoleModel from '../../../../common/models/RoleModel';
import UiListItem from '../../../../common/widgets/UiListItem';
import { ActivityEventId } from '../../enum/ActivityEventId';
import {
    Hero_starCfg,
    HeroCfg,
    Peak_conversionCfg,
    Peak_globalCfg
    } from '../../../../a/config';


/** 
 * @Description: 巅峰之战转换英雄View heroItem
 * @Author: yaozu.hu
 * @Date: 2021-02-23 10:37:28
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-03-02 15:36:11
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/peak/PeakChangeViewHeroItemCtrl")
export default class PeakChangeViewHeroItemCtrl extends UiListItem {

    @property(cc.Node)
    selectSp1Node: cc.Node = null;
    @property(cc.Node)
    selectSp2Node: cc.Node = null;

    @property(cc.Sprite)
    icon: cc.Sprite = null;
    @property(cc.Node)
    careerIcon: cc.Node = null;

    @property(cc.Node)
    groupIcon: cc.Node = null;

    @property(cc.Sprite)
    colorBg: cc.Sprite = null;
    @property(cc.Button)
    clickBtn: cc.Button = null;
    @property(cc.Label)
    lv: cc.Label = null;

    conversionCfg: Peak_conversionCfg;
    heroCfg: HeroCfg = null

    isGray: 0 | 1 = 0;

    isList: boolean = true;
    get roleModel(): RoleModel { return ModelManager.get(RoleModel); }
    get peakModel() { return ModelManager.get(PeakModel); }
    updateView() {
        this.conversionCfg = this.data.cfg;
        this.isGray = this.data.isGray;
        this.isList = this.data.isList;

        this.heroCfg = ConfigManager.getItemById(HeroCfg, this.conversionCfg.item_id);
        this.isGray = this.data.isGray;

        let icon = `icon/hero/${this.heroCfg.icon}`;
        GlobalUtil.setSpriteIcon(this.node, this.icon, icon);
        GlobalUtil.setSpriteIcon(this.node, this.groupIcon, `common/texture/role/select/group_${this.heroCfg.group[0]}`);
        let tem = ConfigManager.getItemByField(Peak_globalCfg, 'key', 'star_level').value
        let starCfg = ConfigManager.getItemByField(Hero_starCfg, 'star', tem[0]);
        GlobalUtil.setSpriteIcon(this.node, this.colorBg, `common/texture/role/select/quality_bg_0${starCfg.color}`);
        this.lv.string = '.' + tem[1]
        GlobalUtil.setAllNodeGray(this.node, this.isGray);
        this.clickBtn.interactable = this.isGray == 0
        gdk.e.on(ActivityEventId.ACTIVITY_PEAK_CHANGEHERO_SELECT_UPDATE, this.selectHeroEvent, this);
        if (this.peakModel.changeHeroSelectId == this.conversionCfg.item_id && this.isList) {
            //this.selectNode.active == true;
            this.itemClick();
        } else {
            this.selectSp1Node.active = false;
        }
        if (!this.isList && this.peakModel.randomData && this.peakModel.randomData.hero.typeId == this.conversionCfg.item_id) {
            this.selectSp2Node.active = true;
        } else {
            this.selectSp2Node.active = false;
        }

    }

    onDisable() {
        gdk.e.targetOff(this);
    }

    // _itemSelect() {

    //     this.selectNode.active = this.ifSelect
    // }

    selectHeroEvent(e: gdk.Event) {
        if (this.isList && e.data.cfg.item_id != this.conversionCfg.item_id) {
            this.selectSp1Node.active = false;
        }
    }

    itemClick() {
        if (this.isList) {
            //发送选中消息
            this.selectSp1Node.active = true;
            this.peakModel.changeHeroSelectId = this.conversionCfg.item_id;
            gdk.e.emit(ActivityEventId.ACTIVITY_PEAK_CHANGEHERO_SELECT_UPDATE, this.data)
        } else {
            gdk.panel.setArgs(PanelId.PeakHeroDetailView, 3);
            gdk.panel.open(PanelId.PeakHeroDetailView, (node: cc.Node) => {
                let comp = node.getComponent(PeakHeroDetailViewCtrl)
                comp.initHeroInfo(this.conversionCfg.item_id, this.conversionCfg.career_id)
            })
        }
    }




}
