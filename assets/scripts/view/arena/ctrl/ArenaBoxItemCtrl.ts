import ArenaModel from '../../../common/models/ArenaModel';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import RewardPreviewCtrl from '../../../common/widgets/RewardPreviewCtrl';
import { Arena_point_awardCfg } from '../../../a/config';

/** 
 * @Description: 竞技场奖励箱子
 * @Author: jijing.liu  
 * @Date: 2019-04-18 13:44:33
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-01-05 19:29:38
 */



const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/arena/ArenaBoxItemCtrl")
export default class ArenaBoxItemCtrl extends cc.Component {

    @property(cc.Node)
    proBar: cc.Node = null;

    @property(cc.Node)
    barBg: cc.Node = null;

    @property(cc.Node)
    boxOn: cc.Node = null;

    @property(cc.Node)
    boxOff: cc.Node = null;

    @property(cc.Node)
    getState: cc.Node = null;

    @property(cc.Label)
    pointLab: cc.Label = null;


    _curCfg: Arena_point_awardCfg = null

    get arenaModel() { return ModelManager.get(ArenaModel); }

    updateViewInfo(cfg: Arena_point_awardCfg, index: number) {
        this._curCfg = cfg
        let awardNums = this.arenaModel.awardNums;
        let pointNum = this.arenaModel.points;

        let masks = [1, 2, 4, 8, 16, 32]
        this.boxOn.angle = 0
        let ani = this.boxOn.getComponent(cc.Animation)
        ani.stop("reward_shake")
        if (pointNum >= cfg.point_number) {
            //已领取
            if (awardNums[0] & masks[cfg.id - 1]) {
                this.getState.active = true;
                this.boxOn.active = false
                this.boxOff.active = true
                //未领取
            } else {
                this.getState.active = false;
                this.boxOn.active = true
                this.boxOff.active = false
                ani.play("reward_shake")
            }
        } else {
            this.getState.active = false;
            this.boxOn.active = true
            this.boxOff.active = false
        }
        this.pointLab.string = `${cfg.point_number}`
        if (cfg.id <= index) {
            let points = cfg.point_number
            let showPoint = this.arenaModel.points
            if (cfg.id > 1) {
                let preCfg = ConfigManager.getItemById(Arena_point_awardCfg, cfg.id - 1)
                points = cfg.point_number - preCfg.point_number
                showPoint = this.arenaModel.points - preCfg.point_number
            }
            this.proBar.width = this.barBg.width * (showPoint / points);
        } else {
            this.proBar.width = 0
        }
    }

    boxClick(e) {
        let idx: number = this._curCfg.id - 1;
        let masks = [1, 2, 4, 8, 16, 32];
        if (masks[idx] & this.arenaModel.awardNums[0]) {
            // 已经领取过的奖励
            GlobalUtil.showMessageAndSound(gdk.i18n.t('i18n:REWARD_IS_RECEIVED'))
            return;
        } else {
            // 还没领取的奖励
            if (this.arenaModel.points >= this._curCfg.point_number) {
                // 可领取奖励
                let qmsg: icmsg.ArenaPointsAwardReq = new icmsg.ArenaPointsAwardReq();
                qmsg.index = idx;
                NetManager.send(qmsg, (rmsg: icmsg.ArenaPointsAwardRsp) => {
                    if (!cc.isValid(this.node)) return;
                    if (!this.node.activeInHierarchy) return;
                    this.arenaModel.points = rmsg.points;
                    this.arenaModel.awardNums = rmsg.awardNums;
                    GlobalUtil.openRewadrView(rmsg.goodsList);
                });
            } else {
                // 不可领取奖励，则显示预览
                let arr: icmsg.GoodsInfo[] = [];
                [this._curCfg.award_1, this._curCfg.award_2].forEach(e => {
                    if (!e || cc.js.isString(e)) return;
                    let goodsInfo = new icmsg.GoodsInfo();
                    goodsInfo.typeId = <number>e[0];
                    goodsInfo.num = <number>e[1];
                    arr.push(goodsInfo);
                });
                if (arr && arr.length > 0) {
                    PanelId.RewardPreview.maskAlpha = 0;
                    PanelId.RewardPreview.onHide = {
                        func: () => {
                            PanelId.RewardPreview.maskAlpha = 180;
                        }
                    }
                    gdk.panel.open(PanelId.RewardPreview, (node: cc.Node) => {
                        let worldPos = e.currentTarget.parent.convertToWorldSpaceAR(e.currentTarget.position);
                        let pos = gdk.gui.layers.popupLayer.convertToNodeSpaceAR(worldPos);
                        let ctrl = node.getComponent(RewardPreviewCtrl);
                        ctrl.setRewards(arr, gdk.i18n.t("i18n:ARENA_TIP4"));
                        node.setPosition(pos.x, pos.y + ctrl.scrollView.node.height + 90);
                        if (idx == 5 || idx == 4) {
                            node.x -= ctrl.scrollView.node.width / 2;
                        }
                    }, this);
                }
            }
        }
    }
}