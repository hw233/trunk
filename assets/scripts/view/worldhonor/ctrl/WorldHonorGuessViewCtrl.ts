import BagUtils from '../../../common/utils/BagUtils';
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
import {
    Arenahonor_worldwideCfg,
    Hero_awakeCfg,
    HeroCfg,
    ItemCfg
    } from '../../../a/config';


/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-11-26 10:56:06 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/worldhonor/WorldHonorGuessViewCtrl")
export default class WorldHonorGuessViewCtrl extends gdk.BasePanel {


    @property(cc.Label)
    endTime: cc.Label = null;
    @property(cc.Label)
    titleLb: cc.Label = null;
    @property(cc.Button)
    rewardBtn: cc.Button = null;
    @property(cc.Node)
    rewardBtnRed: cc.Node = null;

    // @property(cc.Node)
    // titleNode: cc.Node = null;

    @property(cc.Node)
    moneyNode: cc.Node = null;

    @property([cc.Node])
    players: cc.Node[] = [];

    @property([cc.Node])
    betBtns: cc.Node[] = [];

    @property([cc.Node])
    betStateNodes: cc.Node[] = [];

    @property(cc.Node)
    fightBtn: cc.Node = null;

    @property(cc.Node)
    resultFlag: cc.Node = null;

    @property(UiTabMenuCtrl)
    uiTabMenu: UiTabMenuCtrl = null;

    get cModel(): WorldHonorModel { return ModelManager.get(WorldHonorModel); }
    get roleModel(): RoleModel { return ModelManager.get(RoleModel); }
    guessList: icmsg.ArenaHonorMatch[];
    selectIdx: number;
    curProId: number;
    moneyId: number = 32;
    _minNum: number = 0;

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
                this.endTime.string = gdk.i18n.t("i18n:ACTIVITY_TIME_TIP3");//'活动已结束';
            } else {
                this.close();
            }
        }
        else {
            this.endTime.string = TimerUtils.format1(this.leftTime / 1000);
        }
    }

    onEnable() {
        this.selectIdx = this.args[0];
        if (!this.selectIdx) this.selectIdx = 0;

        this.curProId = WorldHonorUtils.getCurProgressId();
        this.guessList = [];
        let cfg = ConfigManager.getItemById(Arenahonor_worldwideCfg, this.curProId);
        this._minNum = cfg.section[0];
        this.cModel.list.forEach(data => {
            if (cfg.match.indexOf(data.match) >= 0 && cfg.group.indexOf(data.group) >= 0) {
                if (data.players.length > 1 && data.players[0].id > 0 && data.players[1].id > 0) {
                    this.guessList.push(data);
                }
            }
        });
        if (this.guessList.length == 0) {
            this.close();
            return
        }
        this._updateTime();
        //检测积分奖励是否领取
        let idx = this.curProId;
        let old = this.cModel.draw[Math.floor((idx - 1) / 8)] | 0;
        if ((old & 1 << (idx - 1) % 8) >= 1) {
            this.rewardBtn.interactable = false;
            GlobalUtil.setAllNodeGray(this.rewardBtn.node, 1);
            this.rewardBtnRed.active = false
        } else {
            this.rewardBtn.interactable = true;
            GlobalUtil.setAllNodeGray(this.rewardBtn.node, 0);
            this.rewardBtnRed.active = true
        }

        this.titleLb.string = '进行中:' + cfg.subject_name + cfg.progress_name
        this.uiTabMenu.setSelectIdx(this.selectIdx, true);

        NetManager.on(icmsg.RoleUpdateRsp.MsgType, this._updateMoney, this);
        NetManager.on(icmsg.ArenaHonorGuessRsp.MsgType, (rsp: icmsg.ArenaHonorGuessRsp) => {
            if (!cc.isValid(this.node)) return;
            if (!this.node.activeInHierarchy) return;
            let infos = this.guessList[this.selectIdx];
            if (infos.group == rsp.group && infos.match == rsp.match) {
                infos.guess = rsp.guess;
                infos.score = rsp.score;
            }
            infos.players[rsp.guess - 1].support += 1;
            this.onTabMenuSelect(true, this.selectIdx);
        }, this);

        this.onTabMenuSelect(true, this.selectIdx);

    }

    onDisable() {
        NetManager.targetOff(this);
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

    /**查看玩家信息 */
    onPlayerCheckBtnClick(e, data) {
        let index = parseInt(data) - 1
        let id = this.guessList[this.selectIdx].players[index].id//[`player${data}`].playerId;
        gdk.panel.setArgs(PanelId.MainSet, id, 7);
        gdk.panel.open(PanelId.MainSet);
    }

    /**下注 */
    onBetBtnClick(e, data) {

        let curNum = BagUtils.getItemNumById(this.moneyId)
        let itemCfg = ConfigManager.getItemById(ItemCfg, this.moneyId);
        if (curNum < this._minNum) {
            gdk.gui.showMessage(`${itemCfg.name}` + gdk.i18n.t("i18n:ARENAHONOR_TIP6"))
            return;
        }
        let index = parseInt(data) - 1
        let info = this.guessList[this.selectIdx]
        gdk.panel.setArgs(PanelId.WorldHonorBetView, [index, info]);
        gdk.panel.open(PanelId.WorldHonorBetView);
    }

    /**查看战斗 */
    onFightBtnClick() {

        let infos: icmsg.ArenaHonorMatch = this.guessList[this.selectIdx];
        this.cModel.guessGroup = infos.group;
        this.cModel.guessMatch = infos.match;
        this.cModel.guessInfo = infos;

        let enemyPlayerId = this.roleModel.id == infos.players[1].id ? infos.players[0].id : infos.players[1].id
        let p = this.cModel.playersInfoMap[enemyPlayerId]//infos.playerId == infos.player1.playerId ? infos.player2 : infos.player1;
        let player = new icmsg.ArenaPlayer();
        player.id = player.id;
        player.robotId = null;
        player.name = p.name;
        player.head = p.head;
        player.frame = p.headFrame;
        player.level = p.level;
        player.power = p.power;
        JumpUtils.openPveArenaScene([player.id, 0, player], player.name, 'WORLDHONOR_GUESS');
    }


    onTabMenuSelect(e, data) {
        if (!e) return;
        this.selectIdx = data;
        this.cModel.guessIndex = this.selectIdx;
        let infos: icmsg.ArenaHonorMatch = this.guessList[this.selectIdx];
        this.cModel.guessGroup = infos.group;
        this.cModel.guessMatch = infos.match;
        if (!infos) return;
        //GlobalUtil.setSpriteIcon(this.node, this.titleNode, this.selectIdx == 0 ? 'view/champion/texture/guess/jbs_dianfeng' : 'view/champion/texture/guess/jbs_zhunheng');
        let allNum = infos.players[0].support + infos.players[1].support;
        let player1Bet = allNum > 0 ? Math.floor((infos.players[0].support / allNum) * 100) : 0;
        let player2Bet = allNum > 0 ? 100 - player1Bet : 0;

        let all2Num = infos.players[0].win + infos.players[1].win;
        let player1Win = all2Num > 0 ? Math.floor((infos.players[0].win / all2Num) * 100) : 0;
        let player2Win = all2Num > 0 ? 100 - player1Win : 0;
        this.players.forEach((p, idx) => {
            let player1 = this.cModel.playersInfoMap[infos.players[0].id];
            let player2 = this.cModel.playersInfoMap[infos.players[1].id];

            let info = [player1, player2][idx];
            let betNum = [player1Bet, player2Bet][idx];
            let scuessNum = [player1Win, player2Win][idx];
            cc.find('layout/label', p).getComponent(cc.Label).string = info.name;
            //cc.find('gradeNode/num', p).getComponent(cc.Label).string = info.points + '';
            cc.find('power/num', p).getComponent(cc.Label).string = info.power + '';
            let guildName = p.getChildByName('guildName').getComponent(cc.Label);
            guildName.string = info.guildId > 0 ? this.cModel.guildNameMap[info.guildId] : '';
            let spine = p.getChildByName('spine').getComponent(sp.Skeleton);
            let path = 'H_zhihuiguan'
            if (info.head == 0) {
                let str = 'H_zhihuiguan'
                path = `spine/hero/${str}/1/${str}`//PveTool.getSkinUrl('H_zhihuiguan')
            } else {
                let heroCfg = ConfigManager.getItemById(HeroCfg, info.head);
                if (heroCfg) {
                    path = `spine/hero/${heroCfg.skin}/1/${heroCfg.skin}`//PveTool.getSkinUrl(heroCfg.skin)
                } else {
                    //属于觉醒的头像 找到对应的英雄模型
                    let cfgs = ConfigManager.getItems(Hero_awakeCfg, { icon: info.head })
                    if (cfgs.length > 0) {
                        path = `spine/hero/${cfgs[cfgs.length - 1].ul_skin}/1/${cfgs[cfgs.length - 1].ul_skin}`
                    } else if ([310149, 310150, 310151].indexOf(info.head) !== -1) {
                        let heroCfg = ConfigManager.getItem(HeroCfg, (cfg: HeroCfg) => {
                            if (cfg.icon == info.head - 10000 && cfg.group[0] == 6) {
                                return true;
                            }
                        });
                        path = `spine/hero/${heroCfg.skin}_jx/1/${heroCfg.skin}_jx`
                    } else {
                        let str = 'H_zhihuiguan'
                        path = `spine/hero/${str}/1/${str}`
                    }
                }
            }
            let aniName = info.head == 0 ? 'stand_s' : 'stand';
            let s = [-0.6, 0.6];
            spine.node.scaleX = info.head == 0 ? -1 * s[idx] : s[idx];
            GlobalUtil.setSpineData(this.node, spine, path, false, aniName, true);

            let resultFlag = cc.find('layout/flag', p);
            let betNode = this.betBtns[idx];
            let betState = this.betStateNodes[idx];

            //支持率
            let supportLevel = p.getChildByName('supportLevel').getComponent(cc.Label);
            let supportlb = p.getChildByName('supportLb').getComponent(cc.Label);
            supportLevel.string = betNum + '%'

            if (!infos.guessWinner) {
                supportlb.string = gdk.i18n.t("i18n:ARENAHONOR_TIP4")
                supportLevel.string = betNum + '%'
            } else {
                supportlb.string = gdk.i18n.t("i18n:ARENAHONOR_TIP5")
                supportLevel.string = scuessNum + '%'
            }
            if (!infos.guess) {
                //未下注
                //supportlb.string = gdk.i18n.t("i18n:ARENAHONOR_TIP4")
                resultFlag.active = false;
                betNode.active = true;
                betState.active = false;
                //supportLevel.string = betNum + '%'
            }
            else {
                //已下注
                // supportlb.string = gdk.i18n.t("i18n:ARENAHONOR_TIP5")
                // supportLevel.string = scuessNum + '%'
                betNode.active = false;
                betState.active = idx == infos.guess - 1//info.playerId == infos.playerId;
                GlobalUtil.setSpriteIcon(this.node, cc.find('icon', betState), GlobalUtil.getIconById(32));
                cc.find('icon/num', betState).getComponent(cc.Label).string = GlobalUtil.numberToStr2(infos.score, true) + '';
                if (!infos.guessWinner) {
                    //未战斗
                    resultFlag.active = false;
                }
                else {
                    //已战斗
                    resultFlag.active = true;
                    // let url = (info.playerId == infos.playerId && infos.rewardScore > 0)
                    //     || (info.playerId !== infos.playerId && infos.rewardScore < 0) ? 'view/champion/texture/guess/jbs_sheng' : 'view/champion/texture/guess/jbs_fu';
                    let url = infos.guessWinner == idx + 1 ? 'view/champion/texture/guess/jbs_sheng' : 'view/champion/texture/guess/jbs_fu';
                    GlobalUtil.setSpriteIcon(this.node, resultFlag, url);
                }
            }
        });

        this.fightBtn.active = infos.guessWinner == 0 && infos.score > 0;
        this.resultFlag.active = infos.guessWinner > 0 //&& infos.addScore !== 0;
        if (this.resultFlag.active) {
            GlobalUtil.setSpriteIcon(this.node, this.resultFlag, infos.guess == infos.guessWinner ? 'view/champion/texture/guess/jbs_jingcaichenggong' : 'view/champion/texture/guess/jbs_jingcaishiai');
        }

        this._updateBtns();
        this._updateMoney();
    }

    _updateBtns() {
        this.uiTabMenu.node.children.forEach((btn, idx) => {
            let info = this.guessList[idx];
            if (!info) {
                btn.active = false;
            }
            else {
                btn.active = true;
                let stateLab = btn.getChildByName('state').getComponent(cc.Label);
                let redPoint = btn.getChildByName('RedPoint');
                if (!info.guessWinner && info.score == 0) {
                    stateLab.string = gdk.i18n.t("i18n:CHAMPION_GUESS_TIP1");//'可竞猜';
                    redPoint.active = true;
                }
                else {
                    if (!info.guessWinner && info.score > 0) {
                        stateLab.string = gdk.i18n.t("i18n:CHAMPION_GUESS_TIP2");//'查看战斗';
                        redPoint.active = true;
                    }
                    else {
                        stateLab.string = gdk.i18n.t("i18n:CHAMPION_GUESS_TIP3");//'已结束';
                        redPoint.active = false;
                    }
                }
            }
        });
    }

    rewardBtnClick() {
        let msg = new icmsg.ArenaHonorDrawReq()
        msg.world = true;
        msg.id = this.curProId;
        NetManager.send(msg, (rsp: icmsg.ArenaHonorDrawRsp) => {
            this.cModel.draw = rsp.draw;
            GlobalUtil.openRewadrView(rsp.goods);
            this.rewardBtn.interactable = false;
            this.rewardBtnRed.active = false;
            GlobalUtil.setAllNodeGray(this.rewardBtn.node, 1);
        })
    }

    _updateMoney() {
        GlobalUtil.setSpriteIcon(this.node, this.moneyNode.getChildByName('icon'), GlobalUtil.getIconById(32));
        this.moneyNode.getChildByName('num').getComponent(cc.Label).string = BagUtils.getItemNumById(32) + '';
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

    openGuessReprotViewBtnClick() {
        gdk.panel.open(PanelId.WorldHonorGuessReportView);
    }

}
