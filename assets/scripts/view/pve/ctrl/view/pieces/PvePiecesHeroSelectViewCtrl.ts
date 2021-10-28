import ConfigManager from '../../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../../common/managers/ModelManager';
import NetManager from '../../../../../common/managers/NetManager';
import PiecesModel, { PiecesTalentType } from '../../../../../common/models/PiecesModel';
import PiecesUtils from '../../../../pieces/utils/PiecesUtils';
import PvePiecesRefreshItemCtrl from './PvePiecesRefreshItemCtrl';
import { Pieces_globalCfg } from '../../../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-05-21 14:37:21 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/pve/view/pieces/PvePiecesHeroSelectViewCtrl")
export default class PvePiecesHeroSelectViewCtrl extends gdk.BasePanel {
    @property(cc.Node)
    heroContent: cc.Node = null;

    @property(cc.Prefab)
    heroPrefab: cc.Prefab = null;

    @property([cc.Node])
    weightNodes: cc.Node[] = [];

    @property(cc.Label)
    moneyLab: cc.Label = null;

    @property(cc.Node)
    lockBtn: cc.Node = null;

    @property(cc.Label)
    costLab: cc.Label = null;

    @property(cc.Node)
    refreshBtn: cc.Node = null;

    get model(): PiecesModel { return ModelManager.get(PiecesModel); }

    lockUrl: string[] = ['common/texture/role/yx_jiesuo', 'common/texture/role/yx_suoding'];
    wave: number;
    onEnable() {
        this.wave = this.args[0];
        NetManager.on(icmsg.PiecesBuyHeroPanelRsp.MsgType, this._updateView, this);
        NetManager.on(icmsg.PiecesRefreshBuyHeroPanelRsp.MsgType, () => {
            if (!this.model.roundRefreshTimes[this.wave]) this.model.roundRefreshTimes[this.wave] = 0;
            this.model.roundRefreshTimes[this.wave] += 1;
            this._updateView();
        }, this);
        NetManager.send(new icmsg.PiecesBuyHeroPanelReq());
    }

    onDisable() {
        NetManager.targetOff(this);
    }

    onCloseBtnClick() {
        this.close();
    }

    onRefreshBtnClick() {
        let cost = this._getRefreshCost();
        if (this.model.silver < cost) {
            gdk.gui.showMessage(gdk.i18n.t('i18n:PIECES_TIPS11'));
        }
        else {
            NetManager.send(new icmsg.PiecesRefreshBuyHeroPanelReq(), null, this);
        }
    }

    onLockBtnClick() {
        let req = new icmsg.PiecesLockBuyHeroPanelReq();
        req.isLock = !this.model.refreshIsLock;
        NetManager.send(req, (resp: icmsg.PiecesLockBuyHeroPanelRsp) => {
            if (!cc.isValid(this.node)) return;
            if (!this.node.activeInHierarchy) return;
            GlobalUtil.setSpriteIcon(this.node, this.lockBtn, this.lockUrl[this.model.refreshIsLock ? 1 : 0]);
        }, this);
    }

    @gdk.binding('model.silver')
    _updateSilver() {
        this.moneyLab.string = this.model.silver + '';
    }


    _updateView() {
        if (!cc.isValid(this.node)) return;
        if (!this.node.activeInHierarchy) return;
        GlobalUtil.setSpriteIcon(this.node, this.lockBtn, this.lockUrl[this.model.refreshIsLock ? 1 : 0]);
        let need = this._getRefreshCost();
        if (need == 0) {
            cc.find('free', this.refreshBtn).active = true;
            cc.find('cost', this.refreshBtn).active = false;
        }
        else {
            cc.find('free', this.refreshBtn).active = false;
            cc.find('cost', this.refreshBtn).active = true;
            this.costLab.string = need + '';
            this.costLab.node.color = cc.color().fromHEX(this.model.silver >= need ? '#FFE1B9' : '#FF0000');
        }
        this.moneyLab.string = this.model.silver + '';
        let weightList = [
            PiecesUtils.getRefreshWeight(1, this.model.chessLv),
            PiecesUtils.getRefreshWeight(2, this.model.chessLv),
            PiecesUtils.getRefreshWeight(3, this.model.chessLv),
            PiecesUtils.getRefreshWeight(4, this.model.chessLv),
        ]
        let total = weightList[0] + weightList[1] + weightList[2] + weightList[3];
        let temps = [];
        this.weightNodes.forEach((w, idx) => {
            let temp = (weightList[idx] / total * 100).toFixed(2);
            temps.push(temp);
            w.getChildByName('num').getComponent(cc.Label).string = `${temp}%`;
        });
        this.weightNodes[0].getChildByName('num').getComponent(cc.Label).string = `${(100 - temps[1] - temps[2] - temps[3]).toFixed(2)}%`;

        this.heroContent.removeAllChildren();
        this.model.refreshHeroList.forEach((l, idx) => {
            let item = cc.instantiate(this.heroPrefab);
            item.parent = this.heroContent;
            let ctrl = item.getComponent(PvePiecesRefreshItemCtrl);
            ctrl.updateView(l, idx);
        });
    }

    /**
     * 获取刷新消耗
     * @returns 
     */
    _getRefreshCost() {
        if (!this.model.roundRefreshTimes[this.wave]) this.model.roundRefreshTimes[this.wave] = 0;
        let t = this.model.roundRefreshTimes[this.wave];
        let cost;
        //talent1  每回合第X次刷新免费
        let t1 = PiecesUtils.getTalentInfoByType(PiecesTalentType.type1);
        if (t1.indexOf(t + 1) !== -1) {
            cost = 0;
            return cost;
        }
        //talent 刷新消耗-X%
        cost = ConfigManager.getItemByField(Pieces_globalCfg, 'key', 'refresh').value[0];
        let d = 0;
        let talentArgs = PiecesUtils.getTalentInfoByType(PiecesTalentType.type10);
        talentArgs.forEach(t => { d += cost * t / 100; })
        return Math.ceil(cost - d);
    }
}
