import { GlobalCfg, HeroCfg, Hero_globalCfg, Hero_starCfg } from '../../../a/config';
import ConfigManager from '../../../common/managers/ConfigManager';
import NetManager from '../../../common/managers/NetManager';
import BagUtils from '../../../common/utils/BagUtils';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import HeroUtils from '../../../common/utils/HeroUtils';
import { AskInfoType } from '../../../common/widgets/AskPanel';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';
import PanelId from '../../../configs/ids/PanelId';
import ActUtil from '../../act/util/ActUtil';

/**
 * 英雄回退
 * @Author: yaozu.hu
 * @Date: 2021-05-25 13:38:32
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-05-26 14:48:12
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('qszc/view/lottery/HeroGoBackViewCtrl')
export default class HeroGoBackViewCtrl extends gdk.BasePanel {

    @property(cc.Node)
    addNode: cc.Node = null;

    @property(cc.Node)
    heroNode: cc.Node = null;

    @property(sp.Skeleton)
    idleSp: sp.Skeleton = null;

    @property(sp.Skeleton)
    summonSp: sp.Skeleton = null;

    @property(cc.ScrollView)
    backScrollView: cc.ScrollView = null;

    @property(cc.Node)
    backContent: cc.Node = null;

    @property(cc.Prefab)
    backPrefab: cc.Prefab = null;

    @property(cc.Node)
    costIcon: cc.Node = null;
    @property(cc.Label)
    costLb: cc.Label = null;

    @property(cc.Label)
    timesLb: cc.Label = null;

    @property(cc.Label)
    tip2Lb: cc.Label = null;

    idleSpUrl: string[] = ['spine/ui/UI_jiyinzhaohuandaijihong/UI_jiyinzhaohuandaijihong'];
    summonSpUrl: string[] = ['spine/ui/UI_yingxionghuitui/UI_yingxionghuitui'];

    heroData: icmsg.HeroInfo;
    list: ListView;

    needNum: number = 0;
    curNum: number = 0;
    actId: number = 109;
    itemId: number = 130115;
    onEnable() {

        if (!ActUtil.ifActOpen(this.actId)) {
            this.close();
            return;
        }
        this.itemId = ConfigManager.getItemByField(Hero_globalCfg, 'key', 'fallback_item').value[0]
        let startTime = new Date(ActUtil.getActStartTime(this.actId));
        let endTime = new Date(ActUtil.getActEndTime(this.actId) - 5000); //time为零点,减去5s 返回前一天
        if (!startTime || !endTime) {
            this.timesLb.string = gdk.i18n.t("i18n:ACTIVITY_TIME_TIP1");
            return;
        }
        else {
            this.timesLb.string = `活动时间:${startTime.getFullYear()}.${startTime.getMonth() + 1}.${startTime.getDate()}-${endTime.getFullYear()}.${endTime.getMonth() + 1}.${endTime.getDate()}`;
        }

        //筛选出6-11星英雄
        let temCfg = ConfigManager.getItemByField(GlobalCfg, 'key', 'fallback')
        this.tip2Lb.string = `${temCfg.value[0]}星~${temCfg.value[1]}星的英雄可回退至`

        GlobalUtil.setSpriteIcon(this.node, this.costIcon, GlobalUtil.getIconById(this.itemId));
        this.addNode.active = true;
        this._updateSpine();
        NetManager.on(icmsg.HeroFallbackRsp.MsgType, this._onHeroFallbackRsp, this);
        this.costLb.node.active = false;
        this.refreshHeroData()
    }

    onDisable() {
        NetManager.targetOff(this)
        if (this.list) {
            this.list.destroy()
            this.list = null;
        }
    }

    _updateSpine() {
        this.summonSp.node.active = false;
        this.summonSp.setCompleteListener(null);
        GlobalUtil.setSpineData(this.node, this.summonSp, null);
        this.idleSp.node.active = false;
        //GlobalUtil.setSpineData(this.node, this.idleSp, this.idleSpUrl[0], true, 'stand', true);
    }

    refreshHeroData() {

        if (this.heroData) {
            this.addNode.active = false;
            this.heroNode.active = true;
            let typeId = this.heroData.typeId;
            let heroCfg = ConfigManager.getItemById(HeroCfg, typeId);
            let heroSpine = this.heroNode.getChildByName('spine').getComponent(sp.Skeleton);
            HeroUtils.setSpineData(this.node, heroSpine, heroCfg.skin, true, false);

            let cfg = ConfigManager.getItemByField(Hero_starCfg, 'star', this.heroData.star);
            //let itemId = 0;

            if (cfg.fallback.length == 2) {
                this.needNum = cfg.fallback[1];
                this.curNum = BagUtils.getItemNumById(cfg.fallback[0]);
                if (!this.curNum) {
                    this.curNum = 0
                }
            } else {
                this.needNum = 0;
                this.curNum = 0;
            }
            this.costLb.node.active = this.needNum > 0;
            this.costLb.node.color = this.needNum > this.curNum ? cc.color('#FF0000') : cc.color('#FFFFFF')
            this.costLb.string = this.needNum + ''
            //获取回退预览
            let msg = new icmsg.HeroFallbackReq()
            msg.heroId = this.heroData.heroId;
            msg.preview = true;
            NetManager.send(msg)
        } else {
            this.addNode.active = true;
            this.heroNode.active = false;
            this.costLb.node.active = false;
            this._updateViewData([])
        }
        // GlobalUtil.setSpineData(this.node, this.idleSp, null);
        // this.idleSp.node.active = false;
        // this.summonSp.node.active = true;
        // this.summonSp.setCompleteListener(() => {
        //     this._updateSpine();
        // });
        // GlobalUtil.setSpineData(this.node, this.summonSp, this.summonSpUrl[0], true, 'stand', true);
    }


    _initListView() {
        if (this.list) {
            return
        }
        this.list = new ListView({
            scrollview: this.backScrollView,
            mask: this.backScrollView.node,
            content: this.backContent,
            item_tpl: this.backPrefab,
            cb_host: this,
            async: true,
            column: 5,
            gap_y: 5,
            direction: ListViewDir.Vertical,
        })
        //this.list.onClick.on(this._selectItem, this)
    }

    _onHeroFallbackRsp(rsp: icmsg.HeroFallbackRsp) {
        if (rsp.preview) {
            //展示预览
            this._updateViewData(rsp.list)
        } else {
            GlobalUtil.openRewadrView(rsp.list)
            //清空预览
            HeroUtils.updateHeroInfo(rsp.info.heroId, rsp.info, true)
            this.heroData = null;
            this.refreshHeroData()
            //this._updateViewData([])
        }
    }

    _updateViewData(list: icmsg.GoodsInfo[]) {
        this._initListView()
        let newList = []
        list = GlobalUtil.sortGoodsInfo(list)
        this.list.set_data(newList.concat(GlobalUtil.getEffectItemList(list, false, true, false, false)), true)
        //this.list.set_data(newList, true)
    }

    AddBtnClick() {
        gdk.panel.open(PanelId.HeroGoBackHeroListView);
    }

    spineBtnClick() {
        gdk.panel.setArgs(PanelId.HeroGoBackHeroListView, this.heroData)
        gdk.panel.open(PanelId.HeroGoBackHeroListView);
    }

    GoBackBtnClick() {

        //判断消耗的道具是否足够
        if (this.needNum > this.curNum) {
            // let itemCcfg = ConfigManager.getItemById(ItemCfg, 130115)
            // gdk.gui.showMessage(`${itemCcfg.name}数量不足`)
            GlobalUtil.openGainWayTips(this.itemId);
            return;
        }

        if (!this.heroData) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:HERO_GOBACK_TIP1"))
            return;
        }

        let askInfo: AskInfoType = {
            sureCb: () => {
                this.summonSp.node.active = true
                this.summonSp.setCompleteListener(() => {
                    this._updateSpine();
                    let msg = new icmsg.HeroFallbackReq()
                    msg.heroId = this.heroData.heroId
                    msg.preview = false
                    NetManager.send(msg)
                });
                GlobalUtil.setSpineData(this.node, this.summonSp, this.summonSpUrl[0], true, 'stand', true);
            },
            descText: gdk.i18n.t("i18n:HERO_GOBACK_TIP2"),
            thisArg: this,
        }
        GlobalUtil.openAskPanel(askInfo)
    }


}
