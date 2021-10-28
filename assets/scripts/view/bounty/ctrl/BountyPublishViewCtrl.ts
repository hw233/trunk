import BagUtils from '../../../common/utils/BagUtils';
import BountReplayCtrl from './BountReplayCtrl';
import BountyModel from './BountyModel';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil, { CommonNumColor } from '../../../common/utils/GlobalUtil';
import HeroModel from '../../../common/models/HeroModel';
import HeroUtils from '../../../common/utils/HeroUtils';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import RoleModel from '../../../common/models/RoleModel';
import StringUtils from '../../../common/utils/StringUtils';
import TimerUtils from '../../../common/utils/TimerUtils';
import TrialInfo from '../../instance/trial/model/TrialInfo';
import {
    Bounty_costCfg,
    Copy_stageCfg,
    Hero_careerCfg,
    ItemCfg
    } from '../../../a/config';
import { ChatChannel, ColorType } from '../../chat/enum/ChatChannel';
import { CopyType } from './../../../common/models/CopyModel';
/** 
 * @Description: 赏金求助
 * @Author: weiliang.huang  
 * @Date: 2019-05-07 09:34:24 
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-12-22 12:13:12
*/


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/bounty/BountyPublishViewCtrl")
export default class BountyPublishViewCtrl extends gdk.BasePanel {

    @property(cc.Node)
    contents: cc.Node[] = [];

    @property(cc.Label)
    curStageLab: cc.Label = null;

    @property(cc.Label)
    powerLab: cc.Label = null;

    @property(cc.Node)
    powerTip: cc.Node = null;

    @property(cc.EditBox)
    editBox: cc.EditBox = null;

    @property(cc.Toggle)
    checkBtns: Array<cc.Toggle> = []

    @property(cc.Node)
    tabBtns: cc.Node[] = [];

    @property(cc.Label)
    costMoneys: cc.Label[] = [];

    @property(cc.Label)
    numLabs: cc.Label[] = [];

    @property(cc.RichText)
    tipLab: cc.RichText = null;

    @property(cc.Node)
    sendNode: cc.Node = null;

    @property(cc.Node)
    waitNode: cc.Node = null;

    @property(cc.Label)
    wMoneyLab: cc.Label = null;

    @property(cc.Label)
    wTimeLab: cc.Label = null;

    _selectIndex: number = 0
    _checkIndex: number = 0
    _myBounty: icmsg.BountyMineRsp
    _costCfgs: Bounty_costCfg[]
    _curCfg: Bounty_costCfg
    _stageId: number = 0
    _isNeedPay: boolean = false //是否需要充值
    copyPassMinPower: number; //副本通关最低战力


    get roleModel() { return ModelManager.get(RoleModel); }
    get bountyModel() { return ModelManager.get(BountyModel); }

    onEnable() {

        NetManager.on(icmsg.BountyMineRsp.MsgType, this._onBountyMineRsp, this)

        let model = ModelManager.get(TrialInfo);
        let stageCfg = model.nextStage;
        if (!stageCfg) {
            stageCfg = ConfigManager.getItemsByField(Copy_stageCfg, "copy_id", CopyType.Trial)[0];
        }
        this._stageId = stageCfg.id;
        this.curStageLab.string = stageCfg.name;
        this._costCfgs = ConfigManager.getItems(Bounty_costCfg);
        let req = new icmsg.DungeonMinPowerReq();
        req.stageId = this._stageId;
        NetManager.send(req, (resp: icmsg.DungeonMinPowerRsp) => {
            if (!cc.isValid(this.node)) return;
            if (!this.node.activeInHierarchy) return;
            this.copyPassMinPower = resp.minPower
            let minPower = this.copyPassMinPower ? Math.min(this.copyPassMinPower, Math.floor(stageCfg.power * 0.8)) : Math.floor(stageCfg.power * 0.8);
            this.powerLab.string = `${minPower}`;
            if (this.roleModel.power < minPower) {
                this.powerTip.active = true;
                this.powerLab.node.color = CommonNumColor.red;
            } else {
                this.powerTip.active = false;
                this.powerLab.node.color = cc.color("#FFEA00")
            }
        }, this);
        // let aid = ParseMainLineId(this._stageId, 1)//地图id编号
        // let sid = ParseMainLineId(this._stageId, 2);//关卡编号
        // this.curStageLab.string = `${aid}-${sid}`
        // let stageCfg = ConfigManager.getItemById(Copy_stageCfg, this._stageId)
        let minPower = this.copyPassMinPower ? Math.min(this.copyPassMinPower, Math.floor(stageCfg.power * 0.8)) : Math.floor(stageCfg.power * 0.8);
        this.powerLab.string = `${minPower}`;
        if (this.roleModel.power < minPower) {
            this.powerTip.active = true;
            this.powerLab.node.color = CommonNumColor.red;
        }
        // 我的求助 是否有
        let msg = new icmsg.BountyMineReq();
        NetManager.send(msg);

        // 更新赏金榜按钮红点
        let redPoint = cc.find('yx_tcbg02/btnBounty/redPoint', this.node);
        if (redPoint) {
            redPoint.active = false;
            NetManager.send(new icmsg.BountyListReq(), (rmsg: icmsg.BountyListRsp) => {
                if (!cc.isValid(this.node)) return;
                if (!this.node.activeInHierarchy) return;
                let player = this.roleModel.name;
                let curTime = Math.floor(GlobalUtil.getServerTime() / 1000);
                redPoint.active = rmsg.list.some(i => {
                    if (i.publisher == player) return false;
                    if (i.committer != '') return false;
                    if (i.endTime - curTime <= 0) return false;
                    return true;
                });
            }, this);
        }
    }

    onDisable() {
        this.unschedule(this._updateTime)
        NetManager.targetOff(this)
    }

    _onBountyMineRsp(data: icmsg.BountyMineRsp) {
        this._myBounty = data
        this._updateNotice()
        this.selectCheck(null, this._checkIndex)
        this.selectType(null, this._selectIndex)
    }

    selectCheck(e, index) {
        this._checkIndex = parseInt(index)
        for (let i = 0; i < this.checkBtns.length; i++) {
            this.checkBtns[i].interactable = true
        }
        this.checkBtns[this._checkIndex].interactable = false

        this._curCfg = this._costCfgs[this._checkIndex]
        if (this._checkIndex == 2) {
            let leftTime = this._curCfg.send_limit - this._myBounty.publishedFreeNum > 0 ? this._curCfg.send_limit - this._myBounty.publishedFreeNum : 0
            this.tipLab.string = `${StringUtils.format(gdk.i18n.t("i18n:BOUNTY_TIP12"), GlobalUtil.getColorStr(this._curCfg.item[1], ColorType.Gold), leftTime, this._curCfg.send_limit)}`//`本次需消耗${GlobalUtil.getColorStr(this._curCfg.item[1], ColorType.Gold)}钻(本周剩余${leftTime}/${this._curCfg.send_limit}次)`
            this._isNeedPay = false
        } else {
            let curNum = BagUtils.getItemNumById(this._curCfg.item[0])
            let itemCfg = ConfigManager.getItemById(ItemCfg, this._curCfg.item[0])
            if (curNum > 0) {
                this.tipLab.string = `${StringUtils.format(gdk.i18n.t("i18n:BOUNTY_TIP13"), GlobalUtil.getColorStr(itemCfg.name, ColorType.Gold))}`//`本次消耗1张${GlobalUtil.getColorStr(itemCfg.name, ColorType.Gold)}`
                this._isNeedPay = false
            } else {
                this.tipLab.string = `${StringUtils.format(gdk.i18n.t("i18n:BOUNTY_TIP14"), GlobalUtil.getColorStr(this._curCfg.name, ColorType.Gold))}`//`本次需充值${GlobalUtil.getColorStr(this._curCfg.name, ColorType.Gold)}`
                this._isNeedPay = true
            }
        }
    }

    selectType(e, index) {
        this._selectIndex = parseInt(index)
        for (let i = 0; i < this.tabBtns.length; i++) {
            let node = this.tabBtns[i]
            let btn = node.getComponent(cc.Button)
            btn.interactable = index != i
            let select = node.getChildByName("on")
            select.active = index == i
            this.contents[i].active = index == i
        }

        if (this._selectIndex == 0) {
            if (this._myBounty.missionId == 0) {
                this.sendNode.active = true
                this.waitNode.active = false
                this._updateSendNode()
            } else {
                this.sendNode.active = false
                this.waitNode.active = true
                this._updateWaitNode()
            }
        } else {
            let ctrl = this.contents[this._selectIndex].getComponent(BountReplayCtrl)
            ctrl.updateView(this._stageId)
        }
    }

    _updateNotice() {
        if (!this._myBounty) return
        if (this._myBounty.notice) {
            this.editBox.string = this._myBounty.notice
            this.editBox.enabled = false
        }
    }

    /**发布页面*/
    _updateSendNode() {
        for (let i = 0; i < this._costCfgs.length; i++) {
            if (i == this._costCfgs.length - 1) {
                this.costMoneys[i].string = gdk.i18n.t("i18n:BOUNTY_TIP15")
            } else {
                this.costMoneys[i].string = `${gdk.i18n.t("i18n:BOUNTY_TIP16")}${this._costCfgs[i].name}`
            }
            // let ownNum = BagUtils.getItemNumById(this._costCfgs[i].item[0])
            // this.numLabs[i].string = `(${ownNum}/1)`
            // if (ownNum > 0) {
            //     this.numLabs[i].node.color = CommonNumColor.green
            // } else {
            //     this.numLabs[i].node.color = CommonNumColor.red
            // }
            this.numLabs[i].string = `${StringUtils.format(gdk.i18n.t("i18n:BOUNTY_TIP17"), this._costCfgs[i].first_reward[1])}` //`  (完成赏金者可得${this._costCfgs[i].first_reward[1]}钻)`

        }
    }

    /**发布完，求助中页面*/
    _updateWaitNode() {
        let cfg = ConfigManager.getItemById(Bounty_costCfg, this._myBounty.missionType)
        this.wMoneyLab.string = `${cfg.name}`
        //倒数计时
        this._updateTime()
        this.schedule(this._updateTime, 1)
    }

    _updateTime() {
        if (!this._myBounty) return
        let curTime = Math.floor(GlobalUtil.getServerTime() / 1000)
        let endTime = this._myBounty.endTime
        let leftTime = endTime - curTime
        if (leftTime <= 0) {
            this.unschedule(this._updateTime)
            this.sendNode.active = true
            this.selectCheck(null, this._checkIndex)
            this.waitNode.active = false
        } else {
            this.wTimeLab.string = `${TimerUtils.format2(leftTime)}`
        }

    }


    /**发布任务 */
    sendFunc() {
        if (this._checkIndex == 2) {
            //钻石发布
            if (this._curCfg.send_limit - this._myBounty.publishedFreeNum <= 0) {
                gdk.gui.showMessage(gdk.i18n.t("i18n:BOUNTY_TIP18"))
                return
            }
        }
        let stageCfg = ConfigManager.getItemById(Copy_stageCfg, this._stageId)
        // if (stageCfg.type_stage != 3) {
        //     gdk.gui.showMessage("Boss关卡才能求助")
        //     return
        // }
        let cb = () => {
            if (this._isNeedPay) {
                let msg = new icmsg.PayOrderReq()
                msg.paymentId = this._curCfg.store
                NetManager.send(msg, () => {
                    this._sendReq()
                })
            } else {
                this._sendReq()
            }
        }

        let minPower = this.copyPassMinPower ? Math.min(this.copyPassMinPower, Math.floor(stageCfg.power * 0.8)) : Math.floor(stageCfg.power * 0.8);
        if (this.roleModel.power < minPower) {
            // gdk.gui.showMessage("战力未符合要求")
            gdk.panel.setArgs(PanelId.BountyPublishTipsView, [minPower, cb]);
            gdk.panel.open(PanelId.BountyPublishTipsView);
            return
        }

        let upList = ModelManager.get(HeroModel).curUpHeroList(0);
        let careerTypes = [1, 3, 4];
        upList.forEach(id => {
            let info = HeroUtils.getHeroInfoByHeroId(id);
            if (info) {
                let type = ConfigManager.getItemByField(Hero_careerCfg, 'career_id', info.careerId).career_type;
                let idx = careerTypes.indexOf(type);
                if (idx != -1) {
                    careerTypes.splice(idx, 1);
                }
            }
        });

        if (careerTypes.length > 0) {
            gdk.panel.setArgs(PanelId.BountyPublishTipsView, [minPower, cb]);
            gdk.panel.open(PanelId.BountyPublishTipsView);
            return;
        }

        cb();
    }

    _sendReq() {
        let msg = new icmsg.BountyPublishReq()
        msg.missionType = this._checkIndex + 1
        msg.notice = this.editBox.string ? this.editBox.string : this.editBox.placeholder
        NetManager.send(msg, () => {
            gdk.gui.showMessage(gdk.i18n.t("i18n:BOUNTY_TIP19"))
            //再请求信息
            let msg2 = new icmsg.BountyMineReq()
            NetManager.send(msg2)
        })
    }

    /*任务列表 */
    openBountyList() {
        // if (ModelManager.get(RoleModel).guildId <= 0) {
        //     gdk.gui.showMessage(ErrorManager.get(2904));
        //     return;
        // }
        gdk.panel.open(PanelId.BountyList);
    }


    /** 更新英雄数据*/
    updateHeroFunc() {
        let msg = new icmsg.BountyRefreshReq()
        msg.missionId = this._myBounty.missionId
        NetManager.send(msg, () => {
            gdk.gui.showMessage(gdk.i18n.t("i18n:BOUNTY_TIP20"))
        })
    }

    /**发送到聊天 */
    sendChatFunc() {
        let msg = new icmsg.ChatSendReq()
        msg.channel = ChatChannel.WORLD //1:系统 2:世界 3:公会 4:私聊
        msg.content = `${StringUtils.format(gdk.i18n.t("i18n:BOUNTY_TIP21"), this.curStageLab.string)}`//`求助通关${this.curStageLab.string}:救救孩子吧,我卡这关3年了!<on click='bountyClick'><color=#00ff00>[帮他通关]</color></on>`
        // msg.equips = [];
        msg.targetId = 0
        NetManager.send(msg, () => {
            gdk.gui.showMessage(gdk.i18n.t("i18n:BOUNTY_TIP19"))
        });
    }
}