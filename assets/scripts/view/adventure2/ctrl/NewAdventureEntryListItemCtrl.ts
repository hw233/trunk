import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import NewAdventureModel from '../model/NewAdventureModel';
import StringUtils from '../../../common/utils/StringUtils';
import UiListItem from '../../../common/widgets/UiListItem';
import { Adventure2_endless_entryCfg, Copy_hardcoreCfg } from '../../../a/config';
/**
 * @Description: 雇佣英雄子项
 * @Author: luoyong
 * @Date: 2019-04-18 13:44:33
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-05-21 11:28:36
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/adventure2/NewAdventureEntryListItemCtrl")
export default class NewAdventureEntryListItemCtrl extends UiListItem {

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

    @property(cc.Node)
    ydhIcon: cc.Node = null
    @property(cc.Label)
    numLab: cc.Label = null
    @property(cc.Node)
    lockNode: cc.Node = null
    @property(cc.Label)
    lockLab: cc.Label = null

    _info: number = 0
    entryCfg: Adventure2_endless_entryCfg
    curSelect: boolean = false;
    isYdh: boolean = false;
    isLock: boolean = false;
    get adventureModel(): NewAdventureModel { return ModelManager.get(NewAdventureModel); }
    strs: string[] = ['普通', '困难', '地狱']
    updateView() {
        //this._info = this.data.info
        this.entryCfg = this.data.cfg
        this.curSelect = this.adventureModel.selectEntyrIds.indexOf(this.entryCfg.hardcore_id) >= 0//this.data.select;
        this.isLock = this.data.lock
        this.selectIcon.active = this.curSelect//this.data.isSelect
        this.lockNode.active = this.isLock;
        if (this.isLock) {
            this.lockLab.string = `通关${this.strs[this.entryCfg.difficulty - 1]}难度解锁`
        }
        // let entryCfg: any = ConfigManager.getItemByField(Adventure2_entryCfg, "hardcore_id", this._info)
        // if (this.adventureModel.copyType == 1) {
        //     entryCfg = ConfigManager.getItemByField(Adventure2_endless_entryCfg, "hardcore_id", this._info)
        // }


        if (this.adventureModel.endless_entryList.indexOf(this.entryCfg.hardcore_id) >= 0) {
            this.ydhIcon.active = true;
            this.isYdh = true
        } else {
            this.ydhIcon.active = false;
            this.isYdh = false;
        }

        this.numLab.string = this.entryCfg.cost + ''
        this.nameLab.string = `${this.entryCfg.name}`
        let hardCoreCfg = ConfigManager.getItemById(Copy_hardcoreCfg, this.entryCfg.hardcore_id)
        this.descLab.string = ''
        this.descLab.string = StringUtils.setRichtOutLine(hardCoreCfg.dec, GlobalUtil.getHeroNameColor(this.entryCfg.quality, true), 1)
        if (!this.isLock) {
            this.nameLab.node.color = cc.color(GlobalUtil.getHeroNameColor(this.entryCfg.quality))
            let line = this.nameLab.node.getComponent(cc.LabelOutline)
            line.color = cc.color(GlobalUtil.getHeroNameColor(this.entryCfg.quality, true))
            line.enabled = true
            this.descLab.node.color = cc.color(GlobalUtil.getHeroNameColor(this.entryCfg.quality))
        } else {
            //this.nameLab.node.color = cc.Color.GRAY
            this.nameLab.node.getComponent(cc.LabelOutline).enabled = false
            //this.descLab.node.color = cc.Color.GRAY
        }
        if (this.entryCfg.icon) {
            GlobalUtil.setSpriteIcon(this.node, this.typeIcon, `view/adventure/texture/bg/${this.entryCfg.icon}`)
        }
        GlobalUtil.setSpriteIcon(this.node, this.bg, `view/adventure/texture/bg/adv_entryBg_${this.entryCfg.quality}`)

        // 1 all  2 阵营id 3 职业id 4 英雄id
        let path = ``
        if (this.entryCfg.apply[0] == 1 || this.entryCfg.apply[0] == 2) {
            path = GlobalUtil.getGroupIcon(this.entryCfg.apply[1])
        } else if (this.entryCfg.apply[0] == 3) {
            path = GlobalUtil.getSoldierTypeIcon(this.entryCfg.apply[1])
        } else if (this.entryCfg.apply[0] == 4) {
            path = GlobalUtil.getHeadIconById(this.entryCfg.apply[1])
        }
        GlobalUtil.setSpriteIcon(this.node, this.suitIcon, path)

        GlobalUtil.setAllNodeGray(this.bg, this.isLock ? 1 : 0)
    }
}