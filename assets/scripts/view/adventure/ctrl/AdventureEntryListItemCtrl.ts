import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import StringUtils from '../../../common/utils/StringUtils';
import UiListItem from '../../../common/widgets/UiListItem';
import { Adventure_entryCfg, Copy_hardcoreCfg } from '../../../a/config';
/**
 * @Description: 雇佣英雄子项
 * @Author: luoyong
 * @Date: 2019-04-18 13:44:33
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-03-01 14:46:50
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/adventure/AdventureEntryListItemCtrl")
export default class AdventureEntryListItemCtrl extends UiListItem {

    @property(cc.Node)
    bg: cc.Node = null

    @property(cc.Node)
    selectIcon: cc.Node = null

    @property(cc.Label)
    nameLab: cc.Label = null

    @property(cc.Node)
    typeIcon: cc.Node = null

    @property(cc.RichText)
    descLab: cc.RichText = null

    @property(cc.Node)
    suitIcon: cc.Node = null

    _info: icmsg.AdventureEntry = null

    updateView() {
        this._info = this.data.info
        this.selectIcon.active = this.data.isSelect
        let entryCfg = ConfigManager.getItemByField(Adventure_entryCfg, "group", this._info.group, { hardcore_id: this._info.id })
        if (!entryCfg) {
            entryCfg = ConfigManager.getItemByField(Adventure_entryCfg, "hardcore_id", this._info.id)
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
}