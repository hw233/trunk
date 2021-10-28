import ConfigManager from '../../../../common/managers/ConfigManager';
import { ActivityEventId } from '../../enum/ActivityEventId';
import { Costume_compositeCfg, CostumeCfg } from '../../../../a/config';
import { CostumeCustomSelectInfo } from './CostumeCustomViewCtrl';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-07-21 15:19:37 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/costumeCustom/CostumeCustomSelectViewCtrl")
export default class CostumeCustomSelectViewCtrl extends gdk.BasePanel {
    @property(cc.Label)
    titleLab: cc.Label = null;

    @property(cc.Label)
    desc: cc.Label = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    selectType: number
    selectInfo: CostumeCustomSelectInfo;
    list: ListView;
    curSelect: number = -1; //根据selectType 决定数据
    onEnable() {
        let args = this.args[0];
        this.selectType = args[0];
        this.selectInfo = args[1];
        this._updateTitle();
        this._updateListLater();
    }

    onDisable() {
        if (this.list) {
            this.list.destroy();
            this.list = null;
        }
    }

    onConfirmBtnClick() {
        if (this.curSelect == -1) {
            this.close();
            return;
        }
        switch (this.selectType) {
            case 0:
                this.selectInfo.type = this.curSelect;
                this.selectInfo.part = -1;
                this.selectInfo.random_attr = [0, 0];
                break;
            case 1:
                this.selectInfo.part = this.curSelect;
                this.selectInfo.random_attr = [0, 0];
                break;
            case 2:
                this.selectInfo.random_attr[0] = this.curSelect;
                break;
            case 3:
                this.selectInfo.random_attr[1] = this.curSelect;
                break;
            default:
                break;
        }
        gdk.e.emit(ActivityEventId.COSTUME_CUSTOM_SELECT_INFO_CHANGE);
        this.close();
    }

    _updateTitle() {
        switch (this.selectType) {
            case 0:
                this.titleLab.string = `神装类型选择`;
                this.desc.string = `请选择要打造的神装类型`;
                break;
            case 1:
                this.titleLab.string = `神装部位选择`;
                this.desc.string = `请选择要打造的神装部位`;
                break;
            case 2:
            case 3:
                this.titleLab.string = `随机属性选择`;
                this.desc.string = `请选择要打造的随机属性`;
                break;
            default:
                break;
        }
    }

    _initList() {
        if (!this.list) {
            this.list = new ListView({
                scrollview: this.scrollView,
                mask: this.scrollView.node,
                content: this.content,
                item_tpl: this.itemPrefab,
                cb_host: this,
                gap_y: 5,
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
        let data = [];
        if (this.selectType == 0) {
            let compositeCfgs = ConfigManager.getItemsByField(Costume_compositeCfg, 'color', 4);
            let types = [];
            compositeCfgs.forEach(c => { if (types.indexOf(c.type) == -1) types.push(c.type); });
            types.forEach(t => {
                let obj = {
                    selectType: this.selectType,
                    selectInfo: this.selectInfo,
                    suitType: t,
                    color: 4,
                    part: -1,
                    randomAttr: -1,
                };
                data.push(obj);
            })
            this.list['curSelect'] = this.selectInfo.type;
        } else if (this.selectType == 1) {
            let cfgs = ConfigManager.getItems(CostumeCfg, (cfg: CostumeCfg) => {
                if (cfg.type == this.selectInfo.type && cfg.custom == 1) {
                    return true;
                }
            });
            cfgs.forEach(c => {
                let obj = {
                    selectType: this.selectType,
                    selectInfo: this.selectInfo,
                    suitType: this.selectInfo.type,
                    color: 4,
                    part: c.part,
                    randomAttr: -1,
                };
                data.push(obj);
            })
            this.list['curSelect'] = this.selectInfo.part;
        } else {
            let cfg = ConfigManager.getItem(CostumeCfg, (cfg: CostumeCfg) => {
                if (cfg.type == this.selectInfo.type && cfg.part == this.selectInfo.part && cfg.custom == 1) {
                    return true;
                }
            })
            let anotherId = this.selectType == 2 ? this.selectInfo.random_attr[1] : this.selectInfo.random_attr[0];
            let ids = [...cfg.random_attr];
            let idx = ids.indexOf(anotherId);
            if (idx !== -1) {
                ids.splice(idx, 1);
            }
            ids.forEach(d => {
                let obj = {
                    selectType: this.selectType,
                    selectInfo: this.selectInfo,
                    suitType: this.selectInfo.type,
                    color: 4,
                    part: this.selectInfo.part,
                    randomAttr: d,
                };
                data.push(obj);
            });
            this.list['curSelect'] = this.selectInfo.random_attr[this.selectType == 2 ? 0 : 1];
        }
        this.list.clear_items();
        this.list.set_data(data);
    }

    _selectItem(data: {
        selectType: number, //0-选择类型 1-选择部位 2-随机属性1 3-随机属性2
        selectInfo: number,
        suitType: number,  //用于type=0
        color: number,     //用于type=0     
        part: number,      //用于type=1
        randomAttr: number, //用于type=2,3
    }) {
        if (this.selectType == 0) {
            if (data.suitType == this.list['curSelect']) return;
            else {
                this.list['curSelect'] = data.suitType;
                this.curSelect = data.suitType;
                this.list.refresh_items();
            }
        } else if (this.selectType == 1) {
            if (data.part == this.list['curSelect']) return;
            else {
                this.list['curSelect'] = data.part;
                this.curSelect = data.part;
                this.list.refresh_items();
            }
        } else {
            if (data.randomAttr == this.list['curSelect']) return;
            else {
                this.list['curSelect'] = data.randomAttr;
                this.curSelect = data.randomAttr;
                this.list.refresh_items();
            }
        }
    }
}
