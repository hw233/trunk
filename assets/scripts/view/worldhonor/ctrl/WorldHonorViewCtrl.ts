import ActUtil from '../../act/util/ActUtil';
import ArenaHonorPlayerItemCtrl from '../../arenahonor/ctrl/ArenaHonorPlayerItemCtrl';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import JumpUtils from '../../../common/utils/JumpUtils';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import RoleModel from '../../../common/models/RoleModel';
import StoreViewCtrl, { StoreActScoreTabType } from '../../store/ctrl/StoreViewCtrl';
import TimerUtils from '../../../common/utils/TimerUtils';
import UiTabMenuCtrl from '../../../common/widgets/UiTabMenuCtrl';
import WorldHonorModel from '../../../common/models/WorldHonorModel';
import WorldHonorUtils from '../utils/WorldHonorUtils';
import { Arenahonor_worldwideCfg, Arenahonor_worshipCfg } from '../../../a/config';


/**
 * enemy世界巅峰赛界面控制器
 * @Author: yaozu.hu
 * @Date: 2019-10-28 10:48:51
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-10-13 10:35:58
 */
const { ccclass, property, menu } = cc._decorator;
function hasId(v: any): boolean {
    return v.id == this.id;
}
@ccclass
@menu("qszc/view/worldhonor/WorldHonorViewCtrl")
export default class WorldHonorViewCtrl extends gdk.BasePanel {



    @property(cc.Label)
    titleLb: cc.Label = null;
    @property(cc.Label)
    actTimeLb: cc.Label = null;
    @property(UiTabMenuCtrl)
    stateMenu: UiTabMenuCtrl = null;
    @property(UiTabMenuCtrl)
    groupMenu: UiTabMenuCtrl = null;


    @property(cc.Node)
    stateNode1: cc.Node = null;
    @property([cc.Node])
    players1: cc.Node[] = [];
    @property([cc.Node])
    flowers: cc.Node[] = []

    @property(cc.Node)
    stateNode2: cc.Node = null;
    @property([cc.Node])
    players2: cc.Node[] = []
    @property([cc.Node])
    lines2: cc.Node[] = [];
    @property([cc.Node])
    effects2: cc.Node[] = []

    @property(cc.Node)
    stateNode3: cc.Node = null;
    @property([cc.Node])
    players3: cc.Node[] = []
    @property([cc.Node])
    lines3: cc.Node[] = []
    @property([cc.Node])
    effects3: cc.Node[] = []

    @property(cc.Node)
    defenderBtn: cc.Node = null;
    @property([cc.Node])
    GroupEffects: cc.Node[] = [];

    @property(cc.Node)
    guessRed: cc.Node = null;
    @property(cc.Node)
    defenderRed: cc.Node = null;
    @property(cc.Node)
    state1Red: cc.Node = null;

    @property(cc.Node)
    titleNode: cc.Node = null;

    canOpenState1: boolean = false;
    canOpenState3: boolean = false;
    //当前赛事类型(0晋级赛 1冠军赛)
    stateNum: number = 0;

    //当前选择的组
    groupNum: number = -1;

    get model(): WorldHonorModel { return ModelManager.get(WorldHonorModel); }
    get roleModel(): RoleModel { return ModelManager.get(RoleModel); }

    actId: number = 112;
    actType: number = 1;

    curCfg: Arenahonor_worldwideCfg;


    myGroup: number = -1;

    curProId: number = 1;

    sendMsg: boolean = false;

    //玩家排名ID
    rankPlayerIds: number[] = []

    _leftTime: number;
    get leftTime(): number { return this._leftTime; }
    set leftTime(v: number) {
        if (!v && v !== 0) {
            return;
        }
        this._leftTime = Math.max(0, v);
        if (this._leftTime == 0) {
            // this.close();
            this.curProId = WorldHonorUtils.getCurProgressId();
            if (!this.curProId) {
                this.actTimeLb.string = gdk.i18n.t("i18n:ACTIVITY_TIME_TIP3");//'活动已结束';
            } else if (!this.sendMsg) {
                this.sendMsg = true;
                let msg = new icmsg.ArenaHonorGroupReq()
                msg.world = true;
                NetManager.send(msg);
            }
        }
        else {
            this.actTimeLb.string = TimerUtils.format1(this.leftTime / 1000);
        }
    }

    onEnable() {

        this.defenderBtn.active = false;
        this.actType = ActUtil.getActRewardType(this.actId);
        //获取当前的时期
        this.curProId = WorldHonorUtils.getCurProgressId();
        if (!this.curProId) {
            this.canOpenState3 = true;
            this.canOpenState1 = true;
            this.titleLb.string = '';
            this.actTimeLb.string = gdk.i18n.t("i18n:ACTIVITY_TIME_TIP3");
        } else {
            this.canOpenState1 = false;
            this.curCfg = ConfigManager.getItemById(Arenahonor_worldwideCfg, this.curProId);
            this.titleLb.string = '进行中:' + this.curCfg.subject_name;
            if (this.curCfg.progress >= 5) {
                this.canOpenState3 = true;
            }
            this._updateTime();
        }

        NetManager.on(icmsg.ArenaHonorGroupRsp.MsgType, this.initArenaHonorData, this);

        let msg = new icmsg.ArenaHonorGroupReq()
        msg.world = true;
        NetManager.send(msg);
        let temCfg = ConfigManager.getItems(Arenahonor_worshipCfg)[0]
        this.maxNum = temCfg.worship_times
        this.addNum = temCfg.worship_value
        //this.stateMenu.setSelectIdx(this.stateNum);
    }

    onDisable() {
        NetManager.targetOff(this)
    }

    _dtime: number = 0;
    update(dt: number) {
        if (!this.leftTime) {
            return;
        }
        if (this._dtime >= 1) {
            this._dtime = 0;
            this._updateTime();
        }
        else {
            this._dtime += dt;
        }
    }

    _updateTime() {
        let curTime = GlobalUtil.getServerTime();
        let ct = WorldHonorUtils.getTimesById(this.curProId)[1];
        this.leftTime = ct - curTime;

    }

    initArenaHonorData(rsp: icmsg.ArenaHonorGroupRsp) {

        this.curNum = this.maxNum - rsp.giveFlower;
        this.curNum = Math.max(0, this.curNum)

        this.sendMsg = false;
        this.model.playersInfoMap = {};
        rsp.players.forEach(p => {
            this.model.playersInfoMap[p.roleBrief.id] = p.roleBrief;
            this.model.playersFlowerMap[p.roleBrief.id] = p.flower;
            if (p.roleBrief.guildId > 0) {
                this.model.guildNameMap[p.roleBrief.guildId] = p.guildName;
            }
        })
        this.model.draw = rsp.draw;
        this.model.giveFlower = rsp.giveFlower;
        this.model.list = rsp.list;
        this.model.list.sort((a: icmsg.ArenaHonorMatch, b: icmsg.ArenaHonorMatch) => {
            if (a.group == b.group) {
                return a.match - b.match
            } else {
                return a.group - b.group;
            }
        })
        let lastGroup = 0;
        let lastMatch = 0;
        let showEffectGroup = -1;
        let localProId = 0;
        let localState = false;
        let showDefenferBtn = false;
        //判断玩家是否在列表中
        this.model.list.forEach(data => {
            if (data.players.length > 0) {
                data.players.forEach((player, index) => {
                    if (player.id == this.roleModel.id) {
                        lastGroup = data.group;
                        lastMatch = data.match;
                        if (data.winner == 0) {
                            showEffectGroup = lastGroup;
                            showDefenferBtn = true;
                        } else {
                            let temCfg = ConfigManager.getItem(Arenahonor_worldwideCfg, (cfg: Arenahonor_worldwideCfg) => {
                                if (cfg.group != '' && cfg.group.indexOf(lastGroup) >= 0 &&
                                    cfg.match != '' && cfg.match.indexOf(lastMatch) >= 0) {
                                    return true;
                                }
                            })
                            if (temCfg) {
                                localProId = temCfg.id;
                            }
                            localState = data.winner - 1 == index;

                        }

                    }
                })
            }
        })

        let arenaHonorLocalData = GlobalUtil.getLocal('WorldHonor_ProgressData')
        if (lastGroup > 0) {
            if (this.curProId == 1) {
                if (!arenaHonorLocalData || arenaHonorLocalData[0] != this.actType) {
                    gdk.panel.setArgs(PanelId.WorldHonorResultView, 1, true);
                    gdk.panel.open(PanelId.WorldHonorResultView)
                }
                GlobalUtil.setLocal('WorldHonor_ProgressData', [this.actType, this.curProId, localState])
            } else if (localProId > 0) {
                if (!arenaHonorLocalData || arenaHonorLocalData[0] != this.actType || arenaHonorLocalData[1] != localProId) {
                    gdk.panel.setArgs(PanelId.WorldHonorResultView, localProId, localState);
                    gdk.panel.open(PanelId.WorldHonorResultView)
                }
                GlobalUtil.setLocal('WorldHonor_ProgressData', [this.actType, localProId, localState])
            }
        }


        if (this.curCfg && this.curCfg.group != '') {
            this.groupNum = this.curCfg.group[0] - 1;
        } else {
            this.groupNum = 0
        }

        //当前组特效显示
        this.GroupEffects.forEach((effect, index) => {
            effect.active = index == showEffectGroup - 1;
        })

        //防御阵营按钮设置
        if (lastGroup != 0) {
            if (this.curCfg && this.curCfg.group != '' && this.curCfg.group.indexOf(lastGroup) >= 0) {
                this.defenderBtn.active = false;
            } else if (showDefenferBtn) {
                this.defenderBtn.active = true;
            }
        }
        this.stateNum = 0;
        if (this.curCfg) {
            this.stateNum = 1;
            if (this.curCfg.progress > 4) {
                this.stateNum = 2;
            }
        }
        //刷新排名信息
        this.stateMenu.showSelect(this.stateNum);
        if (this.stateNum == 0) {
            this.stateNode1.active = true;
            this.stateNode2.active = false;
            this.stateNode3.active = false;
            this.titleNode.active = false;
            this.updateState1Info();
        } else if (this.stateNum == 1) {
            this.groupMenu.showSelect(this.groupNum);
            this.stateNode1.active = false;
            this.stateNode2.active = true;
            this.stateNode3.active = false;
            this.titleNode.active = true;
            this.updateState2Info();
        } else if (this.stateNum == 2) {
            this.stateNode1.active = false;
            this.stateNode2.active = false;
            this.stateNode3.active = true;
            this.titleNode.active = true;
            this.updateState3Info();
        }

        this.refreshRed()
    }


    updateState1Info() {
        let temData: icmsg.ArenaHonorMatch[] = [];
        this.rankPlayerIds = [];
        let setInfoDatas: icmsg.RoleBrief[] = [];
        this.model.list.forEach(data => {
            if (data.group == 9) {
                temData.push(data);
            }
        })
        temData.sort((a: icmsg.ArenaHonorMatch, b: icmsg.ArenaHonorMatch) => {
            return b.match - a.match
        });

        temData.forEach(data => {
            // let winPlayerId = data.players[data.winner - 1].id;
            // if (this.rankPlayerIds.indexOf(winPlayerId) < 0) {
            //     this.rankPlayerIds.push(winPlayerId);
            //     let infoData = this.model.playersInfoMap[winPlayerId];
            //     setInfoDatas.push(infoData);
            // }
            let winId = 0;
            let loseId = 1;
            if (data.winner == 2) {
                winId = 1;
                loseId = 0;
            }
            let winPlayerId = data.players[winId].id;
            if (this.rankPlayerIds.indexOf(winPlayerId) < 0) {
                this.rankPlayerIds.push(winPlayerId);
                let infoData = this.model.playersInfoMap[winPlayerId];
                setInfoDatas.push(infoData);
            }
            let lossPlayerId = data.players[loseId].id;
            if (this.rankPlayerIds.indexOf(lossPlayerId) < 0) {
                this.rankPlayerIds.push(lossPlayerId);
                let infoData = this.model.playersInfoMap[lossPlayerId];
                setInfoDatas.push(infoData);
            }
        })

        this.players1.forEach((node, index) => {
            let ctrl = node.getComponent(ArenaHonorPlayerItemCtrl);
            let titleShow = true;
            if (index < 4) {
                titleShow = false
            }
            ctrl.updatePlayerInfo(2, setInfoDatas[index], 3, true, 1, titleShow)
        })

        this.refreshFlowerNum()

    }

    maxNum: number = 0;
    curNum: number = 0;
    addNum: number = 0;
    refreshFlowerNum() {
        this.flowers.forEach((node, index) => {
            let numLb = cc.find('bg/num', node).getComponent(cc.Label);//node.getChildByName('num').getComponent(cc.Label);
            let addLb = cc.find('btn/addNum', node).getComponent(cc.Label);
            let btnNode = node.getChildByName('btn');
            let playerId = this.rankPlayerIds[index];
            addLb.string = this.addNum + ''
            numLb.string = this.model.playersFlowerMap[playerId] ? this.model.playersFlowerMap[playerId] * this.addNum + '' : '0';
            let state: 0 | 1 = 1;
            if (this.curNum > 0) {
                state = 0;
            }
            GlobalUtil.setAllNodeGray(btnNode, state)
        })
        this.refreshRed()
    }

    //刷新晋级赛信息
    updateState2Info() {
        //获取数据
        let playerIndex = [64, 64, 64, 64, 32, 32, 16, 16, 8]
        let temData = []
        let setInfoIndexs: number[] = [];
        let showNamePlayerId: number[] = []
        this.model.list.forEach(data => {
            if (data.group == this.groupNum + 1) {
                temData.push(data);
            }
        })
        temData.sort((a: icmsg.ArenaHonorMatch, b: icmsg.ArenaHonorMatch) => {
            return a.match - b.match
        })

        let failPlayers: number[] = []
        if (temData.length > 0) {
            for (let i = temData.length - 1; i >= 0; i--) {
                //设置玩家信息
                let data = temData[i];
                setInfoIndexs.push(data.match - 1);
                let playerNode = this.players2[data.match - 1];

                let temPlayer = playerNode.getChildByName('playerItem3');
                if (temPlayer) {
                    cc.find('heroSlot/New Label', temPlayer).getComponent(cc.Label).string = 8 + '';
                    let player3 = temPlayer.getComponent(ArenaHonorPlayerItemCtrl);
                    if (data.winner == 0) {
                        player3.updatePlayerInfo(2, null, 0, true)
                    } else {
                        let playerId3 = data.players[data.winner - 1].id;
                        let showName3 = false;
                        if (showNamePlayerId.indexOf(playerId3) < 0) {
                            showName3 = true;
                            showNamePlayerId.push(playerId3)
                        }
                        let playerData3 = this.model.playersInfoMap[playerId3];
                        player3.updatePlayerInfo(2, playerData3, 3, showName3)
                    }
                }
                let player1 = playerNode.getChildByName('playerItem1').getComponent(ArenaHonorPlayerItemCtrl)
                cc.find('heroSlot/New Label', player1.node).getComponent(cc.Label).string = playerIndex[data.match - 1] + '';
                if (data.players.length > 0 && data.players[0] && data.players[0].id > 0) {
                    let playerId1 = data.players[0].id
                    let state1 = 2;
                    let grayState = 1;
                    if (data.winner != 0) {
                        state1 = data.winner == 1 ? 3 : 1;
                        if (data.winner == 1 && failPlayers.indexOf(playerId1) >= 0) {
                            grayState = 0;
                        } else if (data.winner != 1) {
                            grayState = 0;
                            if (failPlayers.indexOf(playerId1) < 0) {
                                failPlayers.push(playerId1)
                            }
                        }
                    }
                    let showName1 = false;
                    if (showNamePlayerId.indexOf(data.players[0].id) < 0) {
                        showName1 = true;
                        showNamePlayerId.push(data.players[0].id)
                    }
                    let playerData1 = this.model.playersInfoMap[playerId1];
                    player1.updatePlayerInfo(2, playerData1, state1, showName1, grayState)
                } else {
                    player1.updatePlayerInfo(2, null, 0, false)
                }

                let player2 = playerNode.getChildByName('playerItem2').getComponent(ArenaHonorPlayerItemCtrl)
                cc.find('heroSlot/New Label', player2.node).getComponent(cc.Label).string = playerIndex[data.match - 1] + '';
                if (data.players.length > 1 && data.players[1] && data.players[1].id > 0) {
                    let playerId2 = data.players[1].id
                    let state2 = 2;
                    let grayState = 1;
                    if (data.winner != 0) {
                        state2 = data.winner == 2 ? 3 : 1;
                        if (data.winner == 2 && failPlayers.indexOf(playerId2) >= 0) {
                            grayState = 0;
                        } else if (data.winner != 2) {
                            grayState = 0;
                            if (failPlayers.indexOf(playerId2) < 0) {
                                failPlayers.push(playerId2)
                            }
                        }
                    }
                    let showName2 = false;
                    if (showNamePlayerId.indexOf(data.players[1].id) < 0) {
                        showName2 = true;
                        showNamePlayerId.push(data.players[1].id)
                    }
                    let playerData2 = this.model.playersInfoMap[playerId2];
                    player2.updatePlayerInfo(2, playerData2, state2, showName2, grayState)
                } else {
                    player2.updatePlayerInfo(2, null, 0, false)
                }

                let lineNode = this.lines2[data.match - 1];
                let effectNode = this.effects2[data.match - 1];
                if (data.winner == 0) {
                    if (this.curCfg && this.curCfg.group != '' && this.curCfg.match != '' && this.curCfg.group.indexOf(data.group) >= 0 && this.curCfg.match.indexOf(data.match) >= 0) {
                        this.setEffect2(effectNode, true)
                    } else {
                        this.setEffect2(effectNode, false)
                    }
                    lineNode.children.forEach(line => {
                        line.active = false;
                    })
                } else {
                    let line1 = lineNode.getChildByName('line1');
                    line1.active = data.winner == 1;
                    let line2 = lineNode.getChildByName('line2');
                    line2.active = data.winner == 2;
                    let line3 = lineNode.getChildByName('line3')
                    if (line3) {
                        line3.active = true;
                    }
                    this.setEffect2(effectNode, false)
                }
            }
        }

        this.players2.forEach((node, index) => {
            if (setInfoIndexs.indexOf(index) < 0) {
                //设置玩家信息
                let player1 = node.getChildByName('playerItem1').getComponent(ArenaHonorPlayerItemCtrl)
                player1.updatePlayerInfo(2, null, 0, false)
                let player2 = node.getChildByName('playerItem2').getComponent(ArenaHonorPlayerItemCtrl)
                player2.updatePlayerInfo(2, null, 0, false)
                let temPlayer = node.getChildByName('playerItem3');
                if (temPlayer) {
                    cc.find('heroSlot/New Label', temPlayer).getComponent(cc.Label).string = 8 + '';
                    let player3 = temPlayer.getComponent(ArenaHonorPlayerItemCtrl);
                    player3.updatePlayerInfo(2, null, 0, false)
                }
                cc.find('heroSlot/New Label', player1.node).getComponent(cc.Label).string = playerIndex[index] + '';
                cc.find('heroSlot/New Label', player2.node).getComponent(cc.Label).string = playerIndex[index] + '';

                //设置路线
                this.lines2[index].children.forEach(line => {
                    line.active = false;
                })
                //设置特效
                this.setEffect2(this.effects2[index], false);
            }
        })

        // this.effects1.forEach(effectNode => {
        //     this.setEffect1(effectNode, true)
        // })
    }


    setEffect2(node: cc.Node, show: boolean) {

        let effectNode1 = node.getChildByName('effect1');
        let effectNode2 = node.getChildByName('effect2');
        let effectNode3 = node.getChildByName('effect3');
        effectNode1.active = show;
        effectNode2.active = show
        effectNode3 ? effectNode3.active = show : 0;
        if (show) {
            if (node.childrenCount > 2) {
                let effect1 = effectNode1.getComponent(sp.Skeleton);
                let effect2 = effectNode2.getComponent(sp.Skeleton);
                let effect3 = effectNode3.getComponent(sp.Skeleton);
                effect1.setAnimation(0, 'stand', false);
                effect2.setAnimation(0, 'stand', false);
                effect1.setEventListener((entry: any, event: any) => {
                    // 播放施法音效
                    if (event.data.name == 'chuxian') {
                        //effect1.setEventListener(null);
                        effect3.setAnimation(0, 'stand', false);
                        effect3.setCompleteListener(() => {
                            effect1.setAnimation(0, 'stand', false);
                            effect2.setAnimation(0, 'stand', false);
                            effect3.setCompleteListener(null);
                        })
                    }
                });

            } else {
                let effect1 = effectNode1.getComponent(sp.Skeleton);
                let effect2 = effectNode2.getComponent(sp.Skeleton);
                effect1.setAnimation(0, 'stand', true);
                effect2.setAnimation(0, 'stand', true);
            }
        }

    }



    //刷新冠军赛信息
    updateState3Info() {

        let playerIndex = [8, 8, 8, 8, 4, 4, 2, 2, 1]
        let temData: icmsg.ArenaHonorMatch[] = [];
        let setInfoIndexs: number[] = [];
        let showNamePlayerId: number[] = []
        this.model.list.forEach(data => {
            if (data.group == 9) {
                temData.push(data);
            }
        })
        temData.sort((a: icmsg.ArenaHonorMatch, b: icmsg.ArenaHonorMatch) => {
            return a.match - b.match
        })

        if (temData.length > 0) {

            let failPlayers: number[] = []
            for (let i = temData.length - 1; i >= 0; i--) {
                //设置玩家信息
                let data = temData[i];
                setInfoIndexs.push(data.match - 1);
                let playerNode = this.players3[data.match - 1];

                let temPlayer = playerNode.getChildByName('playerItem3');
                if (temPlayer) {
                    cc.find('heroSlot/New Label', temPlayer).getComponent(cc.Label).string = 1 + '';
                    let player3 = temPlayer.getComponent(ArenaHonorPlayerItemCtrl);
                    if (data.winner == 0) {
                        player3.updatePlayerInfo(2, null, 0, true)
                    } else {
                        let playerId3 = data.players[data.winner - 1].id;
                        let showName3 = false;
                        if (showNamePlayerId.indexOf(playerId3) < 0) {
                            showName3 = true;
                            showNamePlayerId.push(playerId3)
                        }
                        let playerData3 = this.model.playersInfoMap[playerId3];
                        player3.updatePlayerInfo(2, playerData3, 3, showName3, 1, false)
                    }
                }
                let player1 = playerNode.getChildByName('playerItem1').getComponent(ArenaHonorPlayerItemCtrl)
                cc.find('heroSlot/New Label', player1.node).getComponent(cc.Label).string = playerIndex[data.match - 1] + '';
                if (data.players.length > 0 && data.players[0] && data.players[0].id > 0) {
                    let playerId1 = data.players[0].id
                    let state1 = 2;
                    let grayState = 1;
                    if (data.winner != 0) {
                        state1 = data.winner == 1 ? 3 : 1;
                        if (data.winner == 2 || failPlayers.indexOf(playerId1) >= 0) {
                            grayState = 0;
                            if (failPlayers.indexOf(playerId1) < 0) {
                                failPlayers.push(playerId1)
                            }
                        }
                        // if (data.winner == 1 && failPlayers.indexOf(playerId1) >= 0) {
                        //     grayState = 0;
                        // } else if (data.winner != 1) {
                        //     grayState = 0;
                        //     if (failPlayers.indexOf(playerId1) < 0) {
                        //         failPlayers.push(playerId1)
                        //     }
                        // }
                    }
                    let showName1 = false;
                    if (showNamePlayerId.indexOf(data.players[0].id) < 0) {
                        showName1 = true;
                        showNamePlayerId.push(data.players[0].id)
                    }
                    let playerData1 = this.model.playersInfoMap[playerId1];
                    player1.updatePlayerInfo(2, playerData1, state1, showName1, grayState)
                } else {
                    player1.updatePlayerInfo(2, null, 0, false)
                }


                let player2 = playerNode.getChildByName('playerItem2').getComponent(ArenaHonorPlayerItemCtrl)
                cc.find('heroSlot/New Label', player2.node).getComponent(cc.Label).string = playerIndex[data.match - 1] + '';
                if (data.players.length > 1 && data.players[1] && data.players[1].id > 0) {
                    let playerId2 = data.players[1].id
                    let state2 = 2;
                    let grayState = 1;
                    if (data.winner != 0) {
                        state2 = data.winner == 2 ? 3 : 1;
                        if (data.winner == 1 || failPlayers.indexOf(playerId2) >= 0) {
                            grayState = 0;
                            if (failPlayers.indexOf(playerId2) < 0) {
                                failPlayers.push(playerId2)
                            }
                        }
                        // if (data.winner == 1 && failPlayers.indexOf(playerId2) >= 0) {
                        //     grayState = 0;
                        // } else if (data.winner != 1) {
                        //     grayState = 0;
                        //     if (failPlayers.indexOf(playerId2) < 0) {
                        //         failPlayers.push(playerId2)
                        //     }
                        // }
                    }
                    let showName2 = false;
                    if (showNamePlayerId.indexOf(data.players[1].id) < 0) {
                        showName2 = true;
                        showNamePlayerId.push(data.players[1].id)
                    }
                    let playerData2 = this.model.playersInfoMap[playerId2];
                    player2.updatePlayerInfo(2, playerData2, state2, showName2, grayState)
                } else {
                    player2.updatePlayerInfo(2, null, 0, false)
                }

                let lineNode = this.lines3[data.match - 1];
                let effectNode = this.effects3[data.match - 1];
                if (data.winner == 0) {

                    if (this.curCfg && this.curCfg.group != '' && this.curCfg.match != '' && this.curCfg.group.indexOf(data.group) >= 0 && this.curCfg.match.indexOf(data.match) >= 0) {
                        this.setEffect3(effectNode, true)
                    } else {
                        this.setEffect3(effectNode, false)
                    }
                    lineNode.children.forEach(line => {
                        line.active = false;
                    })
                } else {
                    let line1 = lineNode.getChildByName('line1');
                    line1.active = data.winner == 1;
                    let line2 = lineNode.getChildByName('line2');
                    line2.active = data.winner == 2;
                    let line3 = lineNode.getChildByName('line3')
                    if (line3) {
                        line3.active = true;
                    }
                    this.setEffect3(effectNode, false)
                }

            }
        }

        //没有数据的
        this.players3.forEach((node, index) => {
            if (setInfoIndexs.indexOf(index) < 0) {
                //设置玩家信息
                let player1 = node.getChildByName('playerItem1').getComponent(ArenaHonorPlayerItemCtrl)
                player1.updatePlayerInfo(2, null, 0, false)
                let player2 = node.getChildByName('playerItem2').getComponent(ArenaHonorPlayerItemCtrl)
                player2.updatePlayerInfo(2, null, 0, false)
                let temPlayer = node.getChildByName('playerItem3');
                if (temPlayer) {
                    cc.find('heroSlot/New Label', temPlayer).getComponent(cc.Label).string = 1 + '';
                    let player3 = temPlayer.getComponent(ArenaHonorPlayerItemCtrl);
                    player3.updatePlayerInfo(2, null, 0, false)
                }
                cc.find('heroSlot/New Label', player1.node).getComponent(cc.Label).string = playerIndex[index] + '';
                cc.find('heroSlot/New Label', player2.node).getComponent(cc.Label).string = playerIndex[index] + '';


                //设置路线
                this.lines3[index].children.forEach(line => {
                    line.active = false;
                })
                //设置特效
                this.setEffect3(this.effects2[index], false);
            }
        })

    }

    setEffect3(node: cc.Node, show: boolean) {

        let effectNode1 = node.getChildByName('effect1');
        let effectNode2 = node.getChildByName('effect2');
        let effectNode3 = node.getChildByName('effect3');
        effectNode1.active = show;
        effectNode2.active = show
        effectNode3 ? effectNode3.active = show : 0;
        if (show) {
            if (node.childrenCount > 2) {
                let effect1 = effectNode1.getComponent(sp.Skeleton);
                let effect2 = effectNode2.getComponent(sp.Skeleton);
                let effect3 = effectNode3.getComponent(sp.Skeleton);
                effect1.setAnimation(0, 'stand', false);
                effect2.setAnimation(0, 'stand', false);
                effect1.setEventListener((entry: any, event: any) => {
                    // 播放施法音效
                    if (event.data.name == 'chuxian') {
                        //effect1.setEventListener(null);
                        effect3.setAnimation(0, 'stand', false);
                        effect3.setCompleteListener(() => {
                            effect1.setAnimation(0, 'stand', false);
                            effect2.setAnimation(0, 'stand', false);
                            effect3.setCompleteListener(null);
                        })
                    }
                });

            } else {
                let effect1 = effectNode1.getComponent(sp.Skeleton);
                let effect2 = effectNode2.getComponent(sp.Skeleton);
                effect1.setAnimation(0, 'stand', true);
                effect2.setAnimation(0, 'stand', true);
            }
        }

    }

    groupPageSelect(event, index, refresh: boolean = false) {
        //if (this.groupNum == index) return;
        if (this.model.list.length == 0) {
            return;
        }
        this.groupNum = index;
        this.updateState2Info();
    }

    statePageSelect(event, index, refresh: boolean = false) {
        if (this.model.list.length == 0) {
            return;
        }
        if (this.stateNum == index) return;
        if (index == 0) {
            if (!this.canOpenState1) {
                this.stateMenu.setSelectIdx(this.stateNum);
                gdk.gui.showMessage(gdk.i18n.t("i18n:ARENAHONOR_TIP7"))
                return;
            }
            this.stateNum = index
            this.stateNode1.active = true;
            this.stateNode2.active = false;
            this.stateNode3.active = false;
            this.titleNode.active = false;
            //this.groupMenu.setSelectIdx(this.groupNum);
            this.updateState1Info()
        } else if (index == 1) {

            this.stateNum = index
            this.stateNode1.active = false;
            this.stateNode2.active = true;
            this.stateNode3.active = false;
            this.titleNode.active = true;
            this.groupMenu.setSelectIdx(this.groupNum);
            //this.updateState1Info()
        } else if (index == 2) {
            //判断冠军赛是否开启
            if (!this.canOpenState3) {
                this.stateMenu.setSelectIdx(this.stateNum);
                gdk.gui.showMessage(gdk.i18n.t("i18n:ARENAHONOR_TIP1"))
                return;
            }
            this.stateNum = index
            this.stateNode1.active = false;
            this.stateNode2.active = false;
            this.stateNode3.active = true;
            this.titleNode.active = true;
            this.updateState3Info();
        }
    }

    //打开商店界面
    openStoreViewBtnClick() {
        if (JumpUtils.ifSysOpen(2923, true)) {
            JumpUtils.openPanel({
                panelId: PanelId.Store,
                panelArgs: { args: [1] },
                currId: this.node,
                callback: (panel) => {
                    let comp = panel.getComponent(StoreViewCtrl)
                    comp.typeBtnSelect(null, StoreActScoreTabType.ArenaHonor)
                    gdk.Timer.once(10, this, () => {
                        comp.typeBtnSelect(null, StoreActScoreTabType.ArenaHonor)
                    })
                }
            });
            return
        }
    }

    //打开竞猜界面
    openGuessViewBtnClick() {
        if (!this.curProId) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:ARENAHONOR_TIP2"))
            return
        } else if (this.curProId <= 1) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:ARENAHONOR_TIP3"))
            return
        }

        let guessList: icmsg.ArenaHonorMatch[] = [];
        this.model.list.forEach(data => {
            if (this.curCfg.match.indexOf(data.match) >= 0 && this.curCfg.group.indexOf(data.group) >= 0) {
                guessList.push(data);
            }
        })

        if (guessList.length <= 0) {
            gdk.gui.showMessage('当前阶段比赛全部轮空,无法竞猜');
            return;
        }

        JumpUtils.openPanel({
            panelId: PanelId.WorldHonorGuessView,
            currId: gdk.gui.getCurrentView()
        })
        //gdk.panel.open(PanelId.ArenaHonorGuessView)
    }

    //打开防御阵营设置界面
    openDefenderViewBtnClick() {
        this.model.openDefenferView = true;
        //gdk.panel.setArgs(PanelId.RoleSetUpHeroSelector, 1, 7)
        gdk.panel.open(PanelId.HonorDefenderSetUpHeroSelector);

    }

    //打开奖励预览界面
    openRewardViewBtnClick() {
        gdk.panel.open(PanelId.WorldHonorRewardView)
    }

    refreshRed() {
        //竞猜
        let guessHave: boolean = false;
        if (this.curProId && this.curProId >= 2 && this.model.list.length > 0) {
            let guessList: icmsg.ArenaHonorMatch[] = [];
            //let cfg = ConfigManager.getItemById(Arenahonor_progressCfg, curProId);

            this.model.list.forEach(data => {
                if (this.curCfg.match.indexOf(data.match) >= 0 && this.curCfg.group.indexOf(data.group) >= 0) {
                    guessList.push(data);
                }
            })
            guessList.forEach(data => {
                if (data.guess == 0 || data.guessWinner == 0) {
                    guessHave = true;
                }
            })

            let old = this.model.draw[Math.floor((this.curProId - 1) / 8)] | 0;
            if (guessList.length > 0 && (old & 1 << (this.curProId - 1) % 8) <= 0) {
                guessHave = true
            }
        }

        this.guessRed.active = guessHave;

        //防御阵营设置
        this.defenderRed.active = false;
        if (this.curProId == 1 && !this.model.openDefenferView && this.model.list.length > 0 && this.model.playersInfoMap[this.roleModel.id]) {
            this.defenderRed.active = true;
        }

        //设置世界之巅点赞红点
        if (this.canOpenState1) {
            this.state1Red.active = this.curNum > 0;
        } else {
            this.state1Red.active = false
        }

    }

    openRankBtnClick() {
        gdk.panel.setArgs(PanelId.WorldHonorRankView, 1);
        gdk.panel.open(PanelId.WorldHonorRankView);
    }

    flowerBtnClick(e: any, idx: string) {
        let index = parseInt(idx)
        let msg = new icmsg.ArenaHonorFlowerReq()
        msg.playerId = this.rankPlayerIds[index];
        if (this.curNum > 0) {
            NetManager.send(msg, (rsp: icmsg.ArenaHonorFlowerRsp) => {
                this.curNum = this.maxNum - rsp.giveFlower;
                this.model.giveFlower = rsp.giveFlower;
                this.curNum = Math.max(0, this.curNum);
                this.model.playersFlowerMap[rsp.playerId] = rsp.flower;
                this.refreshFlowerNum();
                GlobalUtil.openRewadrView(rsp.goods);
            });
        }

    }
}
