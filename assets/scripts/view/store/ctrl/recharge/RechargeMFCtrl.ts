import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import JumpUtils from '../../../../common/utils/JumpUtils';
import NetManager from '../../../../common/managers/NetManager';
import { ItemCfg, StoreCfg, TipsCfg } from '../../../../a/config';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';
/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-10-29 10:51:48 
  */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/store/recharge/RechargeMFCtrl")
export default class RechargeMFCtrl extends gdk.BasePanel {
    @property(cc.Node)
    costNode: cc.Node = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    @property(cc.Node)
    btns: cc.Node = null;

    @property(cc.Label)
    desc: cc.Label = null;

    @property(cc.Button)
    careerBtns: cc.Button[] = []

    @property(cc.Button)
    groupBtns: cc.Button[] = []

    @property(cc.Node)
    contentCareer: cc.Node = null

    @property(cc.Node)
    btnUp: cc.Node = null



    /**货币类型 2钻石 3 金币 4优精钢 5 良精钢 6 竞技点 7友谊点 8皮肤券 9公会积分 */
    storeTitleConfig = [
        { type: 1, title: gdk.i18n.t('i18n:RECHARGE_TIP5'), costType: [2, 110011], isShow: true, sysId: 2845 },
        { type: 2, title: gdk.i18n.t('i18n:RECHARGE_TIP6'), costType: [2, 110011], isShow: true, sysId: 2846 },
    ]

    selectGroup: number = 0     // 筛选阵营
    selectCareer: number = 0    //筛选职业
    isShowCareer: boolean = false
    // curSelect: number;
    list: ListView;
    onEnable() {
        let select;
        let arg = this.args[0];
        if (arg) {
            select = arg;
        }
        if (!select && select != 0) {
            select = 0;
        }
        this.desc.string = ConfigManager.getItemById(TipsCfg, 55).desc21;
        this._initBtn();
        this.onBtnSelect(null, select);
        this._updateList();
        this._updateCost();
        NetManager.on(icmsg.RoleUpdateRsp.MsgType, this._updateCost, this);
        NetManager.on(icmsg.ItemUpdateRsp.MsgType, this._updateCost, this);
    }

    onDisable() {
        NetManager.targetOff(this);
        if (this.list) {
            this.list.destroy();
            this.list = null;
        }
    }

    onCostAddClick() {
        GlobalUtil.openGainWayTips(110011);
    }

    onBtnSelect(e, data) {
        // let idx = parseInt(data);
        // if (idx == 1) {
        //     //神装
        //     gdk.gui.showMessage(gdk.i18n.t('i18n:RECHARGE_TIP7'));
        //     this.onBtnSelect(null, 0);
        //     return;
        // }
        // if (!JumpUtils.ifSysOpen(this.storeTitleConfig[idx].sysId, true)) {
        //     return;
        // }
        // if (this.curSelect !== idx) {
        //     this.curSelect = idx;
        //     let btns = this.btns.children;
        //     for (let i = 0; i < btns.length; i++) {
        //         const element = btns[i].getComponent(cc.Button);
        //         // element.interactable = i != idx
        //         let select = element.node.getChildByName("select");
        //         select.active = idx == i
        //         let common = element.node.getChildByName("common");
        //         common.active = idx != i
        //     }
        //     this._updateList();
        // }
    }

    showCareerContent() {
        this.isShowCareer = true
        this.updateContentState()
    }

    hideCareerContent() {
        this.isShowCareer = false
        this.updateContentState()
    }

    updateContentState() {
        if (this.isShowCareer) {
            this.contentCareer.active = true
            this.btnUp.active = false
        } else {
            this.contentCareer.active = false
            this.btnUp.active = true
        }
    }

    /**选择页签, 筛选职业*/
    selectCareerFunc(e, utype) {
        this.selectCareer = parseInt(utype)
        for (let idx = 0; idx < this.careerBtns.length; idx++) {
            const element = this.careerBtns[idx];
            element.interactable = idx != this.selectCareer
            let select = element.node.getChildByName("select")
            select.active = idx == this.selectCareer
        }
        this._updateList()
    }

    /**选择页签, 筛选阵营*/
    selectGroupFunc(e, utype) {
        this.selectGroup = parseInt(utype)
        for (let idx = 0; idx < this.groupBtns.length; idx++) {
            const element = this.groupBtns[idx];
            let nodeName = element.name
            let group = parseInt(nodeName.substring('group'.length));
            element.interactable = group != this.selectGroup
            let select = element.node.getChildByName("select")
            select.active = group == this.selectGroup
        }
        this._updateList()
    }

    _initBtn() {
        this.btns.children.forEach((btn, idx) => {
            let cfg = this.storeTitleConfig[idx];
            let selectLab = btn.getChildByName('select').getChildByName('label').getComponent(cc.Label);
            let normalLab = btn.getChildByName('common').getChildByName('label').getComponent(cc.Label);
            btn.active = cfg.isShow;
            // btn.getComponent(cc.Button).interactable = JumpUtils.ifSysOpen(cfg.sysId);
            GlobalUtil.setAllNodeGray(btn, JumpUtils.ifSysOpen(cfg.sysId) ? 0 : 1);
            selectLab.string = normalLab.string = cfg.title;
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
                async: true,
                gap_y: 10,
                direction: ListViewDir.Vertical,
            })
        }
    }

    _updateList() {
        this._initList();
        let cfgs = ConfigManager.getItems(StoreCfg, (cfg: StoreCfg) => {
            if (cfg.type == 11 && cfg.subtypes == 1) {
                let itemCfg = ConfigManager.getItemById(ItemCfg, cfg.item_id);
                if (this.selectCareer == 0 || this.selectCareer == itemCfg.career) {
                    if (this.selectGroup == 0 || this.selectGroup == itemCfg.random_hero_chip[0]) {
                        return true;
                    }
                }
            }
        });
        cfgs.sort((a, b) => { return a.sorting - b.sorting; });
        let datas = [];
        for (let i = 0; i < cfgs.length; i += 3) {
            datas.push([cfgs.slice(i, i + 3)]);
        }
        this.list.clear_items();
        this.list.set_data(datas);
    }

    _updateCost() {
        let costIcon = this.costNode.getChildByName('main_itemmoney01');
        let num = this.costNode.getChildByName('number').getComponent(cc.Label);
        let cfg = ConfigManager.getItemsByField(StoreCfg, 'type', 11)[0];
        GlobalUtil.setSpriteIcon(this.node, costIcon, GlobalUtil.getIconById(cfg.money_cost[0]));
        num.string = BagUtils.getItemNumById(cfg.money_cost[0]) + '';
    }
}
