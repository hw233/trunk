import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import GuardianModel from '../../model/GuardianModel';
import GuardianUtils from './GuardianUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import StringUtils from '../../../../common/utils/StringUtils';
import { BagItem } from '../../../../common/models/BagModel';
import { Guardian_lvCfg, Guardian_starCfg, GuardianCfg } from '../../../../a/config';
import { GuardianItemInfo } from './GuardianListCtrl';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';

/**
 * @Description: 守护者分解
 * @Author: luoyong
 * @Date: 2019-03-28 14:49:36
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-04-23 16:50:26
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/guardian/GuardianDecomposePanelCtrl")
export default class GuardianDecomposePanelCtrl extends gdk.BasePanel {
    @property(cc.ScrollView)
    preScrollView: cc.ScrollView = null;

    @property(cc.Node)
    preContent: cc.Node = null

    @property(cc.Prefab)
    rewardItem: cc.Prefab = null

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    decomposeItem: cc.Prefab = null

    @property(cc.Node)
    onNode: cc.Node = null

    @property(cc.Node)
    offNode: cc.Node = null

    @property(cc.Label)
    putNumLab: cc.Label = null

    @property(cc.Label)
    maxNumLab: cc.Label = null

    preList: ListView = null
    list: ListView = null

    _maxNum = 15
    _selectIds: number[] = []
    _datas: { [id: number]: GuardianItemInfo } = {}; // id-GuardianItemInfo
    get model() { return ModelManager.get(GuardianModel) }

    onEnable() {
        this._updateScroll();
    }

    onDisable() {
        gdk.e.targetOff(this)
        gdk.Timer.clearAll(this)
        NetManager.targetOff(this)
    }

    _resetPreviewRsp(selectIds: number[]) {
        this._initPreListView()
        this._updatePreState()
        let datas: any = {};
        let equips: any = [];
        selectIds.forEach(id => {
            let guardianInfo = this._datas[id].bagItem.extInfo as icmsg.Guardian
            let lv = guardianInfo.level
            let disintItem = []
            let cfg = ConfigManager.getItemById(GuardianCfg, this._datas[id].bagItem.itemId)
            disintItem.push(cfg.disint_item[0])
            for (let i = 1; i <= lv; i++) {
                let costCfg = ConfigManager.getItemById(Guardian_lvCfg, i)
                if (costCfg && costCfg[`cost_color${cfg.color}`]) {
                    disintItem.push(costCfg[`cost_color${cfg.color}`][0])
                    disintItem.push(costCfg[`cost_color${cfg.color}`][1])
                }
            }

            let star = (this._datas[id].bagItem.extInfo as icmsg.Guardian).star
            for (let i = 1; i <= star; i++) {
                let starCfg = ConfigManager.getItemByField(Guardian_starCfg, "guardian_id", cfg.id, { star: i })
                if (starCfg.cost_star && starCfg.cost_star.length > 0) {
                    let itemId = starCfg.cost_star[0][0]
                    let num = starCfg.cost_star[0][1]
                    let d_cfg = ConfigManager.getItemById(GuardianCfg, itemId)
                    for (let j = 0; j < num; j++) {
                        disintItem.push(d_cfg.disint_item[0])
                    }
                    disintItem.push(starCfg.cost_star[1])
                }
            }

            disintItem.forEach(item => {
                if (!datas[item[0]]) {
                    datas[item[0]] = 0;
                }
                datas[item[0]] += item[1];
            });

            //添加装备信息
            if (guardianInfo.equips.length > 0) {
                guardianInfo.equips.forEach(equip => {
                    if (equip.id > 0) {
                        let temEquip = {
                            typeId: equip.type,
                            num: 1,
                            extInfo: equip
                        }
                        equips.push(temEquip);
                    }
                })
            }

        });

        let datas2 = [];
        for (let key in datas) {
            let goodsInfo = {
                typeId: parseInt(key),
                num: datas[key]
            }
            // goodsInfo.typeId = parseInt(key);
            // goodsInfo.num = datas[key];
            datas2.push(goodsInfo)
        }
        datas2 = datas2.concat(equips);
        this.preList.set_data(GlobalUtil.sortGoodsInfo(datas2))
        gdk.Timer.once(100, this, () => {
            this.preList.resize_content()
        })
        this._updateNum()
    }

    _initPreListView() {
        if (this.preList) {
            return
        }
        this.preList = new ListView({
            scrollview: this.preScrollView,
            mask: this.preScrollView.node,
            content: this.preContent,
            item_tpl: this.rewardItem,
            cb_host: this,
            column: 5,
            gap_x: 15,
            gap_y: 15,
            async: true,
            direction: ListViewDir.Vertical,
        })
    }

    _initListView() {
        if (this.list) {
            return
        }
        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.decomposeItem,
            cb_host: this,
            column: 5,
            gap_x: 15,
            gap_y: 15,
            async: true,
            direction: ListViewDir.Vertical,
        })
        this.list.onClick.on(this._onItemClick, this)
    }

    _onItemClick(item: GuardianItemInfo) {

        let heroInfo = GuardianUtils.getGuardianHeroInfo(item.bagItem.series)
        if (heroInfo && heroInfo.heroId > 0) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:GUARDIAN_TIP5"))
            return
        }

        let idIndex = this._selectIds.indexOf(item.bagItem.series)
        if (idIndex == -1) {
            if (this._selectIds.length >= this._maxNum) {
                gdk.gui.showMessage(StringUtils.format(gdk.i18n.t("i18n:GUARDIAN_TIP1"), this._maxNum));
                return;
            }
            this._selectIds.push(item.bagItem.series)
        } else {
            this._selectIds.splice(idIndex, 1)
        }

        let datas: GuardianItemInfo[] = this.list.datas
        for (let i = 0; i < datas.length; i++) {
            if (this._selectIds.indexOf(datas[i].bagItem.series) == -1) {
                datas[i].selected = false
            } else {
                datas[i].selected = true
            }

        }
        this.list.refresh_items()

        if (this._selectIds.length > 0) {
            //preview
            this._resetPreviewRsp(this._selectIds);
        } else {
            this.onNode.active = false
            this.offNode.active = true
            this._updateNum()
        }
    }

    _updateDataLater() {
        gdk.Timer.callLater(this, this._updateScroll)
    }

    _updateScroll() {
        this._initListView()
        this.list.clear_items()
        this._updatePreState()
        let items = ModelManager.get(GuardianModel).guardianItems;
        let tempList: GuardianItemInfo[] = [];
        this._datas = {};
        items.sort((a: BagItem, b: BagItem) => {
            let cfgA = ConfigManager.getItemById(GuardianCfg, a.itemId);
            let cfgB = ConfigManager.getItemById(GuardianCfg, b.itemId);
            if (cfgA.color == cfgB.color) {
                return (b.extInfo as icmsg.Guardian).level - (a.extInfo as icmsg.Guardian).level
            }
            else {
                return cfgA.color - cfgB.color;
            }
        })
        items.forEach(item => {
            let obj: GuardianItemInfo = {
                bagItem: item,
                selected: false,
            };
            tempList.push(obj)
            this._datas[obj.bagItem.series] = obj;
        });
        this.list.set_data(tempList)
        this._updateNum()
    }

    _updatePreState() {
        if (this._selectIds.length > 0) {
            this.onNode.active = true
            this.offNode.active = false
        } else {
            this.onNode.active = false
            this.offNode.active = true
        }
    }

    _updateNum() {
        this.putNumLab.string = `(${this._selectIds.length}`
        this.maxNumLab.string = `/${this._maxNum})`
    }

    openTipFunc() {
        gdk.panel.setArgs(PanelId.HelpTipsPanel, 35);
        gdk.panel.open(PanelId.HelpTipsPanel);
    }


    decomposeFunc() {
        if (this._selectIds.length == 0) {
            GlobalUtil.showMessageAndSound(gdk.i18n.t("i18n:GUARDIAN_TIP2"))
            return
        }

        let isTip = false
        for (let i = 0; i < this._selectIds.length; i++) {
            let cfg = ConfigManager.getItemById(GuardianCfg, this._datas[this._selectIds[i]].bagItem.itemId);
            if (cfg.color >= 3) {
                isTip = true
                break
            }
        }

        if (isTip) {
            GlobalUtil.openAskPanel({
                title: gdk.i18n.t("i18n:TIP_TITLE"),
                descText: gdk.i18n.t("i18n:GUARDIAN_TIP4"),
                sureText: gdk.i18n.t("i18n:OK"),
                closeText: gdk.i18n.t("i18n:CANCEL"),
                sureCb: () => {
                    this.doDecompose()
                }
            })
        } else {
            this.doDecompose()
        }
    }

    doDecompose() {
        let msg = new icmsg.GuardianDecomposeReq()
        msg.ids = this._selectIds;
        NetManager.send(msg, (data: icmsg.GuardianDecomposeRsp) => {
            if (!cc.isValid(this.node)) return;
            if (!this.node.activeInHierarchy) return;
            this._selectIds.forEach(id => {
                GuardianUtils.removeGuardianById(id, false)
            })
            this._selectIds = []
            this._updateScroll()
            GlobalUtil.openRewadrView(data.list)
        }, this);
    }

    quickPutFunc() {
        for (let i = 0; i < this.list.datas.length; i++) {
            if (this._selectIds.length >= this._maxNum) {
                break
            }
            let item = this.list.datas[i].bagItem as BagItem
            let cfg = ConfigManager.getItemById(GuardianCfg, item.itemId);
            let heroInfo = GuardianUtils.getGuardianHeroInfo(item.series)
            if (this._selectIds.indexOf(item.series) == -1 && cfg.color <= 2 && !heroInfo) {
                this._selectIds.push(item.series)
                this.list.datas[i].selected = true
            }
        }
        if (this._selectIds.length == 0) {
            GlobalUtil.showMessageAndSound(gdk.i18n.t("i18n:GUARDIAN_TIP3"))
            return
        }

        this.list.refresh_items()

        if (this._selectIds.length < this._maxNum) {
            GlobalUtil.showMessageAndSound(gdk.i18n.t("i18n:GUARDIAN_TIP3"))
        }

        this._resetPreviewRsp(this._selectIds);
    }
}
