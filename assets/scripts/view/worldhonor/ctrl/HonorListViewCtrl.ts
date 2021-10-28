import ModelManager from "../../../common/managers/ModelManager";
import RoleModel from "../../../common/models/RoleModel";
import GlobalUtil from "../../../common/utils/GlobalUtil";
import { ListView, ListViewDir } from "../../../common/widgets/UiListview";
import PanelId from "../../../configs/ids/PanelId";
import ActUtil from "../../act/util/ActUtil";

/**
 * enemy巅峰赛列表界面
 * @Author: yaozu.hu
 * @Date: 2019-10-28 10:48:51
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-06-22 13:52:20
 */
const { ccclass, property, menu } = cc._decorator;
function hasId(v: any): boolean {
    return v.id == this.id;
}
@ccclass
@menu("qszc/view/worldhonor/HonorListViewCtrl")
export default class HonorListViewCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;
    @property(cc.Node)
    content: cc.Node = null;
    @property(cc.Prefab)
    instanceItem: cc.Prefab = null;

    @property(cc.Node)
    maskNode: cc.Node = null;

    list: ListView;
    onEnable() {
        if (!this.list) {
            this.list = new ListView({
                scrollview: this.scrollView,
                mask: this.maskNode,
                content: this.content,
                item_tpl: this.instanceItem,
                cb_host: this,
                async: true,
                column: 1,
                gap_x: 0,
                gap_y: 30,
                direction: ListViewDir.Vertical,
            });

        }

        this._updateListData(true)
    }

    onDisable() {
        if (this.list) {
            this.list.destroy()
            this.list = null;
        }
        gdk.e.targetOff(this);
        gdk.Timer.clearAll(this);
    }

    _updateListData(resetPos: boolean = false) {
        let listData = [];
        let sysIds = [2921, 2919];
        sysIds.forEach(sysId => {
            if (sysId == 2921) {
                let roleModel = ModelManager.get(RoleModel);
                let time = roleModel.CrossOpenTime * 1000;
                let startTime = ActUtil.getActStartTime(112);
                let nowTime = GlobalUtil.getServerTime();

                if (!startTime) {
                    if (nowTime - time > (7 * 24 * 60 * 60 - 1) * 1000) {
                        if (ActUtil.checkActOpen(112)) {
                            let data = { system: sysId, lock: false };
                            listData.push(data);
                        } else {
                            let data = { system: sysId, lock: true };
                            listData.push(data);
                        }
                    } else {
                        let data = { system: sysId, lock: true };
                        listData.push(data);
                    }
                } else {
                    if (startTime - time > (7 * 24 * 60 * 60 - 1) * 1000) {
                        let data = { system: sysId, lock: false };
                        listData.push(data);
                    } else {
                        let data = { system: sysId, lock: true };
                        listData.push(data);
                    }
                }
            } else if (sysId == 2919) {
                let roleModel = ModelManager.get(RoleModel);
                let time = roleModel.CrossOpenTime * 1000;
                let startTime = ActUtil.getActStartTime(110);
                let nowTime = GlobalUtil.getServerTime();

                if (!startTime) {
                    if (nowTime - time > (7 * 24 * 60 * 60 - 1) * 1000) {
                        if (ActUtil.checkActOpen(110)) {
                            let data = { system: sysId, lock: false };
                            listData.push(data);
                        } else {
                            let data = { system: sysId, lock: true };
                            listData.push(data);
                        }
                    } else {
                        let data = { system: sysId, lock: true };
                        listData.push(data);
                    }
                } else {
                    if (startTime - time > (7 * 24 * 60 * 60 - 1) * 1000) {
                        let data = { system: sysId, lock: false };
                        listData.push(data);
                    } else {
                        let data = { system: sysId, lock: true };
                        listData.push(data);
                    }
                }
            }
        })

        this.list.set_data(listData, resetPos);
    }

    openRankBtnClick() {
        gdk.panel.setArgs(PanelId.WorldHonorRankView, 0);
        gdk.panel.open(PanelId.WorldHonorRankView);
    }

    // _checkUnShowRedPoint(systemId: number) {
    //     let result = false;
    //     switch (systemId) {
    //         case 2921:
    //             result = RedPointUtils.is_WorldHonor_show_redPoint()
    //             break;
    //         case 2919:
    //             result = RedPointUtils.is_ArenaHonor_show_redPoint()
    //             break;
    //     }
    //     return result;
    // }
}
