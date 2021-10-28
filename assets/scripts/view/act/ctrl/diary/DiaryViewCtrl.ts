import ActUtil from '../../util/ActUtil';
import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import TaskModel from '../../../task/model/TaskModel';
import TaskUtil from '../../../task/util/TaskUtil';
import TimerUtils from '../../../../common/utils/TimerUtils';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import {
    ActivityCfg,
    Diary_globalCfg,
    Diary_rewardCfg,
    DiaryCfg
    } from '../../../../a/config';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';
import { RedPointEvent } from '../../../../common/utils/RedPointUtils';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-12-22 14:58:46 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/diary/DiaryViewCtrl")
export default class DiaryViewCtrl extends gdk.BasePanel {
    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    slotPrefab: cc.Prefab = null;

    @property(cc.Label)
    timeLab: cc.Label = null;

    @property(cc.Node)
    topNode: cc.Node = null;

    actCfg: ActivityCfg;
    list: ListView;
    curDay: number = 0;
    curExp: number = 0;
    onEnable() {
        ModelManager.get(TaskModel).firstInDiary = false;
        gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE);
        this.schedule(this._updateTime, 1);
        this._updateTime();
        this._initStyle();
        this._updateNextLvPreView();
        NetManager.on(icmsg.ItemUpdateRsp.MsgType, this._onItemUpdateRsp, this);
    }

    onDisable() {
        if (this.list) {
            this.list.destroy();
            this.list = null;
        }
        this.unscheduleAllCallbacks();
        NetManager.targetOff(this);
    }

    onLvRewardBtnClick() {
        gdk.panel.open(PanelId.DiaryLvRewardView);
    }

    _updateTime() {
        let actId = 59;
        this.actCfg = ActUtil.getCfgByActId(actId);
        let startTime = ActUtil.getActStartTime(actId);
        let endTime = ActUtil.getActEndTime(actId);
        let now = GlobalUtil.getServerTime();
        if (!endTime || endTime - now <= 0) {
            gdk.gui.showMessage(gdk.i18n.t('i18n:ACTIVITY_TIME_TIP1'));
            this.unscheduleAllCallbacks();
            if (gdk.panel.isOpenOrOpening(PanelId.DiaryLvRewardView)) {
                gdk.panel.hide(PanelId.DiaryLvRewardView);
            }
            this.close();
        }
        else {
            let t = (endTime - now) / 1000;
            this.timeLab.string = TimerUtils.format4(t);
            let d = Math.min(7, Math.ceil((now - startTime) / 86400000));
            if (d != this.curDay) {
                this.curDay = d;
                this._updateList();
            }
            this.curDay = d;
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
                async: true,
                gap_y: 5,
                direction: ListViewDir.Vertical,
            })
        }
    }

    _updateList() {
        if (!this.actCfg) return;
        this._initList();
        let cfgs = ConfigManager.getItems(DiaryCfg, (cfg: DiaryCfg) => {
            if (cfg.days == this.curDay && cfg.reward_type == this.actCfg.reward_type) {
                return true;
            }
        });
        cfgs.sort((a, b) => { return a.sorting - b.sorting; });
        let undo = [];
        let finish = [];
        let received = [];
        for (let i = 0; i < cfgs.length; i++) {
            if (TaskUtil.getTaskState(cfgs[i].taskid)) {
                if (TaskUtil.getTaskAwardState(cfgs[i].taskid)) {
                    received.push(cfgs[i]);
                }
                else {
                    finish.push(cfgs[i]);
                }
            }
            else {
                undo.push(cfgs[i]);
            }
        }
        this.list.clear_items();
        this.list.set_data([...finish, ...undo, ...received]);
    }

    _updateNextLvPreView() {
        if (!this.actCfg) return;
        let itemId = ConfigManager.getItemByField(Diary_globalCfg, 'key', 'item').value[0];
        let itemNum = BagUtils.getItemNumById(itemId);
        let cfgs = ConfigManager.getItemsByField(Diary_rewardCfg, 'reward_type', this.actCfg.reward_type);
        this.curExp = itemNum;
        cfgs.sort((a, b) => { return b.level - a.level; });
        let curLvCfg, nextLvCfg;
        for (let i = 0; i < cfgs.length; i++) {
            if (cfgs[i].level == 0 || itemNum >= cfgs[i].value[1]) {
                curLvCfg = cfgs[i];
                nextLvCfg = i == 0 ? null : cfgs[i - 1];
                break;
            }
        }
        let nextLab = this.topNode.getChildByName('lab');
        let lvLab = this.topNode.getChildByName('lvLab').getComponent(cc.Label);
        let scrollView = this.topNode.getChildByName('scrollView').getComponent(cc.ScrollView);
        let content = scrollView.node.getChildByName('content');
        let progressNode = this.topNode.getChildByName('progressNode');
        let maxLvLab = this.topNode.getChildByName('maxLvLab');
        lvLab.string = curLvCfg.level;
        if (!nextLvCfg) {
            nextLab.active = false;
            scrollView.node.active = false;
            maxLvLab.active = true;
        }
        else {
            maxLvLab.active = false;
            nextLab.active = true;
            scrollView.node.active = true;
            content.removeAllChildren();
            nextLvCfg.rewards.forEach(reward => {
                let item = cc.instantiate(this.slotPrefab);
                item.parent = content;
                let ctrl = item.getComponent(UiSlotItem);
                ctrl.updateItemInfo(reward[0], reward[1]);
                ctrl.itemInfo = {
                    series: null,
                    itemId: reward[0],
                    itemNum: reward[1],
                    type: BagUtils.getItemTypeById(reward[0]),
                    extInfo: null
                }
            });
            scrollView.getComponent(cc.ScrollView).scrollToTopLeft();
        }
        //progressNode
        let bar = cc.find('progress/bar', progressNode);
        let proLab = cc.find('label', progressNode).getComponent(cc.Label);
        let icon = cc.find('icon', progressNode);
        GlobalUtil.setSpriteIcon(this.node, icon, GlobalUtil.getIconById(itemId));
        let value = nextLvCfg ? nextLvCfg.value[1] : curLvCfg.value[1];
        bar.width = Math.min(249, 249 * (itemNum / value));
        proLab.string = `${itemNum}/${value}`;
    }

    _onItemUpdateRsp() {
        if (!this.actCfg) return;
        let itemId = ConfigManager.getItemByField(Diary_globalCfg, 'key', 'item').value[0];
        let itemNum = BagUtils.getItemNumById(itemId);
        if (itemNum !== this.curExp) {
            this._updateNextLvPreView();
        }
    }

    //==============style===========//
    _initStyle() {
        if (!this.actCfg) return;
        let cfg = ConfigManager.getItem(DiaryCfg, (c: DiaryCfg) => {
            if (c.color && c.color >= 1 && c.reward_type == this.actCfg.reward_type) {
                return true;
            }
        });
        let color = cfg.color;
        GlobalUtil.setSpriteIcon(this.node, cc.find('mxrj_diban01', this.node), `view/act/texture/bg/diary/mxrj_diban0${color == 1 ? '1' : '3'}`);
        GlobalUtil.setSpriteIcon(this.node, cc.find('mxrj_diban02', this.node), `view/act/texture/diary/mxrj_diban0${color == 1 ? '2' : '4'}`);
        GlobalUtil.setSpriteIcon(this.node, cc.find('mxrj_biaotidiban', this.node), `view/act/texture/bg/diary/mxrj_biaotidiban${color == 1 ? '' : '2'}`);
        GlobalUtil.setSpriteIcon(this.node, cc.find('mxrj_maoxianriji', this.node), `view/act/texture/diary/mxrj_maoxianriji${color == 1 ? '' : '2'}`);
        GlobalUtil.setSpriteIcon(this.node, cc.find('top/mxrj_xinxidiban01', this.node), `view/act/texture/bg/diary/mxrj_xinxidiban0${color == 1 ? '1' : '2'}`);
        GlobalUtil.setSpriteIcon(this.node, cc.find('top/mxrj_fenge1', this.node), `view/act/texture/diary/mxrj_fenge${color == 1 ? '' : '2'}`);
        GlobalUtil.setSpriteIcon(this.node, cc.find('top/mxrj_fenge2', this.node), `view/act/texture/diary/mxrj_fenge${color == 1 ? '' : '2'}`);
        GlobalUtil.setSpriteIcon(this.node, cc.find('top/mxrj_dengjidi', this.node), `view/act/texture/diary/mxrj_dengjidi${color == 1 ? '' : '2'}`);
        GlobalUtil.setSpriteIcon(this.node, cc.find('top/mxrj_dengji', this.node), `view/act/texture/diary/mxrj_dengji${color == 1 ? '' : '2'}`);
        GlobalUtil.setSpriteIcon(this.node, cc.find('top/mxrj_text01', this.node), `view/act/texture/diary/mxrj_text0${color == 1 ? '1' : '2'}`);
        GlobalUtil.setSpriteIcon(this.node, cc.find('top/helpBtn', this.node), `view/act/texture/diary/${color == 1 ? 'mxrj_wenhao' : 'sxhl_wenhao'}`);
        GlobalUtil.setSpriteIcon(this.node, cc.find('top/lab', this.node), `view/act/texture/diary/mxrj_xiajijiangli${color == 1 ? '' : '2'}`);
        //lab
        let labColor = [{ color: '#8EF8FF', outline: '#056F95' }, { color: '#F8C084', outline: '#723618' }];
        cc.find('timeTip', this.node).children.forEach(lab => {
            lab.color = cc.color().fromHEX(labColor[color - 1].color);
            lab.getComponent(cc.LabelOutline).color = cc.color().fromHEX(labColor[color - 1].outline);
        })
    }
}
