import ActivityModel from '../model/ActivityModel';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import JumpUtils from '../../../common/utils/JumpUtils';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import RankModel from '../../rank/model/RankModel';
import TimerUtils from '../../../common/utils/TimerUtils';
import { Activity_ranking3Cfg, Activity_ranking7Cfg } from '../../../a/config';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';
import { RankTypes } from '../../rank/enum/RankEvent';


export type KfcbActItemInfo = {
    canGet: boolean,
    cfg: Activity_ranking3Cfg | Activity_ranking7Cfg,
    hasGet: boolean,
    isLight: boolean,
    day: number,
    isEnd: boolean,
}

/** 
 * 开服冲榜
 * @Author: luoyong 
 * @Description: 
 * @Date: 2019-12-13  09:57:55 
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-01-06 10:56:46
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/KfcbActViewCtrl")
export default class KfcbActViewCtrl extends gdk.BasePanel {

    @property(cc.Button)
    upBtns: cc.Button[] = []

    @property(cc.Prefab)
    actItem: cc.Prefab = null

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Label)
    leftTime: cc.Label = null

    @property(cc.Label)
    cruRank: cc.Label = null

    @property(cc.Node)
    rankNode: cc.Node = null

    @property(cc.Node)
    endNode: cc.Node = null
    @property(cc.Node)
    noNumNode: cc.Node = null

    @property(sp.Skeleton)
    spine: sp.Skeleton = null

    list: ListView = null;

    upSelect: number = 0
    isEnd = false

    get activityModel(): ActivityModel {
        return ModelManager.get(ActivityModel)
    }

    get rankModel(): RankModel {
        return ModelManager.get(RankModel)
    }

    onEnable() {
        let self = this
        let msg = new icmsg.ActivityRankingInfoReq();
        NetManager.send(msg, (data: icmsg.ActivityRankingInfoRsp) => {
            self.activityModel.kfcb_history1 = data.history1
            self.activityModel.kfcb_history2 = data.history2
            self.activityModel.kfcb_percent3 = data.percent3
            self.activityModel.kfcb_percent7 = data.percent7 > 0 ? data.percent7 : this.activityModel.kfcb_percent7
            self.activityModel.kfcb_rewarded3 = data.rewarded3
            self.activityModel.kfcb_rewarded7 = data.rewarded7
            self.activityModel.kfcb_ranksInfo = data.top3
            self._initView()

            if (self.activityModel.kfcb_percent7 > 0 && self.activityModel.kfcb_percent7 <= 3) {
                this.spine.setAnimation(0, "stand", false)
                this.spine.setCompleteListener(() => {
                    this.spine.setCompleteListener(null)
                    this.spine.setAnimation(0, "stand2", true)
                })
            } else {
                this.spine.setAnimation(0, "stand2", true)
            }
        });

        this.node.setScale(.7);
        this.node.runAction(cc.sequence(
            cc.scaleTo(.2, 1.05, 1.05),
            cc.scaleTo(.15, 1, 1)
        ));
    }

    onDisable() {
        this.node.stopAllActions();
    }

    //刷新活动时间
    dtTime: number = 0;
    update(dt: number) {
        if (!this.isEnd) {
            if (this.dtTime >= 1) {
                this.dtTime -= 1;
                let serverTime = Math.floor(GlobalUtil.getServerTime() / 1000)
                let serverOpenTime = GlobalUtil.getServerOpenTime()
                let endTime3 = 0;
                let str = ''
                if (this.upSelect == 0) {
                    endTime3 = serverOpenTime + 3600 * 24 * 3 - serverTime
                } else {
                    endTime3 = serverOpenTime + 3600 * 24 * 7 - serverTime
                }
                if (endTime3 > 0) {
                    str = `${TimerUtils.format1(endTime3)}`
                    this.leftTime.node.color = cc.color("#28c660")
                } else {
                    str = gdk.i18n.t("i18n:KFCB_TIP3")
                    this.leftTime.node.color = cc.color("#c66728")
                    this.isEnd = true
                }
                this.leftTime.string = str
            }
            this.dtTime += dt;
        }

    }
    onDestroy() {
        this.activityModel.showKfcbIcon = true
        gdk.e.targetOff(this)
    }

    _initListView() {
        if (this.list) {
            return
        }
        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.actItem,
            cb_host: this,
            async: true,
            gap_y: 5,
            direction: ListViewDir.Vertical,
        })
    }

    _initView() {
        let serverTime = Math.floor(GlobalUtil.getServerTime() / 1000)
        let serverOpenTime = GlobalUtil.getServerOpenTime()
        let endTime3 = serverOpenTime + 3600 * 24 * 3 - serverTime
        if (endTime3 > 0) {
            this.upBtnSelect(null, 0)
        } else {
            this.upBtnSelect(null, 1)
        }
    }

    upBtnSelect(e, utype) {
        utype = parseInt(utype)
        this.upSelect = utype
        for (let idx = 0; idx < this.upBtns.length; idx++) {
            const element = this.upBtns[idx];
            element.interactable = idx != utype
            let select = element.node.getChildByName("select");
            select.active = idx == utype;
        }
        this._updateScroll()
    }


    @gdk.binding("activityModel.kfcb_rewarded3")
    @gdk.binding("activityModel.kfcb_rewarded7")
    _updateScroll() {
        this._initListView()

        this.isEnd = false
        let list = []
        let newList = []
        let str = ""
        let serverTime = Math.floor(GlobalUtil.getServerTime() / 1000)
        let serverOpenTime = GlobalUtil.getServerOpenTime()
        if (this.upSelect == 0) {
            list = ConfigManager.getItems(Activity_ranking3Cfg)
            let endTime3 = serverOpenTime + 3600 * 24 * 3 - serverTime
            if (endTime3 > 0) {
                str = `${TimerUtils.format1(endTime3)}`
                this.leftTime.node.color = cc.color("#28c660")
            } else {
                str = gdk.i18n.t("i18n:KFCB_TIP3")
                this.leftTime.node.color = cc.color("#c66728")
                this.isEnd = true
            }

            //只能领取一档 奖励
            let canGet = true
            let isLight = true
            for (let i = 0; i < list.length; i++) {
                let info3: KfcbActItemInfo = {
                    canGet: canGet,
                    cfg: list[i],
                    hasGet: this.activityModel.kfcb_rewarded3,
                    isLight: isLight,
                    day: 3,
                    isEnd: this.isEnd
                }
                if (this.activityModel.kfcb_percent3 > 0 && this.activityModel.kfcb_percent3 <= list[i].rank) {
                    if (endTime3 <= 0) {
                        newList.push(info3)
                        canGet = false
                    } else {
                        info3.canGet = false
                        newList.push(info3)
                    }
                    isLight = false
                } else {
                    info3.canGet = false
                    info3.isLight = false
                    newList.push(info3)
                }
            }

            let rank = this.activityModel.kfcb_percent3
            if (endTime3 > 0) {
                let rankInfo: icmsg.RankSelfRsp = this.rankModel.rankSelfMap[RankTypes.Refine]
                if (rankInfo && rankInfo.numTd != 0 && rank > rankInfo.numTd) {
                    rank = rankInfo.numTd
                }
            }
            this._updateCurRank(rank)
        } else {
            list = ConfigManager.getItems(Activity_ranking7Cfg)
            let endTime7 = serverOpenTime + 3600 * 24 * 7 - serverTime
            if (endTime7 > 0) {
                str = `${TimerUtils.format1(endTime7)}`
                this.leftTime.node.color = cc.color("#28c660")
            } else {
                str = gdk.i18n.t("i18n:KFCB_TIP3")
                this.isEnd = true
                this.leftTime.node.color = cc.color("#c66728")
            }

            //只能领取一档 奖励
            let canGet = true
            let isLight = true
            for (let i = 0; i < list.length; i++) {

                let info7: KfcbActItemInfo = {
                    canGet: canGet,
                    cfg: list[i],
                    hasGet: this.activityModel.kfcb_rewarded7,
                    isLight: isLight,
                    day: 7,
                    isEnd: this.isEnd
                }
                if (this.activityModel.kfcb_percent7 > 0 && this.activityModel.kfcb_percent7 <= list[i].rank) {
                    if (endTime7 <= 0) {
                        newList.push(info7)
                        canGet = false
                    } else {
                        info7.canGet = false
                        newList.push(info7)
                    }
                    isLight = false
                } else {
                    info7.isLight = false
                    info7.canGet = false
                    newList.push(info7)
                }
            }
            let rank = this.activityModel.kfcb_percent7
            if (endTime7 > 0) {
                let rankInfo: icmsg.RankSelfRsp = this.rankModel.rankSelfMap[RankTypes.Refine]
                if (rankInfo && rankInfo.numTd != 0 && rank > rankInfo.numTd) {
                    rank = rankInfo.numTd
                }
            }
            this._updateCurRank(rank)

        }
        this.list.set_data(newList)
        this.leftTime.string = str
    }

    _updateCurRank(rank) {
        if (rank == 0) {
            this.rankNode.active = false
            this.endNode.active = this.isEnd;
            this.noNumNode.active = !this.isEnd;
        } else {
            this.rankNode.active = true
            this.endNode.active = false
            this.noNumNode.active = false;
            this.cruRank.string = `${rank}`
            let path = "view/act/texture/kfcb"
            let pic = this.rankNode.getChildByName("curTxtPic")
            if (this.isEnd) {
                GlobalUtil.setSpriteIcon(this.rankNode, pic, `${path}/${this.upSelect == 0 ? "kfcb_wenzi06" : "kfcb_wenzi05"}`)
            } else {
                GlobalUtil.setSpriteIcon(this.rankNode, pic, `${path}/kfcb_wenzi01`)
            }
        }
    }

    openRankFunc() {
        gdk.panel.setArgs(PanelId.Rank, 3);
        gdk.panel.hide(PanelId.KfcbActView);
        JumpUtils.openPanel({
            panelId: PanelId.Rank,
            panelArgs: { args: 3 },
            currId: gdk.gui.getCurrentView(),
        });
        //gdk.panel.hide(PanelId.KfcbActView);

        //gdk.panel.open(PanelId.Rank)
        // gdk.panel.open(PanelId.KfcbActNotice)
    }

    openTowerView() {
        if (JumpUtils.ifSysOpen(601, true)) {
            this.close()
            gdk.panel.open(PanelId.TowerPanel)
        }
    }
}
