import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import GuideUtil from '../../../../common/utils/GuideUtil';
import PanelId from '../../../../configs/ids/PanelId';
import PveHeroCtrl from './PveHeroCtrl';
import PveHeroModel from '../../model/PveHeroModel';
import PvePool from '../../utils/PvePool';
import PveSceneCtrl from '../PveSceneCtrl';
import PveSceneHeroSelectCtrl from '../view/PveHeroSelectCtrl';
import PveSceneState from '../../enum/PveSceneState';
import ShaderHelper, { ShaderProperty } from '../../../../common/shader/ShaderHelper';
import StringUtils from '../../../../common/utils/StringUtils';
import { BagItem } from '../../../../common/models/BagModel';
import {
    Copy_assistCfg,
    Copycup_rookieCfg,
    GuideCfg,
    HeroCfg,
    Newordeal_ordealCfg,
    OrdealCfg,
    Pieces_fetterCfg,
    Pieces_heroCfg,
    SoldierCfg
    } from '../../../../a/config';
import { CopyType } from './../../../../common/models/CopyModel';

/** 
 * Pve英雄塔基座控制组件
 * @Author: sthoo.huang  
 * @Date: 2019-04-04 10:07:23 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-09-06 14:06:50
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/pve/other/PveBuildTowerCtrl")
export default class PveBuildTowerCtrl extends cc.Component {

    @property(cc.Node)
    flagImg: cc.Node = null;
    @property(cc.Node)
    baseImg: cc.Node = null;
    @property(cc.Node)
    baseLvImg: cc.Node = null;
    @property(cc.Node)
    atkDisImg: cc.Node = null;

    @property(cc.Node)
    superSkillNode: cc.Node = null;

    @property(cc.Node)
    heroNameNode: cc.Node = null;
    @property(cc.Label)
    heroName: cc.Label = null;
    @property(cc.LabelOutline)
    heroNameLine: cc.LabelOutline = null;

    @property(cc.Node)
    piecesNode: cc.Node = null;
    @property(cc.Node)
    piecesFetterIcon: cc.Node = null;

    @property([cc.Node])
    typeList: cc.Node[] = []
    @property(cc.Node)
    assistNode: cc.Node = null

    @property(cc.Node)
    hireNode: cc.Node = null

    @property(cc.Node)
    recommendNode: cc.Node = null;
    @property(cc.RichText)
    recommendLb: cc.RichText = null;
    @property(cc.Node)
    recommendIconNode: cc.Node = null;

    id: number;
    sceneCtrl: PveSceneCtrl;
    private _hero: PveHeroCtrl;

    careerRank: number = -1;
    careerLv: number = -1;

    //是否推荐士兵类型
    isSoldierType: boolean = false;
    soldierTypeNum: number = 0;

    isRecommendHero: boolean = false;
    //#b7e6ff
    nameColor: string[] = ['#a0edcc', '#b7e6ff', '#fdb8ff']
    nameLineColor: string[] = ['#066d41', '#2d58c1', '#a502af'];

    soldierName1: string[] = ['zd_tuijian03', 'zd_tuijian02', 'zd_tuijian01'];
    soldierName2: string[] = ['zd_tuijian_qiangbing2', 'zd_tuijian_paobing2', 'zd_tuijian_shouwei2'];

    onLoad() {
        this.node.children.forEach(n => n.active = false);
    }

    onEnable() {
        this.flagImg.active = false;
        this.baseImg.active = false;
        this.atkDisImg.active = false;
        this.superSkillNode.active = false;
        this.heroNameNode.active = false;
        this.isSoldierType = false;
        this.assistNode.active = false;
        this.hireNode.active = false
        this.recommendNode.active = false;
        this.recommendIconNode.active = false;
        this.isRecommendHero = false;
        this.piecesNode.active = false;
        this.typeList.forEach((n, i) => {
            let path = ''
            if (this.sceneCtrl.model.stageConfig.copy_id == CopyType.GOD) {
                path = 'view/pve/texture/ui/common/' + this.soldierName2[i]
            } else {
                path = 'view/pve/texture/ui/common/' + this.soldierName1[i]
            }
            GlobalUtil.setSpriteIcon(this.node, n, path);
            n.active = false;
        });
        this.setCareer();
        // 引导绑定节点
        let model = this.sceneCtrl.model;
        if (!model.isMirror && !model.isDemo && !model.isReplay && !model.isBounty) {
            GuideUtil.bindGuideNode(this.id + 110, this.node);
        }
    }

    onDisable() {
        let model = this.sceneCtrl.model;
        let index: number = model.towers.indexOf(this);
        if (index != -1) {
            model.towers.splice(index, 1);
        }
        gdk.e.targetOff(this);
        this.sceneCtrl = null;
        this.hero = null;
        this.piecesNode.active = false;
        this.heroNameNode.active = false;
        this.heroName.string = ''
        this.flagImg.stopAllActions();
        this.baseImg.stopAllActions();
        this.flagImg.active = false;
        this.baseImg.active = false;
        this.superSkillNode.active = false;
        this.clearCareer();
        // 清除引导绑定节点
        if (!model.isMirror && !model.isDemo && !model.isReplay && !model.isBounty) {
            GuideUtil.bindGuideNode(this.id + 110);
        }
    }

    hide(effect: boolean = true) {
        gdk.NodeTool.hide(this.node, effect, () => {
            PvePool.put(this.node);
        });
    }

    set hero(v: PveHeroCtrl) {
        if (this._hero !== v) {
            if (this._hero) {
                this._hero.node.targetOff(this);
            }
            this._hero = v;
            // 更新战力
            if (this.sceneCtrl && this.sceneCtrl.model) {
                this.sceneCtrl.model.updatePower();
            }
            // 显示攻击范围
            v && v.model.ready && this.showAtkDis();
            this.heroNameNode.active = false;
            this.piecesNode.active = false;
        }
        if (!this.enabledInHierarchy) return;
        if (v) {
            let node: cc.Node = v.node;
            // 只对正式的战斗场景有效
            let model = this.sceneCtrl.model;
            if (!model.isDemo) {
                node.on(cc.Node.EventType.TOUCH_END, this.touchHandle, this);
                if (!model.isMirror) {
                    node.on(cc.Node.EventType.TOUCH_MOVE, (event: any) => {
                        if (model.state != PveSceneState.Ready) return;
                        if (gdk.panel.isOpenOrOpening(PanelId.PveSceneHeroDetailPanel)) return;
                        if (gdk.panel.isOpenOrOpening(PanelId.PveHeroFightInfo)) return;
                        if (gdk.panel.isOpenOrOpening(PanelId.PveSceneHeroSelectPanel)) return;
                        let delta: cc.Vec2 = event.touch.getDelta();
                        if (delta.x != 0 || delta.y != 0) {
                            node.targetOff(this);
                        }
                    }, this);
                }
                //--------------刷新超绝图标显示---------------
                let ska = false;
                // let heroInfo = v.model.item.extInfo as HeroInfo;
                // if (heroInfo.pveSsid && heroInfo.pveSsid != 0) {
                //     ska = true;
                // }
                this.superSkillNode.active = ska;
            }
            //----------------------刷新节点名字和坐标----------------------
            node.name = this.node.name.split('_').shift() + '_hero';
            node.setPosition(this.node.getPos());
            v.tower = this;
            // 显示奖杯副本助战标记
            if (this.assistNode) {
                this.assistNode.active = v.isAssist
            }
            //----------------------职业----------------------
            if (v.model.item) {
                // let career = HeroUtils.getHeroCareerById(v.model.item.itemId);
                // if (career) {
                //     let cfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", career.careerId, { career_lv: career.careerLv });
                //     this.setCareer(v.model.config.name, cfg.rank, cfg.career_lv);
                // }
            }

            //-------------------显示英雄名称和职业等级----------------------------
            let heroInfo = v.model.item.extInfo as icmsg.HeroInfo
            let curCareerId = heroInfo.careerId ? heroInfo.careerId : 20;
            let level = 0;
            let rank = Math.floor(curCareerId % 100 / 10);
            // heroInfo.careers.forEach(a => {
            //     if (a.careerId == curCareerId) {
            //         level = a.careerLv;
            //     }
            // });
            let levelStr = level > 0 ? '+' + (level + 1) : '+1'
            this.heroName.string = v.model.config.name //+ levelStr
            this.heroName.node.color = cc.color(this.nameColor[rank]);
            this.heroNameLine.color = cc.color(this.nameLineColor[rank]);
            if (!model.isDemo && [PveSceneState.Ready, PveSceneState.WaveOver].indexOf(model.state) !== -1) {
                this.heroNameNode.active = true;
                // 自走棋显示羁绊 星级
                if (model.arenaSyncData && model.arenaSyncData.fightType == 'PIECES_CHESS') {
                    this.heroNameNode.active = false;
                    this.piecesNode.active = true;
                    this.updatePiecesNode();
                }
            } else {
                // 隐藏英雄名称节点
                this.heroNameNode.active = false;
                this.piecesNode.active = false;
            }

            // 触发引导
            if (!model.isDemo && !model.isMirror && !model.isBounty && !model.isReplay) {
                GuideUtil.activeGuide('set_tower_hero#' + this.id);
            }

            if (!model.isDemo && (model.stageConfig.copy_id == CopyType.HeroTrial || model.stageConfig.copy_id == CopyType.NewHeroTrial)) {
                let cfg = ConfigManager.getItemByField(OrdealCfg, 'round', model.stageConfig.id);
                if (model.stageConfig.copy_id == CopyType.NewHeroTrial) {
                    cfg = ConfigManager.getItemByField(Newordeal_ordealCfg, 'round', model.stageConfig.id);
                }
                if (cfg) {
                    this.recommendNode.active = false;
                    //let soldierType = Math.floor(heroInfo.soldierId / 100);//model.eliteStageUtil.getTowerSoldierType(this.id);
                    let str = ''
                    let tems = cfg.theme_hero.split('|');
                    for (let i = 0; i < tems.length; i++) {
                        let tem = tems[i].split(';');
                        let heroId = Number(tem[0])
                        if (heroId == heroInfo.typeId) {
                            str = tem[1];
                        }
                    }
                    // let tems1 = cfg.recommended_career.split(';')
                    // let temSoldier = Number(tems1[0]);
                    // if (temSoldier == soldierType) {
                    //     str += str == '' ? tems1[1] : '\n' + tems1[1];
                    // }
                    this.recommendLb.string = str
                    this.recommendNode.active = str != '';
                    this.isRecommendHero = str != '';
                }
            }

            // 探险副本显示雇佣标识
            if (!model.isDemo && model.stageConfig.copy_id == CopyType.Adventure) {
                if (this.hireNode) {
                    this.hireNode.active = v.model.item.series > 900000
                }
            }

        } else {
            this.setCareer();
            this.superSkillNode.active = false;
            this.heroNameNode.active = false;
            this.piecesNode.active = false;
            this.recommendNode.active = false;
            this.isRecommendHero = false;
            if (this.hireNode) {
                this.hireNode.active = false
            }
        }
        gdk.Timer.callLater(this, this._updateFlag);
    }

    // 设置卡牌职业相关
    setCareer(name: string = '', careerRank: number = 0, careerLv: number = 0) {
        gdk.Timer.callLater(this, this._setCareerLater, [name, careerRank, careerLv]);
    }

    _setCareerLater(name: string, careerRank: number, careerLv: number) {
        if (!cc.isValid(this.node)) return;
        if (!this.sceneCtrl || this.sceneCtrl.model.isDemo) return;
        careerLv = careerRank == 0 ? 0 : careerLv + 1;
        if (this.careerLv != careerLv) {
            this.careerLv = careerLv;
            if (careerLv > 0) {
                // 更新显示英雄职业等级图标
                this.baseLvImg.active = true;
                let path = `view/pve/texture/ui/common/PVE_taizi_lv_${careerLv}`;
                GlobalUtil.setSpriteIcon(this.node, this.baseLvImg, path);
            } else {
                // 隐藏职业等级图标
                this.baseLvImg.active = false;
            }
        }
        if (this.careerRank != careerRank) {
            this.careerRank = careerRank
            let path = `view/pve/texture/ui/common/PVE_taizi_${careerRank}`;
            GlobalUtil.setSpriteIcon(this.node, this.baseImg, path);
        }
    }

    // 清理职业相关资源
    clearCareer() {
        GlobalUtil.setSpriteIcon(this.node, this.baseImg, null);
        GlobalUtil.setSpriteIcon(this.node, this.baseLvImg, null);
        this.careerRank = -1;
        this.careerLv = -1;
    }

    get hero(): PveHeroCtrl {
        return this._hero;
    }

    // 防止初次上阵英雄heromap内没有英雄数据导致的推荐塔位图标不刷新问题
    @gdk.binding('hero.model.info')
    @gdk.binding('sceneCtrl.model.state')
    _setState(v: PveSceneState) {
        if (!cc.isValid(this.node)) return;
        gdk.Timer.callLater(this, this._updateFlag);
    }

    _updateFlag() {
        if (!cc.isValid(this.node)) return;
        if (!this.sceneCtrl) return;
        let sm = this.sceneCtrl.model;
        let hm = this._hero ? this._hero.model : null;
        let fb = false;
        let bb = false;
        let sb = false;
        let db = false;
        let tb = false;
        let soldierType = sm.eliteStageUtil.getTowerSoldierType(this.id);
        let rb1 = false;//上阵特定英雄（英雄试炼副本准备）
        let rb2 = false;//上阵特定英雄（英雄试炼副本战斗）
        let isAssist = this._hero ? this._hero.isAssist : false;
        switch (sm.state) {
            case PveSceneState.Ready:
            case PveSceneState.Loading:
            case PveSceneState.WaveOver:
                bb = !sm.isDemo && !(sm.isMirror && !hm);
                fb = bb && !hm && sm.showHeroEffect;
                db = bb && this.isSoldierType;
                sb = false; // bb && hm && sm.state == PveSceneState.Ready;
                // if (sb) {
                //     let info = hm.item.extInfo as HeroInfo;
                //     sb = cc.js.isNumber(info.pveSsid) && info.pveSsid != 0;
                // }
                tb = bb && soldierType > 0 && !isAssist && sm.eliteStageUtil.towerShowSoldierTypeFlag;
                rb1 = !sm.isDemo && this.isRecommendHero;
                rb2 = false;
                break;

            case PveSceneState.Fight:
            default:
                bb = !sm.isDemo && !!hm;
                fb = false;
                sb = false;
                db = false;
                tb = false;
                rb1 = false;
                rb2 = !sm.isDemo && this.isRecommendHero
                break;
        }
        // 节点状态
        this.heroNameNode.active = !sm.isDemo && hm && [PveSceneState.Ready, PveSceneState.WaveOver].indexOf(sm.state) !== -1;
        if (this.heroNameNode.active && this.sceneCtrl.model.arenaSyncData && this.sceneCtrl.model.arenaSyncData.fightType == 'PIECES_CHESS') {
            this.heroNameNode.active = false;
            this.piecesNode.active = true;
            this.updatePiecesNode();
        }
        else {
            this.piecesNode.active = false;
        }
        this.superSkillNode.active = sb;
        //this.soldierType.node.active = db;
        const typeIdx: { [soldierType: number]: number } = {
            1: 0, 3: 1, 4: 2,
        };
        this.typeList.forEach((node, i) => {
            node.active = tb && i == typeIdx[soldierType];
            if (node.active) {
                GlobalUtil.setAllNodeGray(node, hm && hm.soldierType == soldierType ? 0 : 1);
            }
        });
        this.recommendNode.active = rb1;
        this.recommendIconNode.active = rb2;
        // let index = 0;
        // switch (soldierType) {
        //     case 1:
        //         index = 0;
        //         break;
        //     case 3:
        //         index = 1;
        //         break;
        //     case 4:
        //         index = 2;
        //         break;
        // }
        // this.typeList[index].active = tb;
        // 旗帜特效
        let anm = this.flagImg.getComponent(cc.Animation);
        if (fb) {
            if (!this.flagImg.active) {
                this.flagImg.active = true;
                this.flagImg.opacity = 0;
                this.flagImg.stopAllActions();
                this.flagImg.runAction(cc.fadeIn(0.25));
            }
            anm.play('towerFlag');
        } else if (this.flagImg.active) {
            this.flagImg.stopAllActions();
            this.flagImg.runAction(cc.sequence(
                cc.fadeOut(0.25),
                cc.callFunc(() => {
                    anm.stop('towerFlag');
                    this.flagImg.active = false;
                }),
            ));
        } else {
            anm.stop('towerFlag');
        }
        // 基座特效
        if (bb) {
            if (!this.baseImg.active) {
                this.baseImg.active = true;
                this.baseImg.opacity = 0;
                this.baseImg.stopAllActions();
                this.baseImg.runAction(cc.fadeIn(0.25));
            }
        } else if (this.baseImg.active) {
            this.baseImg.stopAllActions();
            this.baseImg.runAction(cc.fadeOut(0.25));
        }
        // 场景缩放值
        let scale = sm.scale;
        this.node.setScale(scale);
        this.heroNameNode.setScale(1 / scale);
        this.piecesNode.setScale(0.8 / scale);
        this.superSkillNode.setScale(1 / scale);
        this.atkDisImg.setScale(1 / scale);
        // 刷新阵营信息
        this.sceneCtrl.refreshGroupBuffInfo();
    }

    touchHandle() {
        let model = this.sceneCtrl.model;
        if (model.isDemo) return;
        if (model.isDefender) return;
        switch (model.state) {
            case PveSceneState.Ready:
                // 准备状态
                if (model.towers.indexOf(this) == -1) {
                    // 不在可操作基座列表中
                    return;
                }
                let a: HeroCfg[] = ConfigManager.getItems(HeroCfg);
                if (model.heros.length >= a.length) {
                    // 没有没上阵的英雄了
                    gdk.gui.showMessage(gdk.i18n.t("i18n:NO_MORE_AVAILABLE_HERO"));
                    return;
                }
                if (this._hero) {
                    // 已经上阵过英雄
                    this.openHeroDetail();
                } else {
                    let copyId = model.stageConfig.copy_id
                    if (copyId != CopyType.RookieCup) {
                        // 战斗状态
                        this.openHeroDetail();
                    } else if (!model.isMirror) {
                        // 完全空闲的状态
                        this._openHeroSelector();
                    }
                }
                break;
            case PveSceneState.Exiting:
            case PveSceneState.Entering:
            case PveSceneState.NextLevel:
            case PveSceneState.Fight:
            case PveSceneState.Pause:
                // 战斗状态
                this.openHeroDetail();
                break;
        }
    }

    // 打开英雄详情界面
    openHeroDetail() {
        let hero = this._hero;
        let model = hero ? hero.model : null;
        if (!model) {
            //打开引导
            let cfg = ConfigManager.getItem(GuideCfg, { force: 0, nextTask: 0, bindBtnId: 1801 });
            if (cfg) {
                GuideUtil.setGuideId(cfg.id);
            }
            return;
        }
        if (!model.ready) return;
        // 显示攻击范围圈
        this.showAtkDisLater(model.range * 2, false);
        // 不同的状态打开不同的二级弹框
        switch (this.sceneCtrl.model.state) {
            case PveSceneState.Ready:
                // 准备状态，则打开英雄选择界面
                this._openHeroSelector();
                break;

            case PveSceneState.Exiting:
            case PveSceneState.Entering:
            case PveSceneState.NextLevel:
            case PveSceneState.Fight:
            case PveSceneState.Pause:
                // 打开英雄属性详情界面
                gdk.panel.open(PanelId.PveHeroFightInfo, null, null, { args: model });
                break;
        }
    }

    // 打开英雄选择界面
    _openHeroSelector() {

        // 判断新奖杯模式助战
        let copyId = this.sceneCtrl.model.stageConfig.copy_id
        if (copyId != CopyType.RookieCup) {
            let hero = this._hero;
            let model = hero ? hero.model : null;
            if (model) {
                gdk.panel.open(PanelId.PveHeroFightInfo, null, null, { args: model });
            }
            return;
        }

        let temCfg = ConfigManager.getItem(Copycup_rookieCfg, { 'stage_id': this.sceneCtrl.model.stageConfig.id })
        let isAssist = false;
        let towerStr = 'tower_' + this.id;
        if (temCfg[towerStr] && temCfg[towerStr].length == 1) {
            isAssist = true;
        }
        if (isAssist) {
            gdk.gui.showMessage('此位置英雄无法替换，移动');
            return;
        }

        let pid = PanelId.PveSceneHeroSelectPanel;
        // 判断当前塔的位置是在屏幕的上半部还是下半部
        let isUp = true;
        if (this.node.y < cc.winSize.height / 2) {
            isUp = false;
        }
        // if (this._hero) {
        //     gdk.panel.setArgs(pid, this._hero.model.item.series, isUp, this.id);
        //     pid.maskAlpha = 0;
        // } else {
        //     gdk.panel.setArgs(pid, -1, isUp, this.id);
        //     pid.maskAlpha = 180;
        // }
        gdk.panel.setArgs(pid, this._hero ? this._hero.model.item.series : -1, isUp, this.id);
        gdk.panel.open(pid, (node: cc.Node) => {
            let ctrl = node.getComponent(PveSceneHeroSelectCtrl);
            ctrl.onSelect.targetOff(this);
            ctrl.onSelect.once((item: BagItem) => {
                if (!this.setHeroByItem(item)) return;
                this.sceneCtrl.model.saveBuildTower();
                if (this._hero) {
                    // 显示攻击范围
                    this._hero.showAtkDis = true;
                }
            }, this);
            ctrl.node.onHide.on(() => {
                ctrl.node.onHide.targetOff(this);
                ctrl.onSelect.targetOff(this);
                // 关闭英雄详情界面
                // gdk.panel.hide(PanelId.PveSceneHeroDetailPanel);
                // let node = gdk.panel.get(PanelId.PveSceneHeroDetailPanel)
                // if (node) {
                //     let panel = node.getComponent(PveHeroDetailCtrl);
                //     if (panel) {
                //         panel.onChange.off(this._openHeroSelector, this);
                //         panel.close(-1)
                //     }
                // }
                this.showAtkDisLater(0);
            }, this);
        });
    }

    /**
     * 检查英雄是否能上此塔位
     * @param data 
     * @param showError 
     */
    validItem(data: BagItem, showError?: boolean): boolean {
        let sceneModel = this.sceneCtrl.model;
        let isPieces = sceneModel.arenaSyncData && sceneModel.arenaSyncData.fightType == 'PIECES_CHESS';
        // 演示战斗 /自走棋模式 不做任何限制
        if (sceneModel.isDemo) {
            return true;
        }
        let info = <icmsg.HeroInfo>data.extInfo;
        (showError === void 0) && (showError = sceneModel.showAtkDis);
        // 上阵职业数量限制
        if (sceneModel.eliteStageUtil.careerLimit.length > 0) {
            let type = ConfigManager.getItemById(SoldierCfg, info.soldierId).type;
            let limit = sceneModel.eliteStageUtil.careerLimit[type - 1];
            if (limit <= 0) {
                // 完全限制此类职业
                if (showError) {
                    let desc = gdk.i18n.t("i18n:PVE_ELITE_LIMIT_TIP");
                    let text = StringUtils.replace(desc, "@number", `${limit}`);
                    gdk.gui.showMessage(text);
                }
                return false;
            } else if (limit < 6) {
                // 小于6时说明有限制数量
                let count = 0;
                sceneModel.heros.forEach(h => {
                    if (h.model.soldierType == type) {
                        count++;
                    }
                });
                if (count >= limit) {
                    // 超过限制的数量
                    if (showError) {
                        let desc = gdk.i18n.t("i18n:PVE_ELITE_LIMIT_NUM_TIP");
                        let text = StringUtils.replace(desc, "@number", `${limit}`);
                        gdk.gui.showMessage(text);
                    }
                    return false;
                }
            }
        }
        // // 塔位英雄小兵职业类型限制
        // let soldierType = PveEliteStageUtil.getTowerSoldierType(this.id);
        // if (soldierType != 0) {
        //     let cfg = ConfigManager.getItemById(SoldierCfg, info.soldierId);
        //     if (soldierType != cfg.type) {
        //         // 非指定类型
        //         if (showError) {
        //             let cfg = ConfigManager.getItem(SoldierCfg, { type: soldierType });
        //             let desc = gdk.i18n.t("i18n:PVE_ELITE_LIMIT_SOLDIER_TIP");
        //             let text = StringUtils.replace(desc, "@name", `${cfg.name}`);
        //             gdk.gui.showMessage(text);
        //         }
        //         return false;
        //     }
        // }
        // 雇佣英雄数量限制
        if (data.series > 600000 && sceneModel.eliteStageUtil.maxUpHeroNum_Woker > 0) {
            // 雇佣兵限制数量大于0
            let count = 0;
            sceneModel.heros.forEach(h => {
                if (h.model.item.series > 600000) {
                    count++;
                }
            });
            if (count > sceneModel.eliteStageUtil.maxUpHeroNum_Woker) {
                // 超过限制的数量
                if (showError) {
                    let desc = gdk.i18n.t("i18n:PVE_SURVIVAL_LIMIT_WORKER_NUM_TIP");
                    let text = StringUtils.replace(desc, "@number", `${sceneModel.eliteStageUtil.maxUpHeroNum_Woker}`);
                    gdk.gui.showMessage(text);
                }
                return false;
            }
        }
        //判断奖杯模式上阵英雄数量
        if (data.series > 800000 && sceneModel.eliteStageUtil.maxUpHeroNum > 0) {
            let count = 1;
            sceneModel.heros.forEach(h => {
                if (!h.isAssist) {
                    count++;
                }
            });
            let temCfg = ConfigManager.getItem(Copycup_rookieCfg, { 'stage_id': sceneModel.stageConfig.id })
            let isAssist = false;
            let towerStr = 'tower_' + this.id;
            if (temCfg[towerStr] && temCfg[towerStr].length == 1) {
                isAssist = true;
            }
            if (!isAssist && count > sceneModel.eliteStageUtil.maxUpHeroNum) {
                // 超过限制的数量
                if (showError) {
                    let desc = gdk.i18n.t("i18n:PVE_ELITE_MAX_TIP");
                    let text = StringUtils.replace(desc, "@number", `${sceneModel.eliteStageUtil.maxUpHeroNum}`);
                    gdk.gui.showMessage(text);
                }
                return false;
            }
        }

        //关卡援助英雄判断 不做限制
        let assistCfg = ConfigManager.getItemByField(Copy_assistCfg, "stage_id", sceneModel.stageConfig.id)
        if (assistCfg && data.itemId == assistCfg.hero_id) {
            return true
        }

        // 判断场上是否已经存在相同的英雄
        let exist = sceneModel.heros.some(h => {
            let item = h.model.item;
            return item.series !== data.series && item.itemId == data.itemId;
        });
        if (exist && sceneModel.stageConfig.copy_id != CopyType.ChallengeCup) {
            if (showError) {
                gdk.gui.showMessage(gdk.i18n.t("i18n:PVE_TOWER_HAS_SAME_HERO"));
            }
            return false;
        }
        // 符合要求
        return true;
    }

    /**
     * 选中当前英雄
     * @param {BagItem} data  数据
     * @param {Boolean} showError 是否显示错误提示
     */
    setHeroByItem(data: BagItem, showError?: boolean): boolean {
        // 设置英雄上阵
        let ret = false;
        if (this._hero) {
            if (data && this._hero.model.item.series === data.series) {
                // 当前所上阵的英雄为同一个英雄，不需要替换
                return ret;
            }
            this.hero.hide(false);
            this.hero = null;
            ret = true;
        }
        if (!data) return ret;
        if (!this.validItem(data, showError)) return false;
        // 创建上阵英雄实例
        let sceneModel = this.sceneCtrl.model;
        let info = <icmsg.HeroInfo>data.extInfo;
        let node = PvePool.get(this.sceneCtrl.heroPrefab);
        let hero: PveHeroCtrl = node.getComponent(PveHeroCtrl);
        let model: PveHeroModel = new PveHeroModel();
        model.id = data.itemId;
        model.heroId = info.heroId;
        model.ctrl = hero;
        model.item = data;
        hero.sceneModel = sceneModel;
        hero.model = model;
        this.hero = hero;
        // 添加到场景数据中
        sceneModel.addFight(hero);
        return true;
    }

    // 设置攻击范围图片
    showAtkDis() {
        if (!cc.isValid(this.node)) return;
        if (!this.sceneCtrl) return;
        if (!this._hero) return;
        let sm = this.sceneCtrl.model;
        if (!sm || sm.isDemo || !sm.showAtkDis) {
            this.atkDisImg.active = false;
            this.atkDisImg.removeComponent(ShaderHelper);
            this.atkDisImg.stopAllActions();
            return;
        }
        gdk.Timer.callLater(this, this.showAtkDisLater, [this._hero.model.range * 2]);
    }

    showAtkDisLater(range: number, autoHide: boolean = true) {
        if (!cc.isValid(this.node)) return;
        // 隐藏范围圈
        if (range <= 0) {
            this.atkDisImg.active = false;
            this.atkDisImg.removeComponent(ShaderHelper);
            this.atkDisImg.stopAllActions();
            return;
        }
        this.atkDisImg.active = true;
        this.atkDisImg.setContentSize(range, range);
        // 绘制攻击范围圈
        let c = this.atkDisImg.getComponent(ShaderHelper);
        if (!c) {
            c = this.atkDisImg.addComponent(ShaderHelper);
        }
        if (c) {
            c.enabled = true;
            c.program = 'attack_area';

            let w = new ShaderProperty();
            w.key = 'minRadius';
            w.value = 0.35;

            let m = new ShaderProperty();
            m.key = 'maxRadius';
            m.value = 0.5;

            let t = new ShaderProperty();
            t.key = 'areaColor';
            t.value = cc.color(0, 255, 0, 255);

            c.props = [w, m, t];
        }
        this.atkDisImg.stopAllActions();
        this.atkDisImg.opacity = autoHide ? 0 : 255;
        autoHide && this.atkDisImg.runAction(cc.sequence(
            cc.fadeIn(0.2),
            cc.delayTime(0.6),
            cc.fadeOut(0.2),
            cc.callFunc(() => {
                this.atkDisImg.active = false;
                this.atkDisImg.removeComponent(ShaderHelper);
            }, this),
        ));
    }

    /**更新自走棋 信息节点 */
    updatePiecesNode() {
        if (this.hero
            && this.hero.model.info
            && this.sceneCtrl.model.arenaSyncData
            && this.sceneCtrl.model.arenaSyncData.fightType == 'PIECES_CHESS'
            && [PveSceneState.Ready, PveSceneState.WaveOver].indexOf(this.sceneCtrl.model.state) !== -1) {
            this.piecesNode.active = true;
            let star = this.hero.model.info.heroStar;
            cc.find('heroStar/star', this.piecesNode).getComponent(cc.Label).string = this.hero.model.info.heroStar > 5 ? '1'.repeat(star - 5) : '0'.repeat(star);
            let cfg = ConfigManager.getItemByField(Pieces_heroCfg, 'hero_id', this.hero.model.info.heroType);
            let content = cc.find('heroFetter', this.piecesNode);
            content.removeAllChildren();
            cfg.group.forEach(g => {
                let icon = cc.instantiate(this.piecesFetterIcon);
                icon.parent = content;
                GlobalUtil.setSpriteIcon(this.node, icon, `common/texture/role/select/group_${g}`);
            });
            cfg.fetter.forEach(f => {
                let c = ConfigManager.getItemByField(Pieces_fetterCfg, 'fetter_type', f);
                let icon = cc.instantiate(this.piecesFetterIcon);
                icon.parent = content;
                GlobalUtil.setSpriteIcon(this.node, icon, `view/pve/texture/ui/pieces/${c.icon}`);
            });
        }
        else {
            this.piecesNode.active = false;
        }
    }
}