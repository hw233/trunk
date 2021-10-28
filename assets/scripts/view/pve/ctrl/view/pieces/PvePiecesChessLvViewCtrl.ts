import ConfigManager from '../../../../../common/managers/ConfigManager';
import ModelManager from '../../../../../common/managers/ModelManager';
import NetManager from '../../../../../common/managers/NetManager';
import PanelId from '../../../../../configs/ids/PanelId';
import PiecesModel from '../../../../../common/models/PiecesModel';
import PiecesUtils from '../../../../pieces/utils/PiecesUtils';
import { Pieces_discCfg, Pieces_globalCfg } from '../../../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-07-05 14:12:12 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/pve/view/pieces/PvePiecesChessLvViewCtrl")
export default class PvePiecesChessLvViewCtrl extends gdk.BasePanel {
    @property(cc.Label)
    showLvLab: cc.Label = null;

    @property(cc.Node)
    curQualityContent: cc.Node = null;

    @property(cc.Node)
    previewNode: cc.Node = null;

    @property(cc.Node)
    maxLvTips: cc.Node = null;

    @property(cc.Label)
    curLv: cc.Label = null;

    @property(cc.Label)
    nextLv: cc.Label = null;

    @property(cc.Node)
    progressNode: cc.Node = null;

    @property(cc.Label)
    curSliverLab: cc.Label = null;

    @property(cc.Button)
    upBtn: cc.Button = null;

    @property(cc.Label)
    lvTipsLab: cc.Label = null;

    @property(cc.Node)
    nextQualityContent: cc.Node = null;

    get piecesModel(): PiecesModel { return ModelManager.get(PiecesModel); }

    onEnable() {
    }

    onDisable() {
    }

    onPreBtnClick() {
        gdk.panel.open(PanelId.PvePiecesChessLvPreView);
    }

    onUpBtnClick() {
        let eachUpCost = ConfigManager.getItemByField(Pieces_globalCfg, 'key', 'disc_consumption').value[0];
        if (this.piecesModel.silver < eachUpCost) {
            gdk.gui.showMessage('银币不足');
            return;
        }

        let req = new icmsg.PiecesUpgradeChessBoardReq();
        NetManager.send(req);
    }

    @gdk.binding("piecesModel.chessLv")
    _updateShowNode() {
        let lv = this.piecesModel.chessLv;
        this.showLvLab.string = `棋盘等级Lv${lv}`;
        let weightList = [
            PiecesUtils.getRefreshWeight(1, this.piecesModel.chessLv),
            PiecesUtils.getRefreshWeight(2, this.piecesModel.chessLv),
            PiecesUtils.getRefreshWeight(3, this.piecesModel.chessLv),
            PiecesUtils.getRefreshWeight(4, this.piecesModel.chessLv),
        ]
        let total = weightList[0] + weightList[1] + weightList[2] + weightList[3];
        let temps = [];
        this.curQualityContent.children.forEach((w, idx) => {
            w.active = true;
            let temp = (weightList[idx] / total * 100).toFixed(2);
            temps.push(temp);
            w.getChildByName('num').getComponent(cc.Label).string = `${temp}%`;
        });
        this.curQualityContent.children[0].getChildByName('num').getComponent(cc.Label).string = `${(100 - temps[1] - temps[2] - temps[3]).toFixed(2)}%`;
    }

    @gdk.binding("piecesModel.chessExp")
    @gdk.binding("piecesModel.silver")
    _updateProgress() {
        let nextCfg = ConfigManager.getItemById(Pieces_discCfg, this.piecesModel.chessLv + 1);
        if (!nextCfg) return;
        this.progressNode.getChildByName('num').getComponent(cc.Label).string = `${this.piecesModel.chessExp}/${nextCfg.exp}`;
        this.progressNode.getChildByName('bar').width = Math.max(0, 256 * (this.piecesModel.chessExp / nextCfg.exp));
        this.curSliverLab.string = `${this.piecesModel.silver}`;
        let eachUpCost = ConfigManager.getItemByField(Pieces_globalCfg, 'key', 'disc_consumption').value[0];
        let numLab = this.upBtn.node.getChildByName('num').getComponent(cc.Label);
        numLab.string = eachUpCost + '';
        numLab.node.color = cc.color().fromHEX(this.piecesModel.silver >= eachUpCost ? '#D8FEFE' : '#FF0000');
    }

    @gdk.binding("piecesModel.chessLv")
    _updatePreviewNode() {
        let curCfg = ConfigManager.getItemById(Pieces_discCfg, this.piecesModel.chessLv);
        let nextCfg = ConfigManager.getItemById(Pieces_discCfg, this.piecesModel.chessLv + 1);
        if (!nextCfg) {
            this.previewNode.active = false;
            this.maxLvTips.active = true;
        }
        else {
            this.previewNode.active = true;
            this.maxLvTips.active = false;
            this.curLv.string = `Lv${curCfg.level}`;
            this.nextLv.string = `Lv${nextCfg.level}`;
            this.lvTipsLab.string = `棋盘等级提升至Lv${nextCfg.level},英雄抽取概率提升为`;
            let weightList = [
                PiecesUtils.getRefreshWeight(1, this.piecesModel.chessLv),
                PiecesUtils.getRefreshWeight(2, this.piecesModel.chessLv),
                PiecesUtils.getRefreshWeight(3, this.piecesModel.chessLv),
                PiecesUtils.getRefreshWeight(4, this.piecesModel.chessLv),
            ]
            let total = weightList[0] + weightList[1] + weightList[2] + weightList[3];
            let temps = [];
            this.nextQualityContent.children.forEach((w, idx) => {
                w.active = true;
                let temp = (weightList[idx] / total * 100).toFixed(2);
                temps.push(temp);
                w.getChildByName('num').getComponent(cc.Label).string = `${temp}%`;
            });
            this.nextQualityContent.children[0].getChildByName('num').getComponent(cc.Label).string = `${(100 - temps[1] - temps[2] - temps[3]).toFixed(2)}%`;
        }
    }
}
