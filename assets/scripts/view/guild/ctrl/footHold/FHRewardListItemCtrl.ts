import ConfigManager from '../../../../common/managers/ConfigManager';
import FootHoldModel, { FhRankItemInfo } from './FootHoldModel';
import FriendModel from '../../../friend/model/FriendModel';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import GuildUtils from '../../utils/GuildUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import PveGeneralModel from '../../../pve/model/PveGeneralModel';
import RoleModel from '../../../../common/models/RoleModel';
import StringUtils from '../../../../common/utils/StringUtils';
import UiListItem from '../../../../common/widgets/UiListItem';
import { BtnMenuType } from '../../../../common/widgets/BtnMenuCtrl';
import { FhRewardListData } from './FHRewardListCtrl';
import { FootHoldEventId } from '../../enum/FootHoldEventId';
import { Hero_awakeCfg, HeroCfg } from '../../../../a/config';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';

/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-10-18 13:40:09
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/footHold/FHRewardListItemCtrl")
export default class FHRewardListItemCtrl extends UiListItem {

    @property(cc.Node)
    postionIcon: cc.Node = null;

    @property(cc.Label)
    nameLab: cc.Label = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Node)
    btnGet: cc.Node = null;

    @property(cc.Node)
    hasGet: cc.Node = null;

    @property(sp.Skeleton)
    heroSpine: sp.Skeleton = null;

    @property(cc.Node)
    heroNode: cc.Node = null;

    @property(cc.Prefab)
    rewardItem: cc.Prefab = null

    rewardList: ListView = null;

    _info: FhRewardListData;

    get footHoldModel(): FootHoldModel { return ModelManager.get(FootHoldModel); }
    get roleModel(): RoleModel { return ModelManager.get(RoleModel); }

    onEnable() {
        this._initListView()
    }

    updateView() {

        this._info = this.data
        this.nameLab.string = this._info.menberInfo.name
        this.nameLab.node.color = cc.color("#FFFB82")
        if (this._info.menberInfo.id == this.roleModel.id) {
            this.nameLab.node.color = cc.color("#00ff00")
        }
        this.postionIcon.active = true
        let path = GuildUtils.getMemberTitlePath(this._info.menberInfo.position)
        GlobalUtil.setSpriteIcon(this.node, this.postionIcon, `view/guild/texture/common/${path}`)

        let rewards = this._info.recoredInfo.lastGoods
        this.btnGet.active = false
        this.hasGet.active = false
        this.rewardList.set_data([])
        if (rewards.length > 0) {
            let goods = []
            for (let i = 0; i < rewards.length; i++) {
                let info: FhRankItemInfo = {
                    id: rewards[i].typeId,
                    num: rewards[i].num,
                    isLimit: false,
                    openType: 1
                }
                goods.push(info)
            }
            this.rewardList.set_data(goods)
        }

        if (this._info.menberInfo.id == ModelManager.get(RoleModel).id) {
            if (this.footHoldModel.fhDropReward.length == 0) {
                this.btnGet.active = false
                this.hasGet.active = true
            } else {
                let rewards = this.footHoldModel.fhDropReward
                let goods = []
                for (let i = 0; i < rewards.length; i++) {
                    let info: FhRankItemInfo = {
                        id: rewards[i].typeId,
                        num: rewards[i].num,
                        isLimit: false,
                        openType: 1
                    }
                    goods.push(info)
                }
                this.rewardList.set_data(goods)
                this.btnGet.active = true
            }
        }

        if (this._info.menberInfo.head == 0) {
            let spineName = ModelManager.get(PveGeneralModel).skin;
            let url = StringUtils.format("spine/hero/{0}/1/{0}", spineName);
            GlobalUtil.setSpineData(this.node, this.heroSpine, url, true, "stand_s", true, true);
            this.heroSpine.node.scale = 0.55
        } else {
            this.heroSpine.node.scale = 0.6
            let hcfg = ConfigManager.getItemById(HeroCfg, this._info.menberInfo.head);
            if (hcfg) {
                let url = StringUtils.format("spine/hero/{0}/1/{0}", hcfg.skin);
                GlobalUtil.setSpineData(this.node, this.heroSpine, url, true, "stand", true, true);
            } else {
                //属于觉醒的头像 找到对应的英雄模型
                let cfgs = ConfigManager.getItems(Hero_awakeCfg, { icon: this._info.menberInfo.head })
                if (cfgs.length > 0) {
                    let url = StringUtils.format("spine/hero/{0}/1/{0}", cfgs[cfgs.length - 1].ul_skin);
                    GlobalUtil.setSpineData(this.node, this.heroSpine, url, true, "stand", true, true);
                } else if ([310149, 310150, 310151].indexOf(this._info.menberInfo.head) !== -1) {
                    let heroCfg = ConfigManager.getItem(HeroCfg, (cfg: HeroCfg) => {
                        if (cfg.icon == this._info.menberInfo.head - 10000 && cfg.group[0] == 6) {
                            return true;
                        }
                    });
                    path = `spine/hero/${heroCfg.skin}_jx/1/${heroCfg.skin}_jx`
                } else {
                    let str = 'H_zhihuiguan'
                    path = `spine/hero/${str}/1/${str}`
                }
            }
        }
    }

    _initListView() {
        if (this.rewardList) {
            return
        }
        this.rewardList = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.rewardItem,
            cb_host: this,
            async: true,
            gap_x: 5,
            direction: ListViewDir.Horizontal,
        })
    }

    onGetFunc() {
        // gdk.panel.open(PanelId.FHRewardGet)
        let msg = new icmsg.GuildDropFetchReq()
        NetManager.send(msg, (data: icmsg.GuildDropFetchRsp) => {
            GlobalUtil.openRewadrView(data.list)
            this.footHoldModel.fhDropReward = []
            gdk.e.emit(FootHoldEventId.UPDATE_FOOTHOLD_DROP_REWARD)
            let msg = new icmsg.GuildDropStateReq()
            NetManager.send(msg)
        }, this)
    }

    onOpenMenu() {
        let btns: BtnMenuType[] = [1, 0, 11]
        let id = this._info.menberInfo.id
        if (id == ModelManager.get(RoleModel).id) return;
        let friendModel = ModelManager.get(FriendModel)
        let friendIdList = friendModel.friendIdList
        let idList = friendModel.backIdList
        // // 判断添加屏蔽/取消屏蔽按钮
        if (idList[id.toLocaleString()]) {
            btns.splice(1, 0, 5)
        } else {
            btns.splice(1, 0, 4)
        }
        // 非好友的情况下增加添加好友按钮
        if (!friendIdList[id.toLocaleString()]) {
            btns.splice(1, 0, 2)
        }

        GlobalUtil.openBtnMenu(this.heroNode, btns, {
            id: id,
            name: this._info.menberInfo.name,
            headId: this._info.menberInfo.head,
            headBgId: this._info.menberInfo.frame,
            level: this._info.menberInfo.level,
        })
    }

    openLogFunc() {
        gdk.panel.setArgs(PanelId.GuildLog, 5)
        gdk.panel.open(PanelId.GuildLog)
    }
}