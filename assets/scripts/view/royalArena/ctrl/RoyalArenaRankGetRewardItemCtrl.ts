import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import RewardItem from '../../../common/widgets/RewardItem';
import RoyalModel from '../../../common/models/RoyalModel';
import UiListItem from '../../../common/widgets/UiListItem';
import { ActivityEventId } from '../../act/enum/ActivityEventId';
import { RedPointEvent } from '../../../common/utils/RedPointUtils';
import { Royal_divisionCfg, Royal_sceneCfg } from '../../../a/config';


/** 
 * @Description: 
 * @Author: yaozu.hu
 * @Date: 2021-02-01 10:50:41
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-10-14 20:54:44
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/royalArena/RoyalArenaRankGetRewardItemCtrl")
export default class RoyalArenaRankGetRewardItemCtrl extends UiListItem {

    @property(cc.Sprite)
    divisionSp: cc.Sprite = null;

    @property(cc.Label)
    nameLabel: cc.Label = null;

    @property(cc.Label)
    numLabel: cc.Label = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    @property(cc.Node)
    mapNode: cc.Node = null;

    @property(cc.Node)
    btnGet: cc.Node = null;   //领取物品奖励

    @property(cc.Node)
    hasGet: cc.Node = null;   //领取物品奖励

    get model(): RoyalModel { return ModelManager.get(RoyalModel); }

    _cfg: Royal_divisionCfg

    updateView() {
        this._cfg = this.data;
        this.nameLabel.string = this._cfg.name;
        this.numLabel.string = '(' + this.model.score + '/' + this._cfg.point + ')';
        GlobalUtil.setSpriteIcon(this.node, this.divisionSp, 'view/act/texture/peak/' + this._cfg.icon)

        this.mapNode.active = false
        if (this._cfg.stage_id) {
            this.mapNode.active = true
            let icon = cc.find("icon", this.mapNode)
            let name = cc.find("name", this.mapNode).getComponent(cc.Label)
            let s_cfg = ConfigManager.getItemById(Royal_sceneCfg, this._cfg.stage_id[0])
            let path = ""
            if (s_cfg) {
                path = `view/royalArena/texture/map/${s_cfg.thumbnail}`
            }
            GlobalUtil.setSpriteIcon(this.node, icon, path)
            name.string = `解锁：${s_cfg.scene_name}`
        }

        this.btnGet.active = false
        this.hasGet.active = false

        if (this.model.score >= this._cfg.point) {
            this.btnGet.active = true
            if (this.model.divFlag & Math.pow(2, this._cfg.division - 1)) {
                this.btnGet.active = false
                this.hasGet.active = true
            }
        }

        //刷新奖励信息
        this._updateRewardData()
    }

    _updateRewardData() {
        //this._initListView();
        let listData = []
        this.content.removeAllChildren()
        for (let i = 0; i < this._cfg.rewards.length; i++) {
            let node = cc.instantiate(this.itemPrefab);
            let ctrl = node.getComponent(RewardItem);
            let tem = this._cfg.rewards[i];
            let temData = { index: i, typeId: tem[0], num: tem[1], delayShow: false, effct: false }
            ctrl.data = temData;
            ctrl.updateView();
            node.setParent(this.content)
        }
    }

    onDisable() {
        NetManager.targetOff(this)

    }

    //领取段位wup奖励
    rewardBtnClick() {
        let msg = new icmsg.RoyalDivReq()
        msg.div = this._cfg.division
        NetManager.send(msg, (rsp: icmsg.RoyalDivRsp) => {
            this.model.divFlag = rsp.divFlag;
            GlobalUtil.openRewadrView(rsp.list);
            gdk.e.emit(ActivityEventId.ACTIVITY_ROYAL_RANK_REWARD_UPDATE)
            gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE)
        }, this)
    }

}
