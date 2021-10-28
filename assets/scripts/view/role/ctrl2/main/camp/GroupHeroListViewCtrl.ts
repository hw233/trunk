import ConfigManager from '../../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import PanelId from '../../../../../configs/ids/PanelId';
import { GroupCfg, HeroCfg } from '../../../../../a/config';
import { ListView, ListViewDir } from '../../../../../common/widgets/UiListview';

/** 
 * @Description: 阵营-英雄列表View
 * @Author: yaozu.hu  
 * @Date: 2019-09-16 10:19:03 
 * @Last Modified by: jiangping
 * @Last Modified time: 2020-08-21 17:21:45
 */
const { ccclass, property, menu } = cc._decorator;

export interface GroupHeroItemData {
    cfg: HeroCfg,
    curGroupId: number,
    curHeroId: number
}

@ccclass
@menu("qszc/view/role/GroupHerListViewCtrl")
export default class GroupHerListViewCtrl extends gdk.BasePanel {

    @property(cc.Sprite)
    groupIcon: cc.Sprite = null;
    @property(cc.Sprite)
    groupName: cc.Sprite = null;
    @property(cc.Label)
    gruopDec: cc.Label = null;
    @property(cc.Node)
    content: cc.Node = null;
    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Prefab)
    gruopHeroItem: cc.Prefab = null;

    list: ListView = null
    GroupId: number = 0;
    curHeroId: number = 0;
    start() {
        let temData = gdk.panel.getArgs(PanelId.GroupHeroList)
        this.GroupId = temData[0]
        this.curHeroId = temData[1]
        let cfg = ConfigManager.getItemById(GroupCfg, this.GroupId)
        if (cfg) {
            //更新Icon
            GlobalUtil.setSpriteIcon(
                this.node,
                this.groupIcon,
                `view/role/texture/up/${cfg.icon}_icon`
            );
            //更新名称
            GlobalUtil.setSpriteIcon(
                this.node,
                this.groupName,
                `view/role/texture/up/${cfg.icon}_name`
            );
            //更新描述
            this.gruopDec.string = cfg.desc
        }

        //刷新阵营英雄列表
        this._updateScroll();
    }

    _initListView() {

        if (this.list) {
            return
        }
        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.gruopHeroItem,
            cb_host: this,
            async: true,
            column: 4,
            gap_x: 20,
            gap_y: 10,
            direction: ListViewDir.Vertical,
        })
    }

    _updateScroll() {
        this._initListView()
        let list = []
        let tem: HeroCfg[] = ConfigManager.getItems(HeroCfg, (hero: HeroCfg) => {
            if (hero.group.indexOf(this.GroupId) > -1 && hero.show == 1) {
                return true;
            }
            return false;
        })
        //英雄排序按照品质从高到低排序，同品质按照ID排序
        tem.sort((a, b) => {
            if (a.defaultColor == b.defaultColor) {
                return a.id - b.id
            } else {
                return b.defaultColor - a.defaultColor
            }
        })
        if (tem.length > 0) {
            for (let i = 0; i < tem.length; i++) {
                let temdata = tem[i];
                let data: GroupHeroItemData = {
                    cfg: temdata,
                    curGroupId: this.GroupId,
                    curHeroId: this.curHeroId
                }
                list.push(data);
            }
        }
        this.list.set_data(list)
    }
}
