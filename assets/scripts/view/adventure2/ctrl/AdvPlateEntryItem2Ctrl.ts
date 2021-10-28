import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import NewAdventureModel from '../model/NewAdventureModel';
import StringUtils from '../../../common/utils/StringUtils';
import { Adventure2_entryCfg, Copy_hardcoreCfg } from '../../../a/config';

/**
 * @Description: 雇佣英雄子项
 * @Author: luoyong
 * @Date: 2019-04-18 13:44:33
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-05-13 20:32:05
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/adventure2/AdvPlateEntryItem2Ctrl")
export default class AdvPlateEntryItem2Ctrl extends cc.Component {

    @property(cc.Node)
    bg: cc.Node = null

    @property(sp.Skeleton)
    selectIcon: sp.Skeleton = null

    @property(cc.Label)
    nameLab: cc.Label = null

    @property(cc.Node)
    typeIcon: cc.Node = null

    @property(cc.RichText)
    descLab: cc.RichText = null

    @property(cc.Node)
    suitIcon: cc.Node = null

    _info: icmsg.AdventureEntry = null
    _index: number = 0

    _spineColor = ["", "UI_yiwuxuanzhonglv", "UI_yiwuxuanzhonglan", "UI_yiwuxuanzhongzi", "UI_yiwuxuanzhongjin", "UI_yiwuxuanzhonghong"]

    get adventureModel(): NewAdventureModel { return ModelManager.get(NewAdventureModel); }

    get isSelect() {
        return this.selectIcon.node.active
    }

    get entryInfo() {
        return this._info
    }

    updateViewInfo(index, data) {
        this._index = index
        this._info = data.info
        this.selectIcon.node.active = data.isSelect
        let entryCfg = ConfigManager.getItemByField(Adventure2_entryCfg, "group", this._info.group, { hardcore_id: this._info.id })
        GlobalUtil.setSpineData(this.node, this.selectIcon, `spine/ui/${this._spineColor[entryCfg.quality]}/${this._spineColor[entryCfg.quality]}`)
        if (data.isSelect) {
            this.node.width = this.bg.width * 1.2
            this.node.height = this.bg.height * 1.2
            this.node.runAction(cc.scaleTo(0.3, 1.2, 1.2))
            this.selectIcon.setAnimation(0, "stand", true)
        } else {
            this.node.stopAllActions()
            this.node.scale = 1
            this.node.width = this.bg.width
            this.node.height = this.bg.height
        }
        this.nameLab.string = `${entryCfg.name}`
        this.nameLab.node.color = cc.color(GlobalUtil.getHeroNameColor(entryCfg.quality))
        this.nameLab.node.getComponent(cc.LabelOutline).color = cc.color(GlobalUtil.getHeroNameColor(entryCfg.quality, true))
        let hardCoreCfg = ConfigManager.getItemById(Copy_hardcoreCfg, entryCfg.hardcore_id)
        this.descLab.string = ''
        this.descLab.string = StringUtils.setRichtOutLine(hardCoreCfg.dec, GlobalUtil.getHeroNameColor(entryCfg.quality, true), 1)
        this.descLab.node.color = cc.color(GlobalUtil.getHeroNameColor(entryCfg.quality))
        if (entryCfg.icon) {
            GlobalUtil.setSpriteIcon(this.node, this.typeIcon, `view/adventure/texture/bg/${entryCfg.icon}`)
        }
        GlobalUtil.setSpriteIcon(this.node, this.bg, `view/adventure/texture/bg/adv_entryBg_${entryCfg.quality}`)

        // 1 all  2 阵营id 3 职业id 4 英雄id
        let path = ``
        if (entryCfg.apply[0] == 1 || entryCfg.apply[0] == 2) {
            path = GlobalUtil.getGroupIcon(entryCfg.apply[1])
        } else if (entryCfg.apply[0] == 3) {
            path = GlobalUtil.getSoldierTypeIcon(entryCfg.apply[1])
        } else if (entryCfg.apply[0] == 4) {
            path = GlobalUtil.getHeadIconById(entryCfg.apply[1])
        }
        GlobalUtil.setSpriteIcon(this.node, this.suitIcon, path)
    }


    selectFunc() {
        if (this.adventureModel.entrySelectIndex != this._index) {
            this.adventureModel.entrySelectIndex = this._index
        }
    }
}