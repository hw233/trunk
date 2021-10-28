import BagUtils from '../../../common/utils/BagUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import CopyModel, { CopyEventId } from '../../../common/models/CopyModel';
import CopyUtil from '../../../common/utils/CopyUtil';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import JumpUtils from '../../../common/utils/JumpUtils';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import RewardItem from '../../../common/widgets/RewardItem';
import RoleModel from '../../../common/models/RoleModel';
import StoreViewCtrl from '../../store/ctrl/StoreViewCtrl';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import WipeOutChipCtrl from './WipeOutChipCtrl';
import { AskInfoCacheType } from '../../../common/widgets/AskPanel';
import { BagEvent } from '../../bag/enum/BagEvent';
import { BagItem } from '../../../common/models/BagModel';
import {
    Copy_hardcoreCfg,
    Copy_stageCfg,
    CopyCfg,
    Item_composeCfg,
    ItemCfg
    } from '../../../a/config';
import { StageData } from './CityStageItemCtrl';
import CityMapViewCtrl from './CityMapViewCtrl ';


/**
 * 主线关卡信息详情
 * @Author: jijing.liu
 * @Description:
 * @Date: 2019-03-21 09:57:55
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-01-05 19:32:16
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/map/EnterStageViewCtrl")
export default class EnterStageViewCtrl extends gdk.BasePanel {

    @property(cc.Label)
    needPower: cc.Label = null;

    @property(cc.Label)
    needLv: cc.Label = null;

    // @property(cc.Label)
    // cpusLabel: cc.Label = null;

    @property(cc.Label)
    rewardLabel: cc.Label = null;

    @property(cc.Prefab)
    rewardItemPreb: cc.Prefab = null;

    @property(cc.Node)
    rewardContent: cc.Node = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    // @property(cc.Node)
    // cupContent: cc.Node = null;
    @property(cc.Node)
    costNode: cc.Node = null;

    @property(cc.Node)
    bg1: cc.Node = null;

    @property(cc.Node)
    contentNode: cc.Node = null;

    @property(cc.Node)
    sweepNode: cc.Node = null;

    @property(cc.Node)
    raidNode: cc.Node = null;

    @property(cc.Label)
    raidNum: cc.Label = null;

    @property(cc.Label)
    raidNeedNum: cc.Label = null;

    @property(cc.Label)
    raidItemName: cc.Label = null;

    @property(UiSlotItem)
    raidItem: UiSlotItem = null;

    @property(cc.Node)
    enoughTip: cc.Node = null;

    @property(cc.Node)
    needNumNode: cc.Node = null;

    @property(cc.Node)
    wipeoutChipNode: cc.Node = null;

    @property(cc.Button)
    quickBtn: cc.Button = null;
    @property(cc.Button)
    fightBtn: cc.Button = null;
    @property(cc.Button)
    hangBtn: cc.Button = null;
    @property(cc.Button)
    replayBtn: cc.Button = null;
    @property(cc.RichText)
    decRichtext: cc.RichText = null; //精英副本条件描述

    fromPanelId: string;    // 从哪个界面打开的, PanelId定义
    data: StageData;
    get model(): CopyModel { return ModelManager.get(CopyModel); }
    _raidRewards = []
    _raidNeedItem: BagItem = null
    _showEffect = false
    _showRaid = false

    updateData(data: StageData) {
        this.data = data;
        let cfg: Copy_stageCfg = data.stageCfg;
        let args = this.args;
        this.fromPanelId = args[0];
        this.contentNode.active = true;
        this.sweepNode.active = false;
        this.bg1.active = true

        if (this.decRichtext) {
            if (cfg.copy_id == 12 || cfg.copy_id == 13) {
                let decStr = '';
                let i = 0;
                if (!cc.js.isString(cfg.hardcoreList)) {
                    cfg.hardcoreList.forEach(id => {
                        let temCfg: Copy_hardcoreCfg = ConfigManager.getItemById(Copy_hardcoreCfg, id)
                        if (temCfg && temCfg.dec != '') {
                            decStr += i > 0 ? '\n' + temCfg.dec : temCfg.dec;
                            i++;
                        }
                    })
                }
                this.decRichtext.node.active = true;
                this.decRichtext.string = decStr;//'<color=#00ff00>[敌方生效]</c><color=#0fffff> 敌方获得免疫火伤技能</color>\n<color=#00ff00>[我方生效]</c><color=#0fffff> 我方获得免疫火伤</color>\n<color=#00ff00>[我方生效]</c><color=#0fffff> 我方获得免疫火伤免疫火伤</color>'
                if (this.decRichtext.node.width >= 580) this.decRichtext.maxWidth = 580;
                else this.decRichtext.maxWidth = 0;
            } else {
                this.decRichtext.string = '';
                this.decRichtext.node.active = false;
            }
        }


        this.title = cfg.name;
        this.needPower.string = cfg.power || 0;
        this.needLv.string = cfg.advice_lv ? `${cfg.advice_lv}` : "-";
        this.rewardContent.removeAllChildren();

        // 奖励列表
        let isPass = CopyUtil.isStagePassed(cfg.id);
        let rewards: any[] = [];
        if (cfg.copy_id != 12 && cfg.copy_id != 13) {
            rewards = isPass ? cfg.drop_show : cfg.first_reward;
        } else {
            rewards = cfg.first_reward;
            isPass = false;
        }
        let length = rewards.length;
        if (length > 1) {
            rewards.sort((a, b) => {
                let typeIdA = a instanceof Array ? a[0] : a;
                let typeIdB = b instanceof Array ? b[0] : b;
                let cfgA = BagUtils.getConfigById(typeIdA);
                let cfgB = BagUtils.getConfigById(typeIdB);
                if (cfgA.defaultColor == cfgB.defaultColor) return cfgB.id - cfgA.id;
                else return cfgB.defaultColor - cfgA.defaultColor;
            })
        }
        for (let i = 0; i < length; i++) {
            let n = cc.instantiate(this.rewardItemPreb);
            n.scaleX = n.scaleY = 1;
            n.parent = this.rewardContent;
            // 更新图标
            let c = n.getComponent(RewardItem);
            c.data = {
                typeId: isPass ? rewards[i] : rewards[i][0],
                num: isPass ? 1 : rewards[i][1],
                dropAddNum: isPass ? GlobalUtil.getDropAddNum(cfg, rewards[i]) : [0, 0]
            };
            c.updateView();
        }
        if (length < 5) {
            let n = this.scrollView.node;
            n.x = -n.width / 2 + (n.width - length * 115) / 2;
        }
        this.rewardLabel.string = isPass ? gdk.i18n.t("i18n:HANG_REWARDS") : gdk.i18n.t("i18n:FIRST_REWARDS");
        // 按钮状态
        // let b = this.fromPanelId == PanelId.CityMapView.__id__;
        // this.fightBtn.interactable = b && CopyUtil.isStageEnterable(cfg.id);
        this.fightBtn.node.active = !isPass;
        this.replayBtn.node.active = !isPass;

        this.hangBtn.node.active = isPass;
        this.quickBtn.node.active = isPass;
        this.costNode.active = isPass;
        if (isPass) {
            let hangLab = this.hangBtn.node.getChildByName("label").getComponent(cc.Label)
            hangLab.string = this.model.hangStageId == cfg.id ? "挂机中" : "挂机"
            let [myRaidNum, needRaidNum] = this._initSweepInfo(cfg.id);
            this.costNode.getChildByName('sweepCostLabel').getComponent(cc.RichText).string = `消耗: <color=#7EF662>${myRaidNum}</c> /${needRaidNum}`;
        }
        // 事件处理
        gdk.e.on(BagEvent.UPDATE_ONE_ITEM, this._updateLater, this)
        gdk.e.on(BagEvent.UPDATE_BAG_ITEM, this._updateLater, this)
        gdk.e.on(CopyEventId.RSP_COPY_MAIN_RAIDS, this._raidResult, this);
    }

    _initSweepInfo(stageId: number) {
        if (!stageId && stageId <= 0) {
            return;
        }
        let tem: Copy_stageCfg = CopyUtil.getStageConfig(stageId);
        let subtype: number = tem.subtype
        let copyCfg: CopyCfg = ConfigManager.getItemByField(CopyCfg, "subtype", subtype);
        let needRaidNum = copyCfg.quick_cost[1]
        let myRaidNum = BagUtils.getItemNumById(copyCfg.quick_cost[0])
        return [myRaidNum, needRaidNum];
    }

    onDisable() {
        gdk.e.emit(BagEvent.AUTO_COMPOSE_CHIP)
        gdk.e.targetOff(this);
        NetManager.targetOff(this);
        gdk.Timer.clearAll(this)
    }


    _updateLater() {
        gdk.Timer.callLater(this, this._updateCostNum)
    }

    _updateCostNum() {
        let [myRaidNum, needRaidNum] = this._initSweepInfo(this.data.stageCfg.id);
        this.costNode.getChildByName('sweepCostLabel').getComponent(cc.RichText).string = `消耗: <color=#7EF662>${myRaidNum}</c> /${needRaidNum}`;
        //扫荡结果
        if (this.model.needItem) {
            let needItem = this.model.needItem

            let composeCfg = ConfigManager.getItemByField(Item_composeCfg, "target", needItem.itemId)

            let rewards = this._raidRewards
            let itemNumber = 0;
            let chipNum = 0
            let chipId = 0
            if (rewards.length > 0) {
                for (let i = 0; i < rewards.length; i++) {
                    let tem = rewards[i];
                    if (tem.typeId == needItem.itemId) {
                        itemNumber = tem.num;
                        break;
                    }

                    if (composeCfg && tem.typeId == composeCfg.id) {
                        chipId = tem.typeId
                        chipNum = tem.num
                    }
                }
            }

            if (itemNumber > 0) {
                if (this._showRaid) {
                    this._showRaid = false
                    this.wipeoutChipNode.active = false
                    this.raidNode.active = true
                }
                this.raidNum.string = `${itemNumber}`
                let cfg = ConfigManager.getItemById(ItemCfg, needItem.itemId)
                this.raidItemName.string = cfg.name
                this.raidItemName.node.color = BagUtils.getColor(cfg.color)
                this.raidItem.updateItemInfo(needItem.itemId)
                let myItemNum = BagUtils.getItemNumById(needItem.itemId)
                if (myItemNum >= needItem.itemNum) {
                    this.enoughTip.active = true
                    this.needNumNode.active = false
                } else {
                    let num = needItem.itemNum - myItemNum;
                    this.raidNeedNum.string = `${num}`

                    this.enoughTip.active = false
                    this.needNumNode.active = true
                }

                if (this._showEffect) {
                    this._showEffect = false

                    //展示剩余的合成效果
                    gdk.Timer.once(1200, this, () => {
                        this.raidNode.active = false
                        this.wipeoutChipNode.active = false
                        //普通扫荡
                        let showInfos: icmsg.GoodsInfo[] = []
                        rewards.forEach(element => {
                            let composeCfg = ConfigManager.getItemById(Item_composeCfg, element.typeId)
                            if (composeCfg) {
                                showInfos.push(element)
                            }
                        });
                        this._updateWipeoutChip(showInfos)
                    })
                }
            } else {
                if (this._showEffect) {
                    this._showEffect = false
                    this.wipeoutChipNode.active = true
                    let ctrl = this.wipeoutChipNode.getComponent(WipeOutChipCtrl)
                    if (chipId > 0 && chipNum > 0) {
                        ctrl.updateView(chipId, chipNum)
                    }
                    //展示剩余的合成效果
                    gdk.Timer.once(1200, this, () => {
                        let showInfos: icmsg.GoodsInfo[] = []
                        rewards.forEach(element => {
                            let composeCfg = ConfigManager.getItemById(Item_composeCfg, element.typeId)
                            if (composeCfg && element.typeId != chipId) {
                                showInfos.push(element)
                            }
                        });
                        this._updateWipeoutChip(showInfos)
                    })

                }
            }
        } else {

            if (this._showEffect) {
                this._showEffect = false
                this.wipeoutChipNode.active = false
                //普通扫荡
                let rewards = this._raidRewards
                let showInfos: icmsg.GoodsInfo[] = []
                rewards.forEach(element => {
                    let composeCfg = ConfigManager.getItemById(Item_composeCfg, element.typeId)
                    if (composeCfg) {
                        showInfos.push(element)
                    }
                });
                this._updateWipeoutChip(showInfos)
            }

        }
    }

    _updateWipeoutChip(goods: icmsg.GoodsInfo[]) {
        for (let i = 0; i < goods.length; i++) {
            gdk.Timer.once(i * 1200, this, () => {
                this.wipeoutChipNode.active = true
                let ctrl = this.wipeoutChipNode.getComponent(WipeOutChipCtrl)
                ctrl.updateView(goods[i].typeId, goods[i].num)
            })
        }
    }

    _raidResult(e: gdk.Event) {
        this._raidRewards = e.data.rewards
        this._showEffect = true
        this._showRaid = true
    }

    // 奖杯点击
    // onCupsClick() {
    //     gdk.panel.open(PanelId.MlStageCupsView, (panel: cc.Node) => {
    //         let cpm: MlStageCupsDetail = panel.getComponent(MlStageCupsDetail);
    //         cpm.cfg = this.data.stageCfg;
    //     });
    // }

    // 扫荡
    onQuick() {
        let [myRaidNum, needRaidNum] = this._initSweepInfo(this.data.stageCfg.id);
        if (needRaidNum > myRaidNum) {
            let panelType = 0;
            if (gdk.panel.isOpenOrOpening(PanelId.SubCareerPanel2)) {
                panelType = 1;  // 英雄升阶界面,物品获得途径跳转
            }
            if (gdk.panel.isOpenOrOpening(PanelId.CityMapView)) {
                panelType = 2; //城市地图界面跳转
            }
            if (gdk.panel.isOpenOrOpening(PanelId.Bag)) {
                panelType = 3; //背包界面跳转
            }
            let panel = this.config;
            GlobalUtil.openAskPanel({
                title: "温馨提示",
                descText: `是否去商店购买扫荡券？`,
                sureText: "前往",
                sureCb: () => {
                    gdk.panel.open(PanelId.Store, (node) => {
                        let data = this.data;
                        this.close();
                        panelType == 2 && gdk.panel.hide(PanelId.CityMapView);
                        let comp = node.getComponent(StoreViewCtrl)
                        comp.menuBtnSelect(null, 1);
                        let trigger = gdk.NodeTool.onStartHide(node);
                        trigger.on(() => {
                            trigger.targetOff(this);
                            if (panelType == 1) {
                                gdk.panel.setArgs(PanelId.RoleView2, [2]);
                                gdk.panel.open(PanelId.RoleView2, (node) => {
                                    gdk.panel.open(panel, (node) => {
                                        let ctrl = node.getComponent(EnterStageViewCtrl);
                                        ctrl.updateData(data);
                                    });
                                })
                            }
                            else if (panelType == 2) {
                                gdk.panel.open(PanelId.CityMapView, (node) => {
                                    let ctrl = node.getComponent(CityMapViewCtrl);
                                    let sid = data.stageCfg.id;
                                    ctrl.curCityId = CopyUtil.getChapterId(sid);
                                    let cfg = ConfigManager.getItemById(Copy_stageCfg, sid);
                                    ctrl.initData(cfg.copy_id == 7 ? 1 : 0);
                                    ctrl.openStage(sid);
                                });
                            }
                            else if (panelType == 3) {
                                gdk.panel.open(PanelId.Bag, () => {
                                    gdk.panel.open(panel, (node) => {
                                        let ctrl = node.getComponent(EnterStageViewCtrl);
                                        ctrl.updateData(data);
                                    });
                                })
                            }
                            else {
                                gdk.panel.open(panel, (node) => {
                                    let ctrl = node.getComponent(EnterStageViewCtrl);
                                    ctrl.updateData(data);
                                });
                            }
                        }, this)
                    });
                }
            })
            return;
        }
        this.contentNode.active = false;
        this.sweepNode.active = true;
        this.bg1.active = false
        this.title = '扫荡结果'
        let msg = new icmsg.DungeonRaidsReq();
        msg.stageId = this.data.stageCfg.id;
        NetManager.send(msg);
    }

    // 挑战
    onFight() {
        let cfg = this.data.stageCfg;
        if (ModelManager.get(RoleModel).level < cfg.player_lv) {
            if (cfg.player_lv >= 999) {//未开启的关卡
                gdk.gui.showMessage('正在努力寻找敌人踪迹……');
            } else {
                gdk.gui.showMessage(`指挥官等级达到${cfg.player_lv}级可进行挑战`);
            }
            return;
        }
        if (cfg.copy_id != 12 && cfg.copy_id != 13) {
            if (!CopyUtil.isStageUnlock(cfg.id)) {
                gdk.gui.showMessage("上一关未解锁");
                return;
            }
        }

        gdk.panel.hide(PanelId.SubEliteGroupView);
        gdk.panel.hide(PanelId.WorldMapView);
        gdk.panel.hide(PanelId.CityMapView);
        gdk.panel.hide(PanelId.SubEliteChallengeView);
        this.close();

        JumpUtils.openInstance(this.data.stageCfg.id);
    }

    // 挂机
    onHanding() {
        let b = this.fromPanelId == PanelId.CityMapView.__id__;
        let cfg = this.data.stageCfg;
        let p = CopyUtil.isStagePassed(cfg.id);
        if (b && p && this.model.hangStageId == cfg.id) {
            gdk.gui.showMessage("该关卡挂机中")
            //保存跳转的数据在缓存
            let info = this.model.hangItemInfo
            if (info && info.itemId > 0) {
                let id = info.itemId
                let composeCfg = ConfigManager.getItemByField(Item_composeCfg, "target", info.itemId)
                if (composeCfg) {
                    id = composeCfg.id
                }
                if (cfg.drop_show.indexOf(id) != -1 || cfg.drop_show.indexOf(info.itemId)) {
                    GlobalUtil.setCookie("hangItem_Flag", info)
                }
            }
            return
        }

        GlobalUtil.openAskPanel({
            thisArg: this,
            title: this.rewardLabel.string = gdk.i18n.t("i18n:HANG_TITLE"),
            sureCb: () => {
                NetManager.once(icmsg.DungeonHangStatusRsp.MsgType, () => {
                    if (!cc.isValid(this.node)) return;
                    if (!this.enabled) return;
                    this.close();
                }, this);
                this.model.hangStageId = cfg.id;
                NetManager.send(new icmsg.DungeonHangChooseReq({ stageId: this.model.hangStageId }));

                let hangCityId = Math.floor((this.model.hangStageId % 10000) / 100);
                let hangSid = this.model.hangStageId % 100;
                gdk.gui.showMessage(`挂机关卡变更为 ${hangCityId}-${hangSid}`)
                //保存跳转的数据在缓存
                let info = this.model.hangItemInfo
                if (info && info.itemId > 0) {
                    let id = info.itemId
                    let composeCfg = ConfigManager.getItemByField(Item_composeCfg, "target", info.itemId)
                    if (composeCfg) {
                        id = composeCfg.id
                    }
                    if (cfg.drop_show.indexOf(id) != -1 || cfg.drop_show.indexOf(info.itemId)) {
                        GlobalUtil.setCookie("hangItem_Flag", info)
                    }
                }
            },
            descText: this.rewardLabel.string = gdk.i18n.t("i18n:HANG_ALERT"),
            isShowTip: true,
            tipText: "本次登录不再提示",
            tipSaveCache: AskInfoCacheType.enter_stage_tip
        });
    }

    // @gdk.binding('viewModel.stageCupInfo')
    // updaCup() {
    //     // let num = this.viewModel.getCupCount(this.viewModel.stageCupInfo[this.cfg.id]);
    //     // let max = this.viewModel.stageCupsNum[this.cfg.id];
    //     // if (max > 0) {
    //     //     this.cupContent.active = true
    //     //     this.cpusLabel.string = `${num}/${max}`;
    //     // } else {
    //     //     this.cupContent.active = false
    //     // }
    // }

    // 打开回放列表界面
    openReplayList() {
        JumpUtils.openReplayListView(this.data.stageCfg.id);
    }
}
