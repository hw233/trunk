import BagUtils from '../../../../common/utils/BagUtils';
import ButtonSoundId from '../../../../configs/ids/ButtonSoundId';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import InstanceModel from '../../model/InstanceModel';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import StoreViewCtrl from '../../../store/ctrl/StoreViewCtrl';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { BagEvent } from '../../../bag/enum/BagEvent';
import { BagItem } from '../../../../common/models/BagModel';
import {
    Copy_stage_masteryCfg,
    Copy_stageCfg,
    CopyCfg,
    Copysurvival_stageCfg,
    ItemCfg
    } from '../../../../a/config';
import { CopyEventId } from '../../../../common/models/CopyModel';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/instance/RaidsRewardViewCtrl")

export default class RaidsRewardViewCtrl extends gdk.BasePanel {


    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    //显示扫荡券的数量
    @property(cc.Label)
    hasNum: cc.Label = null;

    @property(cc.Label)
    costNum: cc.Label = null;

    //显示还差多少个需要的物品
    @property(cc.Label)
    needNum: cc.Label = null;

    //显示本次扫荡获得的物品数量
    @property(cc.Label)
    getNum: cc.Label = null;

    @property(cc.Node)
    needNumNode: cc.Node = null;

    @property(cc.Node)
    enoughTip: cc.Node = null;

    @property(cc.Label)
    itemName: cc.Label = null;

    @property(cc.Prefab)
    rewardItemPreb: cc.Prefab = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Node)
    tipsNode: cc.Node = null;

    @property(cc.Node)
    raidItemNode: cc.Node = null;

    @property(UiSlotItem)
    raidItem: UiSlotItem = null;

    list: ListView;
    rewards: icmsg.GoodsInfo[];
    needItem: BagItem;
    stageId: number;

    needRaidNum: number;
    myRaidNum: number;

    isRaid: boolean = false;
    onLoad() {
        gdk.e.on(CopyEventId.RSP_COPY_MAIN_RAIDS, this.reshData, this)
        gdk.e.on(BagEvent.UPDATE_ONE_ITEM, (e: gdk.Event) => {
            this.showRaidNum(this.stageId);
        }, this)
        gdk.e.on(BagEvent.UPDATE_BAG_ITEM, (e: gdk.Event) => {
            this.showRaidNum(this.stageId);
        }, this)
    }

    onEnable() {
        this.isRaid = false;
    }

    onDisable() {
        this.content.active = false;
    }

    onDestroy() {
        gdk.e.targetOff(this);
        this.list.destroy();
    }

    initListView(n: number) {
        if (this.list) {
            this.list.destroy();
        }
        let opt = {
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.rewardItemPreb,
            column: 4,
            gap_x: -5,
            gap_y: -5,
            async: false,
            direction: ListViewDir.Vertical,
        };
        this.list = new ListView(opt);

        // 奖励列表
        this.rewards = GlobalUtil.sortGoodsInfo(this.rewards);
        let list: any[] = [];
        for (let i = 0, n = this.rewards.length; i < n; i++) {
            let e = this.rewards[i];
            let extInfo = { itemId: e.typeId, itemNum: e.num };
            let itemId = e.typeId;
            let type = BagUtils.getItemTypeById(itemId);
            let item = {
                series: itemId,
                itemId: itemId,
                itemNum: extInfo.itemNum,
                type: type,
                extInfo: extInfo,
            };
            list.push({ index: i, info: item });
        }
        this.list.set_data(list, true);
    }

    initPanelData(data: icmsg.GoodsInfo[], stageId: number, args?: BagItem) {

        //刷新获得的物品列表
        this.rewards = data;
        this.stageId = stageId;
        this.initListView(data.length);
        let length = this.content.children.length;
        if (length == 0) {
            this.tipsNode.active = true;
        } else {
            this.tipsNode.active = false;
            for (let i = 0; i < length; i++) {
                let item = this.content.children[i];
                let pos = item.position;
                item.scaleX = 0.9;
                item.scaleY = 0.9;
                //item.x += 5//item.width * 0.1;
                //item.y -= 5//item.height * 0.1;
                item.opacity = 0;
                item.runAction(cc.sequence(
                    cc.delayTime(0.1 * (i + 1)),
                    cc.callFunc(() => {
                        item.opacity = 255
                        let itemConfig = <any>BagUtils.getConfigById(data[i].typeId)
                        if (itemConfig && GlobalUtil.isSoundOn) {
                            if (itemConfig.color == 3 || itemConfig.color == 4) {
                                gdk.sound.play(gdk.Tool.getResIdByNode(this.node), ButtonSoundId.result)
                            } else {
                                gdk.sound.play(gdk.Tool.getResIdByNode(this.node), ButtonSoundId.common)
                            }
                        }
                    }),
                    cc.spawn(cc.moveTo(0.1, pos), cc.scaleTo(0.1, 1, 1))

                ));
            }
        }

        //显示扫荡券数量
        this.showRaidNum(this.stageId)

        //判断
        if (args) {
            this.needItem = args;
            this.ReSetItemInfo()

        } else {
            this.raidItemNode.active = false;
        }
    }

    showRaidNum(stageId: number) {
        if (!stageId && stageId <= 0) {
            return;
        }
        let subtype: number = 1;
        let tem: Copy_stageCfg = ConfigManager.getItemById(Copy_stageCfg, stageId);
        if (!tem) {
            let tem1 = ConfigManager.getItemById(Copy_stage_masteryCfg, stageId);
            if (tem1) {
                subtype = tem1.subtype
            } else {
                let tem2 = ConfigManager.getItemById(Copysurvival_stageCfg, stageId);
                if (tem2) {
                    subtype = tem2.subtype
                }
            }
        } else {
            subtype = tem.subtype
        }
        let copyCfg: CopyCfg = ConfigManager.getItemByField(CopyCfg, "subtype", subtype);
        let needRaidNum = copyCfg.quick_cost[1]
        let myRaidNum = BagUtils.getItemNumById(copyCfg.quick_cost[0])
        this.hasNum.string = `${myRaidNum}`
        this.costNum.string = `${needRaidNum}`

        if (myRaidNum >= needRaidNum) {
            this.hasNum.node.color = cc.color("#00ff00")
        } else {
            this.hasNum.node.color = cc.color("#ff0000")
        }
        // if (myRaidNum >= needRaidNum) {
        //     this.richText1.string = '消耗：<color=#00ff00>' + myRaidNum + '</c>/' + needRaidNum
        // } else {
        //     this.richText1.string = '消耗：<color=#ff0000>' + myRaidNum + '</c>/' + needRaidNum
        // }
        //tips文字修改
        let tipsLb = this.tipsNode.getComponent(cc.RichText);
        if (tipsLb) {
            tipsLb.string = "扫荡可获得<color=#85ED83>" + 5 * needRaidNum + "</c>小时挂机掉落"
        }
        if (this.needItem) {
            this.ReSetItemInfo()
        }
        this.myRaidNum = myRaidNum;
        this.needRaidNum = needRaidNum;
    }

    reshData(e: gdk.Event) {
        this.initPanelData(e.data.rewards, e.data.id);
        if (this.needItem) {
            this.ReSetItemInfo()
        }
    }

    /**
     * 刷新需要获取得材料信息
     */
    ReSetItemInfo() {
        this.raidItemNode.active = true;
        let itemNumber = 0;
        if (this.rewards.length > 0) {
            for (let i = 0; i < this.rewards.length; i++) {
                let tem = this.rewards[i];
                if (tem.typeId == this.needItem.itemId) {
                    itemNumber = tem.num;
                    break;
                }
            }
        }
        //this.richText3.string = '本次扫荡获得个数：<color=#ff0000>' + itemNumber + '</c>个';
        this.getNum.string = `${itemNumber}`
        this.getNum.node.parent.active = this.isRaid;

        let cfg = ConfigManager.getItemById(ItemCfg, this.needItem.itemId)
        this.itemName.string = cfg.name
        this.itemName.node.color = BagUtils.getColor(cfg.color)
        this.raidItem.updateItemInfo(this.needItem.itemId)
        let myItemNum = BagUtils.getItemNumById(this.needItem.itemId)
        if (myItemNum >= this.needItem.itemNum) {
            this.enoughTip.active = true
            this.needNumNode.active = false
            //this.richText2.string = '<color=#00ff00>已足够</c>'
        } else {
            let num = this.needItem.itemNum - myItemNum;
            //this.richText2.string = '还差<color=#ff0000>' + num + '</c>个';
            this.needNum.string = `${num}`

            this.enoughTip.active = false
            this.needNumNode.active = true
        }
        // this.myRaidNum = myItemNum;
        // this.needRaidNum = this.needItem.itemNum;
    }

    /**
     * 再次扫荡
     */
    ReSetRaidClick() {
        // ReSetRaidClick this.stageId = 111004
        // ReSetRaidClick this.stageId = 207001

        if (this.needRaidNum > this.myRaidNum) {
            cc.log("ReSetRaidClick this.stageId =", this.stageId);
            let stageId = this.stageId;
            let self = this;

            let panelType = 0;
            if (gdk.panel.isOpenOrOpening(PanelId.Instance)) {
                panelType = 1;
            }
            if (gdk.panel.isOpenOrOpening(PanelId.CityMapView)) {
                panelType = 2; //城市地图
            }

            GlobalUtil.openAskPanel({
                title: "温馨提示",
                descText: `是否去商店购买扫荡券？`,
                sureText: "前往",
                sureCb: () => {
                    gdk.panel.open(PanelId.Store, (node: cc.Node) => {
                        let comp = node.getComponent(StoreViewCtrl)
                        comp.menuBtnSelect(null, 1);

                        gdk.panel.hide(PanelId.RaidReward);
                        if (panelType == 1) {
                            gdk.panel.hide(PanelId.Instance);
                        } else if (panelType == 0) {
                            gdk.panel.hide(PanelId.MLEnterStagePanel);
                            gdk.panel.hide(PanelId.MainLineView);

                        } else if (panelType == 2) {
                            gdk.panel.hide(PanelId.CityMapView);
                            gdk.panel.hide(PanelId.EnterStageView);
                        }

                        let trigger = gdk.NodeTool.onStartHide(node);
                        trigger.on(() => {
                            trigger.targetOff(self);
                            //主线
                            if (panelType == 0) {
                                gdk.panel.open(PanelId.RaidReward, (node: cc.Node) => {
                                    let ctrl = node.getComponent(RaidsRewardViewCtrl);
                                    ctrl.initPanelData([], stageId);
                                });
                                //生存训练
                            } else if (panelType == 1) {
                                let instModel = ModelManager.get(InstanceModel)
                                gdk.panel.setArgs(PanelId.Instance, instModel.selectInstanceData);
                                gdk.panel.open(PanelId.Instance, (node: cc.Node) => {
                                    gdk.panel.open(PanelId.RaidReward, (node: cc.Node) => {
                                        let ctrl = node.getComponent(RaidsRewardViewCtrl);
                                        ctrl.initPanelData([], stageId);
                                    });
                                });
                            } else if (panelType == 2) {
                                gdk.panel.open(PanelId.RaidReward, (node: cc.Node) => {
                                    let ctrl = node.getComponent(RaidsRewardViewCtrl);
                                    ctrl.initPanelData([], stageId);
                                });
                            }
                        }, this);

                    })
                }
            })
            return;
        }
        this.isRaid = true;

        let msg = new icmsg.DungeonRaidsReq();
        msg.stageId = this.stageId;
        NetManager.send(msg);
    }

}

