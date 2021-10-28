import {
    Copy_stageCfg,
    Copy_towerhaloCfg,
    Copy_towerlistCfg,
    HeroCfg,
    SystemCfg
} from '../../../../a/config';
import ConfigManager from '../../../../common/managers/ConfigManager';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import { BagItem } from '../../../../common/models/BagModel';
import CopyModel from '../../../../common/models/CopyModel';
import HeroModel from '../../../../common/models/HeroModel';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import JumpUtils from '../../../../common/utils/JumpUtils';
import StringUtils from '../../../../common/utils/StringUtils';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';
import PanelId from '../../../../configs/ids/PanelId';
import { ResonatingEventId } from '../../../resonating/enum/ResonatingEventId';
import { RoleEventId } from '../../enum/RoleEventId';
import RoleHeroItemCtrl2 from './RoleHeroItemCtrl2';

/** 
 * @Description: 英雄选择面板
 * @Author: weiliang.huang  
 * @Date: 2019-03-28 16:19:18 
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-05-07 11:01:57
 */

const { ccclass, property, menu } = cc._decorator;

export interface HeroSelectType {
    color: number,   // 品质
    item: BagItem,   // 英雄背包数据
}
interface HeroListItemType {
    data: BagItem,
    isSelect: boolean,
}
@ccclass
@menu("qszc/view/role2/selector/RoleSelectCtrl2")
export default class RoleSelectCtrl2 extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    heroItem: cc.Prefab = null;

    @property(cc.Button)
    careerBtns: cc.Button[] = []

    @property(cc.Button)
    groupBtns: cc.Button[] = []

    @property(cc.Node)
    contentCareer: cc.Node = null

    @property(cc.Node)
    btnUp: cc.Node = null

    @property(cc.Label)
    upHeroPower: cc.Label = null;

    @property([cc.Node])
    addBuffList: cc.Node[] = []

    @property([cc.Node])
    upHeroList: cc.Node[] = []

    @property(cc.Label)
    shouweiNum: cc.Label = null;
    @property(cc.Label)
    paobingNum: cc.Label = null;
    @property(cc.Label)
    jiqiangNum: cc.Label = null;
    @property(cc.LabelOutline)
    shouweiline: cc.LabelOutline = null;
    @property(cc.LabelOutline)
    paobingline: cc.LabelOutline = null;
    @property(cc.LabelOutline)
    jiqiangline: cc.LabelOutline = null;

    // @property([cc.Node])
    // groupBg: cc.Node[] = []
    // @property(cc.Prefab)
    // groupNumPre: cc.Prefab = null;
    // @property(cc.Node)
    // groupNumNode: cc.Node = null;
    @property(cc.Sprite)
    groupSp1: cc.Sprite = null;
    @property(cc.Sprite)
    groupSp2: cc.Sprite = null;
    @property(cc.Label)
    lockNode: cc.Label = null;
    @property(cc.Node)
    addItemsNode: cc.Node = null;


    list: ListView = null
    selectGroup: number = 0     // 筛选阵营
    selectCareer: number = 0    //筛选职业
    isShowCareer: boolean = false

    groupBgData: number[][] = []
    groupBgNames: string[] = ['yx_zhengyingsekuai', 'yx_zhengyingsekuai2', 'yx_zhengyingsekuai3', 'yx_zhengyingsekuai4', 'yx_zhengyingsekuai5', 'yx_zhengyingsekuai6']

    get model(): HeroModel { return ModelManager.get(HeroModel); }
    //get roleModel(): RoleModel { return ModelManager.get(RoleModel); }
    get copyModel(): CopyModel { return ModelManager.get(CopyModel); }
    onEnable() {
        gdk.e.on(RoleEventId.UPDATE_HERO_LIST, this._updateScroll, this);
        gdk.e.on(RoleEventId.REMOVE_ONE_HERO, this._updateScroll, this);
        gdk.e.on(RoleEventId.UPDATE_ONE_HERO, this._updateScroll, this);
        gdk.e.on(ResonatingEventId.ASSIST_ALLIANCE_INFO_PUSH, this._updateScroll, this);
        gdk.e.on(RoleEventId.SHOW_UPHERO_INFO, this._updataUpHeroInfo, this);
        gdk.Timer.callLater(this, this.onEnableLater);
    }

    onEnableLater() {
        if (!cc.isValid(this.node)) return;
        if (!this.node.activeInHierarchy) return;

        this.selectGroupFunc(null, this.model.roleSelectGroup);
        this.selectCareerFunc(null, this.model.roleSelectCareer);
        this.updateContentState();

        let tems = ConfigManager.getItems(Copy_towerlistCfg, (item: Copy_towerlistCfg) => {
            if (item.general_lv <= this.copyModel.lastCompleteStageId) {
                return true;
            }
            return false;
        });
        this.copyCfg = tems[tems.length - 1];

        this.initUpHeroData();
    }

    onDisable() {
        gdk.e.targetOff(this);
        if (this.list) {
            this.list.destroy();
            this.list = null;
        }

        if (!gdk.panel.isOpenOrOpening(PanelId.RoleView2)) {
            this.model.roleSelectGroup = 0
            this.model.roleSelectCareer = 0
        }
    }

    showCareerContent() {
        this.isShowCareer = true
        this.updateContentState()
    }

    hideCareerContent() {
        this.isShowCareer = false
        this.updateContentState()
    }

    updateContentState() {
        if (this.isShowCareer) {
            this.contentCareer.active = true
            this.btnUp.active = false
        } else {
            this.contentCareer.active = false
            this.btnUp.active = true
        }
    }

    /**选择页签, 筛选职业*/
    selectCareerFunc(e, utype) {
        this.selectCareer = parseInt(utype)
        this.model.roleSelectCareer = this.selectCareer
        for (let idx = 0; idx < this.careerBtns.length; idx++) {
            const element = this.careerBtns[idx];
            element.interactable = idx != this.selectCareer
            let select = element.node.getChildByName("select")
            select.active = idx == this.selectCareer
        }
        this._updateScroll()
    }

    /**选择页签, 筛选阵营*/
    selectGroupFunc(e, utype) {
        this.selectGroup = parseInt(utype)
        this.model.roleSelectGroup = this.selectGroup
        for (let idx = 0; idx < this.groupBtns.length; idx++) {
            const element = this.groupBtns[idx];
            let nodeName = element.name
            let group = parseInt(nodeName.substring('group'.length));
            element.interactable = group != this.selectGroup
            let select = element.node.getChildByName("select")
            select.active = group == this.selectGroup
        }
        this._updateScroll()
    }

    _initListView() {
        if (this.list) {
            return
        }
        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.heroItem,
            cb_host: this,
            column: 4,
            gap_x: 40,
            gap_y: 25,
            async: true,
            resize_cb: this._updateDataLater,
            direction: ListViewDir.Vertical,
        })
        this.list.onClick.on(this._selectItem, this);
    }

    _updateDataLater() {
        gdk.Timer.callLater(this, this._updateScroll)
    }

    _updateScroll() {
        this._initListView()
        let datas = this.model.heroInfos.concat();
        let tempList: BagItem[] = [];
        if (this.selectGroup != 0) {
            //英雄阵营数据
            for (let i = 0; i < datas.length; i++) {
                let heroCfg = ConfigManager.getItemById(HeroCfg, datas[i].itemId);
                if (heroCfg.group.indexOf(this.selectGroup) != -1) {
                    tempList.push(datas[i])
                }
            }
        }
        else {
            tempList = datas
        }

        //全职业
        if (this.selectCareer != 0) {
            //英雄职业数据
            let groupDatas = []
            for (let i = 0; i < tempList.length; i++) {
                //let careerCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", (<HeroInfo>tempList[i].extInfo).careerId)
                let type = Math.floor((<icmsg.HeroInfo>tempList[i].extInfo).soldierId / 100);
                if (type == this.selectCareer) {
                    groupDatas.push(tempList[i])
                }
            }
            tempList = groupDatas
        }


        tempList.sort(this.sortFunc1)
        let temList: BagItem[] = [];
        this.selectHeroInfos.forEach(info => {
            if (info) {
                let index = tempList.indexOf(info);
                if (index >= 0) {
                    let tem = tempList.splice(index, 1);
                    temList = temList.concat(tem);
                }
            }
        });
        temList.sort(this.sortFunc1)
        tempList = temList.concat(tempList);

        this.model.selectHeros = [];
        let scorllData = [];
        tempList.forEach(info => {
            this.model.selectHeros.push({
                data: info,
            })
            scorllData.push({ data: info, heros: this.selectHeros })
        })
        this.list.clear_items();
        this.list.set_data(scorllData)
    }

    _selectItem(data: any, index) {
        this.model.curHeroInfo = <icmsg.HeroInfo>data.data.extInfo;
        JumpUtils.openPanel({
            panelId: PanelId.RoleView2,
            currId: this.node
        })
    }

    openUpHeroSelect() {
        gdk.panel.open(PanelId.RoleSetUpHeroSelector)
    }

    copyCfg: Copy_towerlistCfg;
    curConnon: number = 0;  //上阵炮兵数
    curGuard: number = 0;   //上阵守卫数
    curGun: number = 0;     //上阵枪兵数
    selectHeros: number[] = []
    selectHeroInfos: BagItem[] = []
    selectHeroItemIds: number[] = []
    addCfgs: Copy_towerhaloCfg[] = [];
    lastAlive: boolean = false;
    _updataUpHeroInfo() {
        this.initUpHeroData();
        this._updateDataLater();
    }
    //排序方法
    sortFunc1(a: any, b: any) {
        let heroInfoA = <icmsg.HeroInfo>a.extInfo;
        let heroInfoB = <icmsg.HeroInfo>b.extInfo;
        if (heroInfoA.color == heroInfoB.color) {
            if (heroInfoA.star == heroInfoB.star) {
                if (heroInfoA.power == heroInfoB.power) {
                    return heroInfoB.level - heroInfoA.level;
                }
                else {
                    return heroInfoB.power - heroInfoA.power;
                }
            } else {
                return heroInfoB.star - heroInfoA.star;
            }
        } else {
            return heroInfoB.color - heroInfoA.color;
        }
    }
    //排序方法(星星>战力>id)
    sortFunc2(a: any, b: any) {
        let heroInfoA = <icmsg.HeroInfo>a.extInfo;
        let heroInfoB = <icmsg.HeroInfo>b.extInfo;
        if (heroInfoA.star == heroInfoB.star) {
            if (heroInfoA.power == heroInfoB.power) {
                return heroInfoA.typeId - heroInfoB.typeId;
            }
            else {
                return heroInfoB.power - heroInfoA.power;
            }
        }
        else {
            return heroInfoB.star - heroInfoA.star;
        }
    }
    initUpHeroData() {

        let datas = this.model.heroInfos.concat();
        datas.sort(this.sortFunc2)
        //let str = 'Role_setUpHero_pve'
        this.selectHeros = this.model.PveUpHeroList;//GlobalUtil.getLocal(str);

        for (let i = 0; i < 6; i++) {
            this.selectHeroInfos[i] = null;
            this.selectHeroItemIds[i] = -1;
        }
        let change = false
        if (!this.selectHeros || this.selectHeros.length == 0) {
            this.selectHeros = []
            for (let i = 0; i < 6; i++) {
                this.selectHeros[i] = 0;
            }
            this.selectHeros[0] = datas[0].series;
            change = true;
        } else {
            let have = false;
            this.selectHeros.forEach(heroId => {
                if (heroId > 0) {
                    have = true;
                }
            })
            if (!have) {
                this.selectHeros[0] = datas[0].series;
                change = true;
            }
        }
        datas.forEach(info => {
            let index = this.selectHeros.indexOf(info.series)
            if (index >= 0) {
                this.selectHeroInfos[index] = info;
                this.selectHeroItemIds[index] = info.itemId;
            }
        })
        let i = 0;

        this.selectHeroInfos.forEach(info => {
            if (info == null && this.selectHeros[i] > 0) {
                this.selectHeros[i] = 0;
                //GlobalUtil.setLocal('Role_setUpHero_pve', this.selectHeros);
                this.model.PveUpHeroList = this.selectHeros;
                change = true;
            }
            i++;
        })
        if (change) {
            let msg = new icmsg.BattleArraySetReq();
            msg.type = 1;
            msg.heroIds = this.selectHeros;
            NetManager.send(msg, (rsp: icmsg.BattleArraySetRsp) => {
                this.model.refreshCurHeroList(0, rsp.heroIds)
            }, this)
        }
        this.refreshTopInfo()
    }

    refreshTopInfo() {

        this.curGuard = 0;
        this.curConnon = 0
        this.curGun = 0;

        let list: cc.Node[] = this.upHeroList;
        let power = 0;
        for (let i = 0; i < list.length; i++) {
            let heroItem = list[i];
            let add = heroItem.getChildByName('add');
            let roleHeroItem = heroItem.getChildByName('RoleHeroItem');
            let lock = heroItem.getChildByName('lock');
            add.active = false;
            roleHeroItem.active = false;
            lock.active = false;
            if (i < this.copyCfg.num) {
                if (this.selectHeroInfos[i] == null) {
                    add.active = true;
                } else {
                    roleHeroItem.active = true;
                    let ctrl = roleHeroItem.getComponent(RoleHeroItemCtrl2);
                    ctrl.data = { data: this.selectHeroInfos[i], heros: this.selectHeroItemIds }
                    ctrl.updateView();
                    let tem = <icmsg.HeroInfo>this.selectHeroInfos[i].extInfo;
                    let type = Math.floor(tem.soldierId / 100)
                    switch (type) {
                        case 1:
                            this.curGun += 1;
                            break;
                        case 3:
                            this.curConnon += 1;
                            break;
                        case 4:
                            this.curGuard += 1;
                            break;
                    }
                    power += tem.power;
                }
            } else {
                let tem = ConfigManager.getItem(Copy_towerlistCfg, (item: Copy_towerlistCfg) => {
                    if (i < item.num) {
                        return true;
                    }
                    return false;
                })
                if (tem) {
                    let num = lock.getChildByName('openLabel').getComponent(cc.Label);
                    let stageCfg = ConfigManager.getItemById(Copy_stageCfg, tem.general_lv);
                    if (stageCfg) {
                        let tem = stageCfg.name.split(' ')
                        num.string = StringUtils.format(gdk.i18n.t("i18n:HEROTRIAL_SELECT_TIP2"), tem[0])//'通关' + tem[0] + '开放';
                    }
                }
                lock.active = true;
            }
        }

        this.upHeroPower.string = power + ''

        //刷新上阵的士兵类型个数  RoleSetUpHeroItemCtrl
        this.jiqiangNum.string = this.curGun + '/' + this.copyCfg.gun;
        this.jiqiangNum.node.color = this.curGun > 0 ? (this.curGun > this.copyCfg.gun ? cc.color('#FF2D2D') : cc.color('#F3FF26')) : cc.color('#B67F67');
        this.jiqiangline.color = this.curGun > 0 ? (this.curGun > this.copyCfg.gun ? cc.color('#27160A') : cc.color('#8A0300')) : cc.color('#27160A');
        this.paobingNum.string = this.curConnon + '/' + this.copyCfg.cannon;
        this.paobingNum.node.color = this.curConnon > 0 ? (this.curConnon > this.copyCfg.cannon ? cc.color('#FF2D2D') : cc.color('#F3FF26')) : cc.color('#B67F67');
        this.paobingline.color = this.curConnon > 0 ? (this.curConnon > this.copyCfg.cannon ? cc.color('#27160A') : cc.color('#8A0300')) : cc.color('#27160A');
        this.shouweiNum.string = this.curGuard + '/' + this.copyCfg.guard;
        this.shouweiNum.node.color = this.curGuard > 0 ? (this.curGuard > this.copyCfg.guard ? cc.color('#FF2D2D') : cc.color('#F3FF26')) : cc.color('#B67F67');
        this.shouweiline.color = this.curGuard > 0 ? (this.curGuard > this.copyCfg.guard ? cc.color('#27160A') : cc.color('#8A0300')) : cc.color('#27160A');

        //刷新阵营加成属性
        this.refreshGroupBuffInfo();
    }

    refreshGroupBuffInfo() {

        if (!JumpUtils.ifSysOpen(2853)) {
            let path1 = 'common/texture/role/select/yx_zhenying_1';
            GlobalUtil.setSpriteIcon(this.node, this.groupSp1, path1);
            this.groupSp2.node.active = false;
            let systemCfg = ConfigManager.getItemById(SystemCfg, 2853);
            if (systemCfg) {
                let stageCfg = ConfigManager.getItemById(Copy_stageCfg, systemCfg.fbId)
                this.lockNode.string = StringUtils.format(gdk.i18n.t("i18n:HEROTRIAL_SELECT_TIP1"), stageCfg.name.split(' ')[0])//'通关主线' + stageCfg.name.split(' ')[0] + '解锁';
            }
            this.lockNode.node.active = true;
            this.addItemsNode.active = false;
            return;
        }
        this.addItemsNode.active = true;
        this.lockNode.node.active = false;

        let a = {};
        this.addCfgs = [];
        this.lastAlive = false;
        this.groupBgData = []
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
                let cfg = ConfigManager.getItem(Copy_towerhaloCfg, (cfg: Copy_towerhaloCfg) => {
                    if (cfg.group.indexOf(type) >= 0 && a[type] == cfg.num) {
                        return true
                    }
                    return false;
                })
                if (cfg) {
                    addCfgs.push(cfg);
                }
            })
        }

        this.addCfgs = addCfgs;
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

        let name = []
        let num = [];
        this.addCfgs.forEach(cfg => {
            let addStrs = cfg.des.split(';')
            addStrs.forEach(str => {
                let tem = str.split('-');
                if (tem[0] != '') {
                    let index = name.indexOf(tem[0])
                    if (index < 0) {
                        name.push(tem[0])
                        num.push(parseInt(tem[1]))
                    } else {
                        num[index] += parseInt(tem[1])
                    }
                }
            })
        })
        let index = 0;
        let colorList2: cc.Color[] = [cc.color('#BF9973'), cc.color('#5DFF05')]
        this.addBuffList.forEach(item => {
            item.active = index < name.length;
            let nameLb = item.getChildByName('name').getComponent(cc.Label);
            let numLb = item.getChildByName('num').getComponent(cc.Label);
            nameLb.string = name[index] + ':'
            numLb.string = '+' + num[index] + '%';
            numLb.node.color = colorList2[1]
            if (index == 2 && !item.active && name.length > 0) {
                let cfg = ConfigManager.getItem(Copy_towerhaloCfg, (cfg: Copy_towerhaloCfg) => {
                    if (cfg.group.indexOf(maxType) >= 0 && cfg.num == 4) {
                        return true
                    }
                    return false;
                })
                if (cfg) {
                    item.active = true;
                    let addStrs = cfg.des.split(';')
                    let strs = addStrs[0].split('-');
                    nameLb.string = strs[0] + ':'
                    numLb.string = '+' + strs[1] + '%';
                    numLb.node.color = colorList2[0]
                }
            }
            index++;
        })

    }

    openHaloView() {
        if (!JumpUtils.ifSysOpen(2853)) {
            let systemCfg = ConfigManager.getItemById(SystemCfg, 2853);
            if (systemCfg) {
                let stageCfg = ConfigManager.getItemById(Copy_stageCfg, systemCfg.fbId)
                let str = StringUtils.format(gdk.i18n.t("i18n:HEROTRIAL_SELECT_TIP1"), stageCfg.name.split(' ')[0])//'通关主线' + stageCfg.name.split(' ')[0] + '解锁';
                gdk.gui.showMessage(str)
            }
            return;
        }
        gdk.panel.setArgs(PanelId.RoleUpHeroHaloView, this.selectHeroItemIds)
        gdk.panel.open(PanelId.RoleUpHeroHaloView);
    }

    /**图鉴 */
    heroBookFunc() {
        // gdk.panel.setArgs(PanelId.Lottery, [this.curSelect - 1]);
        JumpUtils.openPanel({
            panelId: PanelId.HeroBook,
            currId: this.node,
        });
    }

    /**跳转购买金币 */
    buyGoldFunc() {
        if (!JumpUtils.ifSysOpen(2830, true)) {
            return
        }
        gdk.panel.open(PanelId.Alchemy)
    }
}
