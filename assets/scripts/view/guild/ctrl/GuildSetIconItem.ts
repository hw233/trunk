import GlobalUtil from '../../../common/utils/GlobalUtil';
import GuildModel from '../model/GuildModel';
import GuildUtils from '../utils/GuildUtils';
import ModelManager from '../../../common/managers/ModelManager';
import PanelId from '../../../configs/ids/PanelId';
import UiListItem from '../../../common/widgets/UiListItem';
import { Guild_iconCfg } from '../../../a/config';
import { GuildIconType } from './GuildSetIcon';
/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-12-22 12:10:24
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/GuildSetIconItem")
export default class GuildSetIconItem extends UiListItem {

    @property(cc.Node)
    icon: cc.Node = null;

    @property(cc.Node)
    selectNode: cc.Node = null;

    guildIconType: GuildIconType

    onLoad() {

    }

    updateView() {
        this.guildIconType = this.data
        GlobalUtil.setSpriteIcon(this.node, this.icon, GuildUtils.getIcon(this.guildIconType.cfg.id))
        this.selectNode.active = this.guildIconType.isSelect
    }
}