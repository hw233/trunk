import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import NetManager from '../../../../common/managers/NetManager';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';
import { UniqueCfg } from '../../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-10-18 10:42:01 
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-10-19 14:39:50
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('qszc/view/lottery/gene/UniqueWishListViewCtrl')
export default class UniqueWishListViewCtrl extends gdk.BasePanel {
    @property([cc.Node])
    slotNodes: cc.Node[] = [];

    @property(cc.Node)
    selectNode: cc.Node = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    list: ListView;
    wishIds: number[] = [];
    selectNodeState: number = 0;  //0-隐藏 1-显示
    onEnable() {
        this.selectNodeState = 0;
        // this.selectNode.setPosition(0, -1055);
        this.selectNode.setPosition(0, -cc.view.getVisibleSize().height / 2 - 415);
        NetManager.send(new icmsg.UniqueEquipWishInfoReq(), (resp: icmsg.UniqueEquipWishInfoRsp) => {
            if (!cc.isValid(this.node)) return;
            if (!this.node.activeInHierarchy) return;
            this.wishIds = resp.id;
            this._updateSlots();
            this._updateListLater();
        }, this);
    }

    onDisable() {
        if (this.list) {
            this.list.destroy();
            this.list = null;
        }
    }

    onSlotClick(e, data) {
        let idx = parseInt(data);
        if (this.selectNodeState == 0) {
            this._showSelectNode();
            return;
        }
        let id = this.wishIds[idx];
        if (id > 0) {
            this._reqItem(idx, 0);
        }
    }

    close() {
        if (this.wishIds.length !== 6 || this.wishIds.indexOf(0) !== -1) {
            GlobalUtil.openAskPanel({
                descText: '心愿单尚未填满,装备召唤时不会享有概率加成效果,是否退出?',
                sureCb: () => { super.close(); }
            })
            return;
        }
        super.close();
    }

    _showSelectNode() {
        if (this.selectNodeState == 1) return;
        this.selectNode.stopAllActions();
        this.selectNode.setPosition(0, -cc.view.getVisibleSize().height / 2 - 415);
        this.selectNodeState = 1;
        this.selectNode.runAction(cc.moveTo(.3, cc.v2(0, -cc.view.getVisibleSize().height / 2)));
    }

    _updateSlots() {
        this.slotNodes.forEach((n, idx) => {
            let id = this.wishIds[idx] || 0;
            let slot = n.getChildByName('UiSlotItem').getComponent(UiSlotItem);
            let heroIcon = n.getChildByName('usedNode');
            slot.node.active = id > 0;
            heroIcon.active = false;
            if (id > 0) {
                slot.updateItemInfo(id);
                let cfg = ConfigManager.getItemById(UniqueCfg, id);
                if (cfg.hero_id > 0) {
                    heroIcon.active = true;
                    GlobalUtil.setSpriteIcon(this.node, cc.find('New Node/heroIcon', heroIcon), GlobalUtil.getIconById(cfg.hero_id));
                }
            }
        });
    }

    _initList() {
        if (!this.list) {
            this.list = new ListView({
                scrollview: this.scrollView,
                mask: this.scrollView.node,
                content: this.content,
                item_tpl: this.itemPrefab,
                cb_host: this,
                column: 5,
                gap_x: 20,
                gap_y: 2,
                async: true,
                direction: ListViewDir.Vertical,
            })
            this.list.onClick.on(this._selectItem, this);
        }
    }

    _updateListLater() {
        gdk.Timer.callLater(this, this._updateList);
    }

    _updateList() {
        this._initList();
        this.list['wishIds'] = this.wishIds;
        let cfgs = ConfigManager.getItems(UniqueCfg, (cfg: UniqueCfg) => {
            if (cfg.color == 5 && cfg.wish == 1) {
                return true;
            }
        });
        this.list.clear_items();
        this.list.set_data(cfgs);
    }

    _selectItem(data) {
        let cfg: UniqueCfg = data;
        let idx = this.wishIds.indexOf(cfg.id);
        if (idx == -1) {
            //选择
            if (this.wishIds.length == 6 && this.wishIds.indexOf(0) == -1) {
                gdk.gui.showMessage('心愿单已满');
            } else {
                this._reqItem(this.wishIds.indexOf(0), cfg.id);
            }
        } else {
            //卸下
            this._reqItem(idx, 0);
        }
    }

    _reqItem(idx: number, id: number = 0) {
        this.wishIds[idx] = id;
        let req = new icmsg.UniqueEquipWishSetReq();
        req.id = this.wishIds;
        NetManager.send(req, (resp: icmsg.UniqueEquipWishSetRsp) => {
            if (!cc.isValid(this.node)) return;
            if (!this.node.activeInHierarchy) return;
            this.wishIds = resp.id;
            this._updateSlots();
            if (this.list) {
                this.list['wishIds'] = this.wishIds;
                this.list.refresh_items();
            } else {
                this._updateListLater();
            }
        }, this);
    }
}
