import ConfigManager from '../../../common/managers/ConfigManager';
import CopyModel, { CopyType } from '../../../common/models/CopyModel';
import CopyUtil from '../../../common/utils/CopyUtil';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import InstanceModel from '../../instance/model/InstanceModel';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import RankModel from '../model/RankModel';
import RoleModel from '../../../common/models/RoleModel';
import StoreModel from '../../store/model/StoreModel';
import StringUtils from '../../../common/utils/StringUtils';
import TrialInfo from '../../instance/trial/model/TrialInfo';
import UiTabMenuCtrl from '../../../common/widgets/UiTabMenuCtrl';
import VipFlagCtrl from '../../../common/widgets/VipFlagCtrl';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';
import { ParseMainLineId } from '../../instance/utils/InstanceUtil';
import { RankTypes } from '../enum/RankEvent';
import { SystemCfg } from '../../../a/config';


/** 
 * 排行界面
 * @Author: luoyong
 * @Description: 
 * @Date: 2019-07-17 14:04:00
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-05-31 20:33:18
 */
const { ccclass, property, menu } = cc._decorator;
export type RankInfo = {
    index: number,
    data: icmsg.RoleBrief,
    value: number,
    type: number,
    playerId: number
}


@ccclass
@menu("qszc/view/rank/RankViewCtrl")
export default class RankViewCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Label)
    typeLabel: cc.Label = null;

    @property(cc.Prefab)
    rankItem: cc.Prefab = null;

    @property(cc.Node)
    rankBg: cc.Node = null;

    @property(cc.Label)
    rank: cc.Label = null;

    @property(cc.Node)
    rankImg: cc.Node = null

    @property(cc.Label)
    lv: cc.Label = null;

    @property(cc.Label)
    playerName: cc.Label = null

    @property(cc.Node)
    headFrame: cc.Node = null

    @property(cc.Node)
    headImg: cc.Node = null

    @property(cc.Node)
    titleIcon: cc.Node = null

    @property(cc.Node)
    biao: cc.Node = null

    @property(cc.Node)
    cupIcon: cc.Node = null;

    @property(cc.Node)
    arrowUp: cc.Node = null

    @property(cc.Node)
    arrowDown: cc.Node = null

    @property(cc.Label)
    rankNum: cc.Label = null

    @property(cc.Node)
    powerNode: cc.Node = null;

    @property(cc.Label)
    power: cc.Label = null;

    @property(cc.Node)
    refine: cc.Node = null;
    @property(cc.Label)
    floor: cc.Label = null;

    @property(cc.Node)
    vipFlag: cc.Node = null

    @property(cc.RichText)
    tip: cc.RichText = null

    @property(UiTabMenuCtrl)
    tabMenu: UiTabMenuCtrl = null;

    infoList: RankInfo[] = null;
    cupCount: number = null;
    myRanksMap: any = {};

    curIndex = 0;
    list: ListView = null;

    // reqRecords: boolean[] = [];
    //model: RankModel;
    _rankYesterdayData: icmsg.RankYesterdayRsp = null;

    get model(): RankModel { return ModelManager.get(RankModel); }
    get roleModel(): RoleModel { return ModelManager.get(RoleModel); }
    get instanceModel(): InstanceModel { return ModelManager.get(InstanceModel); }
    get storeModel(): StoreModel { return ModelManager.get(StoreModel); }

    onLoad() {
        this.title = 'i18n:RANK_TITLE';
        this._initListView();

        this.curIndex = -1;
        this.selectType(null, RankTypes.Stage);
    }

    start() {
    }

    /**------------------排行榜改------------------------- */
    onEnable() {
        let args = gdk.panel.getArgs(PanelId.Rank);
        if (args) {
            let index = args[0];
            this.tabMenu.selectIdx = index;
            this.selectType(null, index);
        }
        this._initSelfInfo();
        NetManager.on(icmsg.RankDetailRsp.MsgType, this._onRankRsp, this)
        NetManager.on(icmsg.RankSelfRsp.MsgType, this._onRankSelfRsp, this)
    }

    onDisable() {
        NetManager.targetOff(this);
        gdk.e.targetOff(this)
    }

    onDestroy() {
    }

    _initSelfInfo() {
        let roleModel = this.roleModel
        this.lv.string = "." + roleModel.level;
        this.playerName.string = roleModel.name;
        this.power.string = roleModel.power.toString();
        GlobalUtil.setSpriteIcon(this.node, this.headImg, GlobalUtil.getHeadIconById(roleModel.head));
        GlobalUtil.setSpriteIcon(this.node, this.headFrame, GlobalUtil.getHeadFrameById(roleModel.frame));
        GlobalUtil.setSpriteIcon(this.node, this.titleIcon, GlobalUtil.getHeadTitleById(roleModel.title));

        let sysCfg = ConfigManager.getItemById(SystemCfg, 1802)
        let aid = ParseMainLineId(sysCfg.fbId, 1)//地图id编号
        let sid = ParseMainLineId(sysCfg.fbId, 2);//关卡编号
        this.tip.string = StringUtils.format(gdk.i18n.t("i18n:RANK_TIP2"), `${aid}-${sid}`)//`通关<color=#FF8000>${aid}-${sid}</color>后计算排名`
    }

    _initListView() {
        if (this.list) {
            return
        }
        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.rankItem,
            cb_host: this,
            gap_y: 10,
            async: true,
            direction: ListViewDir.Vertical,
        })
    }

    /**选择页签, 筛选任务类型*/
    selectType(e, utype) {
        utype = parseInt(utype)
        if (this.curIndex == utype) {
            return;
        }
        this.curIndex = utype;
        this._reqRank(utype);
        this.tip.node.active = false//utype == RankTypes.Stage
    }

    _reqRank(type: RankTypes) {
        let msg = new icmsg.RankDetailReq()
        msg.type = type
        NetManager.send(msg);
    }

    _onRankRsp(data: icmsg.RankDetailRsp) {
        this.model.rankListsMap[data.type] = data;
        this._updateRankDatas(data.type);
    }

    _onRankSelfRsp(data: icmsg.RankSelfRsp) {
        this.model.rankSelfMap[data.type] = data;
        this._updateMyRank(data.type);
        this._updateYesterday();
    }

    _updateRankDatas(type: RankTypes) {
        let rankList = this.model.rankListsMap[type];
        let list: icmsg.RankBrief[] = rankList.list;
        let infoList: RankInfo[] = []
        for (let i = 0; i < list.length; i++) {
            let ele = list[i];
            let item: RankInfo = {
                index: i + 1,
                data: ele.brief,
                value: ele.value,
                type: type,
                playerId: this.convPlayerId(ele.brief.id)
            }
            infoList.push(item)
        }
        this.list.clear_items();
        this.list.set_data(infoList);
    }

    convPlayerId(b: number): number {
        return b;
    }

    _updateMyRank(type: RankTypes) {
        this.powerNode.active = type == RankTypes.Power || type == RankTypes.Cup;
        this.refine.active = type == RankTypes.Refine || type == RankTypes.Stage;

        let vipCtrl = this.vipFlag.getComponent(VipFlagCtrl)
        vipCtrl.updateVipLv(this.roleModel.vipLv)

        let rankSelf: icmsg.RankSelfRsp = this.model.rankSelfMap[type]
        let rank = rankSelf.numTd;
        let typeValue = this.getMyRankValue(type)
        let isTopThree = rank > 0 && rank <= 3;
        this.rankImg.active = isTopThree;
        this.rank.node.active = !isTopThree;
        this.rankBg.active = !isTopThree;
        if (isTopThree) {
            let resId: string = gdk.Tool.getResIdByNode(this.node);
            let bgPath = `common/texture/main/gh_gxbhuizhang0${rank}`;
            gdk.rm.loadRes(resId, bgPath, cc.SpriteFrame, (sp) => {
                if (cc.isValid(this.node)) {
                    this.rankImg.getComponent(cc.Sprite).spriteFrame = sp;
                }
            })
        } else {
            this.rank.string = (rank != 0) ? rank.toString() : "1000/";
        }
        this.cupIcon.active = false;
        switch (type) {
            case RankTypes.Stage: {
                this.typeLabel.string = gdk.i18n.t("i18n:RANK_TIP3");
                let cfg = CopyUtil.getStageConfig(typeValue);
                if (cfg) {
                    this.floor.string = cfg.name.split(' ')[0];
                } else {
                    this.floor.string = gdk.i18n.t("i18n:RANK_TIP4");
                }
            }
                break;
            case RankTypes.Refine: {
                this.typeLabel.string = gdk.i18n.t("i18n:RANK_TIP5");
                let cfg = CopyUtil.getStageConfig(typeValue);
                if (cfg) {
                    this.floor.string = cfg.name;
                } else {
                    this.floor.string = gdk.i18n.t("i18n:RANK_TIP4");
                }
            }
                break;
            case RankTypes.Power: {
                this.typeLabel.string = gdk.i18n.t("i18n:RANK_TIP6");
                this.power.string = typeValue + "";
            }
                break;
            case RankTypes.Cup:
                this.cupIcon.active = true;
                this.typeLabel.string = gdk.i18n.t("i18n:RANK_TIP7");
                this.power.string = typeValue + "";
                break;
        }
    }

    getMyRankValue(type: RankTypes) {
        switch (type) {
            case RankTypes.Stage: {
                let copyModel = ModelManager.get(CopyModel);
                let stageId = 0;
                let passStages = copyModel.passStages;
                for (const key in passStages) {
                    let id = parseInt(key);
                    let cfg = CopyUtil.getStageConfig(id);
                    if (cfg.copy_id == CopyType.MAIN) {
                        if (id > stageId) {
                            stageId = id;
                        }
                    }
                }
                return stageId;
            }
                break;
            case RankTypes.Refine:
                let trial = ModelManager.get(TrialInfo);
                return trial.lastStageId;
            case RankTypes.Power:
                return this.roleModel.power;
            case RankTypes.Cup: {
                if (this.cupCount != null) {
                    return this.cupCount;
                }
                let cupCount = 0;
                let copyModel = ModelManager.get(CopyModel)
                let datas = copyModel.eliteStageData
                for (let i = 0; i < datas.length; i++) {
                    if (datas[i] != 0) {
                        let cfg = CopyUtil.getStageConfig(datas[i]);
                        if (cfg) {
                            cupCount += CopyUtil.getEliteStageCurChaterData(cfg.prize)[0];
                        }
                    }
                }
                return cupCount;
            }
        }
    }

    _updateYesterday() {
        let type: RankTypes = this.curIndex;
        let info: icmsg.RankSelfRsp = this.model.rankSelfMap[type]
        if (info) {
            this.biao.active = info.numYd && true;
            if (info.numYd) {
                if (info.numTd > info.numYd) {
                    this.arrowUp.active = false;
                    this.arrowDown.active = true;
                    this.rankNum.string = `${info.numTd - info.numYd}`;
                } else {
                    this.arrowUp.active = true;
                    this.arrowDown.active = false;
                    this.rankNum.string = `${info.numYd - info.numTd}`;
                }
            }
        } else {
            this.biao.active = false;
            this.arrowUp.active = true;
            this.arrowDown.active = false;
            this.rankNum.string = ``;
        }

    }

}
