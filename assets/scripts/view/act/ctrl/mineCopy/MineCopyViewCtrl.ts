import ActUtil from '../../util/ActUtil';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import MineModel from '../../model/MineModel';
import MineUtil from '../../util/MineUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { Activitycave_mainCfg, Activitycave_stageCfg, HeroCfg } from '../../../../a/config';
import { ActivityEventId } from '../../enum/ActivityEventId';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';

/** 
 * @Description: 矿洞大作战View
 * @Author:yaozu.hu yaozu
 * @Date: 2020-08-04 11:29:25
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-12-22 11:33:50
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/mineCopy/MineCopyViewCtrl")
export default class MineCopyViewCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scroll: cc.ScrollView = null;
    @property(cc.Node)
    content: cc.Node = null;
    @property(cc.Prefab)
    copyPage: cc.Prefab = null;
    @property(cc.Prefab)
    heroItem: cc.Prefab = null;
    @property(cc.RichText)
    tansuoNum: cc.RichText = null;
    @property(cc.Node)
    heroList: cc.Node = null;

    @property(cc.Node)
    tfRed: cc.Node = null;
    @property(cc.Node)
    dhRed: cc.Node = null;
    @property(cc.Node)
    passRed: cc.Node = null;

    list: ListView;
    stageData: Activitycave_stageCfg[][] = [];
    listData: any[] = [];

    mineModel: MineModel;

    onEnable() {
        if (!ActUtil.ifActOpen(14)) {
            this.close()
            return;
        }
        this.mineModel = ModelManager.get(MineModel)
        this._initListView();
        let mainCfg = ConfigManager.getItemById(Activitycave_mainCfg, 1);
        this.heroList.removeAllChildren()
        mainCfg.hero.forEach(heroId => {
            let node = cc.instantiate(this.heroItem);
            let solt = node.getChildByName('UiSlotItem').getComponent(UiSlotItem);
            let cfg: HeroCfg = ConfigManager.getItemById(HeroCfg, heroId);
            let icon: string = `icon/hero/${cfg.icon}_s`;
            node.setParent(this.heroList);
            solt.updateItemIcon(icon);
            solt.updateQuality(cfg.defaultColor);

        })

        let msg1 = new icmsg.ActivityCaveStateReq()
        NetManager.send(msg1, (rsp: icmsg.ActivityCaveStateRsp) => {
            this.mineModel.curCaveSstate = rsp;
            this._initData();
            this.refreshExChangeRed();
            this.refreshGiftRed();
            this.refreshPaseRed();
        })
        if (!this.mineModel.passReward1) {
            let msg2 = new icmsg.ActivityCavePassListReq()
            NetManager.send(msg2, (rsp: icmsg.ActivityCavePassListRsp) => {
                this.mineModel.passBoight = rsp.bought;
                this.mineModel.passReward1 = rsp.rewarded1;
                this.mineModel.passReward2 = rsp.rewarded2;
                //刷新通行证红点
                this.refreshPaseRed();
            })
        } else {
            //刷新通行证红点
            this.refreshPaseRed();
        }

        gdk.e.on(ActivityEventId.ACTIVITY_MINE_TANSUOUPHERO, this.refreshTeamNum, this)
        gdk.e.on(ActivityEventId.ACTIVITY_MINE_PASS_REWARD, this.refreshPaseRed, this);
        gdk.e.on(ActivityEventId.ACTIVITY_MINE_EXCHANGE_REFRESH, this.refreshExChangeRed, this)
        gdk.e.on(ActivityEventId.ACTIVITY_MINE_GIFT_CHANGE, this.refreshGiftRed, this)
    }

    onDisable() {
        gdk.e.off(ActivityEventId.ACTIVITY_MINE_TANSUOUPHERO, this.refreshTeamNum, this)
        gdk.e.off(ActivityEventId.ACTIVITY_MINE_PASS_REWARD, this.refreshPaseRed, this)
        gdk.e.off(ActivityEventId.ACTIVITY_MINE_EXCHANGE_REFRESH, this.refreshExChangeRed, this)
        gdk.e.off(ActivityEventId.ACTIVITY_MINE_GIFT_CHANGE, this.refreshGiftRed, this)
    }
    onDestroy() {
        if (this.list != null) {
            this.list.destroy();
        }
    }

    refreshTeamNum() {
        let lastStage = this.mineModel.curCaveSstate.stageId;
        if (lastStage == 0) {
            this.tansuoNum.string = '(<color=#B9D430>0/0</c>)';
        } else {
            let nextCfg = ConfigManager.getItem(Activitycave_stageCfg, (item: Activitycave_stageCfg) => {
                if (item.id > lastStage) {
                    return true;
                }
                return false;
            })
            if (!nextCfg) {
                nextCfg = ConfigManager.getItemById(Activitycave_stageCfg, lastStage)
            }
            if (nextCfg) {
                let num = nextCfg.team + this.mineModel.curCaveSstate.buyTeam;//this.mineModel.curCaveSstate.team.length;
                let temNum = this.mineModel.curCaveSstate.team.length;
                this.tansuoNum.string = `(<color=#B9D430>${temNum}/${num}</c>)`//temNum + '/' + num;
            } else {
                this.tansuoNum.string = '(<color=#B9D430>0/0</c>)';//#B9D430
            }
        }
    }

    //刷新通行证红点信息
    refreshPaseRed() {
        if (this.passRed) {
            this.passRed.active = MineUtil.getHavePassReward();
        }
    }

    //刷新兑换按钮红点状态
    refreshExChangeRed() {
        if (this.dhRed) {
            this.dhRed.active = MineUtil.getHaveExChangeItem();
        }
    }
    //刷新兑换按钮红点状态
    refreshGiftRed() {
        if (this.tfRed) {
            this.tfRed.active = MineUtil.getCurGiftNum() > 0;
        }
    }

    _initListView() {
        if (this.list == null) {
            let opt = {
                scrollview: this.scroll,
                mask: this.scroll.node,
                content: this.content,
                item_tpl: this.copyPage,
                column: 1,
                width: 720,
                gap_x: 0,
                gap_y: 0,
                async: false,
                direction: ListViewDir.Vertical,
            };
            this.list = new ListView(opt);
        }
    }

    _initData() {

        let lastStage = this.mineModel.curCaveSstate.stageId;
        this.refreshTeamNum();
        for (let i = 1; i < 99; i++) {
            let cfgs = ConfigManager.getItems(Activitycave_stageCfg, (item: Activitycave_stageCfg) => {
                if (item.prize == i) {
                    return true;
                }
                return false;
            })
            if (cfgs.length == 0) {
                break;
            }
            this.stageData.push(cfgs);
        }
        let temNum = 0;
        if (this.stageData.length > 0) {
            //获取获得的开始时间
            let startTime = ActUtil.getActStartTime(14) / 1000;
            let curPrize = MineUtil.getCurStagePrizeClearance()
            for (let i = 0; i < this.stageData.length; i++) {
                //判断是否解锁(没有解锁显示剩余天数)
                let lockDay = this.stageData[i][0].date;
                let nowTime = Math.floor(GlobalUtil.getServerTime() / 1000)
                let resTime = startTime + lockDay * 24 * 60 * 60 - nowTime;
                let isLock = resTime > 0;
                let day = isLock ? Math.floor(resTime / (24 * 60 * 60)) : 0;
                let isMak = i == (this.stageData.length - 1)
                if (curPrize == this.stageData[i][0].prize) {
                    temNum = Math.min(this.stageData.length - 1, i + 1);
                }
                this.listData.push({ index: i, cfgs: this.stageData[i], curStageId: lastStage, islock: isLock, resDay: day, isMax: isMak });
            }
        }
        this.list.set_data(this.listData.reverse());
        this.list.scroll_to(this.listData.length - temNum - 1)


    }

    gyBtnClick() {
        gdk.panel.open(PanelId.MercenaryGetView)
    }
    tfBtnClick() {
        gdk.panel.open(PanelId.MineGiftView);
    }
    dhBtnClick() {
        gdk.panel.open(PanelId.MineExchangeView);
    }

    txzBtnClick() {
        gdk.panel.open(PanelId.MinePassPortView);
    }

}
