import CareerIconItemCtrl from '../../../role/ctrl2/main/career/CareerIconItemCtrl';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import HeroModel from '../../../../common/models/HeroModel';
import ModelManager from '../../../../common/managers/ModelManager';
import ThingColliderCtrl from '../../../pve/core/ThingColliderCtrl';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { Copy_stage_masteryCfg, Hero_careerCfg, HeroCfg } from '../../../../a/config';


/**
 * 英雄上阵选择组件
 * @Author: sthoo.huang
 * @Date: 2019-09-24 09:54:38
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-03-26 14:46:54
 */


class SelectSelfItem {
    soltNode: cc.Node;
    solt: UiSlotItem;
    node: cc.Node;
    bg: cc.Node;
    careerIconItem: cc.Node;
}

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/footHold/FHHeroSelecterCtrl")
export default class FHHeroSelecterCtrl extends cc.Component {

    @property(gdk.List)
    heroIconList: gdk.List = null;

    @property(cc.Prefab)
    heroIconPre: cc.Prefab = null;

    //数组下标0~5对应英雄上场的位置
    @property([cc.Node])
    selfSlots: cc.Node[] = [];

    selfItems: SelectSelfItem[] = [];

    heroList: icmsg.HeroInfo[];   // 待选英雄信息列表
    arrayUpHeros: icmsg.HeroInfo[];   // 自己上阵的英雄
    arraySuperSkills: icmsg.HeroInfo[];   // 选择的超级技能

    //实现拖拽参数
    selectHero: icmsg.HeroInfo;
    vx: number = 0;
    vy: number = 0;
    startDragYDetal = 50;
    dragItem: cc.Node;
    dragSlot: cc.Node;
    onArrayChange: gdk.EventTrigger;

    stageCfg: Copy_stage_masteryCfg;
    maxCount: number;
    _fightDefendHeros: icmsg.FightDefendHero[] = []

    isStagePassed: boolean = true;

    onEnable() {
        // 初始化变量
        this.onArrayChange = gdk.EventTrigger.get();
        this.heroList = [];
        // this.heroNodeList = [];
        this.arrayUpHeros = [null, null, null, null, null, null];
        this.arraySuperSkills = [];
        // 创建拖拽图标节点
        if (!this.dragItem) {
            this.dragItem = cc.instantiate(this.heroIconPre);
            this.dragItem.parent = this.node;
            this.dragItem.active = false;
            this.dragItem.zIndex = 9999;
            this.dragItem.group = 'ui';
            this.dragItem.addComponent(ThingColliderCtrl);
            this.dragItem.addComponent(cc.BoxCollider).size = cc.size(100, 100);
        }
        // 初始化英雄列表
        let heroInfos = ModelManager.get(HeroModel).heroInfos;
        heroInfos.forEach(h => {
            let info = h.extInfo as icmsg.HeroInfo;
            this._addHeroToList(info);
        });

        // 计算开放的塔位数
        let max = 6;
        // if (this.isStagePassed) {
        //     let arr = ConfigManager.getItemById(GlobalCfg, 'copy_hero_red').value;
        //     for (let i = arr.length - 1; i >= 0; i--) {
        //         if (CopyUtil.isStagePassed(arr[i])) {
        //             break;
        //         }
        //         max--;
        //     }
        // }
        this.maxCount = max;
        this.selfItems = [];
        this.selfSlots.forEach((n, i) => {
            // 对英雄列表初始化
            if (i >= max) {
                n.active = false;
            } else {
                n.active = true;
                let selfItem = new SelectSelfItem();
                selfItem.node = n;
                selfItem.soltNode = n.getChildByName('UiSlotItem')
                selfItem.solt = n.getComponentInChildren(UiSlotItem)
                selfItem.bg = n.getChildByName('bg');
                selfItem.careerIconItem = selfItem.soltNode.getChildByName("CareerIconItem")
                this.selfItems[i] = selfItem;

                selfItem.careerIconItem.zIndex = 99;

                selfItem.soltNode.on(cc.Node.EventType.TOUCH_START, this._touchHeroStart, this);
                this.showSelfItem(selfItem, false);
            }
        });
        // this.node.on(cc.Node.EventType.TOUCH_START, this._onIconTouchStart, this, true);
    }

    showSelfItem(selfItem: SelectSelfItem, isShow) {
        if (isShow) {
            selfItem.soltNode.active = true
            selfItem.bg.active = true;
            selfItem.careerIconItem.active = true
        } else {
            selfItem.soltNode.active = false
            selfItem.bg.active = true;
            selfItem.careerIconItem.active = false
        }
    }

    onDisable() {
        this.selfItems.forEach(selfItem => {
            selfItem.soltNode.targetOff(this);
        })
        this.node.targetOff(this);
        this.onArrayChange && this.onArrayChange.release();
        this.onArrayChange = null;
        // 清除英雄头像列表使用的对象池
        if (this.dragItem) {
            gdk.pool.clear(this.dragItem.name + "#" + this.dragItem['_prefab'].fileId);
        }
    }

    // 更新上阵数据
    updateHeroList(heroIds: number[], fightDefendHeros: icmsg.FightDefendHero[]) {
        let arr: icmsg.HeroInfo[] = [];
        this._fightDefendHeros = fightDefendHeros
        for (let i = 0, len = heroIds.length; i < len; i++) {
            let heroId = heroIds[i];
            if (heroId > 0) {
                let info = this._getHeroInfoById(heroId);
                let selfItem = this.selfItems[i];
                if (selfItem && info) {
                    this._heroSelect(selfItem.node, info);
                    // if (skills.indexOf(info.pvpSsid) >= 0) {
                    //     arr.push(info);
                    // }
                } else {
                    this._heroCancel(i);
                }
            } else {
                this._heroCancel(i);
            }
        }
        // arr.sort((a: HeroInfo, b: HeroInfo) => {
        //     let index1 = skills.indexOf(a.pvpSsid)
        //     let index2 = skills.indexOf(b.pvpSsid)
        //     return index1 - index2;
        // })
        this.arraySuperSkills.length = 0
        this.arraySuperSkills.push(...arr);
    }

    _getHeroInfoById(id: number): icmsg.HeroInfo {
        let ret: icmsg.HeroInfo;
        ModelManager.get(HeroModel).heroInfos.some(e => {
            if (e.extInfo instanceof icmsg.HeroInfo) {
                if (e.extInfo.heroId == id) {
                    ret = e.extInfo;
                    return true;
                }
            }
            return false;
        });
        return ret;
    }

    // 添加英雄到待选列表
    _addHeroToList(info: icmsg.HeroInfo) {
        if (this.heroList.indexOf(info) >= 0) return;
        this.heroList.push(info);
        this._updateHeroIcons();
    }

    // 从待选列表移除英雄
    _removeHeroFromList(info: icmsg.HeroInfo, isClear: boolean) {
        if (isClear) {
            //移除同类的英雄
            let newList = []
            for (let i = 0; i < this.heroList.length; i++) {
                if (this.heroList[i].typeId != info.typeId) {
                    newList.push(this.heroList[i])
                }
            }
            this.heroList = newList
        } else {
            let index = this.heroList.indexOf(info);
            this.heroList.splice(index, 1);
        }
        this._updateHeroIcons();
    }

    // 英雄下阵
    _heroCancel(pos: number, isRefresh: boolean = false) {
        let heroInfo = this.arrayUpHeros[pos];
        if (heroInfo) {
            if (isRefresh) {
                let heroInfos = ModelManager.get(HeroModel).heroInfos;
                heroInfos.forEach(h => {
                    let info = h.extInfo as icmsg.HeroInfo;
                    if (info.typeId == heroInfo.typeId) {
                        this.heroList.push(info)
                    }
                });
                this._updateHeroIcons();
            } else {
                this._addHeroToList(heroInfo);
            }
            this.arrayUpHeros[pos] = null;
        }
        let selfItem = this.selfItems[pos];
        if (selfItem) {
            this.showSelfItem(selfItem, false);
            this._updateUpArray();
        }
    }

    // 英雄上阵
    _heroSelect(slot: cc.Node, heroInfo: icmsg.HeroInfo, isClear: boolean = true) {
        let index = this.selfSlots.indexOf(slot);
        if (index < 0) {
            return;
        }
        let selfItem = this.selfItems[index];
        if (!selfItem) {
            return;
        }

        // 先下阵槽位上的英雄
        this._heroCancel(index);
        // 从待选英雄列表移除选择的英雄
        this._removeHeroFromList(heroInfo, isClear);
        this.showSelfItem(selfItem, true);

        // 英雄模型
        let cfg = ConfigManager.getItemById(HeroCfg, heroInfo.typeId);
        let ctrl = selfItem.solt.getComponent(UiSlotItem)
        ctrl.updateItemInfo(cfg.id)
        ctrl.updateStar(heroInfo.star)

        let careerCtrl = selfItem.careerIconItem.getComponent(CareerIconItemCtrl)
        careerCtrl.updateView(heroInfo.careerId, GlobalUtil.getHeroCareerLv(heroInfo), heroInfo.soldierId)

        let lvLab = selfItem.soltNode.getChildByName("lvLab").getComponent(cc.Label)
        lvLab.node.active = false
        if (heroInfo.level > 0) {
            lvLab.node.active = true
            lvLab.string = `${heroInfo.level}`
        }

        let fightDefendHero: icmsg.FightDefendHero = null
        for (let i = 0; i < this._fightDefendHeros.length; i++) {
            if (this._fightDefendHeros[i].typeId == heroInfo.typeId) {
                fightDefendHero = this._fightDefendHeros[i]
                break
            }
        }
        if (fightDefendHero) {
            ctrl.updateStar(fightDefendHero.star)
            lvLab.string = `${fightDefendHero.level}`
            careerCtrl.updateView(fightDefendHero.careerId, fightDefendHero.careerLv, fightDefendHero.soldierId)
        }


        // 保存阵型并更新战力
        this.arrayUpHeros[index] = heroInfo;

        this._updateUpArray();
    }

    _updateHeroIcons() {
        gdk.Timer.callLater(this, this._updateHeroIconsLater);
    }

    _updateHeroIconsLater() {
        if (!cc.isValid(this.node)) return;
        if (!this.enabled) return;
        let arr: {
            hero: icmsg.HeroInfo,
            is_monster: boolean,
        }[] = [];
        // 英雄按战力排序（高至低）
        GlobalUtil.sortArray(this.heroList, (a, b) => {
            return b.power - a.power;
        });
        this.heroList.forEach(h => {
            if (!h) return;
            arr.push({
                hero: h,
                is_monster: false,
            });
        });

        this.heroIconList.datas = arr;
    }

    _updateUpArray() {
        gdk.Timer.callLater(this, this._updateUpArrayLater);
    }

    _updateUpArrayLater() {
        if (!cc.isValid(this.node)) return;
        if (!this.enabled) return;
        this.onArrayChange.emit(this.arrayUpHeros);
    }



    _touchHeroStart(event: cc.Event.EventTouch) {
        let node: cc.Node = event.currentTarget;
        let index = this.selfSlots.indexOf(node.parent);
        if (this.arrayUpHeros[index]) {
            // 只对上阵了英雄的节点有效
            node.on(cc.Node.EventType.TOUCH_MOVE, this._touchHeroMove, this);
            node.on(cc.Node.EventType.TOUCH_END, this._touchHeroEnd, this);
            node.on(cc.Node.EventType.TOUCH_CANCEL, this._touchHeroEnd, this);
        }
    }

    _touchHeroMove(event: cc.Event.EventTouch) {
        let node: cc.Node = event.currentTarget;
        let delta: cc.Vec2 = event.touch.getDelta();
        if (delta.x != 0 || delta.y != 0) {
            if (node.parent !== this.node) {
                this.dragSlot = node.parent;
                let pos = node.getPos();
                pos = node.parent.convertToWorldSpaceAR(pos);
                pos = this.node.convertToNodeSpaceAR(pos);
                node.setPosition(pos);
                node.parent = this.node;
                node.zIndex = 9999;
            }
            node.x += delta.x;
            node.y += delta.y;
            node.opacity = 200;
            // 添加碰撞组件
            if (!node.getComponent(ThingColliderCtrl)) {
                node.addComponent(ThingColliderCtrl);
            }
        }
    }

    _touchHeroEnd(event: cc.Event.EventTouch) {
        let node: cc.Node = event.currentTarget;
        node.off(cc.Node.EventType.TOUCH_MOVE, this._touchHeroMove, this);
        node.off(cc.Node.EventType.TOUCH_END, this._touchHeroEnd, this);
        node.off(cc.Node.EventType.TOUCH_CANCEL, this._touchHeroEnd, this);
        if (this.dragSlot) {
            node.opacity = 255;
            node.zIndex = 0;
            // 检查是否与塔座相交
            let collider = node.getComponent(ThingColliderCtrl);
            if (collider) {
                let tower = collider.getClolliderComponent(cc.PolygonCollider);

                if (tower && tower.node !== this.dragSlot) {
                    // 还原位置
                    node.parent = this.dragSlot;
                    node.setPosition(0, 0);
                    // 交换位置
                    let src = this.selfSlots.indexOf(this.dragSlot);
                    let tar = this.selfSlots.indexOf(tower.node);
                    let srcInfo = this.arrayUpHeros[src];
                    let tarInfo = this.arrayUpHeros[tar];
                    this._heroCancel(src);
                    this._heroSelect(tower.node, srcInfo, false);
                    if (tarInfo) {
                        // 目标处有英雄，则交换
                        this._heroSelect(this.dragSlot, tarInfo);
                    }
                } else if (!tower) {
                    // 是否拖拽到英雄选择界面
                    let panel = collider.getClolliderComponent(cc.BoxCollider);
                    // 还原位置
                    node.parent = this.dragSlot;
                    node.setPosition(0, 0);
                    if (panel && panel.node.name == 'heroSelector') {
                        // 英雄下阵
                        //判断是不是专精英雄
                        if (this.stageCfg) {
                            let mastery = false;
                            let heroInfo = this.arrayUpHeros[this.selfSlots.indexOf(this.dragSlot)];
                            if (heroInfo.typeId == this.stageCfg.hero ||
                                heroInfo.typeId == this.stageCfg.connect_hero) {
                                mastery = true;
                            }
                            if (mastery) {
                                // 还原位置
                                node.parent = this.dragSlot;
                                node.setPosition(0, 0);
                            } else {
                                this._heroCancel(this.selfSlots.indexOf(this.dragSlot));
                            }
                        } else {
                            this._heroCancel(this.selfSlots.indexOf(this.dragSlot), true);
                        }

                    }
                } else {
                    // 还原位置
                    node.parent = this.dragSlot;
                    node.setPosition(0, 0);
                }
                node.removeComponent(ThingColliderCtrl);
            } else {
                // 还原位置
                node.parent = this.dragSlot;
                node.setPosition(0, 0);
            }
            this.dragSlot = null;
        } else {
            // 点击，直接下阵
            //判断是不是专精英雄
            if (this.stageCfg) {
                let mastery = false;
                let heroInfo = this.arrayUpHeros[this.selfSlots.indexOf(node.parent)];
                if (heroInfo.typeId == this.stageCfg.hero ||
                    heroInfo.typeId == this.stageCfg.connect_hero) {
                    mastery = true;
                }
                if (mastery) {
                } else {
                    this._heroCancel(this.selfSlots.indexOf(node.parent));
                }
            } else {
                this._heroCancel(this.selfSlots.indexOf(node.parent), true);
            }
        }
    }

    // _onIconTouchStart(event: cc.Event.EventTouch) {
    //     let camera = cc.Camera.main;
    //     let pos: cc.Vec2 = camera.getScreenToWorldPoint(event.getLocation()) as any;
    //     // 检查是否点击到了待选英雄
    //     this.heroIconList.node.children.some(n => {
    //         let ctrl = n.getComponent(icmsg.ArenaBattleHeroItemCtrl);
    //         if (!ctrl || !ctrl.data) return false;
    //         if (!n.getBoundingBoxToWorld().contains(pos)) return false;
    //         this.selectHero = ctrl.data.hero as HeroInfo;
    //         this.vx = pos.x;
    //         this.vy = pos.y;
    //         this.node.on(cc.Node.EventType.TOUCH_MOVE, this._onIconTouchMove, this, true);
    //         this.node.on(cc.Node.EventType.TOUCH_END, this._onIconTouchEnd, this, true);
    //         this.node.on(cc.Node.EventType.TOUCH_CANCEL, this._onIconTouchEnd, this, true);
    //         return true;
    //     });
    // }

    // _onIconTouchMove(event: cc.Event.EventTouch) {
    //     if (this.selectHero == null) return;
    //     if (this.dragItem.active == false) {
    //         //开始拖拽
    //         let camera = cc.Camera.main;
    //         let pos: cc.Vec2 = camera.getScreenToWorldPoint(event.getLocation()) as any;
    //         if (Math.abs(pos.y - this.vy) >= this.startDragYDetal) {
    //             let item = this.dragItem.getComponent(icmsg.ArenaBattleHeroItemCtrl);
    //             item['_data'] = {
    //                 hero: this.selectHero,
    //                 is_monster: false,
    //             };
    //             this.dragItem.setPosition(this.node.convertToNodeSpaceAR(pos));
    //             this.dragItem.active = true;
    //             item.updateView();
    //         }
    //     }
    //     if (this.dragItem.active) {
    //         this.dragItem.x += event.getDeltaX();
    //         this.dragItem.y += event.getDeltaY();
    //         event.stopPropagation();
    //     }
    // }

    // _onIconTouchEnd() {
    //     this.node.off(cc.Node.EventType.TOUCH_MOVE, this._onIconTouchMove, this, true);
    //     this.node.off(cc.Node.EventType.TOUCH_END, this._onIconTouchEnd, this, true);
    //     this.node.off(cc.Node.EventType.TOUCH_CANCEL, this._onIconTouchEnd, this, true);
    //     if (this.selectHero) {
    //         let collider = this.dragItem.getComponent(ThingColliderCtrl);
    //         // 检查是否与塔座相交
    //         if (collider) {
    //             let tower = collider.getClolliderComponent(cc.PolygonCollider);
    //             if (tower) {
    //                 this._heroSelect(tower.node, this.selectHero);
    //             }
    //         }
    //         this.selectHero = null;
    //         this.dragItem.active = false;
    //     }
    // }

    // 一键上阵按钮动作
    oneKeyHandle() {
        if (this.heroList.length == 0) return;
        for (let i = 0, n = this.selfSlots.length; i < n; i++) {
            if (this.arrayUpHeros[i]) continue;
            if (this.heroList.length == 0) break;
            let selfItem = this.selfItems[i];
            if (selfItem) {
                this._heroSelect(selfItem.node, this.heroList[0]);
            }
        }
    }
}