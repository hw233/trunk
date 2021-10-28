import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import RedPointUtils from '../../../common/utils/RedPointUtils';
import StoreModel from '../model/StoreModel';
import { Store_monthcardCfg } from '../../../a/config';
import { StoreEventId } from '../enum/StoreEventId';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/store/MonthCardCtrl")
export default class MonthCardCtrl extends gdk.BasePanel {
    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Node)
    selectBtns: cc.Node[] = []

    @property(cc.Prefab)
    itemPres: Array<cc.Prefab> = [];

    comCtrls: Array<string> = [
        "MonthCardItemCtrl12",
        "MonthCardItemCtrl22",
        "MonthCardItemCtrl32",
    ];

    cardRes = [
        { titleBg: "tqk_biaoti01", titleTxt: "tqk_biaoti02", titleLight: "tqk_guang01", desc: "tqk_zi01" },
        { titleBg: "tqk_biaoti03", titleTxt: "tqk_biaoti04", titleLight: "tqk_guang02", desc: "tqk_zi03" },
        { titleBg: "tqk_biaoti05", titleTxt: "tqk_biaoti06", titleLight: "tqk_guang03", desc: "tqk_zi06" }
    ]
    ids: number[] = [500001, 500002, 500003];
    get storeModel(): StoreModel { return ModelManager.get(StoreModel); }

    cardCfg: Store_monthcardCfg
    curSelect: number = 0

    _isFirst: boolean = true

    onEnable() {
        let args = this.args
        if (args && args.length > 0) {
            this.selectFunc(null, args[0])
        } else {
            this.selectFunc(null, 0)
        }

        // this.node.setScale(.7);
        // this.node.runAction(cc.sequence(
        //     cc.scaleTo(.2, 1.05, 1.05),
        //     cc.scaleTo(.15, 1, 1)
        // ));

        NetManager.on(icmsg.MonthCardUpdateRsp.MsgType, this._onMonthCardUpdate, this)
        NetManager.on(icmsg.MonthCardDayRewardRsp.MsgType, this._onMonthCardUpdate, this)
        NetManager.on(icmsg.MonthCardDungeonChooseRsp.MsgType, this._onMonthCardDungeonChoose, this)
    }

    onDisable() {
        this.node.stopAllActions();
        RedPointUtils.save_state("month_card_double", false)
        this.storeModel.isDoubleShow = false
        gdk.e.emit(StoreEventId.UPDATE_MONTHCARD_RECEIVE);
        NetManager.targetOff(this);
    }

    _onMonthCardUpdate(data: icmsg.MonthCardUpdateRsp) {
        let index = this.ids.indexOf(data.info.id)
        this.selectFunc(null, index);
    }

    _onMonthCardDungeonChoose(data: icmsg.MonthCardDungeonChooseRsp) {
        let index = this.ids.indexOf(data.info.id)
        this.selectFunc(null, index)
    }

    selectFunc(e, utype) {
        utype = parseInt(utype)
        this.curSelect = utype
        this.cardCfg = ConfigManager.getItemById(Store_monthcardCfg, this.ids[utype]);
        for (let idx = 0; idx < this.selectBtns.length; idx++) {
            const element = this.selectBtns[idx];
            let btn = element.getComponent(cc.Button)
            btn.interactable = idx != utype
            let select = element.getChildByName("select");
            select.active = idx == utype
            let common = element.getChildByName("common");
            common.active = idx != utype

            let redPoint = element.getChildByName("red_point")
            redPoint.active = false
            let info = this.storeModel.getMonthCardInfo(this.ids[idx]);
            // let node = element.getChildByName("layout")
            // let timeIcon = node.getChildByName("timeIcon")
            // let lab = node.getChildByName("lab").getComponent(cc.Label)
            // let outLine = node.getChildByName("lab").getComponent(cc.LabelOutline)
            // outLine.enabled = false
            let nowTime = GlobalUtil.getServerTime() / 1000;
            if (info && info.time - nowTime > 0) {
                // timeIcon.active = true
                //let time = info.time - nowTime;
                // let day = Math.ceil(time / 86400);
                // lab.string = `${day}天`;
                // lab.node.color = cc.color("#FFF8D7")
                // outLine.enabled = true
                if (idx == 2) {

                } else {
                    redPoint.active = !info.isRewarded
                }
            } else {
                // timeIcon.active = false
                // lab.node.color = cc.color("#af7667")
            }
        }
        let monthCardInfo = this.storeModel.getMonthCardInfo(this.ids[utype]);
        this.content.removeAllChildren()
        let itemNode = cc.instantiate(this.itemPres[utype]) as cc.Node;
        this.content.addChild(itemNode)
        let comCtrl = itemNode.getComponent(this.comCtrls[utype]);
        comCtrl.data = monthCardInfo;
        comCtrl.cfg = this.cardCfg;
        comCtrl.updateView();
    }

    buyFunc() {
        let msg = new icmsg.PayOrderReq()
        msg.paymentId = this.cardCfg.id
        NetManager.send(msg)
    }


    openFunc() {
        this.content.active = true
        // this.unBuyNode.active = false

        this.content.removeAllChildren()
        let itemNode = cc.instantiate(this.itemPres[this.curSelect]) as cc.Node;
        this.content.addChild(itemNode)

        let comCtrl = itemNode.getComponent(this.comCtrls[this.curSelect]);
        comCtrl.data = null;
        comCtrl.cfg = this.cardCfg;
        comCtrl.updateView();
    }

}

export type MCRewardInfo = {
    type: number, //类型 1，钻石 2 扫荡券
    cardInfo: icmsg.MonthCardInfo,
    itemId: number,
    num: number,
    index: number,
}