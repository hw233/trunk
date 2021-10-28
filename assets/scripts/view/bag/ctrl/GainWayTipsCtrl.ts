import BagUtils from '../../../common/utils/BagUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import ItemWayItemCtrl from './ItemWayItemCtrl';
import StringUtils from '../../../common/utils/StringUtils';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { BagType } from '../../../common/models/BagModel';
import {
    CostumeCfg,
    Hero_careerCfg,
    Hero_starCfg,
    HeroCfg,
    Item_equipCfg,
    ItemCfg,
    RuneCfg
    } from '../../../a/config';

/** 
 * 物品获取途径提示面板
 * @Author: luoyong  
 * @Description: 
 * @Date: 2019-09-06 09:57:55 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-05-10 15:57:34
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/bag/GainWayTipsCtrl")
export default class GainWayTipsCtrl extends gdk.BasePanel {
    @property(cc.Node)
    textTitleLayout: cc.Node = null;

    @property(cc.Label)
    nameLab: cc.Label = null

    @property(cc.RichText)
    descLab: cc.RichText = null

    @property(UiSlotItem)
    uiSlotItem: UiSlotItem = null

    @property(cc.Node)
    getWayNode: cc.Node = null

    @property(cc.Prefab)
    wayItemPrefab: cc.Prefab = null;

    baseConfig: ItemCfg | RuneCfg | Item_equipCfg | CostumeCfg | HeroCfg;

    onEnable() {
        let args = this.args
        let itemId = args[0]
        let ways = args[1] || []
        this.initItemInfo(itemId, ways)
    }

    /**
     *
     */
    initItemInfo(itemId: number, ways: any[] = []) {
        this.baseConfig = <ItemCfg | RuneCfg | Item_equipCfg | CostumeCfg | HeroCfg>BagUtils.getConfigById(itemId)
        let type = BagUtils.getItemTypeById(this.baseConfig.id)
        let color;
        let des;
        if (type == BagType.HERO) {
            this.textTitleLayout.x = -98;
            cc.find('costLab', this.textTitleLayout).active = true;
            color = ConfigManager.getItemById(Hero_starCfg, (<HeroCfg>this.baseConfig).star_min).color;
            des = (<HeroCfg>this.baseConfig).desc
            this.uiSlotItem.starNum = (<HeroCfg>this.baseConfig).star_min;
            this.uiSlotItem.group = (<HeroCfg>this.baseConfig).group[0];
            this.uiSlotItem.career = ConfigManager.getItemByField(Hero_careerCfg, 'career_id', (<HeroCfg>this.baseConfig).career_id).career_type;
        }
        else {
            this.textTitleLayout.x = 0;
            cc.find('costLab', this.textTitleLayout).active = false;
            color = (<ItemCfg | RuneCfg | Item_equipCfg | CostumeCfg>this.baseConfig).color;
            des = (<ItemCfg | RuneCfg | Item_equipCfg | CostumeCfg>this.baseConfig).des
        }
        if (type == BagType.ITEM) {
            let args = this.baseConfig["func_args"]
            let n: number = args ? args.length : 0
            if (n > 0) {
                for (let i = 0; i < n; i++) {
                    des = StringUtils.replace(des, "{" + "func_args" + "}", args[i]);
                }
            }
        }
        this.descLab.string = des
        this.uiSlotItem.updateItemInfo(itemId)

        this.nameLab.string = this.baseConfig.name


        this.nameLab.node.color = BagUtils.getColor(color)
        let outline = this.nameLab.getComponent(cc.LabelOutline)
        outline.color = BagUtils.getOutlineColor(color)


        let wayGet: any[] = this.baseConfig["new_get"] || []
        if (ways.length > 0) {
            wayGet = ways
        }
        if (wayGet.length > 0) {
            this.getWayNode.active = true
            for (let i = 0; i < wayGet.length; i++) {
                let way = cc.instantiate(this.wayItemPrefab)
                this.getWayNode.addChild(way)
                let wayCtrl = way.getComponent(ItemWayItemCtrl)
                wayCtrl.updateWayInfo(wayGet[i], this.baseConfig);
            }
        }
        else {
            this.textTitleLayout.active = false;
        }
        this.getWayNode.parent.getComponent(cc.ScrollView).enabled = wayGet.length >= 3;
        gdk.Timer.callLater(this, () => {
            if (!cc.isValid(this.node)) return;
            if (!this.node.activeInHierarchy) return;
            this.getWayNode.parent.height = Math.min(372, wayGet.length * 148 + 2);
        });
    }
}
