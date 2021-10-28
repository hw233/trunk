import ActUtil from '../../../act/util/ActUtil';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GuardianCallSelectItemCtrl from './GuardianCallSelectItemCtrl';
import GuardianModel from '../../model/GuardianModel';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import { Guardian_drawCfg, Guardian_trailerCfg } from '../../../../a/config';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';


/** 
 * @Description: 英雄守护者界面
 * @Author: yaozu.hu
 * @Date: 2019-05-08 14:30:43 
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-04-22 15:38:25
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/guardian/GuardianCallSelectViewCtrl")
export default class GuardianCallSelectViewCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;
    @property(cc.Node)
    content: cc.Node = null;
    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    //curSelect: number = 0;
    list: ListView;

    curIndex: number = 0;
    selectWishItem: GuardianWishData;

    callRewardType: number = 1;
    actId: number = 99;
    tipActId: number = 98;
    tipRewardType: number = 0;
    get model() { return ModelManager.get(GuardianModel) }
    onEnable() {

        //this.curSelect = this.model.wishItemId;
        this.callRewardType = ActUtil.getActRewardType(this.actId);
        this.tipRewardType = ActUtil.getActRewardType(this.tipActId);
        this._updateView();

    }
    onDisable() {
        gdk.Timer.clearAll(this)
        NetManager.targetOff(this)
        if (this.list) {
            this.list.destroy()
            this.list = null;
        }
    }
    _initListView() {
        if (!this.list) {
            this.list = new ListView({
                scrollview: this.scrollView,
                mask: this.scrollView.node,
                content: this.content,
                item_tpl: this.itemPrefab,
                cb_host: this,
                column: 4,
                gap_x: 40,
                gap_y: 30,
                async: true,
                direction: ListViewDir.Vertical,
            })
        }
        this.list.onClick.on(this._selectItem, this);

    }

    _selectItem(data: any, index) {
        this.selectWishItem = data;
        this.curIndex = index;

        // let tem = this.list.items[index];
        // if (tem) {
        //     let ctrl = tem.node.getComponent(GuardianCallSelectItemCtrl);
        //     if (!ctrl.info.cfg) {
        //         gdk.gui.showMessage(ctrl.nameLb.string + '许愿池')
        //     }
        // }

        // ctrl.ifSelect = true;
        // ctrl._itemSelect()
    }

    _updateView(resetPos: boolean = true) {
        this._initListView();
        let listData: GuardianWishData[] = [];

        let temCfgs = ConfigManager.getItems(Guardian_drawCfg, (cfg: Guardian_drawCfg) => {
            if (cfg.reward_type == this.callRewardType && cfg.type == 2 && cfg.wish == 1) {
                return true;
            }
            return false;
        })
        this.curIndex = -1;
        temCfgs.forEach((cfg, index) => {
            let temData = { cfg: cfg };
            listData.push(temData);
            if (cfg.award[0] == this.model.wishItemId) {
                this.curIndex = index;
                this.selectWishItem = temData;
            }
        })

        if (this.tipRewardType > 0) {
            let cfg = ConfigManager.getItemByField(Guardian_trailerCfg, 'reward_type', this.tipRewardType);
            if (cfg) {
                cfg.guardian_id[0].forEach(id => {
                    let tem = { guardianID: id, tipActRewardType: this.tipRewardType }
                    listData.push(tem);
                });
            }
        }
        //this.list.clear_items()
        this.list.set_data(listData, resetPos);
        if (this.curIndex >= 0) {
            gdk.Timer.once(50, this, () => {
                let tem = this.list.items[this.curIndex];
                this.list.select_item(this.curIndex);
                let ctrl = tem.node.getComponent(GuardianCallSelectItemCtrl);
                this._selectItem(ctrl.data, this.curIndex)
            })
        }
    }


    selectBtnClick() {
        if (this.selectWishItem && this.selectWishItem.cfg.award[0] != this.model.wishItemId) {
            //发送许愿消息
            let msg = new icmsg.GuardianWishReq()
            msg.itemId = this.selectWishItem.cfg.award[0]
            NetManager.send(msg, (rsp: icmsg.GuardianWishRsp) => {
                this.model.wishItemId = rsp.itemId;
                this.model.guardianDrawState.wishItemId = rsp.itemId;
                this.close();
            }, this)
        } else {
            this.close();
        }
    }
}

export interface GuardianWishData {
    cfg?: Guardian_drawCfg,
    guardianID?: number,
    tipActRewardType?: number
}

