import ActUtil from '../../act/util/ActUtil';
import ConfigManager from '../../../common/managers/ConfigManager';
import CopyUtil from '../../../common/utils/CopyUtil';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import JumpUtils from '../../../common/utils/JumpUtils';
import ModelManager from '../../../common/managers/ModelManager';
import PanelId from '../../../configs/ids/PanelId';
import RedPointUtils from '../../../common/utils/RedPointUtils';
import RoleModel from '../../../common/models/RoleModel';
import ServerModel from '../../../common/models/ServerModel';
import StringUtils from '../../../common/utils/StringUtils';
import TimerUtils from '../../../common/utils/TimerUtils';
import UiListItem from '../../../common/widgets/UiListItem';
import { Guild_enterCfg, SystemCfg } from '../../../a/config';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';


/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-06-23 10:55:15
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/GuildCopyItemCtrl")
export default class GuildCopyItemCtrl extends UiListItem {

    @property(cc.Node)
    bgButton: cc.Node = null;

    @property(cc.Label)
    statuLab: cc.Label = null;

    @property(cc.Sprite)
    icon: cc.Sprite = null;

    @property(cc.Node)
    redPoint: cc.Node = null;

    @property(cc.Node)
    lockIcon: cc.Node = null;

    @property(cc.Label)
    lockText: cc.Label = null;

    @property(cc.ScrollView)
    scroll: cc.ScrollView = null;
    @property(cc.Node)
    content: cc.Node = null;
    @property(cc.Prefab)
    rewardItem: cc.Prefab = null;

    temList: ListView;
    _cfg: Guild_enterCfg
    _systemCfg: SystemCfg

    updateView() {
        this._cfg = this.data
        GlobalUtil.setSpriteIcon(this.node, this.icon, `view/guild/texture/bg/guild_copy_${this._cfg.id}`);
        this.statuLab.string = `${this._cfg.time_show}`
        this.initRewardItem(this._cfg.rewards_show)

        let isLock = !JumpUtils.ifSysOpen(this._cfg.system, false)
        this._updateLockState(isLock)
        this._updateRedPointState()
    }

    initRewardItem(reward: number[]) {
        if (!this.temList) {
            this.temList = new ListView({
                scrollview: this.scroll,
                mask: this.scroll.node,
                content: this.content,
                item_tpl: this.rewardItem,
                async: true,
                row: 1,
                gap_x: 5,
                gap_y: 0,
                direction: ListViewDir.Horizontal,
            });
        }
        let temData = []
        for (let i = 0; i < reward.length; i++) {
            let itemId = reward[i];
            let tem = { index: i, typeId: itemId, num: 1, delayShow: false, effect: false };
            temData.push(tem);
        }
        this.temList.set_data(temData);
    }

    _updateLockState(isLock: boolean) {
        if (isLock) {
            GlobalUtil.setGrayState(this.icon, 1)
            this.lockIcon.active = true
            this._systemCfg = ConfigManager.getItemById(SystemCfg, this._cfg.system)
            let model = ModelManager.get(RoleModel);
            this.lockText.string = ''
            // 等级达不到要求
            if (model.level < this._systemCfg.openLv) {
                this.lockText.string = StringUtils.format(gdk.i18n.t("i18n:INS_LIST_TIP1"), this._systemCfg.openLv)//`${cfg.openLv}级开放`
            } else if (cc.js.isNumber(this._systemCfg.fbId) && this._systemCfg.fbId > 0 && !CopyUtil.isStagePassed(this._systemCfg.fbId)) {
                this.lockText.string = StringUtils.format(gdk.i18n.t("i18n:INS_LIST_TIP2"), CopyUtil.getChapterId(this._systemCfg.fbId), CopyUtil.getSectionId(this._systemCfg.fbId))
            }
            if ([2835, 2922].indexOf(this._systemCfg.id) !== -1) {
                this._createExpeditionTime()
            }
        } else {
            GlobalUtil.setGrayState(this.icon, 0)
            this.lockIcon.active = false
            this.lockText.string = ''
        }
    }


    _createExpeditionTime() {
        this._clearExpeditionTime()
        this._updateExpeditionTime()
        this.schedule(this._updateExpeditionTime, 1)
    }

    _updateExpeditionTime() {
        let curTime = ModelManager.get(ServerModel).serverTime
        let nextStartTime = ActUtil.getNextActStartTime(this._systemCfg.activity)
        let leftTime = nextStartTime - curTime
        if (leftTime > 0) {
            this.lockText.string = `活动开启剩余时间：${TimerUtils.format1(Math.floor(leftTime / 1000))}`
        } else {
            GlobalUtil.setGrayState(this.icon, 0)
            this.lockIcon.active = false
            this.lockText.string = ''
        }
    }

    _clearExpeditionTime() {
        this.unschedule(this._updateExpeditionTime)
    }

    _updateRedPointState() {
        let result = false;
        switch (this._cfg.id) {
            case 1://公会boss
                result = RedPointUtils.has_guild_boss_reward_or_challenge()
                break;
            case 2://末日集结
                result = RedPointUtils.has_guild_power_reward_or_challenge()
                break
            case 3: //团队远征
                result = RedPointUtils.has_expedition_task_rewards() || RedPointUtils.has_expedition_army_strengthen()
                break;
            default:
                break;
        }
        this.redPoint.active = result
    }

    onClick() {
        if (!JumpUtils.ifSysOpen(this._cfg.system, true)) {
            return;
        }
        switch (this._cfg.id) {
            case 1://公会boss
                JumpUtils.openPanel({
                    panelId: PanelId.GuildBossView,
                    currId: PanelId.GuildCopyView
                })
                break
            case 2://末日集结
                JumpUtils.openPanel({
                    panelId: PanelId.GuildPowerView,
                    currId: PanelId.GuildCopyView
                })
                break
            case 3://团队远征
                JumpUtils.openPanel({
                    panelId: PanelId.ExpeditionMainView,
                    currId: PanelId.GuildCopyView
                })
                break
        }
    }
}