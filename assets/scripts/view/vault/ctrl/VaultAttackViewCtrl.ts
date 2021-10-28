import {
    GlobalCfg,
    Headframe_titleCfg, MonsterCfg,
    VaultCfg
} from '../../../a/config';
import ConfigManager from '../../../common/managers/ConfigManager';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import ArenaModel from '../../../common/models/ArenaModel';
import RoleModel from '../../../common/models/RoleModel';
import BagUtils from '../../../common/utils/BagUtils';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import JumpUtils from '../../../common/utils/JumpUtils';
import StringUtils from '../../../common/utils/StringUtils';
import TimerUtils from '../../../common/utils/TimerUtils';
import PanelId from '../../../configs/ids/PanelId';
import VaultModel from '../model/VaultModel';

/** 
 * @Description: 殿堂指挥官挑战界面
 * @Author: yaozu.hu
 * @Date: 2021-01-08 14:16:11
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-06-02 14:32:32
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
export default class VaultAttackViewCtrl extends gdk.BasePanel {

    @property(cc.Node)
    playerNode: cc.Node = null;
    @property(cc.Node)
    nplayerNode: cc.Node = null;
    @property(cc.Sprite)
    playerHead: cc.Sprite = null;
    @property(cc.Sprite)
    playerHeadFrame: cc.Sprite = null;
    @property(cc.Label)
    playerName: cc.Label = null;
    @property(cc.Label)
    serverName: cc.Label = null;
    @property(cc.Node)
    atklbNode: cc.Node = null;
    @property(cc.Node)
    hplbNode: cc.Node = null;
    @property(cc.Label)
    atkAdd: cc.Label = null;
    @property(cc.Label)
    hpAdd: cc.Label = null;
    @property(cc.Sprite)
    titleIcon: cc.Sprite = null;
    @property(sp.Skeleton)
    monsterSpine: sp.Skeleton = null;
    @property([cc.Sprite])
    groupList: cc.Sprite[] = []
    @property(cc.RichText)
    difficultyNum: cc.RichText = null;
    @property(cc.RichText)
    curNum: cc.RichText = null;
    @property(cc.Label)
    timeLb: cc.Label = null;
    @property(cc.RichText)
    rankLb: cc.RichText = null;
    @property(cc.Sprite)
    titleSp: cc.Sprite = null;

    index: number;
    posData: icmsg.PositionInfo
    cfg: VaultCfg = null;
    get model(): VaultModel { return ModelManager.get(VaultModel); }
    get roleModel(): RoleModel { return ModelManager.get(RoleModel); }
    canAttack: boolean = true;
    vault_cd: number = 0;
    havePos: boolean = false;
    //titleStrs: string[] = ['dqzhg_qiongding', 'dqzhg_dianfeng', 'dqzhg_zhuzai']
    onEnable() {
        let args = gdk.panel.getArgs(PanelId.VaultAttackView);
        this.index = args[0];
        this.posData = args[1];
        this.nplayerNode.active = this.posData.playerId == 0;
        this.playerNode.active = this.posData.playerId != 0;
        this.vault_cd = ConfigManager.getItemByField(GlobalCfg, 'key', 'vault_cd').value[0]
        this.cfg = ConfigManager.getItemById(VaultCfg, this.index + 1);
        // let tem = this.titleStrs[0];
        // if (this.index > 0) {
        //     tem = this.index > 2 ? this.titleStrs[2] : this.titleStrs[1]
        // }
        // let path = 'view/vault/texture/' + tem;
        // GlobalUtil.setSpriteIcon(this.node, this.titleSp, path);
        this.model.infoData.info.forEach(data => {
            if (data.playerId == this.roleModel.id) {
                this.havePos = true;
            }
        })

        if (this.posData.playerId > 0) {
            this.initPlayerInfo()
        }
        this.initVaultData()
    }

    onDisable() {
        NetManager.targetOff(this)
        gdk.Timer.clearAll(this);
        gdk.e.targetOff(this);

    }

    initPlayerInfo() {
        this.playerName.string = this.posData.playerName;
        let serverNum = Math.floor((this.posData.playerId % (10000 * 100000)) / 100000)
        this.serverName.string = 'S' + serverNum + '  ' + this.posData.guildName;
        GlobalUtil.setSpriteIcon(this.node, this.playerHeadFrame, GlobalUtil.getHeadFrameById(this.posData.frameId))
        GlobalUtil.setSpriteIcon(this.node, this.playerHead, GlobalUtil.getHeadIconById(this.posData.headId));
    }

    initVaultData() {
        //设置头像框
        GlobalUtil.setSpriteIcon(this.node, this.titleIcon, "icon/headframe/" + this.cfg.title[0])
        let frameCfg = ConfigManager.getItemByField(Headframe_titleCfg, 'icon', this.cfg.title[0])
        let atkState = cc.js.isNumber(frameCfg.atk_p) && frameCfg.atk_p > 0
        let hpState = cc.js.isNumber(frameCfg.hp_p) && frameCfg.hp_p > 0
        this.atklbNode.active = atkState
        this.hplbNode.active = hpState
        this.atkAdd.node.active = atkState
        this.hpAdd.node.active = hpState
        this.atkAdd.string = atkState ? '+' + (frameCfg.atk_p / 100).toFixed(1) + '%' : '';
        this.hpAdd.string = hpState ? '+' + (frameCfg.hp_p / 100).toFixed(1) + '%' : '';
        this.groupList.forEach((group, index) => {
            if (index < this.cfg.buff_group.length) {
                group.node.parent.active = true
                let path = 'common/texture/role/select/groupB_' + this.cfg.buff_group[index]
                GlobalUtil.setSpriteIcon(this.node, group, path);
            } else {
                group.node.parent.active = false;
            }
        })
        let str = gdk.i18n.t("i18n:VAULT_TIP6")
        this.difficultyNum.string = StringUtils.format(str, this.posData.difficulty)

        let heroCfg = ConfigManager.getItemByField(MonsterCfg, 'id', this.cfg.monster);
        let heroPath = `spine/monster/${heroCfg.skin}/${heroCfg.skin}`
        this.monsterSpine.node.scale = this.cfg.size;
        GlobalUtil.setSpineData(this.node, this.monsterSpine, heroPath, true, 'idle_s', true);


        if (this.model.infoData.failTime > 0) {
            let serverTime = Math.floor(GlobalUtil.getServerTime() / 1000);
            let timeLeft = this.model.infoData.failTime + this.vault_cd
            if (serverTime < timeLeft) {
                this.canAttack = false;
                this.timeLb.string = TimerUtils.format2(timeLeft - serverTime)
            }
        }
        this.timeLb.node.active = !this.canAttack;

        //竞技场排名
        let arenaModel = ModelManager.get(ArenaModel);
        let rankStr = gdk.i18n.t("i18n:VAULT_TIP5")
        this.rankLb.string = StringUtils.format(rankStr, this.cfg.limit, arenaModel.rank > 0 ? arenaModel.rank : '无');
    }

    resTime = 1;
    update(dt: number) {
        if (!this.canAttack) {
            this.resTime -= dt;
            if (this.resTime < 0) {
                let serverTime = Math.floor(GlobalUtil.getServerTime() / 1000);
                let timeLeft = this.model.infoData.failTime + this.vault_cd;
                if (serverTime >= timeLeft) {
                    this.canAttack = true;
                    this.timeLb.node.active = !this.canAttack;
                    return;
                }
                this.timeLb.string = TimerUtils.format2(timeLeft - serverTime)
            }
        }
    }

    @gdk.binding("model.curNum")
    refreshCurNum() {
        let str = gdk.i18n.t("i18n:VAULT_TIP4")
        this.curNum.string = StringUtils.format(str, this.model.addNum[this.model.curNum])
    }

    spineBtnClick(event: cc.Event, indexS: string) {
        //let index = parseInt(indexS)
        gdk.panel.setArgs(PanelId.VaultAttackListView, this.cfg, this.posData)
        gdk.panel.open(PanelId.VaultAttackListView)
    }

    attackBtnClick() {
        if (this.posData.playerId == this.roleModel.id) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:VAULT_TIP8"))
            return;
        }
        if (!this.canAttack) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:VAULT_TIP3"))
            return;
        }
        let arenaModel = ModelManager.get(ArenaModel);
        if (arenaModel.rank == 0 || arenaModel.rank > this.cfg.limit) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:VAULT_TIP2"))
            return;
        }
        //当前已经占领位置了弹提示
        if (this.havePos) {
            GlobalUtil.openAskPanel({
                title: gdk.i18n.t("i18n:TIP_TITLE"),
                descText: gdk.i18n.t("i18n:VAULT_TIP9"),
                thisArg: this,
                sureText: gdk.i18n.t("i18n:OK"),
                sureCb: () => {
                    this.attack();
                },
            });
        } else {
            this.attack();
        }

    }

    attack() {
        let msg = new icmsg.VaultFightReadyReq()
        msg.positionId = this.model.curPos + 1;
        msg.difficulty = this.model.curDifficulty + this.model.addNum[this.model.curNum]
        NetManager.send(msg, (rsp: icmsg.VaultFightReadyRsp) => {
            if (rsp.enterSucc) {
                let player = new icmsg.ArenaPlayer()
                player.name = this.cfg.name
                player.head = this.cfg.monster
                // player.frame = this.cfg.title[0]
                player.power = 0;
                this.model.heroList = rsp.heroList;
                this.model.general = rsp.general;
                JumpUtils.openPveArenaScene([0, 0, player], this.cfg.name, "VAULT");
                this.close();
            } else {
                gdk.gui.showMessage(gdk.i18n.t("i18n:VAULT_TIP1"))
            }
        }, this)
    }

    selectBtnClick() {
        gdk.panel.setArgs(PanelId.VaultSelectView)
        gdk.panel.open(PanelId.VaultSelectView)
    }

    playerInfoBtnClick() {
        gdk.panel.setArgs(PanelId.MainSet, this.posData.playerId)
        gdk.panel.open(PanelId.MainSet)
    }

    headFrameBtnClick() {
        // let item: HeadItemInfo = {
        //     isHead: true,
        //     id: this.cfg.prize[0],
        //     isActive: true,
        //     isSelect: false
        // }
        // gdk.panel.setArgs(PanelId.FrameDetailsView, item);
        // gdk.panel.open(PanelId.FrameDetailsView);

        let itemInfo = {
            series: null,
            itemId: this.cfg.title[0],
            itemNum: 1,
            type: BagUtils.getItemTypeById(this.cfg.title[0]),
            extInfo: null,
        }
        GlobalUtil.openItemTips(itemInfo, true, false);


    }

    groupBtnClick() {
        gdk.gui.showMessage(this.cfg.buff_des)
    }
}
