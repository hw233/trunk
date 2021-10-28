import FootHoldModel from './FootHoldModel';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import GuildModel from '../../model/GuildModel';
import GuildUtils from '../../utils/GuildUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import RoleModel from '../../../../common/models/RoleModel';
import UiListItem from '../../../../common/widgets/UiListItem';
import { Foothold_baseCfg } from '../../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-04-14 10:41:25 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/footHold/FHBaseUpgradePreviewItemCtrl")
export default class FHBaseUpgradePreviewItemCtrl extends UiListItem {
    @property(cc.Label)
    lvLab: cc.Label = null;

    @property(cc.Node)
    iconNode: cc.Node = null;

    @property(cc.Node)
    curFlag: cc.Node = null;

    @property(cc.Node)
    curLvDescContent: cc.Node = null;

    @property(cc.Node)
    curLvDescItem: cc.Node = null;

    get footHoldModel(): FootHoldModel { return ModelManager.get(FootHoldModel); }
    get roleModel(): RoleModel { return ModelManager.get(RoleModel); }
    get guildModel(): GuildModel { return ModelManager.get(GuildModel); }

    cfg: Foothold_baseCfg;
    updateView() {
        this.cfg = this.data;
        this.lvLab.string = `${this.cfg.level}${gdk.i18n.t('i18n:GENERAL_WEAPON_TIP6')}`;
        GlobalUtil.setSpriteIcon(this.node, this.iconNode.getChildByName('icon'), GuildUtils.getIcon(this.guildModel.guildDetail.info.icon))
        GlobalUtil.setSpriteIcon(this.node, this.iconNode.getChildByName('frame'), GuildUtils.getIcon(this.guildModel.guildDetail.info.frame))
        GlobalUtil.setSpriteIcon(this.node, this.iconNode.getChildByName('bottom'), GuildUtils.getIcon(this.guildModel.guildDetail.info.bottom))
        let idx = 0;
        for (let i = 0; i < this.footHoldModel.fhGuilds.length; i++) {
            if (this.footHoldModel.fhGuilds[i].id == this.roleModel.guildId) {
                idx = i;
                break;
            }
        }
        GlobalUtil.setSpriteIcon(this.node, this.iconNode.getChildByName('iconBg'), `view/guild/texture/icon/${this.cfg['skin' + `${idx == 0 ? '' : `${idx}`}`]}`);
        this.curFlag.active = this.footHoldModel.baseLevel == this.cfg.level;
        this._updateDescContent();
    }

    _updateDescContent() {
        this.curLvDescContent.removeAllChildren()
        let cfg_desc = this.cfg.desc
        let datas = cfg_desc.split("<br/>")

        for (let i = 0; i < datas.length; i++) {
            let item = cc.instantiate(this.curLvDescItem)
            item.active = true
            let richLab = cc.find("label", item).getComponent(cc.RichText)
            richLab.string = `<color=#fab624><outline color=#2e1b06 width=2>${datas[i]}</outline></c>`
            this.curLvDescContent.addChild(item)
        }
    }
}
