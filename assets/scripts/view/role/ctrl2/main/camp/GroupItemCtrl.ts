import { GroupCfg } from '../../../../../a/config';
import ConfigManager from '../../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import PanelId from '../../../../../configs/ids/PanelId';


/** 
 * @Description: 阵营-阵营图标Item
 * @Author: yaozu.hu  
 * @Date: 2019-09-16 10:19:03 
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-05-13 19:21:49
 */


const { ccclass, property, menu } = cc._decorator;
@ccclass
@menu("qszc/view/role/GroupItemCtrl")
export default class GroupItemCtrl extends cc.Component {

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
            let path = 'common/texture/role/select/' + this.cfg.icon
            GlobalUtil.setSpriteIcon(this.node, this.icon, path)
        }

    }

    GroupClick() {
        gdk.panel.setArgs(PanelId.GroupHeroList, this.groupId, this.curHeroId)
        gdk.panel.open(PanelId.GroupHeroList)
    }
}
