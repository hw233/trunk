import ActUtil from '../../act/util/ActUtil';
import ConfigManager from '../../../common/managers/ConfigManager';
import FirstPayItemCtrl from './FirstPayItemCtrl';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import GuideUtil from '../../../common/utils/GuideUtil';
import HeroDetailViewCtrl from '../../lottery/ctrl/HeroDetailViewCtrl';
import JumpUtils from '../../../common/utils/JumpUtils';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import RechargeLBCtrl from './recharge/RechargeLBCtrl';
import RedPointCtrl from '../../../common/widgets/RedPointCtrl';
import SdkTool from '../../../sdk/SdkTool';
import StoreModel from '../model/StoreModel';
import StringUtils from '../../../common/utils/StringUtils';
import TimerUtils from '../../../common/utils/TimerUtils';
import { ActivityEventId } from '../../act/enum/ActivityEventId';
import { HeroCfg } from '../../../a/config';
import { Store_first_payCfg } from './../../../a/config';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/store/FirstPayGiftCtrl")
export default class FirstPayGiftCtrl extends gdk.BasePanel {

    @property(cc.Node)
    awardNode: Array<cc.Node> = [];

    @property(cc.Node)
    goRechargeBtn: cc.Node = null;

    @property(sp.Skeleton)
    spine: sp.Skeleton = null;

    @property(sp.Skeleton)
    aniSpine: sp.Skeleton = null;

    @property(cc.Node)
    infoNode: cc.Node[] = [];

    @property(cc.Node)
    oneDollarBtn: cc.Node = null;

    @property(cc.Label)
    timeLab: cc.Label = null;

    index: number = -1;
    actionTimes: number = 0;
    countDownNode: cc.Node = null;
    countDownDay: number;
    get storeModel(): StoreModel { return ModelManager.get(StoreModel); }
    get current(): icmsg.PayFirstList {
        let ret: icmsg.PayFirstList = null;
        let lst = this.storeModel.firstPayList;
        if (lst && lst.length > 0) {
            let cfg = ConfigManager.getItemById(Store_first_payCfg, this.index);
            if (cfg) {
                lst.some(i => {
                    if (i.grade == cfg.RMB_cost) {
                        ret = i;
                        return true;
                    }
                    return false;
                });
            }
        }
        return ret;
    }

    dtime: number = 0;
    update(dt: number) {
        if (!this.countDownNode || !this.countDownDay) return;
        if (this.dtime > 1) {
            this.dtime = 0;
            this._countDown(this.countDownNode);
        }
        else {
            this.dtime += dt;
        }
    }

    onEnable() {
        this.updateTime();
        let index = 1;
        let args = this.args;
        if (args && args.length > 0 && cc.js.isNumber(args[0]) && args[0] > 0) {
            // 指定了有效的外部参数
            index = args[0];
        } else {
            let list = this.storeModel.firstPayList;
            // 有可领取的项时
            let curTime = GlobalUtil.getServerTime();
            let ret = list.some((item, idx) => {
                for (let i = 0; i < 3; i++) {
                    let byte = item.rewarded;
                    if ((byte &= 1 << i) <= 0) {
                        let startZeroTime = TimerUtils.getZerohour(item.firstPayTime) * 1000;
                        let day = Math.floor((curTime - startZeroTime) / (24 * 60 * 60 * 1000)) + 1;
                        if (day >= i + 1) {
                            index = idx + 1;
                            return true;
                        }
                    }
                }
            });
            // 如果没有可领取的项时，则打开最低充钱页
            if (!ret) {
                let cfgs = ConfigManager.getItems(Store_first_payCfg);
                if (list.length >= cfgs.length) {
                    // 所有累计充值已经达到，则选择一个奖还没有领取完的项
                    for (let i = list.length - 1; i >= 0; i--) {
                        if (list[i].rewarded != 7) {
                            index = i + 1;
                            break;
                        }
                    }
                } else {
                    // 当前累计充值已达到的下一页
                    index = list.length + 1;
                }
            }
        }
        this.index = index;
        this._refresh();
        this.node.setScale(.7);
        this.node.runAction(cc.sequence(
            cc.scaleTo(.2, 1.05, 1.05),
            cc.scaleTo(.15, 1, 1)
        ));
    }

    onDisable() {
        this.index = -1;
        this.node.stopAllActions();
    }

    close(buttonIndex: number = -1) {
        let cfg = GuideUtil.getCurGuide();
        if (cfg) {
            // 判断是否有关于首充界面的引导
            let cond = `popup#${this.resId}#close#bymyself`;
            if (cfg.finishCondition == cond) {
                // let popCom = this.node.getComponent("gdk_PopupComponent");
                // if (popCom) {
                //     this.node.removeComponent(popCom);
                // }
                // this.node.runAction(cc.sequence(
                //     cc.spawn(cc.moveTo(0.5, 0, 428), cc.scaleTo(0.5, 0.1)),
                //     cc.callFunc(() => {
                GuideUtil.activeGuide(cond);
                //         super.close(buttonIndex);
                //     }, this)
                // ));
                // return;
            }
        }
        super.close(buttonIndex);
    }

    updateTime() {
        let startTime = new Date(ActUtil.getActStartTime(136));
        let endTime = new Date(ActUtil.getActEndTime(136) - 5000); //time为零点,减去5s 返回前一天
        if (!startTime || !endTime) {
            this.timeLab.string = gdk.i18n.t("i18n:ACTIVITY_TIME_TIP1");
            gdk.e.emit(ActivityEventId.ACTIVITY_TIME_IS_OVER);
            gdk.panel.hide(PanelId.FirstPayGift);
            return;
        }
        else {
            this.timeLab.string = `${startTime.getFullYear()}.${startTime.getMonth() + 1}.${startTime.getDate()}-${endTime.getFullYear()}.${endTime.getMonth() + 1}.${endTime.getDate()}`;
        }
    }

    showIdle() {
        this.spine.animation = "idle";
        this.spine.loop = false;
        this.spine.setCompleteListener(() => {
            this.showStand();
        });
    }

    showStand() {
        this.spine.animation = "stand";
        this.spine.loop = false;
        this.actionTimes = Date.now() % 4 + 2;
        this.spine.setCompleteListener(() => {
            this.actionTimes--;
            if (this.actionTimes <= 0) {
                this.showIdle();
                return;
            }
            this.spine.animation = "stand";
        })
    }

    playIdle() {
        this.actionTimes = 0;
    }

    /**刷新显示 */
    _refresh() {
        this._showRewardItems();
        this._updateOneDollarBtn();
        this._showBtn();
        this._showRechargePro();
    }

    _showRechargePro() {
        let progressNode = cc.find('progressNode', this.node);
        let totalMoney = ConfigManager.getItemById(Store_first_payCfg, this.index).RMB_cost;
        totalMoney = SdkTool.tool.getRealRMBCost(totalMoney);
        let m = this.storeModel.firstPaySum;
        if (totalMoney <= m) {
            progressNode.active = false;
        }
        else {
            progressNode.active = true;
            let totalLab = cc.find('target/totalLab', progressNode).getComponent(cc.Label);
            let bar = cc.find('ProgressBar', progressNode).getComponent(cc.ProgressBar);
            let rechargeLab = cc.find('ProgressBar/rechargeLab', progressNode).getComponent(cc.Label);
            totalLab.string = `${totalMoney}`.replace('.', '/');
            bar.progress = m / totalMoney;
            rechargeLab.string = `${m}/${totalMoney}`;
        }
    }

    /**显示奖励物品 */
    _showRewardItems() {
        // 英雄模型
        let cfg = ConfigManager.getItemById(Store_first_payCfg, this.index);
        let heroCfg = ConfigManager.getItemById(HeroCfg, cfg.model);
        GlobalUtil.setSpriteIcon(this.node, cc.find('sc_wenzi', this.node), `view/store/textrue/firstPay/tab/${cfg.title}`)
        GlobalUtil.setSpineData(
            this.node,
            this.spine,
            `spine/hero/${heroCfg.skin}/1/${heroCfg.skin}`,
            true, 'idle', true, false,
            () => {
                this.showStand();
            },
        );
        // GlobalUtil.setSpriteIcon(
        //     this.node,
        //     cc.find('sc_wenzi', this.node),
        //     `view/store/textrue/firstPay/tab/sc_yingxjieshaowenan0${this.index}`
        // );
        // 奖励列表
        for (let i = 0; i < 3; i++) {
            let slotItems = this.awardNode[i].children;
            let value: number[] = cfg['first_pay_award_' + (i + 1)];
            let idx = 0;
            slotItems.forEach((item) => {
                if (value[idx] && value[idx + 1]) {
                    item.active = true;
                    let ctrl = item.getComponent(FirstPayItemCtrl);
                    ctrl.setData(null, 0, { itemId: value[idx], num: value[idx + 1] });
                    ctrl.updateView();
                }
                else {
                    item.active = false;
                }
                idx += 2;
            });
        }
        // 奖励说明
        cc.find('sc_wenzi01', this.node).getComponent(cc.RichText).string = `<outline color=#642800 width=2>${cfg.des}</outline>`;
    }

    /**更新奖励物品状态 */
    _updateRewardStatus() {
        let item = this.current;
        let slotNode = this.awardNode;
        let statusNode = this.infoNode;
        let str = [
            gdk.i18n.t('i18n:ACT_FLIPCARD_NUM1'),
            gdk.i18n.t('i18n:ACT_FLIPCARD_NUM2'),
            gdk.i18n.t('i18n:ACT_FLIPCARD_NUM3'),
        ];
        this.countDownNode = null;
        this.countDownDay = null;
        statusNode.forEach((node, idx) => {
            let status = item.rewarded;
            if ((status &= 1 << idx) > 0) {
                //已领取
                slotNode[idx].children.forEach(slot => {
                    let ctrl = slot.getComponent(FirstPayItemCtrl);
                    ctrl.setMaskStatus(true);
                });
                node.getComponent(cc.Sprite).enabled = false;
                node.getChildByName('sc_lingqudiban').getComponent(cc.Sprite).enabled = true;
                let label = cc.find('sc_lingqudiban/label', node).getComponent(cc.Label);
                label.string = StringUtils.format(gdk.i18n.t('i18n:STORE_TIP1'), str[idx]);
                label.node.color = new cc.Color().fromHEX('#FFB08D');
                node.getChildByName('zb_huanseanniu').active = false;
                node.getChildByName('zb_lanseanniu').active = false;
            }
            else {
                slotNode[idx].children.forEach(slot => {
                    let ctrl = slot.getComponent(FirstPayItemCtrl);
                    ctrl.setMaskStatus(false);
                });
                let curTime = GlobalUtil.getServerTime();
                let startZeroTime = TimerUtils.getZerohour(item.firstPayTime) * 1000;
                let day = Math.floor((curTime - startZeroTime) / (24 * 60 * 60 * 1000)) + 1;
                if (day >= idx + 1) {
                    // 可领取的奖励
                    node.getComponent(cc.Sprite).enabled = true;
                    node.getChildByName('sc_lingqudiban').getComponent(cc.Sprite).enabled = false;
                    let label = cc.find('sc_lingqudiban/label', node).getComponent(cc.Label);
                    label.string = StringUtils.format(gdk.i18n.t('i18n:STORE_TIP2'), str[idx]);
                    label.node.color = new cc.Color().fromHEX('#FFB08D');
                    node.getChildByName('zb_huanseanniu').active = true;
                    node.getChildByName('zb_lanseanniu').active = false;
                    return;
                }
                let status = item.rewarded;
                if (day == idx && idx > 0 && (status &= 1 << idx - 1) > 0) {
                    // 上一个奖励已经被领取
                    node.getComponent(cc.Sprite).enabled = true;
                    node.getChildByName('sc_lingqudiban').getComponent(cc.Sprite).enabled = false;
                    node.getChildByName('zb_huanseanniu').active = false;
                    node.getChildByName('zb_lanseanniu').active = true;
                    this.countDownNode = node;
                    this.countDownDay = day;
                    this._countDown(node);
                }
                else {
                    // 剩余可领的奖励
                    node.getComponent(cc.Sprite).enabled = false;
                    node.getChildByName('sc_lingqudiban').getComponent(cc.Sprite).enabled = true;
                    let label = cc.find('sc_lingqudiban/label', node).getComponent(cc.Label);
                    label.string = StringUtils.format(gdk.i18n.t('i18n:STORE_TIP3'), str[idx]);
                    label.node.color = new cc.Color().fromHEX('#FFB08D');
                    node.getChildByName('zb_huanseanniu').active = false;
                    node.getChildByName('zb_lanseanniu').active = false;
                }
            }
        });
    }

    _countDown(node: cc.Node) {
        let item = this.current;
        let curTime = GlobalUtil.getServerTime();
        let startZeroTime = TimerUtils.getZerohour(item.firstPayTime) * 1000;
        let day = Math.floor((curTime - startZeroTime) / (24 * 60 * 60 * 1000)) + 1;
        if (day != this.countDownDay) {
            this._showBtn();
            return;
        }
        let label = cc.find('sc_lingqudiban/label', node).getComponent(cc.Label);
        label.string = `${TimerUtils.format2(TimerUtils.getTomZerohour(curTime / 1000) - curTime / 1000)}${gdk.i18n.t('i18n:STORE_TIP4')}`;
        label.node.color = new cc.Color().fromHEX('#33ff41');
    }

    _updateOneDollarBtn() {
        this.oneDollarBtn.active = false;
    }

    /**跳转购买钻石充值界面 */
    buyDiamondFunc() {
        JumpUtils.openPanel({
            panelId: PanelId.Recharge,
            panelArgs: { args: 1 },
            currId: this.resId,
            callback: () => {
                let tabIndex = 3;
                let panel = gdk.panel.get(PanelId.RechargeLB);
                if (panel) {
                    let ctrl = panel.getComponent(RechargeLBCtrl);
                    ctrl.typeBtnSelect(null, tabIndex);
                }
                else {
                    gdk.panel.open(PanelId.RechargeLB, (node) => {
                        let ctrl = node.getComponent(RechargeLBCtrl);
                        ctrl.typeBtnSelect(null, tabIndex);
                    });
                }
            },
            blockInput: true,
        });
    }

    /**领取首充奖励 */
    getAwards(e: any, data: string) {
        let item = this.current;
        if (!item || item.rewarded == 7) {
            // 无效的数据
            return;
        }
        let cfg = ConfigManager.getItemById(Store_first_payCfg, this.index);
        let req = new icmsg.PayFirstRewardReq();
        req.grade = cfg.RMB_cost;
        req.index = parseInt(data) - 1;
        NetManager.send(req, () => {
            item.rewarded |= 1 << (parseInt(data) - 1);
            if (this.storeModel._hasGetFirstPayReward()) {
                // 奖励都已领取
                gdk.Timer.callLater(this, () => {
                    this.close();
                });
            }
            else {
                this._showBtn();
            }
        });
    }

    showHeroTip() {
        let cfg = ConfigManager.getItemById(Store_first_payCfg, this.index);
        let heroCfg = ConfigManager.getItemById(HeroCfg, cfg.model);
        gdk.panel.open(PanelId.HeroDetail, (node: cc.Node) => {
            let comp = node.getComponent(HeroDetailViewCtrl);
            comp.initHeroInfo(heroCfg);
        });
    }

    oneDollarBtnClick() {
        // if (StoreUtils.isAllRewardRecivedInOneDollarGiftView()) {
        //     this.oneDollarBtn.active = false;
        //     gdk.gui.showMessage('奖励已全部领取');
        //     return;
        // }
        // gdk.panel.open(PanelId.OneDollarGift);
    }

    /**
     显示前往充值或领取奖励按钮
     * */
    _showBtn() {
        //充值过，未领取奖励，领取按钮显示，充值按钮关闭
        let item = this.current;
        if (item && item.firstPayTime) {
            this.goRechargeBtn.active = false;
            //领取按钮显示
            this._updateRewardStatus();
        } else {
            //显示充值按钮
            this.goRechargeBtn.active = true;
            this.countDownNode = null;
            this.countDownDay = null;
            let slotNode = this.awardNode;
            let statusNode = this.infoNode;
            let str = [
                gdk.i18n.t('i18n:ADVENTURE_NUM_1'),
                gdk.i18n.t('i18n:ADVENTURE_NUM_2'),
                gdk.i18n.t('i18n:ADVENTURE_NUM_3'),
            ];
            statusNode.forEach((node, idx) => {
                slotNode[idx].children.forEach(slot => {
                    let ctrl = slot.getComponent(FirstPayItemCtrl);
                    ctrl.setMaskStatus(false);
                });
                node.getComponent(cc.Sprite).enabled = false;
                node.getChildByName('sc_lingqudiban').getComponent(cc.Sprite).enabled = true;
                let label = cc.find('sc_lingqudiban/label', node).getComponent(cc.Label);
                label.string = StringUtils.format(gdk.i18n.t('i18n:STORE_TIP3'), str[idx]);
                label.node.color = new cc.Color().fromHEX('#FFB08D');
                node.getChildByName('zb_huanseanniu').active = false;
                node.getChildByName('zb_lanseanniu').active = false;
            });
        }
        // 选择卡按钮
        let root = cc.find('tabs', this.node);
        let node = cc.find('btn0', root);
        let cfgs = ConfigManager.getItems(Store_first_payCfg);
        cfgs.forEach((cfg, index) => {
            let i = cfgs.length - index;
            let s = this.index == i;
            let n = cc.find('btn' + i, root);
            if (!n) {
                n = cc.instantiate(node);
                n.name = 'btn' + i;
                n.parent = root;
                n.active = true;
            }
            if (s) {
                // 当前选中的项，不需要处理按钮事件
                n.targetOff(this);
                // 刷新红点
                n.getComponent(RedPointCtrl)._updateView();
            } else {
                n.on('click', () => {
                    this.index = i;
                    this._refresh();
                }, this);
            }
            GlobalUtil.setSpriteIcon(
                this.node,
                cc.find('bg', n),
                `view/store/textrue/firstPay/tab/sc_leijianniu0${s ? 2 : 1}`
            );
            GlobalUtil.setSpriteIcon(
                this.node,
                cc.find('label', n),
                `view/store/textrue/firstPay/tab/${s ? 'sc_anniu0' : 'sc_anniuan0'}${i}`
            );
            let tips = n.getChildByName('tips');
            if (cfgs[i - 1].des_1 && cfgs[i - 1].des_1.length > 0 && this.storeModel.firstPaySum < SdkTool.tool.getRealRMBCost(cfgs[i - 1].RMB_cost)) {
                tips.active = true;
                tips.getChildByName('richtext').getComponent(cc.RichText).string = cfgs[i - 1].des_1;
            }
            else {
                tips.active = false;
            }
        });
        if (node.active) {
            node.active = false;
        }
    }

    /**选项卡按钮红点 */
    tabRedPoint(e: any, node: cc.Node) {
        let index = parseInt(node.name.substr(3));
        let cfg = ConfigManager.getItemById(Store_first_payCfg, index);
        let curTime = GlobalUtil.getServerTime();
        let ret = this.storeModel.firstPayList.some(item => {
            if (item.grade != cfg.RMB_cost) {
                return false;
            }
            for (let i = 0; i < 3; i++) {
                let byte = item.rewarded;
                if ((byte &= 1 << i) <= 0) {
                    let startZeroTime = TimerUtils.getZerohour(item.firstPayTime) * 1000;
                    let day = Math.floor((curTime - startZeroTime) / (24 * 60 * 60 * 1000)) + 1;
                    if (day >= i + 1) {
                        return true;
                    }
                }
            }
        });
        return ret;
    }
}