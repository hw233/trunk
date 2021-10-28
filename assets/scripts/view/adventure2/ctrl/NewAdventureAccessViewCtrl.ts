import ActUtil from '../../act/util/ActUtil';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import HeroDetailViewCtrl from '../../lottery/ctrl/HeroDetailViewCtrl';
import HeroUtils from '../../../common/utils/HeroUtils';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import NewAdventureModel from '../model/NewAdventureModel';
import NewAdventureUtils from '../utils/NewAdventureUtils';
import PanelId from '../../../configs/ids/PanelId';
import TimerUtils from '../../../common/utils/TimerUtils';
import { ActivityEventId } from '../../act/enum/ActivityEventId';
import {
    Adventure_themeheroCfg,
    Adventure2_rankingCfg,
    Adventure2_themeheroCfg,
    HeroCfg
    } from '../../../a/config';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-11-09 18:28:24 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/adventure/NewAdventureAccessViewCtrl")
export default class NewAdventureAccessViewCtrl extends gdk.BasePanel {

    @property(cc.Label)
    timeLab: cc.Label = null;

    @property(cc.Node)
    lvFrame: cc.Node = null;

    @property(sp.Skeleton)
    frameSp: sp.Skeleton = null;

    @property([cc.Node])
    herosNode: cc.Node[] = [];

    // @property(cc.ScrollView)
    // scrollView: cc.ScrollView = null;

    // @property(cc.Node)
    // content: cc.Node = null;

    // @property(cc.Prefab)
    // slotPrefab: cc.Prefab = null;

    // @property(cc.Node)
    // lvTips: cc.Node = null;

    @property(cc.Label)
    pointLb: cc.Label = null;
    @property(cc.Label)
    rankLb: cc.Label = null;
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
    @property(cc.Node)
    rankRed: cc.Node = null;

    datas: icmsg.Adventure2RankListRsp;
    list: ListView;
    curDay: number = 1;
    serverNum: number = 1;

    get adModel(): NewAdventureModel { return ModelManager.get(NewAdventureModel); }
    frameSpUrl = ['spine/ui/UI_adv_access_red/UI_huodongrukouhong', 'spine/ui/UI_adv_access_blue/UI_huodongrukoulan', 'spine/ui/UI_adv_access_green/UI_huodongrukoulv']
    actId: number = 107;
    actType: number = 1;
    nextUnlockCfg: Adventure2_themeheroCfg;
    _nextLvTime: number;
    themeheroCfgs: Adventure2_themeheroCfg[]

    get nextLvTime() { return this._nextLvTime; }
    set nextLvTime(v: number) {
        if (!v && v !== 0) {
            return;
        }
        this._nextLvTime = Math.max(0, v);
        if (this._nextLvTime == 0) {
            this._updateNextLvTips();
        }
        else {
            // this.lvTips.active = false;
            // let timeLab = this.lvTips.getChildByName('lockLab').getComponent(cc.Label);
            // let lvLab = this.lvTips.getChildByName('levelLab').getComponent(cc.Label);
            // timeLab.string = TimerUtils.format1(this._nextLvTime / 1000) + `${gdk.i18n.t("i18n:ADVENTURE_TIP1")}`;
            // lvLab.string = this.nextUnlockCfg.difficulty_name;
        }
    }

    onEnable() {
        let cfg = ActUtil.getCfgByActId(this.actId);
        if (!cfg) {
            this.timeLab.string = `${gdk.i18n.t("i18n:ADVENTURE_TIP2")}`;
            gdk.e.emit(ActivityEventId.ACTIVITY_TIME_IS_OVER);
        }
        else {
            this.actType = ActUtil.getActRewardType(this.actId);
            let startTime = new Date(ActUtil.getActStartTime(this.actId));
            let endTime = new Date(ActUtil.getActEndTime(this.actId) - 5000); //time为零点,减去5s 返回前一天
            this.timeLab.string = `${gdk.i18n.t("i18n:ADVENTURE_TIP3")}${startTime.getFullYear()}.${startTime.getMonth() + 1}.${startTime.getDate()}-${endTime.getFullYear()}.${endTime.getMonth() + 1}.${endTime.getDate()}`;
            let msg = new icmsg.Adventure2StateReq()
            NetManager.send(msg, (rsp: icmsg.Adventure2StateRsp) => {
                let state = rsp.normal
                this.adModel.difficultyRewarded = rsp.rewarded;
                this.adModel.difficulty = state.difficulty//state.difficulty > 0 ? state.difficulty : 1;

                //state.plateFinish ? state.difficulty : state.difficulty - 1;
                this.adModel.normal_layerId = rsp.normal.layerId
                this.adModel.normal_plateIndex = rsp.normal.plateIndex
                this.adModel.normal_plateFinish = rsp.normal.plateFinish
                this.adModel.normalState = rsp.normal;
                this.adModel.normal_blood = rsp.normal.blood
                this.adModel.endless_lastPlate = rsp.endLess.lastPlate
                this.adModel.endless_layerId = rsp.endLess.layerId
                this.adModel.endless_plateIndex = rsp.endLess.plateIndex
                this.adModel.endless_plateFinish = rsp.endLess.plateFinish
                this.adModel.endLessState = rsp.endLess;
                this.adModel.endless_blood = rsp.endLess.blood
                this.adModel.endless_lastPlate = rsp.endLess.lastPlate
                let temDifficulty = Math.max(0, state.difficulty - 1)
                if (NewAdventureUtils.isLayerPass(state.difficulty)) {
                    temDifficulty = state.difficulty
                }
                this._updateView();
                //显示排行榜内容
                this.showRankInfo()
                if (temDifficulty == 0) {
                    this.jinduLb.string = 0 + '/3'
                    this.jinduSp.width = 0
                } else {
                    this.jinduLb.string = temDifficulty + '/3'
                    this.jinduSp.width = 158 * (temDifficulty) / 3
                }
            })
            NetManager.send(new icmsg.StorePushListReq());;
            this.themeheroCfgs = ConfigManager.getItemsByField(Adventure2_themeheroCfg, 'type', this.actType);
        }
    }

    onDisable() {
    }

    onGoBtnClick() {
        let cfg = ActUtil.getCfgByActId(this.actId);
        if (!cfg) {
            this.timeLab.string = `${gdk.i18n.t("i18n:ADVENTURE_TIP2")}`;
            gdk.e.emit(ActivityEventId.ACTIVITY_TIME_IS_OVER);
            return;
        }
        gdk.panel.hide(PanelId.ActivityMainView);
        gdk.panel.open(PanelId.AdventureMainView);
    }

    //打开排行榜
    openRankClick() {
        //cc.log('打开排行榜按钮')
        // gdk.panel.setArgs(PanelId.NewHeroTrialRankView, this.ordealCfg);
        gdk.panel.open(PanelId.AdventureRankView2);
    }

    //打开关卡奖励界面
    openStageRewardView() {
        // gdk.panel.setArgs(PanelId.NewHeroTrialStageRewardView, this.ordealCfg);
        // gdk.panel.open(PanelId.NewHeroTrialStageRewardView);
        gdk.panel.open(PanelId.NewAdventureStageRewardView)
    }

    //进入关卡界面
    stageAttackBtnClick(e: any, idx: string) {
        let index = parseInt(idx);
        if (index == 0) {
            //无尽模式
            //判断无尽模式是否开启
            let cfg = ConfigManager.getItemByField(Adventure2_themeheroCfg, 'type', this.actType, { difficulty: 4 });
            let startTime = ActUtil.getActStartTime(this.actId);
            let curTime = GlobalUtil.getServerTime();
            let time = cfg.unlocktime;
            let unLockTime = startTime + (time[2] * 24 * 60 * 60 + time[3] * 60 * 60 + time[4] * 60) * 1000;
            if (unLockTime > curTime) {
                let s = TimerUtils.format4((unLockTime - curTime) / 1000)
                gdk.gui.showMessage('无尽模式' + s + "后解锁")
                return;
            }

            gdk.panel.hide(PanelId.ActivityMainView);
            gdk.panel.open(PanelId.NewAdventureMainView);
        } else {
            //普通模式
            gdk.panel.hide(PanelId.ActivityMainView);
            gdk.panel.open(PanelId.AdventureMainView2);
        }
    }


    _dtime: number = 0;
    update(dt: number) {
        if (!this._nextLvTime && !this.nextUnlockCfg) {
            return;
        }
        if (this._dtime >= 1) {
            this._dtime = 0;
            this._updateNextLvTips();
        }
        else {
            this._dtime += dt;
        }
    }

    showRankInfo() {
        NetManager.send(new icmsg.Adventure2RankListReq(), (rsp: icmsg.Adventure2RankListRsp) => {
            this.datas = rsp;
            this.serverNum = rsp.serverNum
            //刷新排名信息
            this._updateRankView()

        }, this);
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
    _updateRankView(resetPos: boolean = true) {
        this._initListView();
        let infos = this.datas.list;

        this.pointLb.string = (this.datas.layerId > 0 || this.datas.plateIndex > 0) ? this.datas.layerId + '-' + this.datas.plateIndex : '暂无进度';
        this.rankLb.string = this.datas.ranking > 0 ? this.datas.ranking + '' : '暂无排名';

        let data = [];
        let actType = ActUtil.getActRewardType(this.actId);
        let cfgs = ConfigManager.getItems(Adventure2_rankingCfg, (item: Adventure2_rankingCfg) => {
            if (item.activity_id == this.actId && item.type == actType && item.server == this.serverNum) {
                return true;
            }
        })

        let length = infos.length
        for (let i = 0; i < 10; i++) {
            let temRankCfg;
            cfgs.forEach(cfg => {
                if (i + 1 <= cfg.rank && !temRankCfg) {
                    temRankCfg = cfg;
                }
            })
            let obj;
            if (i < length) {
                let info = infos[i]
                obj = {
                    brief: info.brief,
                    value: info.layerId + '-' + info.plateIndex,
                    rank: i + 1,
                    rankCfg: temRankCfg
                };
            } else {
                obj = {
                    brief: null,
                    value: '暂无进度',
                    rank: i + 1,
                    rankCfg: temRankCfg
                };
            }
            data.push(obj);
        }

        this.list.clear_items();

        this.list.set_data(data, resetPos);
    }


    //@gdk.binding('adModel.difficulty')
    _updateView() {
        let actCfg = ActUtil.getCfgByActId(this.actId);
        if (!actCfg) {
            this.timeLab.string = `${gdk.i18n.t("i18n:ADVENTURE_TIP2")}`;
            gdk.e.emit(ActivityEventId.ACTIVITY_TIME_IS_OVER);
        }
        else {
            let curLvCfg = ConfigManager.getItemByField(Adventure_themeheroCfg, 'type', this.actType, { difficulty: this.adModel.difficulty });
            GlobalUtil.setSpriteIcon(this.node, this.lvFrame, `view/adventure/texture/bg/qjtx_taiziyanse01`);
            GlobalUtil.setSpineData(this.node, this.frameSp, this.frameSpUrl[0], true, 'stand', true, false);
            //hero
            let heroStrs = curLvCfg.theme_hero.split('|');
            this.herosNode.forEach((node, idx) => {
                let str = heroStrs[idx];
                if (str) {
                    node.active = true;
                    let id = str.split(';')[0];
                    let spine = node.getChildByName('spine').getComponent(sp.Skeleton);
                    // let desc = node.getChildByName('desc').getComponent(cc.RichText);
                    let previewBtn = node.getChildByName('yulan').getComponent(cc.Button);
                    let heroCfg = ConfigManager.getItemById(HeroCfg, parseInt(id));
                    HeroUtils.setSpineData(this.node, spine, heroCfg.skin, true, false);
                    // desc.string = str.split(';')[1];
                    previewBtn.clickEvents = [];
                    let e = new cc.Component.EventHandler();
                    e.component = 'NewAdventureAccessViewCtrl';
                    e.handler = 'showHero';
                    e.customEventData = id;
                    e.target = this.node;
                    previewBtn.clickEvents[0] = e;
                }
                else {
                    node.active = false;
                }
            });
            //nextLv
            this._updateNextLvTips();
        }
    }

    _updateNextLvTips() {
        let actCfg = ActUtil.getCfgByActId(this.actId);
        if (!actCfg) return;
        let cfgs = ConfigManager.getItemsByField(Adventure2_themeheroCfg, 'type', actCfg.reward_type);
        let startTime = ActUtil.getActStartTime(this.actId);
        let curTime = GlobalUtil.getServerTime();
        for (let i = 0; i < cfgs.length; i++) {
            let time = cfgs[i].unlocktime;
            let unLockTime = startTime + (time[2] * 24 * 60 * 60 + time[3] * 60 * 60 + time[4] * 60) * 1000;
            if (unLockTime > curTime) {
                this.nextUnlockCfg = cfgs[i];
                this.nextLvTime = unLockTime - curTime;
                return;
            }
        }
        this.nextUnlockCfg = null;
        this.nextLvTime = null;
        //this.lvTips.active = false;
    }

    showHero(e, id: string) {
        let heroCfg = ConfigManager.getItemById(HeroCfg, parseInt(id));
        gdk.panel.open(PanelId.HeroDetail, (node: cc.Node) => {
            let comp = node.getComponent(HeroDetailViewCtrl)
            comp.initHeroInfo(heroCfg)
        })
    }


    refreshRewardRed(): boolean {
        let res = false;
        let old = this.adModel.difficultyRewarded;
        for (let i = 0, n = this.themeheroCfgs.length; i < n - 1; i++) {
            let cfg = this.themeheroCfgs[i];
            let curDifficulty = this.adModel.difficulty;
            if (curDifficulty > cfg.difficulty ||
                (curDifficulty == cfg.difficulty && NewAdventureUtils.isLayerPass(curDifficulty))) {
                if (!((old & 1 << (cfg.difficulty - 1) % 8) >= 1)) {
                    res = true;
                }
            }
        }
        return res;
    }
}
