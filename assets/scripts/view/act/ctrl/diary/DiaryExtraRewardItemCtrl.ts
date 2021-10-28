import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import ShaderHelper from '../../../../common/shader/ShaderHelper';
import StringUtils from '../../../../common/utils/StringUtils';
import TaskModel from '../../../task/model/TaskModel';
import UiListItem from '../../../../common/widgets/UiListItem';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { BagType } from '../../../../common/models/BagModel';
import { Diary_globalCfg, Diary_reward1Cfg, Diary_rewardCfg } from '../../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-12-23 17:08:34 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/diary/DiaryExtraRewardItemCtrl")
export default class DiaryExtraRewardItemCtrl extends UiListItem {
    @property(cc.Node)
    titleNode: cc.Node = null;

    @property(cc.Button)
    getBtn: cc.Button = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Node)
    mask: cc.Node = null;

    @property(cc.Prefab)
    slotItemPrefab: cc.Prefab = null;

    @property(cc.Node)
    progressNode: cc.Node = null;

    @property(cc.Label)
    limitLab: cc.Label = null;

    get taskModel(): TaskModel { return ModelManager.get(TaskModel); }

    cfg: Diary_reward1Cfg;
    updateView() {
        this.cfg = this.data;
        this.titleNode.getChildByName('title').getComponent(cc.RichText).string = StringUtils.format(this.cfg.desc, this.cfg.level, this.cfg.value[1], BagUtils.getConfigById(this.cfg.value[0]).name) + ' ';
        GlobalUtil.setSpriteIcon(this.node, this.titleNode.getChildByName('icon'), GlobalUtil.getIconById(this.cfg.value[0]));
        // this.titleLabel.string = `冒险日记达到${this.cfg.level}级(并且积攒${this.cfg.value[1]}个${BagUtils.getConfigById(this.cfg.value[0]).name})`;
        let rewards = this.cfg.rewards;
        this.content.removeAllChildren();
        rewards.forEach(reward => {
            let slot = cc.instantiate(this.slotItemPrefab);
            let ctrl = slot.getComponent(UiSlotItem);
            slot.parent = this.content;
            if (BagUtils.getItemTypeById(reward[0]) == BagType.HERO) ctrl.isCanPreview = true;
            ctrl.updateItemInfo(reward[0], reward[1]);
            ctrl.itemInfo = {
                series: null,
                itemId: reward[0],
                itemNum: reward[1],
                type: BagUtils.getItemTypeById(reward[0]),
                extInfo: null,
            };
        });
        this.content.getComponent(cc.Layout).updateLayout();
        this.scrollView.scrollToTopLeft();
        this.scrollView.enabled = rewards.length >= 5;
        this._updateProgress();
        this._updateTaskState();
    }

    _updateProgress() {
        let maxBarLen = 150;
        let color = ['#90FF01', '#FFE4D0']; //已完成/未完成
        let bar = cc.find('progress/bar', this.progressNode);
        let label = cc.find('label', this.progressNode).getComponent(cc.Label);
        let info = [BagUtils.getItemNumById(this.cfg.value[0]), this.cfg.value[1]];
        label.string = `${Math.min(info[0], info[1])}/${info[1]}`;
        label.node.color = new cc.Color().fromHEX(info[0] >= info[1] ? color[0] : color[1]);
        bar.width = Math.min(maxBarLen, maxBarLen * (info[0] / info[1]));
    }

    _updateTaskState() {
        if (!this.cfg) return;
        GlobalUtil.setAllNodeGray(this.getBtn.node, 0);
        this.getBtn.node.getChildByName('label').getComponent(ShaderHelper).enabled = false;
        this.limitLab.node.active = false;
        if (this._getLv() >= this.cfg.level && BagUtils.getItemNumById(this.cfg.value[0]) >= this.cfg.value[1]) {
            if ((this.taskModel.diaryExtraRewards & 1 << this.cfg.level) >= 1) {
                this.getBtn.node.active = false;
                this.mask.active = true;
            }
            else {
                this.getBtn.node.active = true;
                this.mask.active = false;
            }
        } else {
            if (this._getLv() < this.cfg.level) {
                this.limitLab.node.active = true;
                this.getBtn.node.active = false;
                this.mask.active = false;
                this.limitLab.string = StringUtils.format(gdk.i18n.t('i18n:ACT_DIARY_TIP1'), this.cfg.level);
            }
            else {
                this.getBtn.node.active = true;
                GlobalUtil.setAllNodeGray(this.getBtn.node, 1);
                this.getBtn.node.getChildByName('label').getComponent(ShaderHelper).enabled = true;
                this.mask.active = false;
            }
        }
    }

    onGetBtnClick() {
        if (BagUtils.getItemNumById(this.cfg.value[0]) >= this.cfg.value[1]) {
            let req = new icmsg.MissionAdventureDiaryRewardReq();
            req.id = this.cfg.id;
            NetManager.send(req, (resp: icmsg.MissionAdventureDiaryRewardRsp) => {
                GlobalUtil.openRewadrView(resp.rewards);
                this._updateTaskState();
            });
        }
        else {
            //todo
            GlobalUtil.openGainWayTips(this.cfg.value[0]);
        }

    }

    _getLv() {
        let itemId = ConfigManager.getItemByField(Diary_globalCfg, 'key', 'item').value[0];
        let itemNum = BagUtils.getItemNumById(itemId);
        let cfgs = ConfigManager.getItemsByField(Diary_rewardCfg, 'reward_type', this.cfg.reward_type);
        cfgs.sort((a, b) => { return b.level - a.level; });
        let curLv = 0;
        for (let i = 0; i < cfgs.length; i++) {
            if (cfgs[i].level == 0 || itemNum >= cfgs[i].value[1]) {
                curLv = cfgs[i].level;
                break;
            }
        }
        return curLv;
    }
}
