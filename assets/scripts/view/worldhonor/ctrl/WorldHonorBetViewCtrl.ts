import BagUtils from '../../../common/utils/BagUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import WorldHonorModel from '../../../common/models/WorldHonorModel';
import WorldHonorUtils from '../utils/WorldHonorUtils';
import { Arenahonor_worldwideCfg } from '../../../a/config';

/**
 * enemy荣耀巅峰赛竞猜投注界面
 * @Author: yaozu.hu
 * @Date: 2019-10-28 10:48:51
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-06-21 17:36:01
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/worldhonor/WorldHonorBetViewCtrl")
export default class WorldHonorBetViewCtrl extends gdk.BasePanel {
    @property(cc.Node)
    player: cc.Node = null;

    @property(cc.Label)
    betNum: cc.Label = null;

    @property(cc.Slider)
    numSlider: cc.Slider = null;

    @property(cc.Node)
    icon: cc.Node = null;

    _maxNum: number;
    _minNum: number = 0;
    selectNum: number;
    step: number = 0.1;
    moneyId: number = 32;
    idx: number; //组数
    info: icmsg.ArenaHonorMatch;
    playerInfo: icmsg.RoleBrief;
    get model(): WorldHonorModel { return ModelManager.get(WorldHonorModel); }
    onEnable() {
        [this.idx, this.info] = this.args[0];
        let playerId = this.info.players[this.idx].id;
        this.playerInfo = this.model.playersInfoMap[playerId];
        let proId = WorldHonorUtils.getCurProgressId()
        cc.find('layout/name', this.player).getComponent(cc.Label).string = this.playerInfo.name//this.info.players[this.idx];
        GlobalUtil.setSpriteIcon(this.node, cc.find('layout/icon', this.player), GlobalUtil.getIconById(this.moneyId));
        GlobalUtil.setSpriteIcon(this.node, cc.find('heroSlot/iconBg', this.player), GlobalUtil.getHeadFrameById(this.playerInfo.headFrame));
        GlobalUtil.setSpriteIcon(this.node, cc.find('heroSlot/mask/icon', this.player), GlobalUtil.getHeadIconById(this.playerInfo.head));
        GlobalUtil.setSpriteIcon(this.node, this.icon, GlobalUtil.getIconById(this.moneyId));
        let cfg = ConfigManager.getItemById(Arenahonor_worldwideCfg, proId)
        let m = cfg.section[1];
        this._maxNum = Math.min(m, BagUtils.getItemNumById(this.moneyId));
        this._minNum = cfg.section[0];
        this.selectNum = this._minNum;
        this._updateView();
    }

    onDisable() {
        NetManager.targetOff(this);
    }

    onBetBtnClick() {
        if (this.selectNum <= 0) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:CHAMPION_BET_TIP1"));
            return;
        }

        let req = new icmsg.ArenaHonorGuessReq();
        req.world = true;
        req.group = this.info.group;
        req.match = this.info.match;
        req.winner = this.idx + 1;
        req.score = this.selectNum;
        NetManager.send(req, () => {
            gdk.gui.showMessage(gdk.i18n.t("i18n:CHAMPION_BET_TIP2"));

            //刷新本地数据
            this.close();
        }, this);
    }

    //滑动条
    onSliderChange() {
        this.selectNum = Math.floor((this._maxNum - this._minNum) * this.numSlider.progress) + this._minNum
        this._updateView();
    }

    //减数量
    onMinusBtn() {
        this.selectNum -= (this._maxNum - this._minNum) * this.step;
        this._updateView();
    }

    //加数量
    onPlusBtn() {
        this.selectNum += (this._maxNum - this._minNum) * this.step;
        this._updateView();
    }

    _updateView() {
        this.selectNum = Math.min(this._maxNum, this.selectNum);
        this.selectNum = Math.max(this._minNum, this.selectNum);
        this.selectNum = Math.floor(this.selectNum);
        this.betNum.string = `${GlobalUtil.numberToStr2(this.selectNum, true)}`;
        this.numSlider.progress = this._maxNum == 0 ? 0 : (this.selectNum - this._minNum) / (this._maxNum - this._minNum);
        this.numSlider.node.getChildByName('sliderBar').width = 335 * this.numSlider.progress;
    }
}
