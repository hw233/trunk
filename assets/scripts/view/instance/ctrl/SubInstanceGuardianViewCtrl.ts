import ConfigManager from '../../../common/managers/ConfigManager';
import CopyModel, { CopyType } from '../../../common/models/CopyModel';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import RoleModel from '../../../common/models/RoleModel';
import { Copy_stageCfg, GlobalCfg, VipCfg } from '../../../a/config';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-03-29 10:44:17 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/instance/SubInstanceGuardianViewCtrl")
export default class SubInstanceGuardianViewCtrl extends gdk.BasePanel {
    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    subGuardianItem: cc.Prefab = null

    @property(cc.Label)
    num: cc.Label = null;

    list: ListView = null
    cfgs: Copy_stageCfg[] = [];

    curStageId: number = 0;
    get roleModel() { return ModelManager.get(RoleModel); }
    get copyModel() { return ModelManager.get(CopyModel); }

    onEnable() {
        this.cfgs = ConfigManager.getItemsByField(Copy_stageCfg, 'copy_id', CopyType.Guardian);
        this._updateList();
    }

    onDisable() {
        if (this.list) {
            this.list.destroy();
            this.list = null;
        }
        gdk.e.targetOff(this);
        NetManager.targetOff(this);
    }

    onRaidBtnClick() {
        if (!this.copyModel.guardianMaxStageId) {
            gdk.gui.showMessage('暂无可扫荡的关卡');
            return;
        }
        let gCfg = ConfigManager.getItemByField(GlobalCfg, 'key', 'guardian_free_sweep');
        let vipCfg = ConfigManager.getItemByField(VipCfg, 'level', ModelManager.get(RoleModel).vipLv);
        let maxRaidTimes = gCfg.value[0] + vipCfg.vip12 || 0;
        if (this.copyModel.guardianRaidNum >= maxRaidTimes) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:INS_RUNE_ITEM_TIP6"))//('已达到今日可扫荡次数上限');
        }
        else {
            let req = new icmsg.GuardianCopyRaidReq();
            req.all = true;
            NetManager.send(req, (resp: icmsg.GuardianCopyRaidRsp) => {
                if (!cc.isValid(this.node)) return;
                if (!this.node.activeInHierarchy) return;
                GlobalUtil.openRewadrView(resp.rewards);
            }, this);
        }
    }

    _initListView() {
        if (!this.list) {
            this.list = new ListView({
                scrollview: this.scrollView,
                mask: this.scrollView.node,
                content: this.content,
                item_tpl: this.subGuardianItem,
                cb_host: this,
                column: 1,
                gap_x: 0,
                gap_y: 10,
                async: true,
                direction: ListViewDir.Vertical,
            })
        }
    }

    _updateList() {
        this._initListView();
        this.list.clear_items();
        this.list.set_data(this.cfgs);
        gdk.Timer.callLater(this, () => {
            if (!cc.isValid(this.node)) return;
            if (!this.node.activeInHierarchy) return;
            let idx = 0;
            for (let i = 0; i < this.cfgs.length; i++) {
                if (this.cfgs[i].id == this.copyModel.guardianMaxStageId + 1) {
                    idx = i;
                    break;
                }
                if (i == this.cfgs.length - 1 && this.cfgs[i].id == this.copyModel.guardianMaxStageId) {
                    idx = i;
                    break;
                }
            }
            this.list.scroll_to(idx);
        });
    }

    @gdk.binding('copyModel.guardianRaidNum')
    _updateRaidNumTimes() {
        let gCfg = ConfigManager.getItemByField(GlobalCfg, 'key', 'guardian_free_sweep');
        let vipCfg = ConfigManager.getItemByField(VipCfg, 'level', ModelManager.get(RoleModel).vipLv);
        let maxRaidTimes = gCfg.value[0] + vipCfg.vip12 || 0;
        this.num.string = Math.max(0, maxRaidTimes - this.copyModel.guardianRaidNum) + '';
    }
}
