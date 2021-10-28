import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import GuildModel from '../model/GuildModel';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import StringUtils from '../../../common/utils/StringUtils';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { Guild_lvCfg, Guild_signCfg } from '../../../a/config';
import { GuildEventId } from '../enum/GuildEventId';

/*
 * @Author: luoyong 
 * @Date: 2020-02-24 10:30:19 
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-12-24 14:49:16
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/GuildSignCtrl")
export default class GuildSignCtrl extends gdk.BasePanel {

    @property(cc.Label)
    signDayNum: cc.Label = null;

    @property(cc.Node)
    progressBg: cc.Node = null;

    @property(cc.Node)
    progressFg: cc.Node = null;

    @property(cc.Node)
    signBox: cc.Node[] = [];

    @property(cc.Node)
    signBoxGetFlag: cc.Node[] = [];

    @property(cc.Label)
    signDayLab: cc.Label[] = [];

    @property(cc.Label)
    jewelLabel: cc.Label = null;
    @property(cc.Label)
    expLabel: cc.Label = null;
    @property(cc.Node)
    expIcon: cc.Node = null;

    @property(cc.Button)
    btnSign: cc.Button = null;
    @property(cc.Label)
    btnLab: cc.Label = null;

    @property(cc.Node)
    tipsNode: cc.Node = null;
    @property(cc.Node)
    layout: cc.Node = null;
    @property(cc.Node)
    tipsBtn: cc.Node = null;

    signCfg: Guild_signCfg

    get model() { return ModelManager.get(GuildModel); }

    onLoad() {
        this.tipsNode.active = false;
        this.tipsBtn.active = false;
    }

    start() {
    }

    onEnable() {
        this._initBoxInfo()
        gdk.e.emit(GuildEventId.REQ_GUILD_SIGN_INFO)
    }

    onDisable() {
        gdk.e.targetOff(this)
    }

    onDestroy() {

    }

    _initBoxInfo() {
        this.signCfg = ConfigManager.getItemById(Guild_signCfg, 1)

        this.signDayLab[0].string = `${this.signCfg.number2}`
        this.signDayLab[1].string = `${this.signCfg.number3}`
        //签到增加的经验不能超过公会人数上限*10
        let cfg = ConfigManager.getItemByField(Guild_lvCfg, "clv", this.model.guildDetail.info.level)
        if (this.model.signNum <= cfg.number) {
            this.jewelLabel.string = `${this.signCfg.reward1[0][1]}`;
            this.expLabel.string = `${this.signCfg.exp}`;
            this.expLabel.node.active = true;
            this.expIcon.active = true;
        } else {
            this.jewelLabel.string = `${this.signCfg.reward1[0][1]}`;
            this.expLabel.node.active = false;
            this.expIcon.active = false;
        }
        this.updateSignBoxState()
    }

    @gdk.binding("model.signFlag")
    updateSignBoxState() {
        this.signDayNum.string = StringUtils.format(gdk.i18n.t("i18n:GUILD_TIP43"), this.model.signNum || 0)//`已签到${this.model.signNum || 0}人`
        let signFlag = this.model.signFlag;
        this.signBoxGetFlag[0].active = Boolean(2 & signFlag)
        this.signBoxGetFlag[1].active = Boolean(4 & signFlag)
        this.signBox[0].active = !(2 & signFlag)
        this.signBox[1].active = !(4 & signFlag)

        if (this.model.signFlag & 1) {
            GlobalUtil.setGrayState(this.btnSign.node, 1)
            this.btnSign.interactable = false;
            this.btnLab.string = gdk.i18n.t("i18n:GUILD_TIP44")
            GlobalUtil.setGrayState(this.btnLab, 1)
        } else {
            GlobalUtil.setGrayState(this.btnSign.node, 0)
            this.btnSign.interactable = true;
            this.btnLab.string = gdk.i18n.t("i18n:GUILD_TIP45")
            GlobalUtil.setGrayState(this.btnLab, 0)
        }
        this.progressFg.width = this.progressBg.width * (Math.min(this.model.signNum, this.signCfg.number3) / this.signCfg.number3);
    }

    signBoxClick(e: cc.Event.EventTouch, param: string) {
        let idx: number = parseInt(param);
        if ([2, 4][idx - 1] & this.model.signFlag) {
            // 已经领取过的奖励
            gdk.gui.showMessage(gdk.i18n.t("i18n:GUILD_TIP46"));
            return;
        } else {
            // 还没领取的奖励
            let day = idx == 1 ? this.signCfg.number2 : this.signCfg.number3
            if (this.model.signNum >= day) {
                let msg = new icmsg.GuildSignBoxReq()
                msg.index = idx
                NetManager.send(msg, (data: icmsg.GuildSignBoxRsp) => {
                    this.model.signFlag = data.flag
                    //展示奖励
                    GlobalUtil.openRewadrView(data.rewards)
                    gdk.e.emit(GuildEventId.UPDATE_GUILD_SIGN_INFO)
                })
            } else {
                let rewards = idx == 1 ? this.signCfg.reward2 : this.signCfg.reward3
                this.showPreReward(e.target, rewards);
                // let arr: GoodsInfo[] = [];
                // rewards.forEach(e => {
                //     if (!e || cc.js.isString(e)) return;
                //     arr.push(new GoodsInfo({
                //         typeId: e[0],
                //         num: e[1],
                //     }));
                // });
                // GlobalUtil.openRewardPreview(arr, '奖励预览');
            }
        }
    }

    signFunc() {
        //未签到
        if (!(1 & this.model.signFlag)) {
            let msg = new icmsg.GuildSignReq()
            NetManager.send(msg, (data: icmsg.GuildSignRsp) => {
                this.model.guildDetail.info.level = data.level
                this.model.guildDetail.exp = data.exp
                this.model.signNum++
                this.model.signFlag++
                //展示奖励
                GlobalUtil.openRewadrView(data.rewards)
                gdk.e.emit(GuildEventId.UPDATE_GUILD_SIGN_INFO)
            })
        }
    }

    onTipsBtnClick() {
        this.tipsNode.active = false;
        this.tipsBtn.active = false;
    }

    showPreReward(btn: cc.Node, reward2: number[][]) {
        let point = btn.convertToWorldSpace(new cc.Vec2(btn.width * btn.anchorX, btn.height * btn.anchorY));
        point = this.node.convertToNodeSpaceAR(point);
        this.tipsNode.active = true;
        this.tipsBtn.active = true;
        this.tipsNode.x = point.x;

        let len = this.layout.children.length;
        for (let i = 0; i < len; i++) {
            const slotNode = this.layout.children[i];
            let item = reward2[i];
            if (item) {
                slotNode.active = true;
                let slop = slotNode.getComponent(UiSlotItem);
                slop.updateItemInfo(item[0], item[1]);
            } else {
                slotNode.active = false;
            }
        }
    }
}