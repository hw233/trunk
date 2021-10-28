import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import PanelId from '../../../../configs/ids/PanelId';
import { GroupCfg } from '../../../../a/config';


/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-12-23 18:28:43
 */
const { ccclass, property, menu } = cc._decorator;
@ccclass
@menu("qszc/view/guild/footHold/FHGroupItemCtrl")
export default class FHGroupItemCtrl extends cc.Component {

    @property(cc.Sprite)
    icon: cc.Sprite = null;

    groupId: number = 0;
    cfg: GroupCfg;
    setGruopDate(id: number) {
        this.groupId = id
        this.cfg = ConfigManager.getItemById(GroupCfg, id)
        if (this.cfg) {
            let path = 'view/role/texture/up/' + this.cfg.icon + '_icon';
            GlobalUtil.setSpriteIcon(this.node, this.icon, path)
        }
    }

    GroupClick() {
        GlobalUtil.showMessageAndSound(gdk.i18n.t("i18n:FOOTHOLD_TIP13"))
        return
        // gdk.panel.setArgs(PanelId.FHGroupHeroListView, this.groupId)
        // gdk.panel.open(PanelId.FHGroupHeroListView)
    }
}
