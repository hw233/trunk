import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import HeroModel from '../../../../common/models/HeroModel';
import HeroUtils from '../../../../common/utils/HeroUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import RedPointCtrl from '../../../../common/widgets/RedPointCtrl';
import { Costume_globalCfg, Hero_awakeCfg, HeroCfg } from '../../../../a/config';
import { RoleEventId } from '../../enum/RoleEventId';

/**
 * 英雄详情界面 type 类型 0 英雄 1 装备 2 评论 3士兵 4升星
 * @Author: sthoo.huang
 * @Date: 2020-02-21 17:32:43
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-08-17 20:11:20
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/main/RoleViewCtrl2")
export default class RoleViewCtrl2 extends gdk.BasePanel {

    @property(cc.ToggleContainer)
    selectBtns: cc.ToggleContainer = null;

    @property(cc.Node)
    upPanel: cc.Node = null;

    @property(cc.Node)
    attrPanel: cc.Node = null;

    @property(cc.Node)
    panelParent: cc.Node = null;

    @property({ type: cc.String })
    _panelNames: string[] = [];

    @property(cc.Node)
    costumeLock: cc.Node = null;

    @property({ type: gdk.PanelId, tooltip: "子界面，如果没可选值，请先配置gdk.PanelId" })
    get panels() {
        let ret = [];
        for (let i = 0; i < this._panelNames.length; i++) {
            ret[i] = gdk.PanelId[this._panelNames[i]] || 0;
        }
        return ret;
    }
    set panels(value) {
        this._panelNames = [];
        for (let i = 0; i < value.length; i++) {
            this._panelNames[i] = gdk.PanelId[value[i]];
        }
    }

    panelIndex: number = -1;    // 当前打开的界面索引
    get model() { return ModelManager.get(HeroModel); }

    onEnable() {
        gdk.e.on(RoleEventId.UPDATE_ONE_HERO, this._updateOneHero, this);
        this.title = 'i18n:ROLE_TITLE';
        this.scheduleOnce(this.checkArgs, 0);
    }

    onDisable() {
        gdk.e.targetOff(this);
        gdk.Timer.clearAll(this);
        this.unschedule(this.checkArgs);
        // 关闭打开或打开中的子界面
        for (let i = 0, n = this._panelNames.length; i < n; i++) {
            let panelId = gdk.PanelId.getValue(this._panelNames[i]);
            if (panelId) {
                gdk.panel.hide(panelId);
            }
        }
        this.panelIndex = -1;
        this._onPanelShow = null;
        // this.model.curHeroInfo = null;
    }

    /**
     * 打开角色面板,额外参数可带一个次级面板数据,
     * 0:英雄界面 1.装备界面 2.神装界面 3.士兵界面 4 升星界面 5 觉醒界面
     */
    _onPanelShow: (node?: cc.Node) => void;   // 当子界面打开时回调
    checkArgs() {
        let args = this.args;
        let idx = 0;
        if (args && args.length > 0) {
            // 有外部参数
            if (args[0] instanceof Array) {
                args = args[0];
            }
            // 更新当前选中的下层子界面索引
            idx = args[0];
        } else {
            // 没有参数时
            idx = 0;
        }
        let btn = this.selectBtns.toggleItems[idx];
        if (btn) {
            // 调用子界面方法
            if (args && args.length > 1) {
                this._onPanelShow = (node: cc.Node) => {
                    if (cc.isValid(node)) {
                        let arr = node.getComponents(cc.Component);
                        let name = args[1];
                        let params = args.slice(2);
                        for (let i = 0, n = arr.length; i < n; i++) {
                            let ctrl = arr[i];
                            let func: Function = ctrl[name];
                            if (typeof func === 'function') {
                                func.call(ctrl, ...params);
                            }
                        }
                    }
                    this._onPanelShow = null;
                };
            }
            // 打开指定的子界面
            btn.checkEvents.forEach(h => {
                h.emit([null]);
            });
        }
    }

    /**面板选择显示 */
    selectFunc(e: any, utype: any) {
        (cc.js.isString(utype)) && (utype = parseInt(utype));
        (utype < 0) && (utype = 0);
        // 打开子界面索引变更
        if (this.panelIndex == utype) {
            return;
        }
        if (utype == 3) {//|| utype == 2
            // 士兵界面特殊处理
            let panelId = gdk.PanelId.getValue(this._panelNames[utype]);
            if (panelId) {
                gdk.panel.open(panelId, (node: cc.Node) => {
                    // 关闭事件
                    let onHide = gdk.NodeTool.onHide(node);
                    onHide.on(() => {
                        onHide.targetOff(this);
                        if (cc.isValid(this.node)) {
                            this._updateSelectBtns();
                        }
                    }, this);
                    // 如果有回调函数需要执行
                    this._onPanelShow && this._onPanelShow(node);
                }, this);
            }
        }
        else if (utype == 4 || utype == 5 || utype == 6) {

            let cfg = <HeroCfg>BagUtils.getConfigById(this.model.curHeroInfo.typeId);
            //升星
            if (utype == 4) {
                if (this.model.curHeroInfo.star >= cfg.star_max) {
                    this._updateSelectBtnsLater()
                    gdk.gui.showMessage(gdk.i18n.t("i18n:HERO_TIP52"));
                    return;
                }
            }

            //觉醒
            if (utype == 5) {
                if (this.model.curHeroInfo.star >= cfg.star_max) {
                    this._updateSelectBtnsLater()
                    gdk.gui.showMessage(gdk.i18n.t("i18n:HERO_TIP61"));
                    return;
                }

                //11星判断
                if (this.model.curHeroInfo.star == 11) {
                    if (!cfg.awake) {
                        this._updateSelectBtnsLater()
                        gdk.gui.showMessage(gdk.i18n.t("i18n:HERO_TIP62"));
                        return;
                    }

                    if (HeroUtils.upStarLimit(this.model.curHeroInfo.star + 1)) {
                        this._updateSelectBtnsLater()
                        return;
                    }
                }
            }

            let panelId = gdk.PanelId.getValue(this._panelNames[utype]);
            if (panelId) {
                gdk.panel.open(panelId, (node: cc.Node) => {
                    // 关闭事件
                    let onHide = gdk.NodeTool.onHide(node);
                    onHide.on(() => {
                        onHide.targetOff(this);
                        if (cc.isValid(this.node)) {
                            this._updateSelectBtns();
                        }
                    }, this);
                    // 如果有回调函数需要执行
                    this._onPanelShow && this._onPanelShow(node);
                }, this);
            }
        }
        else {
            if (utype == 2) {
                let costume_star = ConfigManager.getItemById(Costume_globalCfg, "costume_star").value[0]
                if (this.model.curHeroInfo.star < costume_star) {
                    this._updateSelectBtns();
                    gdk.gui.showMessage(`英雄达到${costume_star}星开启神装`)
                    return
                }
            }
            // 关闭上一个子界面
            if (this.panelIndex > -1) {
                let panelId = gdk.PanelId.getValue(this._panelNames[this.panelIndex]);
                if (panelId) {
                    gdk.panel.hide(panelId);
                }
                this.panelIndex = -1;
            }
            // 打开新的子界面
            let panelId = gdk.PanelId.getValue(this._panelNames[utype]);
            if (panelId) {
                gdk.panel.open(
                    panelId,
                    this._onPanelShow,
                    this,
                    {
                        parent: this.panelParent
                    },
                );
            }
            this.panelIndex = utype;
            // 英雄模型显示状态
            // this.upPanel.active = utype != 2
            this.attrPanel.active = utype != 2
        }
        // 刷新红点显示状态
        this._updateSelectBtns();
    }

    // tab按钮的额外红点逻辑
    toggleRedPointHandle(index: string | number) {
        let panelId = gdk.PanelId.getValue(this._panelNames[index]);
        if (panelId) {
            return !gdk.panel.isOpenOrOpening(panelId);
        }
        return false;
    }

    _updateOneHero(e: gdk.Event) {
        let heroId = e.data;
        // 刷新英雄属性
        let heroInfo = this.model.curHeroInfo;
        if (heroId == heroInfo.heroId) {
            // let attrInfo = HeroUtils.getHeroAttrById(heroId);
            // if (!attrInfo) {
            // let msg = new HeroDetailReq()
            // msg.heroId = heroId
            // NetManager.send(msg)
            // }
            this.model.curHeroInfo = HeroUtils.getHeroInfoByHeroId(heroId);
        }
        // 刷新红点显示状态
        this._updateSelectBtns();

    }

    /**更新按钮红点状态 */
    _updateSelectBtns() {
        gdk.Timer.once(100, this, this._updateSelectBtnsLater);
    }

    _updateSelectBtnsLater() {
        if (!cc.isValid(this.node)) return;
        if (!this.enabledInHierarchy) return;
        let toggleItems = this.selectBtns.toggleItems;

        let cfg = <HeroCfg>BagUtils.getConfigById(this.model.curHeroInfo.typeId);

        for (let i = 0, n = toggleItems.length; i < n; i++) {
            let toggle = toggleItems[i];
            //升星
            if (i == 4) {
                if (this.model.curHeroInfo.star >= 11 || cfg.group[0] == 6) {
                    toggle.node.active = false
                } else {
                    toggle.node.active = true
                    this._upStarProgressNode(toggle.node);
                }
            }

            //觉醒
            if (i == 5) {
                if (this.model.curHeroInfo.star >= 11 && cfg.group[0] !== 6) {
                    toggle.node.active = true
                    this._updateAwakeProgressNode(toggle.node);
                } else {
                    toggle.node.active = false
                }
            }

            //领悟
            if (i == 6) {
                if (cfg.group[0] == 6) {
                    toggle.node.active = true
                }
                else {
                    toggle.node.active = false;
                }
            }

            if (i == 2) {
                let costume_star = ConfigManager.getItemById(Costume_globalCfg, "costume_star").value[0]
                if (this.model.curHeroInfo.star < costume_star) {
                    this.costumeLock.active = true
                } else {
                    this.costumeLock.active = false
                }
            }
            // 按钮状态
            let selected = i == this.panelIndex;
            if (toggle.checkMark) {
                toggle.checkMark.node.active = selected;
            }
            toggle['_N$isChecked'] = selected;
            toggle.interactable = !selected;
            // 红点
            let ctrl = toggle.getComponent(RedPointCtrl);
            if (ctrl) {
                ctrl.isShow = this.toggleRedPointHandle(i);
            }


        }
    }

    /**
     * 更新升星进度显示
     * @param node 
     */
    _upStarProgressNode(node: cc.Node) {
        let cfg = ConfigManager.getItemById(HeroCfg, this.model.curHeroInfo.typeId);
        if (cfg.group[0] == 6) return;
        let progressNode = node.getChildByName('progressNode');
        let bar1 = progressNode.getChildByName('bar1');
        let bar2 = progressNode.getChildByName('bar2');
        let num = progressNode.getChildByName('num').getComponent(cc.Label);
        if (this.model.curHeroInfo.star >= cfg.star_max) {
            progressNode.active = false;
        }
        else {
            progressNode.active = true;
            let [hasNum, needNum] = HeroUtils.getProgressOfUpStar(this.model.curHeroInfo.typeId, this.model.curHeroInfo.star);
            hasNum = Math.max(0, hasNum - 1);
            needNum = needNum - 1;
            if (hasNum == needNum) {
                bar2.active = true;
                bar1.active = false;
            }
            else {
                bar2.active = false;
                bar1.active = true;
                bar1.width = hasNum / needNum * 80;
            }
            num.string = `${hasNum}/${needNum}`;
        }
    }

    _updateAwakeProgressNode(node: cc.Node) {
        let cfg = ConfigManager.getItemById(HeroCfg, this.model.curHeroInfo.typeId);
        let progressNode = node.getChildByName('progressNode');
        let bar1 = progressNode.getChildByName('bar1');
        let bar2 = progressNode.getChildByName('bar2');
        let num = progressNode.getChildByName('num').getComponent(cc.Label);
        if (this.model.curHeroInfo.star >= cfg.star_max) {
            progressNode.active = false;
        } else {
            if (cfg.awake) {
                progressNode.active = true;
                let maxLv = ConfigManager.getItems(Hero_awakeCfg, { "hero_id": this.model.curHeroInfo.typeId }).length - 1
                let heroAwakeState = this.model.heroAwakeStates[this.model.curHeroInfo.heroId]
                let curLv = heroAwakeState ? heroAwakeState.awakeLv : 0
                if (curLv == maxLv) {
                    bar2.active = true;
                    bar1.active = false;
                } else {
                    bar2.active = false;
                    bar1.active = true;
                    bar1.width = curLv / maxLv * 80;
                }
                num.string = `${curLv}/${maxLv}`;
            } else {
                progressNode.active = false;
            }
        }
    }

}
