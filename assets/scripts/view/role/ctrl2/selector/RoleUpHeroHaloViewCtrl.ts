import ConfigManager from '../../../../common/managers/ConfigManager';
import CopyModel, { CopyType } from '../../../../common/models/CopyModel';
import EnergyModel from '../../../energy/model/EnergyModel';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import HeroModel from '../../../../common/models/HeroModel';
import HeroUtils from '../../../../common/utils/HeroUtils';
import MercenaryModel from '../../../mercenary/model/MercenaryModel';
import ModelManager from '../../../../common/managers/ModelManager';
import PanelId from '../../../../configs/ids/PanelId';
import PveSceneCtrl from '../../../pve/ctrl/PveSceneCtrl';
import {
    Copy_towerhaloCfg,
    Energystation_advancedCfg,
    GroupCfg,
    HeroCfg
    } from '../../../../a/config';
/** 
 * @Description: 角色上阵英雄halo面板
 * @Author:yaozu.hu  
 * @Date: 2019-03-28 17:21:18 
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-08-26 21:59:18
 */


const { ccclass, property, menu } = cc._decorator;


@ccclass
@menu("qszc/view/role2/selector/RoleUpHeroHaloViewCtrl")
export default class RoleUpHeroHaloViewCtrl extends gdk.BasePanel {

    // @property(cc.ScrollView)
    // scrollView: cc.ScrollView = null;

    // @property(cc.Node)
    // content: cc.Node = null;

    // @property(cc.Prefab)
    // haloItem: cc.Prefab = null;

    // @property([cc.Node])
    // addItems: cc.Node[] = []

    // list: ListView;
    groups: number[] = [];
    cfgs: Copy_towerhaloCfg[] = [];
    laseIsAlive: boolean = false;

    //阵营图标
    @property([cc.Node])
    iconNodes: cc.Node[] = []

    //全阵营属性
    @property([cc.Node])
    attributesNodes: cc.Node[] = []

    //单独阵营
    @property([cc.Node])
    groupNodes: cc.Node[] = []


    @property(cc.Sprite)
    groupSp1: cc.Sprite = null;
    @property(cc.Sprite)
    groupSp2: cc.Sprite = null;

    @property(cc.Node)
    tipNode: cc.Node = null;
    @property(cc.RichText)
    tipStr: cc.RichText = null;

    //神秘者阵营
    @property(cc.Node)
    smGroupNode: cc.Node = null
    //神秘者阵营
    @property([cc.Node])
    smNodes: cc.Node[] = []

    colorList1: cc.Color[] = [cc.color('#F8AF12'), cc.color('#56E608')]
    colorLineList1: cc.Color[] = [cc.color('#3D2107'), cc.color('#2A221A')]
    colorList2: cc.Color[] = [cc.color('#BF9973'), cc.color('#56E608')]

    a: any = {}
    shuxingCfg: Copy_towerhaloCfg = null;
    groupCfgs: Copy_towerhaloCfg[] = []
    addNum = 0;
    maxType = 0;
    maxNum = 0;
    big4Type: number[] = [];


    onEnable() {

        // let arg = gdk.panel.getArgs(PanelId.RoleUpHeroHaloView);
        // if (arg) {
        //     this.cfgs = arg[0];
        //     this.laseIsAlive = arg[1];
        // }

        this.tipNode.active = false;

        //1.数据处理 

        this.initGroupData();

        //2.设置icon、图片
        this.setGroupIconState()

        //3.设置属性
        this.setShuxingData()

        //4.设置阵营属性
        this.setGroupData()

        //5.设置神秘者阵营属性
        this.setsmGroupData()

    }

    onDisable() {
        this.clearData()
    }

    initGroupData() {
        let selectHeroItemIds = [];
        let view = gdk.gui.getCurrentView();
        let ctrl = view.getComponent(PveSceneCtrl);
        let arg = gdk.panel.getArgs(PanelId.RoleUpHeroHaloView);
        if (arg) {
            selectHeroItemIds = arg[0];
        } else if (cc.isValid(ctrl) && ctrl.enabledInHierarchy) {
            // 战斗场景中
            let cfg = ctrl.model.stageConfig;
            if (cfg && cfg.copy_id == CopyType.Survival && cfg.subtype == 1) {
                // 生存副本
                let copyModel = ModelManager.get(CopyModel);
                let mercenaryModel = ModelManager.get(MercenaryModel);
                let List1 = mercenaryModel.borrowedListHero;
                copyModel.survivalStateMsg.heroes.forEach(data => {
                    if (data.typeId == 0) {
                        let heroInfo = HeroUtils.getHeroInfoByHeroId(data.heroId);
                        if (heroInfo) {
                            selectHeroItemIds.push(heroInfo.typeId);
                        }
                    } else {
                        let temData = List1[data.heroId - 1];
                        if (temData) {
                            selectHeroItemIds.push(temData.brief.typeId);
                        }
                    }
                });
            } else {
                // 其他类型的副本
                ctrl.model.towers.forEach(t => {
                    selectHeroItemIds[t.id - 1] = t.hero ? t.hero.model.item.itemId : -1;
                });
            }
        } else {
            // 其他界面情况下，则显示当前上阵的英雄
            let model = ModelManager.get(HeroModel);
            let selectHeros = model.PveUpHeroList;
            selectHeros.forEach(heroId => {
                let heroInfo = HeroUtils.getHeroInfoByHeroId(heroId)
                if (heroInfo) {
                    selectHeroItemIds.push(heroInfo.typeId);
                }
            });
        }

        selectHeroItemIds.forEach(id => {
            if (id > 0) {
                let cfg = ConfigManager.getItemById(HeroCfg, id);
                if (cfg) {
                    if (!this.a[cfg.group[0]]) {
                        this.a[cfg.group[0]] = 1;
                    } else {
                        this.a[cfg.group[0]] += 1;
                    }
                }
            }
        })
        for (let i = 1; i <= 6; i++) {
            if (this.a[i] == null && i < 6) continue;
            if (i == 1 || i == 2) {
                this.addNum += this.a[i];
            } else {
                if (this.a[i] > this.maxNum) {
                    this.maxNum = this.a[i];
                    this.maxType = i;
                }
            }
            if (this.a[i] >= 4) {
                this.big4Type.push(i);
            }
            if (i == 6 && (this.maxNum + this.addNum >= 2)) {
                let temNum = Math.min(6, this.maxNum + this.addNum);
                let cfg = ConfigManager.getItem(Copy_towerhaloCfg, (cfg: Copy_towerhaloCfg) => {
                    if (cfg.only == 1 && cfg.num == temNum) {
                        return true;
                    }
                    return false;
                })
                if (cfg) {
                    this.shuxingCfg = cfg;
                }
            }
        }
    }

    setGroupIconState() {

        //设置图标
        for (let i = 1; i <= this.iconNodes.length; i++) {
            let node = this.iconNodes[i - 1];
            let label = node.getChildByName('lv').getComponent(cc.Label);
            let icon = node.getChildByName('icon');
            let state: 0 | 1 = 1;
            if (this.a[i]) {
                label.string = this.a[i] + '';
                if (i == 6 || i == this.maxType || i <= 2) {
                    state = 0
                }
            } else {
                label.string = '0'
            }
            GlobalUtil.setGrayState(icon, state)
        }
        //设置图片
        let num = 1;
        if (this.addNum + this.maxNum >= 2) {
            num = Math.min(6, this.addNum + this.maxNum)
        }

        let path1 = 'common/texture/role/select/yx_zhenying_' + num;
        GlobalUtil.setSpriteIcon(this.node, this.groupSp1, path1);

        let temMax = 0;
        if (this.big4Type.length > 0) {
            this.big4Type.forEach(type => {
                if (this.a[type] > temMax) {
                    temMax = this.a[type]
                }
            })
            this.groupSp2.node.active = true;
            let temNum = Math.min(3, temMax - 3);
            let path2 = 'common/texture/role/select/yx_zhenyingji_' + temNum;
            GlobalUtil.setSpriteIcon(this.node, this.groupSp2, path2);
        } else {
            this.groupSp2.node.active = false;
        }
    }

    //设置属性数据
    setShuxingData() {

        let temCfgs = ConfigManager.getItems(Copy_towerhaloCfg, (cfg: Copy_towerhaloCfg) => {
            if (cfg.only == 1) {
                return true;
            }
            return false;
        })
        for (let i = 0; i < this.attributesNodes.length; i++) {
            let node = this.attributesNodes[i];
            if (temCfgs[i]) {
                node.active = true;
                let temStrs = temCfgs[i].des.split(';');
                let str1 = temStrs[0].split('-');
                let str2 = temStrs[1].split('-');
                let group = node.getChildByName('group').getComponent(cc.Label);
                let groupLine = node.getChildByName('group').getComponent(cc.LabelOutline);
                let name1 = node.getChildByName('name1').getComponent(cc.Label);
                let num1 = node.getChildByName('num1').getComponent(cc.Label);
                let name2 = node.getChildByName('name2').getComponent(cc.Label);
                let num2 = node.getChildByName('num2').getComponent(cc.Label);

                group.string = temCfgs[i].num + gdk.i18n.t("i18n:ROLE_UPHERO_HALO_TIP3")//'个同阵营:'
                name1.string = str1[0];
                num1.string = '+' + str1[1] + '%';
                name2.string = str2[0];
                num2.string = '+' + str2[1] + '%';
                //设置颜色
                let colorIndex = temCfgs[i] == this.shuxingCfg ? 1 : 0;
                group.node.color = this.colorList1[colorIndex];
                groupLine.color = this.colorLineList1[colorIndex];
                name1.node.color = this.colorList2[colorIndex]
                num1.node.color = this.colorList2[colorIndex]
                name2.node.color = this.colorList2[colorIndex]
                num2.node.color = this.colorList2[colorIndex]

            } else {
                node.active = false;
            }
        }
    }

    setGroupData() {

        for (let i = 0; i < this.groupNodes.length; i++) {
            let node = this.groupNodes[i];
            let temCfg: Copy_towerhaloCfg;
            let have = false;
            if (this.big4Type.indexOf(i + 1) >= 0) {
                have = true;
                let num = Math.min(6, this.a[i + 1])
                temCfg = ConfigManager.getItem(Copy_towerhaloCfg, (cfg: Copy_towerhaloCfg) => {
                    if (cfg.group.indexOf(i + 1) >= 0 && cfg.num == num) {
                        return true;
                    }
                    return false;
                })
            } else {
                temCfg = ConfigManager.getItem(Copy_towerhaloCfg, (cfg: Copy_towerhaloCfg) => {
                    if (cfg.group.indexOf(i + 1) >= 0 && cfg.num == 4) {
                        return true;
                    }
                    return false;
                })
            }
            let group = node.getChildByName('group').getComponent(cc.Label);
            let groupLine = node.getChildByName('group').getComponent(cc.LabelOutline);
            let name1 = node.getChildByName('name1').getComponent(cc.Label);
            let num1 = node.getChildByName('num1').getComponent(cc.Label);
            let tips = node.getChildByName('tips');
            let temStrs = temCfg.des.split(';');
            let str1 = temStrs[0].split('-');
            let groupCfg = ConfigManager.getItemById(GroupCfg, i + 1)
            group.string = temCfg.num + gdk.i18n.t("i18n:ROLE_UPHERO_HALO_TIP4") + groupCfg.name
            name1.string = str1[0] + ' +' + str1[1] + '%';
            tips.active = have;
            let energyInfo = ModelManager.get(EnergyModel).energyStationInfo[i + 1];
            if (energyInfo) {
                let energyAdvanceCfg = ConfigManager.getItemById(Energystation_advancedCfg, energyInfo.advanceId);
                num1.node.active = !!energyAdvanceCfg && energyAdvanceCfg.camp;
                if (num1.node.active) {
                    let str = GlobalUtil.getSkillCfg(energyAdvanceCfg.camp).des;
                    num1.string = `(+${str.split('+')[1]})`;
                }
            } else {
                num1.node.active = false
            }
            //设置颜色
            let colorIndex = have ? 1 : 0;
            group.node.color = this.colorList1[colorIndex];
            groupLine.color = this.colorLineList1[colorIndex];
            name1.node.color = this.colorList2[colorIndex]

            // if (have) {
            //     tips.setPosition(cc.v2(115 + name1.node.width + 35, -12))
            // }
        }
    }


    setsmGroupData() {
        if (this.a[6]) {
            this.smGroupNode.active = true;
            let groupCfg = ConfigManager.getItemById(GroupCfg, 6)
            let num = Math.min(6, this.a[6])
            for (let i = 0; i < this.smNodes.length; i++) {
                let node = this.smNodes[i];
                let temCfg: Copy_towerhaloCfg;
                let have = false;
                temCfg = ConfigManager.getItem(Copy_towerhaloCfg, (cfg: Copy_towerhaloCfg) => {
                    if (cfg.group.indexOf(6) >= 0 && cfg.num == i + 1) {
                        return true;
                    }
                    return false;
                })
                if (temCfg) {
                    node.active = true;
                    have = temCfg.num <= num;
                    let group = node.getChildByName('group').getComponent(cc.Label);
                    let groupLine = node.getChildByName('group').getComponent(cc.LabelOutline);
                    let name1 = node.getChildByName('name1').getComponent(cc.Label);
                    let num1 = node.getChildByName('num1').getComponent(cc.Label);

                    let temStrs = temCfg.des.split(';');
                    let str1 = temStrs[0].split('-');

                    group.string = temCfg.num + gdk.i18n.t("i18n:ROLE_UPHERO_HALO_TIP4") + groupCfg.name
                    name1.string = str1[0] + ' +' + str1[1] + '%';

                    let energyInfo = ModelManager.get(EnergyModel).energyStationInfo[6];
                    if (energyInfo) {
                        let energyAdvanceCfg = ConfigManager.getItemById(Energystation_advancedCfg, energyInfo.advanceId);
                        num1.node.active = !!energyAdvanceCfg && energyAdvanceCfg.camp;
                        if (num1.node.active) {
                            let str = GlobalUtil.getSkillCfg(energyAdvanceCfg.camp).des;
                            num1.string = `(+${str.split('+')[1]})`;
                        }
                    } else {
                        num1.node.active = false
                    }
                    //设置颜色
                    let colorIndex = have ? 1 : 0;
                    group.node.color = this.colorList1[colorIndex];
                    groupLine.color = this.colorLineList1[colorIndex];
                    name1.node.color = this.colorList2[colorIndex]
                } else {
                    node.active = false;
                }

                // if (have) {
                //     tips.setPosition(cc.v2(115 + name1.node.width + 35, -12))
                // }
            }

        } else {
            this.smGroupNode.active = false;
        }
    }

    curType: number = 0;

    tipBtnClick(event: cc.Event, type: any) {
        //cc.log('打开阵营激活属性tips----' + type)
        let temType = parseInt(type);
        if (this.tipNode.active) {
            if (this.curType != temType) {
                this.curType = temType
            } else {
                this.curType = 0;
                this.tipNode.active = false;
            }
        } else {
            this.tipNode.active = true;
            this.curType = temType
        }
        if (this.curType != 0) {
            let temCfgs = ConfigManager.getItems(Copy_towerhaloCfg, (cfg: Copy_towerhaloCfg) => {
                if (cfg.group.indexOf(temType) >= 0 && cfg.num >= 4) {
                    return true;
                }
                return false;
            })
            let str = '';
            for (let i = 0; i < temCfgs.length; i++) {
                let cfg = temCfgs[i];
                let temStrs = cfg.des.split(';');
                let str1 = temStrs[0].split('-');
                let groupCfg = ConfigManager.getItemById(GroupCfg, temType)
                let temStr = cfg.num + gdk.i18n.t("i18n:ROLE_UPHERO_HALO_TIP4") + groupCfg.name + ': ' + str1[0] + ' +' + str1[1] + '%';
                if (this.a[this.curType] == cfg.num) {
                    temStr = '<color=#56E608>' + temStr + '</color>'
                }
                str = str + temStr;
                if (i != temCfgs.length - 1) {
                    str = str + '\n'
                }
            }
            // 灰 #E8D7B8  绿 #56E608
            this.tipStr.string = str;
        }
    }

    closeTipsBtn() {
        this.curType = 0;
        this.tipNode.active = false;
    }
    clearData() {
        this.a = {}
        this.shuxingCfg = null;
        this.groupCfgs = []
        this.addNum = 0;
        this.maxType = 0;
        this.maxNum = 0;
        this.big4Type = [];
    }

}
