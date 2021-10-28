import ConfigManager from '../../../../common/managers/ConfigManager';
import FootHoldModel from '../footHold/FootHoldModel';
import FootHoldUtils from '../footHold/FootHoldUtils';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import MilitaryRankUtils from './MilitaryRankUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import UiListItem from '../../../../common/widgets/UiListItem';
import { Foothold_titleCfg } from '../../../../a/config';

/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-02-05 16:50:24
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/militaryRank/MilitaryRankPreItemCtrl")
export default class MilitaryRankPreItemCtrl extends UiListItem {

    @property(cc.Node)
    icon: cc.Node = null

    @property(cc.Label)
    MRNameLab: cc.Label = null

    @property(cc.Node)
    descContent: cc.Node = null

    @property(cc.Node)
    descItem: cc.Node = null

    @property(cc.Node)
    curState: cc.Node = null

    _cfg: Foothold_titleCfg

    updateView() {
        this._cfg = this.data
        this.MRNameLab.string = `${this._cfg.name}`
        GlobalUtil.setSpriteIcon(this.node, this.icon, MilitaryRankUtils.getIcon(this._cfg.level))
        this.curState.active = this._cfg.level == ModelManager.get(FootHoldModel).militaryRankLv
        this._updateDescContent()
    }

    _updateDescContent() {
        this.descContent.removeAllChildren()
        let cfg_desc = this._cfg.desc
        let datas = cfg_desc.split("<br>")

        for (let i = 0; i < datas.length; i++) {
            let item = cc.instantiate(this.descItem)
            item.active = true
            let richLab = cc.find("label", item).getComponent(cc.RichText)
            richLab.string = `${datas[i]}`
            this.descContent.addChild(item)
        }
    }
}