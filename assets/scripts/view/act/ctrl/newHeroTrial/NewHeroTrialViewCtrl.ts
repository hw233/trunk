import ActUtil from '../../util/ActUtil';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import HeroDetailViewCtrl from '../../../lottery/ctrl/HeroDetailViewCtrl';
import InstanceModel from '../../../instance/model/InstanceModel';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import StringUtils from '../../../../common/utils/StringUtils';
import TimerUtils from '../../../../common/utils/TimerUtils';
import {
    ActivityCfg,
    HeroCfg,
    Newordeal_ordealCfg,
    Newordeal_rankingCfg
    } from '../../../../a/config';
import { ActivityEventId } from '../../enum/ActivityEventId';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';
import { RedPointEvent } from '../../../../common/utils/RedPointUtils';

/** 
 * @Description: 英雄试炼入口
 * @Author: yaozu.hu
 * @Date: 2020-10-21 14:50:32
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-05-17 10:08:02
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/newHeroTrial/NewHeroTrialViewCtrl")
export default class NewHeroTrialViewCtrl extends gdk.BasePanel {

    @property(cc.Label)
    timeLabel: cc.Label = null;

    @property(cc.Label)
    hurtLb: cc.Label = null;
    @property(cc.Label)
    rankLb: cc.Label = null;
    @property(cc.Node)
    rankLayout: cc.Node = null;
    @property(cc.Prefab)
    rewardItem: cc.Prefab = null;
    @property(sp.Skeleton)
    heroSpine1: sp.Skeleton = null;
    @property(sp.Skeleton)
    heroSpine2: sp.Skeleton = null;
    // @property(cc.Node)
    // activityLayout: cc.Node = null;
    // @property(cc.Label)
    // attacckNum: cc.Label = null;
    @property(cc.Node)
    redNode: cc.Node = null;
    @property(sp.Skeleton)
    spine1: sp.Skeleton = null;
    @property(sp.Skeleton)
    spine2: sp.Skeleton = null;

    @property(cc.Sprite)
    titleSp: cc.Sprite = null;
    @property(cc.Sprite)
    bgSp: cc.Sprite = null;

    activityId: number = 70;
    cfg: ActivityCfg;
    actRewardType: number = 1;
    ordealCfg: Newordeal_ordealCfg;

    model: InstanceModel = ModelManager.get(InstanceModel);
    allAttackNum: number = 0;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;
    @property(cc.Node)
    content: cc.Node = null;
    @property(cc.Prefab)
    itemPre: cc.Prefab = null;
    @property(cc.Node)
    jinduSp: cc.Node = null;
    @property(cc.Label)
    jinduLb: cc.Label = null;

    ordealCfgList: Newordeal_ordealCfg[] = []
    datas: icmsg.NewOrdealRankListRsp;
    list: ListView;
    curDay: number = 1;
    serverNum: number = 1;

    onEnable() {

        let temStartTime = ActUtil.getActStartTime(this.activityId)
        let temEndTime = ActUtil.getActEndTime(this.activityId) - 5000
        let startTime = new Date(temStartTime);
        let endTime = new Date(temEndTime);//time为零点,减去5s 返回前一天
        //gdk.e.on(ActivityEventId.ACTIVITY_HEROTRIAL_DAMAGEREWARD_UPDATE, this.refreshRed, this)
        if (!startTime || !endTime) {
            this.timeLabel.string = gdk.i18n.t("i18n:ACTIVITY_TIME_TIP1")//`活动已过期`;
            gdk.e.emit(ActivityEventId.ACTIVITY_TIME_IS_OVER);
            this.close();
            return;
        }
        else {
            this.timeLabel.string = gdk.i18n.t("i18n:ACTIVITY_TIME_TIP2") + `${startTime.getFullYear()}.${startTime.getMonth() + 1}.${startTime.getDate()}-${endTime.getFullYear()}.${endTime.getMonth() + 1}.${endTime.getDate()}`;
            this.cfg = ActUtil.getCfgByActId(this.activityId);
            this.actRewardType = ActUtil.getActRewardType(this.activityId)
            let temCfg = ConfigManager.getItem(Newordeal_ordealCfg, (item: Newordeal_ordealCfg) => {
                if (item.activity_id == this.cfg.id && item.type == this.actRewardType) {
                    return true;
                }
            })

            let name = temCfg.effects
            let url = `spine/ui/${name}/${name}`
            GlobalUtil.setSpineData(this.node, this.spine1, url, true, 'stand', true);
            this.spine2.node.active = false;;
            if (name == 'UI_yingxiongshilian_huo') {
                this.spine2.node.active = true;
                let url = `spine/ui/${name}/${name}`
                GlobalUtil.setSpineData(this.node, this.spine2, url, true, 'stand2', true);
            }

            let path1 = '/view/act/texture/heroTrial/' + temCfg.advertising
            let path2 = '/view/act/texture/bg/' + temCfg.background
            GlobalUtil.setSpriteIcon(this.node, this.titleSp, path1);
            GlobalUtil.setSpriteIcon(this.node, this.bgSp, path2);

            let curTime = GlobalUtil.getServerTime();
            let temDay = Math.floor(((curTime - temStartTime) / 1000) / 86400) + 1
            this.curDay = temDay > 5 ? 5 : temDay;
        }

        NetManager.send(new icmsg.NewOrdealInfoReq(), (rsp: icmsg.NewOrdealInfoRsp) => {
            this.model.newHeroTrialInfo = rsp;
            let stageId = this.model.newHeroTrialInfo.maxStageId > 0 ? this.model.newHeroTrialInfo.maxStageId : 0;
            let cfgs = ConfigManager.getItems(Newordeal_ordealCfg, (item: Newordeal_ordealCfg) => {
                if (item.activity_id == this.cfg.id && item.type == this.actRewardType) {
                    return true;
                }
            })
            this.ordealCfgList = cfgs;
            if (cfgs[cfgs.length - 2].round == stageId) {
                this.ordealCfg = cfgs[cfgs.length - 1]
            } else if (stageId == 0) {
                this.ordealCfg = ConfigManager.getItem(Newordeal_ordealCfg, (item: Newordeal_ordealCfg) => {
                    if (item.activity_id == this.cfg.id && item.type == this.actRewardType && item.round > stageId) {
                        return true;
                    }
                })
            } else {
                this.ordealCfg = ConfigManager.getItem(Newordeal_ordealCfg, (item: Newordeal_ordealCfg) => {
                    if (item.activity_id == this.cfg.id && item.type == this.actRewardType && item.round > stageId) {
                        return true;
                    }
                })
                if (this.curDay < this.ordealCfg.quality) {
                    this.ordealCfg = ConfigManager.getItemByField(Newordeal_ordealCfg, 'round', stageId);
                }
            }
            if (!this.ordealCfg) {
                //cc.log('数据配置有问题:' + this.cfg.reward_type + '------->' + stageId);
                this.close();;
            }
            // let stageCfg = ConfigManager.getItemById(Copy_stageCfg, this.ordealCfg.round)
            // let copyCfg = ConfigManager.getItemByField(CopyCfg, 'copy_id', stageCfg.copy_id, { 'subtype': stageCfg.subtype })
            // this.allAttackNum = copyCfg.times;
            this.updateInfoData();
            //显示排行榜内容
            this.showRankInfo()
        }, this);


    }

    showRankInfo() {
        NetManager.send(new icmsg.NewOrdealRankListReq(), (rsp: icmsg.NewOrdealRankListRsp) => {
            this.datas = rsp;
            this.serverNum = rsp.serverNum
            //刷新排名信息
            this._updateView()

        }, this);
    }

    onDisable() {
        if (this.list) {
            this.list.destroy();
            this.list = null;
        }
        gdk.Timer.clearAll(this);
        NetManager.targetOff(this);
        //gdk.e.off(ActivityEventId.ACTIVITY_HEROTRIAL_DAMAGEREWARD_UPDATE, this.refreshRed, this)
    }

    _initListView() {
        if (!this.list) {
            this.list = new ListView({
                scrollview: this.scrollView,
                mask: this.scrollView.node,
                content: this.content,
                item_tpl: this.itemPre,
                cb_host: this,
                gap_y: 10,
                async: true,
                direction: ListViewDir.Vertical,
            })
        }
    }
    _updateView(resetPos: boolean = true) {
        this._initListView();
        let infos = this.datas.list;
        infos.sort((a, b) => {
            let temA = 0
            a.value.forEach(num => {
                temA += num
            })
            let temB = 0
            b.value.forEach(num => {
                temB += num
            })
            return temB - temA;
        });
        let data = [];

        let cfgs = ConfigManager.getItems(Newordeal_rankingCfg, (item: Newordeal_rankingCfg) => {
            if (item.activity_id == this.ordealCfg.activity_id && item.type == this.ordealCfg.type && item.server == this.serverNum) {
                return true;
            }
        })

        infos.forEach((info, idx) => {
            let temRankCfg;
            cfgs.forEach(cfg => {
                if (idx + 1 >= cfg.rank[0] && idx + 1 <= cfg.rank[1]) {
                    temRankCfg = cfg;
                }
            })
            let obj = {
                brief: info.brief,
                value: info.value,
                rank: idx + 1,
                rankCfg: temRankCfg
            };
            data.push(obj);
        });
        this.list.clear_items();
        this.list.set_data(data, resetPos);
    }

    updateInfoData() {
        let tem = this.model.newHeroTrialInfo.stageDamages;
        let value = 0;//tem[tem.length - 1]//this.model.heroTrialInfo.damage
        tem.forEach(dmg => {
            value += dmg;
        })
        this.hurtLb.string = value > 10000 ? (value / 10000).toFixed(1) + gdk.i18n.t("i18n:HEROTRIAL_RANK_TIP1") : value + '';//this.model.heroTrialInfo.damage + '';//GlobalUtil.numberToStr(this.model.heroTrialInfo.damage, true);
        let rankNum = this.model.newHeroTrialInfo.rankNum;
        this.rankLb.string = rankNum > 0 ? rankNum + '' : gdk.i18n.t("i18n:HEROTRIAL_RANK_TIP2");


        let stageId = this.model.newHeroTrialInfo.maxStageId > 0 ? this.model.newHeroTrialInfo.maxStageId : 0;
        if (stageId == 0) {
            this.jinduLb.string = 0 + '/' + (this.ordealCfgList.length - 1)
            this.jinduSp.width = 0
        } else {

            let length = this.ordealCfgList.length
            if (this.ordealCfgList[length - 2].round == stageId) {
                this.jinduLb.string = (length - 1) + '/' + (length - 1)
                this.jinduSp.width = 158
            } else {
                let curIndex = 0;
                this.ordealCfgList.forEach((cfg, index) => {
                    if (cfg.round == stageId) {
                        curIndex = index;
                    }
                })
                this.jinduLb.string = (curIndex + 1) + '/' + (length - 1)
                this.jinduSp.width = 158 * ((curIndex + 1) * 25 / 100)
            }
        }

        //设置英雄spine;
        let heroStrs = this.ordealCfg.theme_hero.split('|')
        let heroSpines = []
        if (heroStrs.length == 2) {
            heroSpines = [this.heroSpine1, this.heroSpine2]
        }
        for (let i = 0; i < heroStrs.length; i++) {
            let heroId = Number(heroStrs[i].split(';')[0]);
            let heroCfg = ConfigManager.getItemById(HeroCfg, heroId)
            let url: string = StringUtils.format("spine/hero/{0}/1/{0}", heroCfg.skin);
            GlobalUtil.setSpineData(this.node, heroSpines[i], url, true, 'stand', true);
        }


        //刷新红点
        this.refreshRed();

    }

    refreshRed() {
        let have = false;
        //let tem = this.model.heroTrialInfo.stageDamages;
        //let myDamage = tem[tem.length - 1]//this.model.heroTrialInfo.damage
        // this.model.heroTrialInfo.rewardTimes.forEach(data => {
        //     if (myDamage >= data.damage && data.times > 0 && this.model.heroTrialInfo.rewardRecord.indexOf(data.damage) < 0) {
        //         have = true;
        //     }
        // })
        if (!this.model.ClickNewHeroTrialEndless) {
            have = true;
        }
        this.redNode.active = have;
    }

    //打开排行榜
    openRankClick() {
        //cc.log('打开排行榜按钮')
        gdk.panel.setArgs(PanelId.NewHeroTrialRankView, this.ordealCfg);
        gdk.panel.open(PanelId.NewHeroTrialRankView);
    }

    // //进入活动按钮
    // enterActivityBtnClick() {
    //     if (this.ordealCfg) {
    //         gdk.panel.hide(PanelId.ActivityMainView);
    //         gdk.panel.setArgs(PanelId.NewHeroTrialMonsterView, this.ordealCfg)
    //         gdk.panel.open(PanelId.NewHeroTrialMonsterView)
    //     }
    // }

    //进入关卡界面
    stageAttackBtnClick(e: any, idx: string) {
        let index = parseInt(idx);
        let temcfg = this.ordealCfg;
        if (index == 0) {
            //无尽模式
            if (!this.model.ClickNewHeroTrialEndless) {
                this.model.ClickNewHeroTrialEndless = true;
                gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE);
                this.refreshRed()
            }
            temcfg = this.ordealCfgList[this.ordealCfgList.length - 1]
            gdk.panel.setArgs(PanelId.HeroTrialSetUpHeroSelector, temcfg);
            gdk.panel.open(PanelId.HeroTrialSetUpHeroSelector);
        } else {
            //关卡模式
            let lastCfg = this.ordealCfgList[this.ordealCfgList.length - 2]
            //判断当前关卡是否可以进入
            if (lastCfg.round == this.model.newHeroTrialInfo.maxStageId) {
                gdk.gui.showMessage(gdk.i18n.t("i18n:HEROTRIAL_TIP10"))
                return;
            }
            if (this.ordealCfg.round == this.model.newHeroTrialInfo.maxStageId) {
                let temTime = ActUtil.getActStartTime(this.activityId) / 1000 + this.curDay * 86400
                let curTime = GlobalUtil.getServerTime() / 1000;
                let time = TimerUtils.format5(temTime - curTime)
                gdk.gui.showMessage(time + gdk.i18n.t("i18n:HEROTRIAL_TIP9"))
                //gdk.gui.showMessage(gdk.i18n.t("i18n:HEROTRIAL_TIP2"))
                return;
            }
            if (this.ordealCfg) {
                gdk.panel.setArgs(PanelId.HeroTrialSetUpHeroSelector, this.ordealCfg);
                gdk.panel.open(PanelId.HeroTrialSetUpHeroSelector);
            }
        }
    }


    //打开关卡奖励界面
    openStageRewardView() {
        gdk.panel.setArgs(PanelId.NewHeroTrialStageRewardView, this.ordealCfg);
        gdk.panel.open(PanelId.NewHeroTrialStageRewardView);

    }

    openHeroDetail(event: any, num: string) {
        let heroCfg: HeroCfg;
        let heroStrs = this.ordealCfg.theme_hero.split('|')
        if (num == "1") {
            let heroId = heroStrs[0].split(';')[0]
            heroCfg = ConfigManager.getItemById(HeroCfg, heroId);
        } else {
            let heroId = heroStrs[1].split(';')[0]
            heroCfg = ConfigManager.getItemById(HeroCfg, heroId);
        }
        gdk.panel.open(PanelId.HeroDetail, (node: cc.Node) => {
            let comp = node.getComponent(HeroDetailViewCtrl)
            comp.initHeroInfo(heroCfg)
        })
    }


}
