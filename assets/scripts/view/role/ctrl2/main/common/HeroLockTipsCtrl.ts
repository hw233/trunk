import BYMainViewCtrl from '../../../../bingying/ctrl/BYMainViewCtrl';
import ConfigManager from '../../../../../common/managers/ConfigManager';
import HeroUtils from '../../../../../common/utils/HeroUtils';
import JumpUtils from '../../../../../common/utils/JumpUtils';
import NetManager from '../../../../../common/managers/NetManager';
import PanelId from '../../../../../configs/ids/PanelId';
import { hero_lock_model } from '../../../../../common/models/HeroModel';
import { HeroCfg } from '../../../../../../boot/configs/bconfig';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-07-26 18:19:45 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/main/common/HeroLockTipsCtrl")
export default class HeroLockTipsCtrl extends gdk.BasePanel {
    @property(cc.RichText)
    tips: cc.RichText = null;

    @property(cc.Node)
    jumpContent: cc.Node = null;

    @property(cc.Node)
    jumpItem: cc.Node = null;

    @property(cc.Node)
    cancelBtn: cc.Node = null;

    @property(cc.Node)
    confirmBtn: cc.Node = null;

    LockModelInfo: { [id: number]: { name: string, jumpFun: Function } } = {
        0: { name: gdk.i18n.t('i18n:HERO_TIP65'), jumpFun: null },
        1: { name: gdk.i18n.t('i18n:HERO_TIP66'), jumpFun: null },
        2: { name: gdk.i18n.t('i18n:HERO_TIP67'), jumpFun: null },
        3: { name: gdk.i18n.t('i18n:HERO_TIP68'), jumpFun: null },
        4: { name: gdk.i18n.t('i18n:HERO_TIP69'), jumpFun: null },
        5: { name: gdk.i18n.t('i18n:HERO_TIP70'), jumpFun: null },
        6: { name: gdk.i18n.t('i18n:HERO_TIP71'), jumpFun: () => { JumpUtils.openSupportView([1]); } },
        7: { name: gdk.i18n.t('i18n:HERO_TIP72'), jumpFun: () => { JumpUtils.openSupportView([4]); } },
        8: { name: gdk.i18n.t('i18n:HERO_TIP73'), jumpFun: this._jumpFunc8 },
        9: { name: gdk.i18n.t('i18n:HERO_TIP74'), jumpFun: null },
        10: { name: gdk.i18n.t('i18n:HERO_TIP75'), jumpFun: this._jumpFunc10 },
        11: { name: gdk.i18n.t('i18n:HERO_TIP76'), jumpFun: null },
        12: { name: gdk.i18n.t('i18n:HERO_TIP77'), jumpFun: this._JumpFunc12 },
        13: { name: gdk.i18n.t('i18n:HERO_TIP83'), jumpFun: (arg) => { this._jumpFunc13(arg) } },
        14: { name: gdk.i18n.t('i18n:HERO_TIP84'), jumpFun: null },
        15: { name: gdk.i18n.t('i18n:HERO_TIP87'), jumpFun: null },
    }

    heroId: number;
    excludeLockModels: hero_lock_model[];
    cb: Function;

    oneKeyBattleOffLockModel: hero_lock_model[] = []; //支持 一键下阵
    jumpLockModel: hero_lock_model[] = []; //跳转 需玩家手动下阵
    curIdx: number;
    onEnable() {
    }

    onDisable() {
        NetManager.targetOff(this);
        this.cb = null;
    }

    onCancelBtnClick() {
        this.close();
    }

    onConfirmBtnClick() {
        //锁定
        if (this.curIdx == 0) {
            let req = new icmsg.HeroStatusLockReq();
            req.heroId = this.heroId;
            req.switchFlag = 0;
            NetManager.send(req, (resp: icmsg.HeroStatusLockRsp) => {
                if (!cc.isValid(this.node)) return;
                if (!this.node.activeInHierarchy) return;
                this._updateView();
            }, this);
            return;
        }
        //一键下阵
        if (this.curIdx == 2) {
            NetManager.once(icmsg.BattleArrayQueryRsp.MsgType, (resp: icmsg.BattleArrayQueryRsp) => {
                if (!cc.isValid(this.node)) return;
                if (!this.node.activeInHierarchy) return;
                this._updateView();
            }, this);
            let req = new icmsg.BattleArrayOffReq();
            req.heroId = this.heroId;
            NetManager.send(req);
            return;
        }
    }

    initArgs(heroId: number, excludeLockModels: hero_lock_model[] = [], cb?: Function) {
        this.heroId = heroId;
        this.excludeLockModels = excludeLockModels;
        cb && (this.cb = cb);
        this._updateView();
    }

    _init() {
        let oneKeyIds = [0, 1, 2, 3, 4, 5, 11, 14, 15];
        this.oneKeyBattleOffLockModel = [];
        this.jumpLockModel = [];
        let curLockModel = HeroUtils.getLockModelByHeroId(this.heroId, this.excludeLockModels);
        curLockModel.forEach(l => {
            if (oneKeyIds.indexOf(l) == -1) {
                this.jumpLockModel.push(l);
            }
            else {
                this.oneKeyBattleOffLockModel.push(l);
            }
        });
    }

    _updateView() {
        this._init();
        this.confirmBtn.active = false;
        this.jumpContent.removeAllChildren();
        if (this.jumpLockModel.indexOf(9) !== -1) {
            this.confirmBtn.active = true;
            this.tips.string = gdk.i18n.t('i18n:HERO_TIP78');
            this.curIdx = 0;
            return;
        }
        if (this.jumpLockModel.length > 0) {
            this.tips.string = gdk.i18n.t('i18n:HERO_TIP79');
            this._updateJumpContent(this.jumpLockModel);
            this.curIdx = 1;
            return;
        }
        if (this.oneKeyBattleOffLockModel.length > 0) {
            this.tips.string = gdk.i18n.t('i18n:HERO_TIP80');
            this.confirmBtn.active = true;
            this._updateJumpContent(this.oneKeyBattleOffLockModel);
            this.curIdx = 2;
            return;
        }
        //选定
        this.cb && this.cb();
        this.close();
    }

    _updateJumpContent(m: hero_lock_model[]) {
        m.forEach(id => {
            let info = this.LockModelInfo[id];
            let item = cc.instantiate(this.jumpItem);
            item.active = true;
            item.parent = this.jumpContent;
            let lab = item.getChildByName('lab').getComponent(cc.Label);
            let jumpBtn = item.getChildByName('jumpBtn');
            lab.string = info.name;
            jumpBtn.active = !!info.jumpFun;
            jumpBtn.targetOff(this);
            if (jumpBtn.active) {
                jumpBtn.on(cc.Node.EventType.TOUCH_START, () => {
                    let arg = this.heroId;
                    gdk.gui.removeAllPopup();
                    info.jumpFun(arg);
                }, this);
            }
        });
    }

    //=============jumpFun===========//
    _JumpFunc12() {
        gdk.panel.open(PanelId.BYMainView, (node: cc.Node) => {
            let ctrl = node.getComponent(BYMainViewCtrl);
            ctrl.selectPanel(2, () => {
                gdk.panel.open(PanelId.BYResearchView);
            });
        })
    }

    _jumpFunc10() {
        gdk.panel.open(PanelId.AwakeStarUpView);
    }

    _jumpFunc8() {
        gdk.panel.open(PanelId.GuildMain, (node: cc.Node) => {
            gdk.panel.open(PanelId.MercenarySetView);
        })
    }

    _jumpFunc13(heroId: number) {
        let heroInfo = HeroUtils.getHeroInfoByHeroId(heroId);
        let mysticId;
        if (ConfigManager.getItemById(HeroCfg, heroInfo.typeId).group[0] == 6) {
            mysticId = heroInfo.heroId;
        } else {
            mysticId = heroInfo.mysticLink;
        }
        gdk.panel.setArgs(PanelId.GeneConnectView, mysticId);
        JumpUtils.openSupportView([6]);
    }
}
