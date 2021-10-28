import ConfigManager from '../../../../../common/managers/ConfigManager';
import GuardianEquipSuitPreViewItemCtrl from './GuardianEquipSuitPreViewItemCtrl';
import GuardianEquipSuitTypeCtrl from './GuardianEquipSuitTypeCtrl';
import { Guardian_equip_skillCfg } from '../../../../../a/config';

const { ccclass, property, menu } = cc._decorator;
/** 
 * @Description: 
 * @Author:luoyong
 * @Date: 2019-05-08 14:30:43 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-04-19 13:40:57
 */


@ccclass
@menu("qszc/view/role2/guardian/equip/GuardianEquipSuitPreViewCtrl")
export default class GuardianEquipSuitPreViewCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    suitItemPrefab: cc.Prefab = null

    @property(cc.Button)
    suitBtns: cc.Button[] = []

    _selectSuitType: number = 0

    onEnable() {
        this.selectSuitFunc(null, 0)
    }

    _updateViewInfo() {
        this._updteSuitBtns()
        let tempCfgs = ConfigManager.getItemsByField(Guardian_equip_skillCfg, "type", 1)
        let starArr = []
        let numArr = []
        tempCfgs.forEach(element => {
            if (starArr.indexOf(element.star) == -1) {
                starArr.push(element.star)
            }
            if (numArr.indexOf(element.number) == -1) {
                numArr.push(element.number)
            }
        });

        let targetNum = numArr[numArr.length - 1]
        this.scrollView.stopAutoScroll()
        this.content.removeAllChildren()
        if (this._selectSuitType == 0) {
            for (let i = 0; i < starArr.length; i++) {
                let cfgs = ConfigManager.getItems(Guardian_equip_skillCfg, { star: starArr[i], number: targetNum })
                for (let j = 0; j < cfgs.length; j++) {
                    let suitItem = cc.instantiate(this.suitItemPrefab)
                    this.content.addChild(suitItem)
                    let ctrl = suitItem.getComponent(GuardianEquipSuitPreViewItemCtrl)
                    ctrl.updateViewInfo(cfgs[j])
                }
            }
        } else {
            for (let i = 0; i < starArr.length; i++) {
                let cfg = ConfigManager.getItemByField(Guardian_equip_skillCfg, "type", this._selectSuitType, { star: starArr[i], number: targetNum })
                let suitItem = cc.instantiate(this.suitItemPrefab)
                this.content.addChild(suitItem)
                let ctrl = suitItem.getComponent(GuardianEquipSuitPreViewItemCtrl)
                ctrl.updateViewInfo(cfg)
            }
        }
    }

    _updteSuitBtns() {
        for (let i = 0; i < this.suitBtns.length; i++) {
            let ctrl = this.suitBtns[i].node.getComponent(GuardianEquipSuitTypeCtrl)
            ctrl.updateViewInfo(i)
        }
    }

    /**选择页签, 筛选职业*/
    selectSuitFunc(e, utype) {
        this._selectSuitType = parseInt(utype)
        for (let idx = 0; idx < this.suitBtns.length; idx++) {
            const element = this.suitBtns[idx];
            element.interactable = idx != this._selectSuitType
            let select = element.node.getChildByName("select")
            select.active = idx == this._selectSuitType
        }
        this._updateViewInfo()
    }
}