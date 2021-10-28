import {
    CopyCfg,
    Copy_towerhaloCfg,
    Eternal_stageCfg,
    HeroCfg,
    Monster2Cfg,
    MonsterCfg
} from '../../../../a/config';
import ConfigManager from '../../../../common/managers/ConfigManager';
import ModelManager from '../../../../common/managers/ModelManager';
import { BagItem } from '../../../../common/models/BagModel';
import CopyModel from '../../../../common/models/CopyModel';
import HeroModel from '../../../../common/models/HeroModel';
import RoleModel from '../../../../common/models/RoleModel';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import JumpUtils from '../../../../common/utils/JumpUtils';
import StringUtils from '../../../../common/utils/StringUtils';
import TimerUtils from '../../../../common/utils/TimerUtils';
import PanelId from '../../../../configs/ids/PanelId';
import PveTool from '../../../pve/utils/PveTool';
import ActivityModel from '../../model/ActivityModel';
import ActUtil from '../../util/ActUtil';
import EternalBossItemCtrl from './EternalBossItemCtrl';


/** 
 * @Description: 武魂试炼
 * @Author:yaozu.hu yaozu
 * @Date: 2020-08-04 11:29:25
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-04-10 15:25:40
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/eternalCopy/EternalCopyViewCtrl")
export default class EternalCopyViewCtrl extends gdk.BasePanel {

    @property(sp.Skeleton)
    bossSpine: sp.Skeleton = null;
    @property(cc.Prefab)
    bossItem: cc.Prefab = null;
    @property(cc.Node)
    listNode: cc.Node = null;
    @property(cc.Label)
    timeLb: cc.Label = null;
    @property(cc.Label)
    powerLb: cc.Label = null;
    @property(cc.LabelOutline)
    powerLbline: cc.LabelOutline = null;
    @property(cc.Label)
    bossName: cc.Label = null;

    @property(gdk.List)
    rewardList: gdk.List = null;

    @property(cc.Node)
    attackBtn: cc.Node = null;

    @property(cc.Sprite)
    groupSp1: cc.Sprite = null;
    @property(cc.Sprite)
    groupSp2: cc.Sprite = null;

    get model(): HeroModel { return ModelManager.get(HeroModel); }
    get copyModel(): CopyModel { return ModelManager.get(CopyModel) }
    get roleModel(): RoleModel { return ModelManager.get(RoleModel) }
    get actModel() { return ModelManager.get(ActivityModel); }
    copyCfg: CopyCfg;
    stages: Eternal_stageCfg[] = [];
    index = 0;
    bossItems: EternalBossItemCtrl[] = [];
    curStageCfg: Eternal_stageCfg;
    dtime: number = 0;
    endTime: number = 0;
    powerLBColors: string[] = ['#f7eb9d', '#ff1d1a'];
    powerLBlineColors: string[] = ['#932c09', '#461303']
    _leftTime: number;
    get leftTime(): number { return this._leftTime; }
    set leftTime(v: number) {
        if (!v && v != 0) return;
        v = Math.max(0, v);
        this._leftTime = v;
        this.timeLb.string = '' + TimerUtils.format4(v);
        if (v == 0) {
            //TODO
            this.refreshActivityData();
        }
    }

    selectHeroItemIds: number[] = []
    datas: BagItem[] = []; //所有英雄的临时数据

    onEnable() {
        this.refreshActivityData();

        //判断是否打开限时礼包界面
        if (this.actModel.wuhunShowView) {
            this.actModel.wuhunShowView = false;
            gdk.panel.setArgs(PanelId.LimitActGiftView, 15)
            gdk.panel.open(PanelId.LimitActGiftView)
        }
    }

    refreshActivityData() {
        this.initCopyData();
        if (this.copyCfg == null) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:ETERNAL_TIP1"));
            this.close();
        }
        this.copyModel.enterEternalCopy = true;
        this.stages = ConfigManager.getItems(Eternal_stageCfg, (item: Eternal_stageCfg) => {
            if (item.subtype == this.copyCfg.subtype) {
                return true;
            }
            return false;
        })
        let nowTime = Math.floor(GlobalUtil.getServerTime() / 1000)
        this.endTime = ActUtil.getActEndTime(this.copyCfg.activityid) / 1000;
        this.leftTime = Math.max(0, Math.floor(this.endTime - nowTime));
        this.initBossItem();

        //刷新阵营加成属性
        this.refreshGroupBuffInfo();
    }

    refreshGroupBuffInfo() {
        for (let i = 0; i < 6; i++) {
            this.selectHeroItemIds[i] = -1;
        }
        this.datas = this.model.heroInfos.concat();
        let selectHeros = this.model.curUpHeroList(0)
        this.datas.forEach(info => {
            let index = selectHeros.indexOf(info.series)
            if (index >= 0) {
                this.selectHeroItemIds[index] = info.itemId;
            }
        })

        let a = {};

        this.selectHeroItemIds.forEach(id => {
            if (id > 0) {
                let cfg = ConfigManager.getItemById(HeroCfg, id);
                if (cfg) {
                    if (!a[cfg.group[0]]) {
                        a[cfg.group[0]] = 1;
                    } else {
                        a[cfg.group[0]] += 1;
                    }
                }
            }
        })
        let addNum = 0;
        let maxType = 0;
        let maxNum = 0;
        let big4Type: number[] = [];
        let addCfgs: Copy_towerhaloCfg[] = [];
        let temMaxNum = 0;
        for (let i = 1; i <= 6; i++) {
            if (a[i] == null && i < 6) continue;
            if (i == 1 || i == 2) {
                addNum += a[i];
            } else {
                if (a[i] > maxNum) {
                    maxNum = a[i];
                }
            }
            if (a[i] > temMaxNum) {
                temMaxNum = a[i]
                maxType = i;
            }
            if (a[i] >= 4) {
                big4Type.push(i);
            }
            if (i == 6 && (maxNum + addNum >= 2)) {
                let temNum = Math.min(6, maxNum + addNum);
                let cfg = ConfigManager.getItem(Copy_towerhaloCfg, (cfg: Copy_towerhaloCfg) => {
                    if (cfg.only == 1 && cfg.num == temNum) {
                        return true;
                    }
                    return false;
                })
                if (cfg) {
                    addCfgs.push(cfg);
                }
            }
        }
        if (big4Type.length > 0) {
            big4Type.forEach(type => {
                let num = Math.min(6, a[type])
                let cfg = ConfigManager.getItem(Copy_towerhaloCfg, (cfg: Copy_towerhaloCfg) => {
                    if (cfg.group.indexOf(type) >= 0 && num == cfg.num) {
                        return true
                    }
                    return false;
                })
                if (cfg) {
                    addCfgs.push(cfg);
                }
            })
        }

        //设置图片
        let tem1 = 1;
        if (addNum + maxNum >= 2) {
            tem1 = Math.min(6, addNum + maxNum)
        }

        let path1 = 'common/texture/role/select/yx_zhenying_' + tem1;
        GlobalUtil.setSpriteIcon(this.node, this.groupSp1, path1);

        let temMax = 0;
        if (big4Type.length > 0) {
            big4Type.forEach(type => {
                if (a[type] > temMax) {
                    temMax = a[type]
                }
            })
            this.groupSp2.node.active = true;
            let tem2 = Math.min(3, temMax - 3);
            let path2 = 'common/texture/role/select/yx_zhenyingji_' + tem2;
            GlobalUtil.setSpriteIcon(this.node, this.groupSp2, path2);
        } else {
            this.groupSp2.node.active = false;
        }
    }


    initCopyData() {
        let cfgs = ConfigManager.getItems(CopyCfg, (item: CopyCfg) => {
            if (item.copy_id == 15) {
                return true;
            }
            return false;
        })

        if (cfgs.length > 0) {
            cfgs.forEach(cfg => {
                if (ActUtil.ifActOpen(cfg.activityid)) {
                    this.copyCfg = cfg;
                }
            });
        }
    }
    update(dt: number) {
        if (!this.leftTime || this.leftTime <= 0) return;
        if (this.dtime >= 1) {
            let nowTime = Math.floor(GlobalUtil.getServerTime() / 1000)
            this.leftTime = Math.max(0, Math.floor(this.endTime - nowTime));
            this.dtime = 0;
        }
        else {
            this.dtime += dt;
        }
    }

    initBossItem() {
        let i = 0;
        let select = false;
        this.index = -1;
        this.listNode.removeAllChildren();
        this.stages.forEach(stage => {
            let node = cc.instantiate(this.bossItem);
            let ctrl = node.getComponent(EternalBossItemCtrl);

            this.bossItems.push(ctrl);
            if (this.copyModel.eternalCopyStageIds.indexOf(stage.id) < 0 && !select) {
                select = true;
                this.curStageCfg = stage;
                this.index = i;
                this.refreshStageInfo();
            }
            ctrl.initData(stage, i, this.selectBossItem, this, this.index == i)
            node.setParent(this.listNode);
            i++;
        })
        if (!this.curStageCfg) {
            this.curStageCfg = this.stages[0];
            this.index = 0;
            this.bossItems[0].select.active = true;
            this.refreshStageInfo();
        }
    }

    selectBossItem(index: number) {
        if (index != this.index) {
            let ctrl = this.bossItems[this.index];
            ctrl.select.active = false;
            this.index = index;
            this.curStageCfg = this.stages[index];
            this.refreshStageInfo();
        }
    }

    refreshStageInfo() {

        this.rewardList.datas = this.curStageCfg.show_rewards;
        this.powerLb.string = this.curStageCfg.recommended + '';
        let index = this.roleModel.power > this.curStageCfg.recommended ? 0 : 1
        this.powerLb.node.color = cc.color(this.powerLBColors[index])
        this.powerLbline.color = cc.color(this.powerLBlineColors[index])
        this.bossName.string = this.curStageCfg.name;
        this.bossSpine.node.scale = this.curStageCfg.interface;
        let state: 0 | 1 = this.copyModel.eternalCopyStageIds.indexOf(this.curStageCfg.id) < 0 ? 0 : 1
        GlobalUtil.setAllNodeGray(this.attackBtn, state);
        let skin = ''
        if (this.curStageCfg.type_pk == 'pve') {
            let monsterCfg = ConfigManager.getItemById(MonsterCfg, this.curStageCfg.monster);
            if (!monsterCfg) {
                //cc.log('怪物配置有问题，请检查---->' + this.curStageCfg.id)
                return;
            }
            skin = monsterCfg.skin
        } else {
            let monsterCfg = ConfigManager.getItemById(Monster2Cfg, this.curStageCfg.monster);
            if (!monsterCfg) {
                //cc.log('怪物配置有问题，请检查---->' + this.curStageCfg.id)
                return;
            }
            skin = monsterCfg.skin
        }
        let bossPath = PveTool.getSkinUrl(skin);
        let anim = StringUtils.startsWith(skin, "M_") ? 'stand_s' : 'stand';
        GlobalUtil.setSpineData(this.node, this.bossSpine, bossPath, true, anim, true);

    }

    attackClick() {
        if (this.copyModel.eternalCopyStageIds.indexOf(this.curStageCfg.id) >= 0) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:ETERNAL_TIP2"))
            return;
        }
        JumpUtils.openInstance(this.curStageCfg.id);
    }

    //打开通关攻略界面
    openReplayView() {
        JumpUtils.openReplayListView(this.curStageCfg.id)
    }



    openHaloView() {
        gdk.panel.setArgs(PanelId.EternalHeroHaloView, this.selectHeroItemIds)
        gdk.panel.open(PanelId.EternalHeroHaloView);
    }

}
