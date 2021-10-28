import GlobalUtil from '../../../common/utils/GlobalUtil';
import InstanceModel from '../model/InstanceModel';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import RoleModel from '../../../common/models/RoleModel';
import StoreModel from '../../store/model/StoreModel';
import VipFlagCtrl from '../../../common/widgets/VipFlagCtrl';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';
import { RankInfo } from '../../rank/ctrl/RankViewCtrl';
import { RankTypes } from '../../rank/enum/RankEvent';

/**
 * @Description: 点杀副本排行榜
 * @Author: yaozu.hu
 * @Date: 2020-07-07 10:07:33
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-12-22 12:34:36
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/instance/DianshaRankViewCtrl")
export default class DianshaRankViewCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;
    @property(cc.Node)
    content: cc.Node = null
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
    @property(cc.Label)
    power: cc.Label = null;
    @property(cc.Label)
    rankNum: cc.Label = null
    @property(cc.Node)
    headFrame: cc.Node = null
    @property(cc.Node)
    headImg: cc.Node = null
    @property(cc.Node)
    vipFlag: cc.Node = null
    @property(cc.Node)
    biao: cc.Node = null
    @property(cc.Node)
    arrowUp: cc.Node = null
    @property(cc.Node)
    arrowDown: cc.Node = null


    list: ListView = null;
    get roleModel(): RoleModel { return ModelManager.get(RoleModel); }
    get instanceModel(): InstanceModel { return ModelManager.get(InstanceModel); }
    get storeModel(): StoreModel { return ModelManager.get(StoreModel); }

    onLoad() {
        //this.title = 'i18n:RANK_TITLE';
        this._initListView();
        this._reqRank(RankTypes.DianSha)
    }

    onEnable() {

        this._initSelfInfo();
        NetManager.on(icmsg.RankDetailRsp.MsgType, this._onRankRsp, this)
        NetManager.on(icmsg.RankSelfRsp.MsgType, this._onRankSelfRsp, this)
    }

    onDisable() {
        NetManager.targetOff(this);
        gdk.e.targetOff(this)
    }

    onDestroy() {
        if (this.list != null) {
            this.list.destroy()
        }
    }

    _initSelfInfo() {
        let roleModel = this.roleModel
        this.lv.string = "." + roleModel.level;
        this.playerName.string = roleModel.name;
        GlobalUtil.setSpriteIcon(this.node, this.headImg, GlobalUtil.getHeadIconById(roleModel.head));
        GlobalUtil.setSpriteIcon(this.node, this.headFrame, GlobalUtil.getHeadFrameById(roleModel.frame));
        let num = this.instanceModel.dunGeonBossJusticeState.boss.id;
        let hp = this.instanceModel.dunGeonBossJusticeState.boss.hp;
        num = hp > 0 ? num - 1 : num;
        this.power.string = Math.max(0, num) + ''

    }

    _onRankRsp(data: icmsg.RankDetailRsp) {
        //this.model.rankListsMap[data.type] = data;
        this._updateRankDatas(data.list);
    }

    _onRankSelfRsp(data: icmsg.RankSelfRsp) {
        //this.model.rankSelfMap[data.type] = data;
        this._updateMyRank(data);
        this._updateYesterday(data);
    }

    _updateMyRank(data: icmsg.RankSelfRsp) {
        let rank = data.numTd;
        //let typeValue = this.getMyRankValue(type)
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
        let vipCtrl = this.vipFlag.getComponent(VipFlagCtrl)
        vipCtrl.updateVipLv(this.roleModel.vipExp)
    }

    _updateYesterday(data: icmsg.RankSelfRsp) {
        // let type: RankTypes = this.curIndex;
        // let info: RankSelfRsp = this.model.rankSelfMap[type]
        this.biao.active = data.numYd && true;
        if (data.numYd) {
            if (data.numTd > data.numYd) {
                this.arrowUp.active = false;
                this.arrowDown.active = true;
                this.rankNum.string = `${data.numTd - data.numYd}`;
            } else {
                this.arrowUp.active = true;
                this.arrowDown.active = false;
                this.rankNum.string = `${data.numYd - data.numTd}`;
            }
        }
    }

    _updateRankDatas(listData: icmsg.RankBrief[]) {
        //let rankList = this.model.rankListsMap[type];
        //let list: RankBrief[] = rankList.list;
        let infoList: RankInfo[] = []
        for (let i = 0; i < listData.length; i++) {
            let ele = listData[i];
            let item: RankInfo = {
                index: i + 1,
                data: ele.brief,
                value: ele.value,
                type: RankTypes.DianSha,
                playerId: this.convPlayerId(ele.brief.id)
            }
            infoList.push(item)
        }
        this.list.set_data(infoList);
    }
    convPlayerId(b: number): number {
        return b;
    }
    _reqRank(type: RankTypes) {
        let msg = new icmsg.RankDetailReq()
        msg.type = type
        NetManager.send(msg);
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
}
