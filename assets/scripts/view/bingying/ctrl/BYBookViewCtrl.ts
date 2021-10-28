import BYModel from '../model/BYModel';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import RoleModel from '../../../common/models/RoleModel';
import SoldierModel from '../../../common/models/SoldierModel';
import SoldierUtils from '../../../common/utils/SoldierUtils';
import StringUtils from '../../../common/utils/StringUtils';
import { BarracksCfg, SoldierCfg } from '../../../a/config';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';


/**
 * 士兵面板
 * @Author: sthoo.huang
 * @Date: 2020-01-14 17:49:04
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-12-21 15:47:52
 */
const { ccclass, property, menu } = cc._decorator;

const CfgWKeys = ["hp_w", "atk_w", "def_w"];
const AttGKeys = ["hpG", "atkG", "defG"];
const AttWKeys = ["hpW", "atkW", "defW"];
const AttAKeys = ["addSoldierHp", "addSoldierAtk", "addSoldierDef"];

interface SoldierItemType {
    solId: number,
    color: number,
    type: number,
    isSelect: boolean,
}

@ccclass
@menu("qszc/view/bingying/BYBookViewCtrl")
export default class BYBookViewCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(sp.Skeleton)
    spine: sp.Skeleton = null;

    @property(cc.Prefab)
    soliderItem: cc.Prefab = null;

    @property(cc.Node)
    attNode: cc.Node = null;

    @property(cc.Label)
    soldierName: cc.Label = null;

    @property(cc.Node)
    upTitle: cc.Node = null;

    @property(cc.Node)
    upTip: cc.Node = null;

    @property(cc.Label)
    unLockDesc: cc.Label = null;

    @property(cc.RichText)
    skillDescLabs: cc.RichText[] = [];

    attLab: Array<cc.Label> = [];

    list: ListView = null;
    curList: Array<any> = [];
    soldierCfg: SoldierCfg

    _curSelect = 0
    _selectSoldierId: number = 0
    _initIndex = 0
    _curIndex = 0

    _curType = 1
    activeIds = []//已激活的士兵id

    get soldierModel() { return ModelManager.get(SoldierModel); }
    get byModel() { return ModelManager.get(BYModel); }
    get roleModel() { return ModelManager.get(RoleModel); }

    _nameArr = [gdk.i18n.t("i18n:BINGYING_TIP1"), "", gdk.i18n.t("i18n:BINGYING_TIP3"), gdk.i18n.t("i18n:BINGYING_TIP4")]

    onLoad() {
        // 列表
        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.soliderItem,
            cb_host: this,
            async: true,
            column: 4,
            gap_x: -7,
            gap_y: -8,
            direction: ListViewDir.Vertical,
        });
        // 属性文本
        for (let index = 1; index <= 3; index++) {
            let attLab = this.attNode.getChildByName("attLab" + index).getComponent(cc.Label);
            this.attLab.push(attLab);
        }
    }

    onEnable() {
        let args = this.args
        this._curType = args[0]
        this._selectSoldierId = args[1]
        this.list.onClick.on(this._selectItem, this);
        this._updateListData();
    }

    onDisable() {
        this.list.onClick.targetOff(this);
        gdk.e.targetOff(this);
    }

    _updateListData() {
        let s_cfgs = ConfigManager.getItemsByField(SoldierCfg, "type", this._curType)
        let infoList: SoldierItemType[] = this.list.datas || [];
        let length = s_cfgs.length;
        let sIdx = 0;
        for (let i = 0; i < length; i++) {
            let data = infoList[i];
            if (data) {
                // 更新旧对象的数据
                data.solId = s_cfgs[i].id;
                data.color = s_cfgs[i].color
                data.type = s_cfgs[i].type
                data.isSelect = false;
            } else {
                // 创建新的对象
                infoList[i] = {
                    solId: s_cfgs[i].id,
                    color: s_cfgs[i].color,
                    type: s_cfgs[i].type,
                    isSelect: false,
                };
            }
        }
        if (infoList.length != length) {
            infoList.length = length;
        }
        GlobalUtil.sortArray(infoList, (a, b) => {
            return a.solId - b.solId;
        });
        let activeList = []
        let unActiveList1 = []
        //已激活符合当前职业的士兵id
        this.activeIds = []
        let b_lv = this.byModel.byLevelsData[this._curType - 1]
        let cfgs = ConfigManager.getItemsByField(BarracksCfg, "type", this._curType)
        for (let i = 0; i < cfgs.length; i++) {
            if (b_lv >= cfgs[i].barracks_lv && cfgs[i].soldier_id && cfgs[i].soldier_id > 0) {
                this.activeIds.push(cfgs[i].soldier_id)
            }
        }
        for (let i = 0; i < infoList.length; i++) {
            if (this.activeIds.indexOf(infoList[i].solId) != -1) {
                activeList.push(infoList[i])
            } else {
                if (infoList[i].type == this._curType) {
                    unActiveList1.push(infoList[i])
                }
            }
        }
        // GlobalUtil.sortArray(activeList, (a, b) => {
        //     if (a.color == b.color) {
        //         return a.solId - b.solId
        //     }
        //     return b.color - a.color
        // });

        this.curList = activeList.concat(unActiveList1)

        let showList = []
        for (let i = 0; i < this.curList.length; i++) {
            showList.push({ info: this.curList[i], isActive: true })
        }
        this.list.set_data(showList);

        //默认选择使用的
        for (let i = 0; i < showList.length; i++) {
            if (this._selectSoldierId == showList[i].info.solId) {
                sIdx = i
                break
            }
        }
        this.scheduleOnce(() => {
            this.list.select_item(sIdx)
            this.list.scroll_to(sIdx)
        });
    }

    _selectItem(data, index) {
        if (this._curSelect == index) {
            return;
        }
        this._curSelect = index
        this._selectSoldierId = data.info.solId

        //更新模型
        this.soldierCfg = ConfigManager.getItemById(SoldierCfg, this._selectSoldierId);
        GlobalUtil.setUiSoldierSpineData(this.node, this.spine, this.soldierCfg.skin, true);
        this.spine.node.scale = this.soldierCfg.size
        this.soldierName.string = `${this.soldierCfg.name}`
        // 更新技能
        this._updateSkillInfo();
        this._updateUpTip()
        this._updateViewInfo()
    }

    _updateViewInfo() {
        let playerLv = this.roleModel.level
        let cfg = ConfigManager.getItemById(SoldierCfg, this._selectSoldierId)
        let attList = [['hp_w', 'grow_hp'], ['atk_w', 'grow_atk'], ['def_w', 'grow_def'], ['hit_w', 'grow_hit'], ['dodge_w', 'grow_dodge']]
        for (let index = 0; index < 3; index++) {
            this.attLab[index].string = cfg[attList[index][0]] + Math.floor((playerLv - 1) * cfg[attList[index][1]] / 100);
        }
    }

    _updateSkillInfo() {
        for (let i = 0; i < 2; i++) {
            let skillInfo = SoldierUtils.getSkillInfo(this._selectSoldierId, i, 1);
            this.skillDescLabs[i].string = skillInfo.skillId > 0 ? StringUtils.setRichtOutLine(skillInfo.desc, "#432208", 2) : `${StringUtils.setRichtOutLine("无", "#432208", 2)}`;
        }
    }

    _updateUpTip() {
        let b_lv = this.byModel.byLevelsData[this.soldierCfg.type - 1]
        let bCfg = ConfigManager.getItemByField(BarracksCfg, "soldier_id", this.soldierCfg.id)
        if (bCfg) {
            if (b_lv >= bCfg.barracks_lv) {
                this.upTip.active = false
            } else {
                this.upTip.active = true
                this.unLockDesc.string = StringUtils.format(gdk.i18n.t("i18n:BINGYING_TIP5"), this._nameArr[this.soldierCfg.type - 1], bCfg.rounds + 1)//`兵营-${this._nameArr[this.soldierCfg.type - 1]}训练提升至${bCfg.rounds + 1}级解锁`
            }
        } else {
            this.upTip.active = true
            this.unLockDesc.string = gdk.i18n.t("i18n:BINGYING_TIP6")
        }
    }

}
