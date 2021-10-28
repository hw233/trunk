import ArenaTeamSeachEnemyViewItemCtrl from './ArenaTeamSeachEnemyViewItemCtrl';
import ArenaTeamViewModel from '../model/ArenaTeamViewModel';
import MathUtil from '../../../common/utils/MathUtil';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';

/** 
 * @Description: 组队竞技场View
 * @Author: yaozu.hu
 * @Date: 2021-01-08 14:16:11
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-02-07 10:29:51
 */



const { ccclass, property, menu } = cc._decorator;

@ccclass
//@menu("qszc/scene/pve/PveSceneCtrl")
export default class ArenaTeamSeachEnemyViewCtrl extends gdk.BasePanel {

    @property(cc.Node)
    teamNode: cc.Node = null;
    @property(cc.Node)
    enemyNode: cc.Node = null;
    @property([cc.Node])
    teamItems: cc.Node[] = [];
    @property([cc.Node])
    enemyItems: cc.Node[] = [];
    @property(cc.Label)
    resetNum: cc.Label = null;
    @property(cc.Label)
    timeLb: cc.Label = null;
    @property(cc.Node)
    vsSp: cc.Node = null;
    @property(sp.Skeleton)
    vsSpine: sp.Skeleton = null;
    @property(sp.Skeleton)
    searchSpine: sp.Skeleton = null;
    @property(cc.Node)
    btnNode: cc.Node = null;

    get model(): ArenaTeamViewModel { return ModelManager.get(ArenaTeamViewModel); }
    info: icmsg.ArenaTeamMatchRsp;

    attackTime: number = 5;
    showTime: number = 1;
    sendReset: boolean = false;
    searchAnim: boolean = false;
    onEnable() {
        this.attackTime = this.model.mainCfg.auto;
        this.showTime = 1;
        this.model.AttackEnterView = 1;
        let arg = gdk.panel.getArgs(PanelId.ArenaTeamSeachEnemyView)
        if (arg) {
            this.info = arg[0];
            this.initPlayerInfo()
        } else {
            this.close();
        }
    }

    onDisable() {
        NetManager.targetOff(this);
        gdk.Timer.clearAll(this)
    }

    update(dt: number) {
        if (this.attackTime > 0 && !this.sendReset && !this.searchAnim) {
            this.attackTime -= dt;
            this.showTime -= dt;
            if (this.showTime <= 0) {
                this.showTime += 1;
                this.timeLb.string = Math.ceil(this.attackTime) + '';
            }
            if (this.attackTime <= 0) {
                //打开挑战界面
                this.attackBtnClick()
            }
        }
    }

    initPlayerInfo() {

        this.vsSp.active = false;
        this.vsSpine.node.active = false;
        this.searchSpine.node.active = true;
        this.teamNode.active = false;
        this.enemyNode.active = false;
        this.searchAnim = true;
        this.btnNode.active = false;
        let t = this.searchSpine.setAnimation(0, 'stand', false);
        if (t) {
            this.searchSpine.setCompleteListener((trackEntry, loopCount) => {
                let name = trackEntry.animation ? trackEntry.animation.name : '';
                if (name === "stand") {
                    this.btnNode.active = true;
                    this.searchAnim = false;
                    this.searchSpine.node.active = false;
                    if (this.info.opponents.length > 0) {
                        this.teamNode.active = true;
                        this.enemyNode.active = true;
                        this.teamItems.forEach((item, i) => {
                            let ctrl = item.getComponent(ArenaTeamSeachEnemyViewItemCtrl);
                            if (this.info.teammates.length > i) {
                                ctrl.data = { data: this.info.teammates[i], show: true, isEnemy: false, index: i };
                                ctrl.updateView()
                            }
                        })
                        this.enemyItems.forEach((item, i) => {
                            let ctrl = item.getComponent(ArenaTeamSeachEnemyViewItemCtrl);
                            if (this.info.opponents.length > i) {
                                let show = i != this.model.randomNum;
                                ctrl.data = { data: this.info.opponents[i], show: show, isEnemy: true, index: i };
                                ctrl.updateView()
                            }
                        })
                        this.vsSpine.node.active = true;
                        gdk.Timer.once(1000, this, () => {
                            let t = this.vsSpine.setAnimation(0, 'stand', false);
                            if (t) {
                                this.vsSpine.setCompleteListener((trackEntry, loopCount) => {
                                    let name = trackEntry.animation ? trackEntry.animation.name : '';
                                    if (name === "stand") {
                                        this.vsSp.active = true;
                                        this.vsSpine.node.active = false;
                                    }
                                })
                            }
                        })
                    } else {
                        gdk.gui.showMessage(gdk.i18n.t("i18n:ARENATEAM_TIP10"));
                        this.close();
                    }
                }
            })
        }



        this.resetNum.string = Math.max(0, this.model.mainCfg.anew - this.model.matchInfo.matchedNum) + ''
        this.timeLb.string = Math.ceil(this.attackTime) + '';
    }

    reSearchEnemy() {
        if (this.searchAnim) return;
        //判断次数
        if (this.model.matchInfo.matchedNum < this.model.mainCfg.anew) {
            this.sendReset = true;
            let msg = new icmsg.ArenaTeamMatchReq()
            msg.query = false;
            NetManager.send(msg, (rsp: icmsg.ArenaTeamMatchRsp) => {
                this.model.matchInfo.matchedNum += 1;
                this.info = rsp;
                this.sendReset = false;
                this.attackTime = this.model.mainCfg.auto;
                this.showTime = 1;
                this.model.matchData = rsp;
                this.model.randomNum = MathUtil.rnd(0, rsp.opponents.length - 1);
                this.initPlayerInfo()
            }, this)
        }

        // this.initPlayerInfo()
    }

    attackBtnClick() {
        if (this.searchAnim) return;
        this.close()
        gdk.panel.open(PanelId.ArenaTeamAttackView)
    }

}
