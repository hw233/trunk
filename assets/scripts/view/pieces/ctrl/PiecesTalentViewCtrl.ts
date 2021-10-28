import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import PiecesModel from '../../../common/models/PiecesModel';
import PiecesTalentIconCtrl from './PiecesTalentIconCtrl';
import StringUtils from '../../../common/utils/StringUtils';
import { Pieces_globalCfg, Pieces_talentCfg } from '../../../a/config';
import { PiecesEventId } from '../enum/PiecesEventId';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-05-19 10:28:53 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/pieces/PiecesTalentViewCtrl")
export default class PiecesTalentViewCtrl extends gdk.BasePanel {
    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Node)
    line1Layer: cc.Node = null;

    @property(cc.Node)
    line2Layer: cc.Node = null;

    @property(cc.Node)
    iconLayer: cc.Node = null;

    @property(cc.Prefab)
    line1Prefab: cc.Prefab = null;

    @property(cc.Prefab)
    line2Prefab: cc.Prefab = null;

    @property(cc.Prefab)
    iconPrefab: cc.Prefab = null;

    @property(cc.Label)
    pointLab: cc.Label = null;

    get model(): PiecesModel { return ModelManager.get(PiecesModel); }

    spaceX: number = 165;
    spaceY: number = 151;
    cfgs: Pieces_talentCfg[] = [];
    iconMap: { [id: number]: cc.Node } = {};
    tweens: cc.Tween[] = [];
    onEnable() {
        this.initView();
        gdk.e.on(PiecesEventId.PIECES_TALENT_CLICK_TO_ACTIVE, this.onIconClick, this);
    }

    onDisable() {
        this.iconMap = {};
        this.tweens.forEach(t => {
            t.stop();
        });
        this.tweens = [];
        gdk.e.targetOff(this);
    }

    onResetBtnClick() {
        let cb = () => {
            let req = new icmsg.PiecesLightUpTalentReq();
            req.talentId = 0;
            NetManager.send(req, (resp: icmsg.PiecesLightUpTalentRsp) => {
                if (!cc.isValid(this.node)) return;
                if (!this.node.activeInHierarchy) return;
                if (resp.talentId == 0) {
                    this._resetAll();
                }
            }, this);
        }

        if (Object.keys(this.model.talentMap).length <= 0) {
            gdk.gui.showMessage(gdk.i18n.t('i18n:PIECES_TIPS6'));
            return;
        }

        let cost = ConfigManager.getItemByField(Pieces_globalCfg, 'key', 'reset_talent').value;
        GlobalUtil.openAskPanel({
            descText: StringUtils.format(gdk.i18n.t('i18n:PIECES_TIPS7'), cost[1]),
            sureCb: () => {
                if (GlobalUtil.checkMoneyEnough(cost[1], cost[0], null, [PanelId.PiecesMain])) {
                    cb();
                }
            }
        })
    }

    initView() {
        let maxX = 0;
        let maxY = 0;
        let firstPos = cc.v2();
        let normalVec = new cc.Vec2(1, 0);
        this.cfgs = ConfigManager.getItems(Pieces_talentCfg);
        [this.line1Layer, this.line2Layer, this.iconLayer].forEach(l => { l.removeAllChildren(); });
        this.cfgs.forEach(c => {
            maxX = Math.max(maxX, c.place[0]);
            maxY = Math.max(maxY, c.place[1]);
            //icon
            let icon = cc.instantiate(this.iconPrefab);
            icon.parent = this.iconLayer;
            icon.setPosition((c.place[0] - 1) * this.spaceX, -(c.place[1] - 1) * this.spaceY);
            if (c.id == 1) {
                firstPos = icon.getPos();
            }
            let unlock = this.model.talentMap[c.id] == 1;
            let ctrl = icon.getComponent(PiecesTalentIconCtrl);
            ctrl.updateView(c.id);
            this.iconMap[c.id] = icon;
            //line1 & line2
            let afterIconIds = c.after;
            if (afterIconIds && afterIconIds.length > 0) {
                afterIconIds.forEach(id => {
                    let afterCfg = ConfigManager.getItemById(Pieces_talentCfg, id);
                    let line1 = cc.instantiate(this.line1Prefab);
                    line1.parent = this.line1Layer;
                    line1.setPosition(icon.x + icon.width / 2, icon.y - icon.height / 2);
                    let afterPos = cc.v2((afterCfg.place[0] - 1) * this.spaceX, -(afterCfg.place[1] - 1) * this.spaceY);
                    let vec = afterPos.sub(icon.getPos());
                    line1.height = vec.mag();
                    line1.angle = normalVec.signAngle(vec) * 180 / Math.PI + 90;
                    if (unlock) {
                        let line2 = cc.instantiate(this.line2Prefab);
                        line2.parent = this.line2Layer;
                        line2.setPosition(line1.getPos());
                        line2.height = line1.height;
                        line2.angle = line1.angle;
                    }
                });
            }
        });
        this.content.width = this.spaceX * maxX;
        this.content.height = this.spaceY * maxY;
        this.scrollView.scrollToOffset(cc.v2(Math.abs(this.scrollView.node.width / 2 - firstPos.x) + 48, 0));
    }

    onIconClick(e: gdk.Event) {
        let id = e.data;
        let cfg = ConfigManager.getItemById(Pieces_talentCfg, id);
        if (cfg) {
            if (this.model.talentPoint < cfg.consumption) {
                gdk.gui.showMessage(gdk.i18n.t('i18n:PIECES_TIPS8'));
                return;
            }
            else {
                let req = new icmsg.PiecesLightUpTalentReq();
                req.talentId = cfg.id;
                NetManager.send(req, (resp: icmsg.PiecesLightUpTalentRsp) => {
                    if (!cc.isValid(this.node)) return;
                    if (!this.node.activeInHierarchy) return;
                    if (resp.talentId == 0) {
                        this._resetAll();
                    }
                    else {
                        this._playUnlockAni(resp.talentId);
                    }
                }, this);
            }
        }
    }

    @gdk.binding('model.talentPoint')
    _updatePoint() {
        this.pointLab.string = this.model.talentPoint + '';
    }

    _resetAll() {
        this.tweens.forEach(t => { t.stop(); });
        this.tweens = [];
        this.line2Layer.removeAllChildren();
        for (let key in this.iconMap) {
            let ctrl = this.iconMap[key].getComponent(PiecesTalentIconCtrl);
            ctrl.updateView(parseInt(key));
        }
    }

    _playUnlockAni(id: number) {
        let cfg = ConfigManager.getItemById(Pieces_talentCfg, id);
        let icon = this.iconMap[cfg.id];
        icon.getComponent(PiecesTalentIconCtrl).updateView(cfg.id);
        PanelId.PiecesTalentActiveView.onHide = {
            func: () => {
                if (!cc.isValid(this.node)) return;
                if (!this.node.activeInHierarchy) return;
                if (cfg.after && cfg.after.length > 0) {
                    let normalVec = new cc.Vec2(1, 0);
                    let startPos = cc.v2((cfg.place[0] - 1) * this.spaceX, -(cfg.place[1] - 1) * this.spaceY);
                    cfg.after.forEach(i => {
                        let afterCfg = ConfigManager.getItemById(Pieces_talentCfg, i);
                        let line2 = cc.instantiate(this.line2Prefab);
                        line2.parent = this.line2Layer;
                        line2.setPosition(startPos.x + icon.width / 2, startPos.y - icon.height / 2);

                        let afterPos = cc.v2((afterCfg.place[0] - 1) * this.spaceX, -(afterCfg.place[1] - 1) * this.spaceY);
                        let vec = afterPos.sub(startPos);
                        line2.angle = normalVec.signAngle(vec) * 180 / Math.PI + 90;
                        line2.height = 0;
                        let h = vec.mag();
                        let t = cc.tween(line2)
                            .to(.3, { height: h })
                            .call(() => {
                                this.iconMap[i].getComponent(PiecesTalentIconCtrl).updateView(i);
                            })
                            .start();
                        this.tweens.push(t);
                    });
                }
            }
        }

        gdk.panel.setArgs(PanelId.PiecesTalentActiveView, cfg.id);
        gdk.panel.open(PanelId.PiecesTalentActiveView);
    }
}
