import ConfigManager from '../../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import PanelId from '../../../../../configs/ids/PanelId';
import { GroupCfg } from '../../../../../a/config';

/** 
 * @Description: 阵营-阵营图标Item
 * @Author: yaozu.hu  
 * @Date: 2019-09-16 10:19:03 
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-12-25 10:41:59
 */

const { ccclass, property, menu } = cc._decorator;
@ccclass
@menu("qszc/view/role2/main/common/GroupItemCtrl2")
export default class GroupItemCtrl2 extends cc.Component {

    @property(cc.Sprite)
    icon: cc.Sprite = null;

    groupId: number = 0;
    cfg: GroupCfg;
    curHeroId: number = 0;
    setGruopDate(id: number, curHeroId: number) {
        this.groupId = id
        this.curHeroId = curHeroId;
        this.cfg = ConfigManager.getItemById(GroupCfg, id)
        if (this.cfg) {
            let path = 'view/role/texture/up/' + this.cfg.icon + '_icon';
            GlobalUtil.setSpriteIcon(this.node, this.icon, path)
        }

    }

    GroupClick() {
        gdk.panel.setArgs(PanelId.GroupHeroList, this.groupId, this.curHeroId)
        gdk.panel.open(PanelId.GroupHeroList)
    }
}
