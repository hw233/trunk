import ConfigManager from '../../../../../common/managers/ConfigManager';
import HeroUtils from '../../../../../common/utils/HeroUtils';
import NetManager from '../../../../../common/managers/NetManager';
import PiecesUtils from '../../../../pieces/utils/PiecesUtils';
import PveBuildTowerCtrl from '../../fight/PveBuildTowerCtrl';
import PvePiecesDragHeroCtrl from './PvePiecesDragHeroCtrl';
import PvePiecesHeroSellCtrl from './PvePiecesHeroSellCtrl';
import PveSceneState from '../../../enum/PveSceneState';
import ThingColliderCtrl from '../../../core/ThingColliderCtrl';
import UiSlotItem from '../../../../../common/widgets/UiSlotItem';
import { Hero_careerCfg, Pieces_heroCfg } from '../../../../../a/config';
import { PiecesEventId } from '../../../../pieces/enum/PiecesEventId';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-05-20 17:38:44 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/pve/view/pieces/PvePiecesHandCardCtrl")
export default class PvePiecesHandCardCtrl extends cc.Component {
    @property({ type: cc.Integer, tooltip: "手牌位置Id" })
    id: number = 0;

    @property(UiSlotItem)
    slot: UiSlotItem = null;

    @property(cc.Prefab)
    heroPrefab: cc.Prefab = null;

    @property(sp.Skeleton)
    upStarSpine: sp.Skeleton = null;

    heroItem: cc.Node;
    moveSpine: sp.Skeleton;
    onEnable() {
        this.upStarSpine.setCompleteListener(null);
        this.upStarSpine.node.active = false;
        this._update();
        this.node.on(cc.Node.EventType.TOUCH_START, this._onTouchStart, this);
        gdk.e.on(PiecesEventId.PIECES_PVP_HERO_UP_STAR, this._onHeroUpStar, this);
        gdk.e.on(PiecesEventId.PIECES_HAND_CARD_UPDATE, this._update, this);
        gdk.e.on(PiecesEventId.PIECES_PVP_CAREER_CHANGE, this._update, this);
    }

    onDisable() {
        if (this.heroItem) {
            this.heroItem.removeFromParent();
            this.heroItem = null;
        }
        this.upStarSpine.setCompleteListener(null);
        gdk.e.targetOff(this);
        this.node.off(cc.Node.EventType.TOUCH_START, this._onTouchStart, this);
    }

    /**
     * 英雄下阵
     * @param heroId 
     * @param cb 
     */
    offBattleReq(heroId: number, cb?: Function) {
        let info = PiecesUtils.getHeroInfoByPos(this.id);
        if (PiecesUtils.isValidOnBattle(info ? info.heroId : 0, heroId)) {
            let req = new icmsg.PiecesHeroOnBattleReq();
            req.heroId = heroId;
            req.pos = this.id;
            NetManager.send(req, (resp: icmsg.PiecesHeroOnBattleRsp) => {
                cb && cb(resp);
            }, this);
            return true;
        }
        return false;
    }

    _update() {
        let info = PiecesUtils.getHeroInfoByPos(this.id);
        this.slot.node.active = !!info;
        if (this.slot.node.active) {
            this.slot.starNum = info.star
            this.slot.updateItemInfo(info.typeId);
            let cfg = ConfigManager.getItemByField(Pieces_heroCfg, 'hero_id', info.typeId);
            this.slot.updateQuality(cfg.color);
            this.slot.updateGroup(cfg.group[0]);
            this.slot.updateCareer(ConfigManager.getItemByField(Hero_careerCfg, 'hero_id', info.typeId, { career_id: info.line }).career_type);
        }
    }

    _onTouchStart(event: cc.Event.EventTouch) {
        if (!this.slot.node.active) return;
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this._touchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this._touchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this._touchEnd, this);

        gdk.e.emit(PiecesEventId.PIECES_PVP_SHOW_HERO_SELL_ICON, PiecesUtils.getHeroInfoByPos(this.id).heroId);
        let content = this.node.parent.parent.parent.getChildByName('dragArea');
        let typeId = this.slot.itemId;
        if (this.heroItem) {
            this.heroItem.removeFromParent();
            this.heroItem = null;
        }

        //wx小程序上 未触发touchEnd 导致heroItem没回收
        let oldItem = content.getChildByName('customHeroItem');
        if (oldItem) {
            oldItem.removeFromParent();
            oldItem = null;
        }

        this.heroItem = cc.instantiate(this.heroPrefab);
        this.heroItem.parent = content;
        this.heroItem.name = 'customHeroItem';
        this.heroItem.setPosition(content.convertToNodeSpaceAR(event.getStartLocation()));
        let ctrl = this.heroItem.getComponent(PvePiecesDragHeroCtrl);
        ctrl.updateView(typeId);
        //特效
        if (!this.moveSpine) {
            this.moveSpine = content.getChildByName('spine').getComponent(sp.Skeleton);
        }
        this.moveSpine.node.active = true;
        this.moveSpine.node.setSiblingIndex(999);
        //起点
        let pos = this.node.parent.convertToWorldSpaceAR(this.node.getPos());
        this.moveSpine.node.x = content.convertToNodeSpaceAR(pos).x;
        // //终点
        let zhixiang = this.moveSpine.findBone('zhixiang');
        if (zhixiang) {
            let targetPos = this.moveSpine.node.convertToNodeSpaceAR(event.getLocation());
            zhixiang.x = targetPos.x;
            zhixiang.y = targetPos.y;
        }
    }

    _touchMove(event: cc.Event.EventTouch) {
        let delta: cc.Vec2 = event.touch.getDelta();
        if (delta.x != 0 || delta.y != 0) {
            this.heroItem.setPosition(this.heroItem.parent.convertToNodeSpaceAR(event.getLocation()));

            //特效
            this.moveSpine.node.setSiblingIndex(999);
            let zhixiang = this.moveSpine.findBone('zhixiang');
            if (zhixiang) {
                let pos = this.moveSpine.node.convertToNodeSpaceAR(event.getLocation());
                zhixiang.x = pos.x;
                zhixiang.y = pos.y;
            }

            // 检查是否相交
            let collider = this.heroItem.getComponent(ThingColliderCtrl);
            if (!collider) {
                collider = this.heroItem.addComponent(ThingColliderCtrl);
            }
        }
    }

    _touchEnd(event: any) {
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this._touchMove, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this._touchEnd, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this._touchEnd, this);
        //特效 
        this.moveSpine.node.active = false;

        let collider = this.heroItem.getComponent(ThingColliderCtrl);
        if (collider) {
            let tower = collider.getClolliderComponent(PveBuildTowerCtrl, t => !t.sceneCtrl.model.isMirror);
            let sellNode = collider.getClolliderComponent(PvePiecesHeroSellCtrl);
            let handCard = collider.getClolliderComponent(PvePiecesHandCardCtrl);
            let curHeroId = PiecesUtils.getHeroInfoByPos(this.id).heroId;
            if (sellNode) {
                //自走棋模式卖出英雄
                let cb = () => { gdk.e.emit(PiecesEventId.PIECES_PVP_HIDE_HERO_SELL_ICON); }
                sellNode.sellHero(curHeroId, true, cb);
            } else if (tower) {
                if ([PveSceneState.Ready, PveSceneState.WaveOver].indexOf(tower.sceneCtrl.model.state) !== -1) {
                    if (PiecesUtils.isValidOnBattle(curHeroId, tower.hero ? tower.hero.model.info.heroId : 0)) {
                        let req = new icmsg.PiecesHeroOnBattleReq();
                        req.heroId = curHeroId;
                        req.pos = tower.id - 1;
                        NetManager.send(req, (resp: icmsg.PiecesHeroOnBattleRsp) => {
                            if (!cc.isValid(this.node)) return;
                            for (let i = 0; i < resp.changeList.length; i++) {
                                let l = resp.changeList[i];
                                if (l.pos == tower.id - 1) {
                                    let req = new icmsg.PiecesFightQueryReq();
                                    req.heroId = l.heroId;
                                    NetManager.send(req, (resp: icmsg.PiecesFightQueryRsp) => {
                                        if (!cc.isValid(this.node)) return;
                                        let info = resp.hero;
                                        let item = HeroUtils.createHeroBagItemBy(info);
                                        item.series = 800000 + info.heroId;
                                        tower.sceneCtrl.model.heroMap[item.series] = info;
                                        tower.setHeroByItem(item);
                                        tower.hero.fsm.start();
                                    }, this);
                                }
                            }
                        }, this);
                    }
                }
            } else if (handCard) {
                if (handCard.id !== this.id) {
                    let req = new icmsg.PiecesHeroOnBattleReq();
                    req.heroId = PiecesUtils.getHeroInfoByPos(this.id).heroId;
                    req.pos = handCard.id;
                    NetManager.send(req, null, this);
                }
            }
            if (!sellNode) {
                gdk.e.emit(PiecesEventId.PIECES_PVP_HIDE_HERO_SELL_ICON);
            }
        }
        this.heroItem.removeFromParent();
        this.heroItem = null;
    }

    _onHeroUpStar(e: gdk.Event) {
        let info = e.data[2];
        if (info instanceof icmsg.PiecesHero) {
            if (info.pos >= 100 && info.pos == this.id) {
                //手牌区升星
                this.upStarSpine.setCompleteListener(() => {
                    this.upStarSpine.setCompleteListener(null);
                    this.upStarSpine.node.active = false;
                });
                this.upStarSpine.node.active = true;
                this.upStarSpine.setAnimation(0, 'stand', true);
            }
        }
    }
}
