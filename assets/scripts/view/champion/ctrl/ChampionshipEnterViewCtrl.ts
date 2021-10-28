import ActUtil from '../../act/util/ActUtil';
import BagUtils from '../../../common/utils/BagUtils';
import ChampionModel from '../model/ChampionModel';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import JumpUtils from '../../../common/utils/JumpUtils';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import RoleModel from '../../../common/models/RoleModel';
import TimerUtils from '../../../common/utils/TimerUtils';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import {
    ActivityCfg,
    Champion_divisionCfg,
    Champion_dropCfg,
    Champion_mainCfg,
    Hero_awakeCfg,
    HeroCfg,
    ItemCfg
    } from '../../../a/config';

/**
 * @Description: 锦标赛入口界面
 * @Author: yaozu.hu
 * @Date: 2020-11-26 14:03:28
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-10-18 13:39:44
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/champion/ChampionshipEnterViewCtrl")
export default class ChampionshipEnterViewCtrl extends gdk.BasePanel {


    @property(cc.Label)
    endTime: cc.Label = null;

    @property([cc.Node])
    rankShowNode: cc.Node[] = []

    @property([cc.Label])
    daunweiList: cc.Label[] = []
    @property([cc.Label])
    pointsList: cc.Label[] = []
    @property([cc.Label])
    nameList: cc.Label[] = []
    @property([sp.Skeleton])
    spineList: sp.Skeleton[] = []

    @property([cc.Node])
    rankHideNode: cc.Node[] = []

    @property([cc.Sprite])
    duanweiIcons: cc.Sprite[] = []

    @property([cc.Node])
    duanweiBiaoji: cc.Node[] = []
    @property([cc.Label])
    daunweiPoint: cc.Label[] = []

    @property([UiSlotItem])
    daunweiReward: UiSlotItem[] = []

    @property([cc.Sprite])
    daunweiFrame: cc.Sprite[] = []

    @property(cc.Node)
    rankRewardBtn: cc.Node = null;
    @property(cc.Node)
    lqBtn: cc.Node = null;
    @property(cc.Node)
    ylqBtn: cc.Node = null;

    curDivisionCfg: Champion_divisionCfg;

    cfg: Champion_mainCfg;
    sendRank: boolean = false

    _leftTime: number;
    get leftTime(): number { return this._leftTime; }
    set leftTime(v: number) {
        if (!v && v !== 0) {
            return;
        }
        this._leftTime = Math.max(0, v);
        if (this._leftTime == 0) {
            // this.close();
            this.endTime.string = gdk.i18n.t("i18n:ACTIVITY_TIME_TIP3");//'活动已结束';
        }
        else {
            this.endTime.string = TimerUtils.format1(this.leftTime / 1000);
        }
    }
    get championModel() { return ModelManager.get(ChampionModel); }

    onEnable() {

        NetManager.send(new icmsg.ChampionInfoReq(), (rsp: icmsg.ChampionInfoRsp) => {

            this.championModel.infoData = rsp;
            let lv = rsp.level > 0 ? rsp.level : 1;
            this.curDivisionCfg = ConfigManager.getItemByField(Champion_divisionCfg, 'lv', lv);
            //设置排名信息
            this.initRankPlayerInfo()

            this.initDuanweiInfo();
            this._updateTime();

        }, this)

    }

    onDisable() {
        NetManager.targetOff(this);
        gdk.Timer.clearAll(this);
    }

    _dtime: number = 0;
    update(dt: number) {
        if (!this.leftTime) {
            return;
        }
        if (this._dtime >= 1) {
            this._dtime = 0;
            this._updateTime();
        }
        else {
            this._dtime += dt;
        }
    }

    initRankPlayerInfo() {
        if (!this.championModel.infoData || this.championModel.infoData.legends.length == 0) {
            this.rankShowNode.forEach(show => {
                show.active = false;
            })
            this.rankHideNode.forEach(hide => {
                hide.active = true;
            })
        } else {
            let legends = this.championModel.infoData.legends
            for (let i = 0; i < 3; i++) {
                let state = i < legends.length
                this.rankShowNode[i].active = state
                this.rankHideNode[i].active = !state
                if (state) {
                    let data = legends[i];

                    this.daunweiList[i].string = gdk.i18n.t("i18n:CHAMPION_ENTER_TIP1")//'传奇';
                    this.pointsList[i].string = data.points + ''
                    this.nameList[i].string = data.brief.name;
                    let path = 'H_zhihuiguan'
                    if (data.brief.head == 0) {
                        let str = 'H_zhihuiguan'
                        path = `spine/hero/${str}/1/${str}`//PveTool.getSkinUrl('H_zhihuiguan')
                    } else {
                        let heroCfg = ConfigManager.getItemByField(HeroCfg, 'id', data.brief.head);
                        if (heroCfg) {
                            path = `spine/hero/${heroCfg.skin}/1/${heroCfg.skin}`//PveTool.getSkinUrl(heroCfg.skin)
                        } else {
                            //属于觉醒的头像 找到对应的英雄模型
                            let cfgs = ConfigManager.getItems(Hero_awakeCfg, { icon: data.brief.head })
                            if (cfgs.length > 0) {
                                path = `spine/hero/${cfgs[cfgs.length - 1].ul_skin}/1/${cfgs[cfgs.length - 1].ul_skin}`
                            } else if ([310149, 310150, 310151].indexOf(data.brief.head) !== -1) {
                                let heroCfg = ConfigManager.getItem(HeroCfg, (cfg: HeroCfg) => {
                                    if (cfg.icon == data.brief.head - 10000 && cfg.group[0] == 6) {
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
                    let animStr = data.brief.head == 0 ? 'stand_s' : 'stand';
                    let scalex = i == 0 ? 0.5 : 0.4
                    this.spineList[i].node.scaleX = data.brief.head == 0 ? -scalex : scalex;
                    GlobalUtil.setSpineData(this.node, this.spineList[i], path, true, animStr, true);

                }
            }
        }
    }

    initDuanweiInfo() {
        let temCfgs = ConfigManager.getItems(Champion_divisionCfg);
        let divisionList: number[] = []
        let cfgDatas: Champion_divisionCfg[] = []
        temCfgs.forEach(cfg => {
            if (divisionList.indexOf(cfg.division) < 0) {
                cfgDatas.push(cfg);
                divisionList.push(cfg.division)
            }
        })
        let season = this.championModel.infoData.seasonId
        for (let i = 0; i <= 5; i++) {
            let cfg = cfgDatas[i];
            this.duanweiBiaoji[i].active = cfg.division == this.curDivisionCfg.division;
            if (cfg.division == this.curDivisionCfg.division) {
                this.rankRewardBtn.x = this.duanweiBiaoji[i].parent.x;
            }
            this.daunweiPoint[i].string = cfg.point + '';
            let dropCfg = ConfigManager.getItem(Champion_dropCfg, { 'season': season, 'lv': cfg.lv })
            let itemId = dropCfg.drop_rank[0][0]
            let num = dropCfg.drop_rank[0][1]
            this.daunweiReward[i].updateItemInfo(itemId, num);
            this.daunweiReward[i].itemInfo = {
                series: null,
                itemId: itemId,
                itemNum: 1,
                type: BagUtils.getItemTypeById(itemId),
                extInfo: null
            }
            if (dropCfg.drop_rank.length > 1) {
                let itemCfg = ConfigManager.getItemById(ItemCfg, dropCfg.drop_rank[1][0])
                let path = 'icon/headframe/' + itemCfg.icon
                GlobalUtil.setSpriteIcon(this.node, this.daunweiFrame[i - 3], path);
            }
        }

    }

    //排行榜按钮点击事件
    onRankBtnClick() {
        gdk.panel.open(PanelId.ChampionRankView);
    }

    //进入按钮点击事件
    onEnterBtnClick() {
        if (!this.championModel.infoData || this.championModel.infoData.level == 0 || this.championModel.infoData.seasonId == 0) return;
        // gdk.panel.open(PanelId.ChampionshipView);
        // gdk.Timer.once(100, this, this.close)
        JumpUtils.openPanel({
            panelId: PanelId.ChampionshipView,
            currId: this.node
        })
    }


    _updateTime() {
        this.cfg = null;
        if (!this.cfg) {
            this.cfg = ConfigManager.getItemById(Champion_mainCfg, ModelManager.get(ChampionModel).infoData.seasonId);
        }
        //let cfg: Champion_mainCfg = ConfigManager.getItemById(Champion_mainCfg, ModelManager.get(ChampionModel).infoData.seasonId);
        if (this.cfg) {
            let curTime = GlobalUtil.getServerTime();
            // let c = this.cfg.close_time.split('/');
            // let ct = new Date(c[0] + '/' + c[1] + '/' + c[2] + ' ' + c[3] + ':' + c[4] + ':' + c[5]).getTime();
            // this.leftTime = ct - curTime;
            // if (curTime >= ct && curTime <= ct + 24 * 60 * 60 * 1000 * 2) {
            //     this.endTime.string = gdk.i18n.t("i18n:ACTIVITY_TIME_TIP3");
            //     this.rankRewardBtn.active = true;
            //     this.lqBtn.active = !this.championModel.infoData.rankRewarded
            //     this.ylqBtn.active = this.championModel.infoData.rankRewarded
            // } else {
            //     this.rankRewardBtn.active = false;
            // }
            if (ActUtil.ifActOpen(122)) {
                let ct = ActUtil.getActEndTime(122)
                this.leftTime = ct - curTime;
                this.rankRewardBtn.active = false;
            } else {
                this.leftTime = 0;
                let roleModel = ModelManager.get(RoleModel);
                let cfgs = ConfigManager.getItems(ActivityCfg, (cfg: ActivityCfg) => {
                    if (cfg.reward_type == this.championModel.infoData.seasonId && cfg.cross_id.length > 0 && cfg.cross_id.indexOf(roleModel.crossId) >= 0) {
                        return true
                    } else if (cfg.reward_type == this.championModel.infoData.seasonId && cfg.type == 4) {
                        return true;
                    }
                })
                //加入平台判断
                let tempCfgs = [];
                cfgs.forEach(c => {
                    if (Array.isArray(c.platform_id) && c.platform_id.indexOf(iclib.SdkTool.tool.config.platform_id) !== -1) {
                        tempCfgs.push(c);
                    }
                })
                if (tempCfgs.length <= 0) {
                    cfgs.forEach(c => {
                        if (!c.platform_id) {
                            tempCfgs.push(c);
                        }
                    })
                }
                cfgs = tempCfgs;
                let have = false
                if (cfgs.length > 0) {
                    for (let i = 0, n = cfgs.length; i < n; i++) {
                        let cfg = cfgs[i];
                        let endTime;
                        if (cfg.type == 3) {
                            endTime = new Date(`${cfg.close_time[0]}/${cfg.close_time[1]}/${cfg.close_time[2]} ${cfg.close_time[3]}:${cfg.close_time[4]}`).getTime();
                        } else if (cfg.type == 4) {
                            let time = roleModel.CrossOpenTime * 1000;
                            endTime = time + (cfg.close_time[2] * 24 * 60 * 60 + cfg.close_time[3] * 60 * 60 + cfg.close_time[4] * 60) * 1000;
                        }
                        if (curTime >= endTime && curTime <= endTime + 24 * 60 * 60 * 1000 * 2) {
                            have = true;
                            break;
                        }
                    }
                }
                if (have) {
                    this.endTime.string = gdk.i18n.t("i18n:ACTIVITY_TIME_TIP3");
                    this.rankRewardBtn.active = true;
                    this.lqBtn.active = !this.championModel.infoData.rankRewarded
                    this.ylqBtn.active = this.championModel.infoData.rankRewarded
                } else {
                    this.rankRewardBtn.active = false;
                }
            }

        }
        else {
            this.endTime.string = gdk.i18n.t("i18n:ACTIVITY_TIME_TIP3");
        }
    }

    //头像框按钮点击事件
    frameBtnClick(event: Event, index: string) {

        let tem = parseInt(index)
        let season = this.championModel.infoData.seasonId
        let temCfg = ConfigManager.getItemByField(Champion_divisionCfg, 'division', tem)
        let cfg = ConfigManager.getItem(Champion_dropCfg, { 'season': season, 'lv': temCfg.lv })
        let itemInfo = {
            series: null,
            itemId: cfg.drop_rank[1][0],
            itemNum: 1,
            type: BagUtils.getItemTypeById(cfg.drop_rank[1][0]),
            extInfo: null,
        }
        GlobalUtil.openItemTips(itemInfo, true, false);
    }


    //领取段位排行奖励
    rankRewardBtnClick() {
        if (!this.sendRank) {
            this.sendRank = true;
            NetManager.send(new icmsg.ChampionRankRewardsReq(), (rsp: icmsg.ChampionRankRewardsRsp) => {
                this.championModel.infoData.rankRewarded = true;
                GlobalUtil.openRewadrView(rsp.goodsList);
                this.lqBtn.active = !this.championModel.infoData.rankRewarded
                this.ylqBtn.active = this.championModel.infoData.rankRewarded
            }, this)
        }
    }

}
