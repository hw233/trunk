import {
    GlobalCfg, HeroCfg, Hero_crystalCfg, ItemCfg
} from '../../../a/config';
import ConfigManager from '../../../common/managers/ConfigManager';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import HeroModel from '../../../common/models/HeroModel';
import RoleModel from '../../../common/models/RoleModel';
import BagUtils from '../../../common/utils/BagUtils';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import HeroUtils from '../../../common/utils/HeroUtils';
import StringUtils from '../../../common/utils/StringUtils';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';
import PanelId from '../../../configs/ids/PanelId';
import PveHeroChatItemCtrl from '../../pve/ctrl/view/PveHeroChatItemCtrl';
import { ResonatingEventId } from '../enum/ResonatingEventId';
import ResonatingModel from '../model/ResonatingModel';

/** 
 * @Description: 永恒水晶View
 * @Author: yaozu.hu
 * @Date: 2020-12-23 10:28:06
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-04-29 21:39:38
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
//@menu("qszc/scene/pve/PveSceneCtrl")
export default class ResonatingViewCtrl extends gdk.BasePanel {

    @property(cc.Label)
    crystalLv: cc.Label = null;

    @property([cc.Node])
    HeroState1List: cc.Node[] = []
    @property([cc.Node])
    HeroState2List: cc.Node[] = []
    @property([sp.Skeleton])
    HeroSpineList: sp.Skeleton[] = []
    @property([cc.Label])
    HeroLevelList: cc.Label[] = []

    @property(cc.Label)
    lockNum: cc.Label = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;
    @property(cc.Node)
    content: cc.Node = null;
    @property(cc.Prefab)
    heroItemPre: cc.Prefab = null;


    @property(cc.Button)
    careerBtns: cc.Button[] = []

    @property(cc.Button)
    groupBtns: cc.Button[] = []

    @property(cc.Node)
    contentCareer: cc.Node = null

    @property(cc.Node)
    btnUp: cc.Node = null

    @property(cc.Label)
    curOpneNum: cc.Label = null;
    @property(cc.Label)
    curItemNum: cc.Label = null;
    @property(cc.Label)
    curItemNum2: cc.Label = null; //流金
    @property(cc.Prefab)
    heroChatPrefab: cc.Prefab = null;

    lvColors: cc.Color[] = [cc.color('#FFFFFF'), cc.color('#43FDFF')]

    list: ListView = null
    selectGroup: number = 0     // 筛选阵营
    selectCareer: number = 0    //筛选职业
    isShowCareer: boolean = false

    canOpenNum: number = 0; //当前可解锁的下标
    get model() { return ModelManager.get(ResonatingModel); }
    get heroModel(): HeroModel { return ModelManager.get(HeroModel); }

    allNum: number = 0;
    onEnable() {
        let msg = new icmsg.ResonatingStateReq()
        NetManager.send(msg);
        gdk.e.on(ResonatingEventId.RESONATINGSTATE_UPDATA, () => {
            this.initHeroUpperData()
            this.selectGroupFunc(null, 0);
            this.selectCareerFunc(null, 0);
            this.updateContentState();
        }, this)
        gdk.e.on(ResonatingEventId.RESONATING_DATA_UPDATA, this._updateDataLater, this)

        //this.crystalLv.string = 
    }

    onDisable() {
        NetManager.targetOff(this)
        gdk.Timer.clearAll(this);
        gdk.e.targetOff(this);
        if (this.list) {
            this.list.destroy();
            this.list = null;
        }
    }

    initHeroUpperData() {
        //this.model.Upper.
        for (let i = 0; i < this.HeroSpineList.length; i++) {
            if (i < this.model.UpperHeroInfo.length) {
                let temHeroInfo = this.model.UpperHeroInfo[i];
                this.HeroState1List[i].active = false;
                this.HeroState2List[i].active = true;
                this.HeroLevelList[i].string = 'Lv.' + temHeroInfo.level
                let color = i == this.model.UpperHeroInfo.length - 1 ? this.lvColors[1] : this.lvColors[0];
                this.HeroLevelList[i].node.color = color;
                let url = HeroUtils.getHeroSkin(temHeroInfo.typeId, temHeroInfo.star)
                let path = `spine/hero/${url}/1/${url}`
                GlobalUtil.setSpineData(this.node, this.HeroSpineList[i], path, true, 'stand', true);

            } else {
                this.HeroState1List[i].active = true;
                this.HeroState2List[i].active = false;
            }
        }
        this.crystalLv.string = 'Lv.' + this.model.minLevel
    }

    btnClickList: number[] = []
    spineBtnClick(e: Event, index: string) {

        let temIndex = parseInt(index);
        if (this.btnClickList.indexOf(temIndex) >= 0) {
            return;
        }
        this.btnClickList.push(temIndex);
        let temSpine = this.HeroSpineList[temIndex]
        temSpine.setAnimation(0, "idle", false)
        temSpine.setCompleteListener((trackEntry, loopCount) => {
            let name = trackEntry.animation ? trackEntry.animation.name : '';
            if (name === "idle") {
                let tem = this.btnClickList.indexOf(temIndex);
                tem >= 0 ? this.btnClickList.splice(tem, 1) : 0;
                temSpine.setAnimation(0, "stand", true);
            }
        })
        let cfg = ConfigManager.getItemById(Hero_crystalCfg, 1);
        let texts = cfg.bubbles//['测试11111111111111111111', '测试222222222222222222']//cfg.bubbling.split(',');
        let text = texts[Math.floor(Math.random() * texts.length)];
        let heroChatNode = cc.instantiate(this.heroChatPrefab);
        let ctrl = heroChatNode.getComponent(PveHeroChatItemCtrl);
        let parentNode = this.HeroState2List[temIndex]
        ctrl.scaleNum = 1 / parentNode.parent.scaleX;
        ctrl.hide();

        heroChatNode.parent = parentNode
        ctrl.showTime = 2000;
        heroChatNode.setPosition(30, 120);
        ctrl.updateText(text[0]);
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


    lowerAllNum: number = 0;
    lowerCurNum: number = 0;
    _updateScroll() {
        this._initListView()

        //let datas2 = this.heroModel.heroInfos.concat();

        let datas1 = this.model.Lower.concat();
        this.lowerAllNum = datas1.length;
        let tempList: any[] = [];
        for (let i = 0; i < datas1.length; i++) {
            let tem: icmsg.ResonatingGrid = datas1[i]
            let temHeroInfo = HeroUtils.getHeroInfoByHeroId(tem.heroId)
            let heroCfg = temHeroInfo ? ConfigManager.getItemById(HeroCfg, temHeroInfo.typeId) : null;;
            let state = 1;
            if (tem.heroId > 0) {
                state = 2;
            } else if (tem.offTime > 0) {
                let addTime = ConfigManager.getItemByField(GlobalCfg, 'key', 'crystal_cd').value[0]
                let curTime = Math.floor(GlobalUtil.getServerTime() / 1000);
                if (curTime < tem.offTime + addTime) {
                    state = 3;
                }
            }
            let temData = { heroInfo: temHeroInfo, state: state, index: i, offTime: tem.offTime, herolv: tem.heroLv0, newherolv: tem.heroLv }
            if (this.selectGroup != 0) {
                if (tem.heroId == 0 || heroCfg.group.indexOf(this.selectGroup) != -1) {
                    tempList.push(temData)
                }
            } else {
                tempList.push(temData)
            }
        }
        //全职业
        if (this.selectCareer != 0) {
            //英雄职业数据
            let groupDatas = []
            for (let i = 0; i < tempList.length; i++) {
                //let careerCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", (<HeroInfo>tempList[i].extInfo).careerId)
                let type = Math.floor(tempList[i].heroInfo.soldierId / 100);
                if (type == this.selectCareer) {
                    groupDatas.push(tempList[i])
                }
            }
            tempList = groupDatas
        }
        let cfgs = ConfigManager.getItems(Hero_crystalCfg);
        this.allNum = cfgs.length;
        let lockNum = cfgs.length - datas1.length;
        this.curOpneNum.string = datas1.length + '/' + this.allNum
        this.curItemNum.string = BagUtils.getItemNumById(110012) + '';
        let item2Num = BagUtils.getItemNumById(15)
        this.curItemNum2.string = GlobalUtil.numberToStr(item2Num, true);
        let lockData: any[] = [];
        for (let i = 0; i < lockNum; i++) {
            let state = i == 0 ? 4 : 5;
            let index = datas1.length + i
            let temData = { heroInfo: null, state: state, index: index, offTime: 0, herolv: 0, newherolv: 0 }
            lockData.push(temData);
        }
        let scorllData: any[] = tempList.concat(lockData);
        this.lowerCurNum = scorllData.length;
        this.list.clear_items();
        this.list.set_data(scorllData)
    }


    _initListView() {
        if (this.list) {
            return
        }
        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.heroItemPre,
            cb_host: this,
            column: 5,
            gap_x: 5,
            gap_y: 10,
            async: true,
            resize_cb: this._updateDataLater,
            direction: ListViewDir.Vertical,
        })
        this.list.onClick.on(this._selectItem, this);
    }

    _updateDataLater() {
        gdk.Timer.callLater(this, this._updateScroll)
    }

    _selectItem(data: any, index) {
        // this.model.curHeroInfo = <icmsg.HeroInfo>data.data.extInfo;
        // JumpUtils.openPanel({
        //     panelId: PanelId.RoleView2,
        //     currId: this.node
        // })
        let heroInfo = data.heroInfo
        let state = data.state;
        //state:1可上阵英雄 2已上阵英雄 3冷却中 4可解锁 5不能解锁
        switch (state) {
            case 1:
                gdk.panel.setArgs(PanelId.ResonatingSelectView, index);
                gdk.panel.open(PanelId.ResonatingSelectView);
                break;
            case 2:
                gdk.panel.setArgs(PanelId.ResonatingDownHeroView, data);
                gdk.panel.open(PanelId.ResonatingDownHeroView);
                break;
            case 3:
                let value = ConfigManager.getItemByField(GlobalCfg, 'key', 'crystal_cd_consumption').value
                let num = BagUtils.getItemNumById(value[0])
                let itemCfg = ConfigManager.getItemById(ItemCfg, value[0])
                let needNum = value[1]
                let descStr1 = StringUtils.format(gdk.i18n.t("i18n:RESONATING_TIP2"), needNum, itemCfg.name)//`是否消耗${needNum}${itemCfg.name}刷新冷却时间？`
                GlobalUtil.openAskPanel({
                    title: gdk.i18n.t("i18n:TIP_TITLE"),
                    descText: descStr1,
                    thisArg: this,
                    sureText: gdk.i18n.t("i18n:OK"),
                    sureCb: () => {
                        if (num >= needNum) {
                            let msg = new icmsg.ResonatingClearCDReq();
                            msg.gridId = data.index;
                            NetManager.send(msg, (rsp: icmsg.ResonatingClearCDRsp) => {
                                this.model.Lower[rsp.gridId].offTime = 0;
                                this._updateDataLater()
                            }, this);
                        } else {
                            gdk.gui.showMessage(StringUtils.format(gdk.i18n.t("i18n:RESONATING_TIP5"), itemCfg.name))
                        }
                    },
                });

                break;
            case 4:
                let roleModel = ModelManager.get(RoleModel)
                roleModel.level
                let cfg = ConfigManager.getItemById(Hero_crystalCfg, index + 1);
                if (cfg) {
                    if (roleModel.level >= cfg.level) {
                        let num = BagUtils.getItemNumById(cfg.consume[0][0])
                        let itemCfg = ConfigManager.getItemById(ItemCfg, cfg.consume[0][0])
                        let needNum = cfg.consume[0][1]

                        let tem = num >= needNum ? gdk.i18n.t("i18n:RESONATING_TIP4") : gdk.i18n.t("i18n:RESONATING_TIP10")
                        let descStr2 = StringUtils.format(tem, needNum, itemCfg.name)//`是否消耗${needNum}${itemCfg.name}解锁槽位？`
                        GlobalUtil.openAskPanel({
                            title: gdk.i18n.t("i18n:TIP_TITLE"),
                            descText: descStr2,
                            thisArg: this,
                            sureText: gdk.i18n.t("i18n:OK"),
                            sureCb: () => {
                                if (num >= needNum) {
                                    let msg = new icmsg.ResonatingUnlockReq();
                                    NetManager.send(msg, (rsp: icmsg.ResonatingUnlockRsp) => {
                                        let temData = new icmsg.ResonatingGrid()
                                        temData.heroId = 0
                                        temData.heroLv = 0
                                        temData.heroLv0 = 0
                                        temData.offTime = 0
                                        this.model.Lower[rsp.gridId] = temData;
                                        this._updateDataLater()
                                    }, this);
                                } else {
                                    //弹出道具获取界面
                                    GlobalUtil.openGainWayTips(itemCfg.id)
                                }
                            },
                        });
                        // if (num >= needNum) {

                        // } else {
                        //     gdk.gui.showMessage(StringUtils.format(gdk.i18n.t("i18n:RESONATING_TIP5"), itemCfg.name))//(itemCfg.name + "不足,无法解锁")
                        // }

                    } else {
                        gdk.gui.showMessage(StringUtils.format(gdk.i18n.t("i18n:RESONATING_TIP6"), cfg.level))//(`指挥官等级达到${cfg.level}级解锁`)
                    }
                } else {
                    //cc.log('当前槽位数据有问题，请检查')
                }
                break;
            case 5:
                gdk.gui.showMessage(gdk.i18n.t("i18n:RESONATING_TIP3"))
                break;
        }
    }

    /**跳转购买道具 */
    buyGoldFunc() {

        gdk.panel.open(PanelId.PveReady);
    }

    //钻石解锁
    zuanshiOpenBtn() {
        let curNum = this.model.Lower.length;
        if (curNum == this.allNum) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:RESONATING_TIP7"))//("槽位已经全部解锁了")
            return;
        }
        let roleModel = ModelManager.get(RoleModel)
        let cfg = ConfigManager.getItemById(Hero_crystalCfg, this.model.Lower.length + 1);
        if (cfg) {
            if (roleModel.level >= cfg.level) {
                let item1 = cfg.deduction[0]
                let item2 = cfg.deduction[1]
                let num1 = BagUtils.getItemNumById(item1[0])
                let itemCfg1 = ConfigManager.getItemById(ItemCfg, item1[0])
                let needNum1 = item1[1]
                let num2 = BagUtils.getItemNumById(item2[0])
                let itemCfg2 = ConfigManager.getItemById(ItemCfg, item2[0])
                let needNum2 = item2[1]
                //
                let descStr2 = '';
                let canSend = false;
                let str1 = GlobalUtil.numberToStr(needNum1, true);
                let str2 = GlobalUtil.numberToStr(needNum2, true);
                if (num1 >= needNum1 && num2 >= needNum2) {
                    canSend = true;
                    descStr2 = StringUtils.format(gdk.i18n.t("i18n:RESONATING_TIP8"), str1, itemCfg1.name, str2, itemCfg2.name)
                } else if (num1 < needNum1 && num2 >= needNum2) {
                    descStr2 = StringUtils.format(gdk.i18n.t("i18n:RESONATING_TIP11"), str1, itemCfg1.name, str2, itemCfg2.name)
                } else if (num1 >= needNum1 && num2 < needNum2) {
                    descStr2 = StringUtils.format(gdk.i18n.t("i18n:RESONATING_TIP12"), str1, itemCfg1.name, str2, itemCfg2.name)
                } else {
                    descStr2 = StringUtils.format(gdk.i18n.t("i18n:RESONATING_TIP13"), str1, itemCfg1.name, str2, itemCfg2.name)
                }
                //let descStr2 = StringUtils.format(gdk.i18n.t("i18n:RESONATING_TIP8"), needNum1, itemCfg1.name, needNum2, itemCfg2.name)//`是否消耗${needNum1}${itemCfg1.name},${needNum2}${itemCfg2.name}解锁槽位？`
                GlobalUtil.openAskPanel({
                    title: gdk.i18n.t("i18n:TIP_TITLE"),
                    descText: descStr2,
                    thisArg: this,
                    sureText: gdk.i18n.t("i18n:OK"),
                    sureCb: () => {
                        if (canSend) {
                            let msg = new icmsg.ResonatingUnlockReq();
                            NetManager.send(msg, (rsp: icmsg.ResonatingUnlockRsp) => {
                                let temData = new icmsg.ResonatingGrid()
                                temData.heroId = 0
                                temData.heroLv = 0
                                temData.offTime = 0
                                temData.heroLv0 = 0
                                this.model.Lower[rsp.gridId] = temData;
                                this._updateDataLater()
                            }, this);
                        } else {
                            if (num1 < needNum1) {
                                gdk.gui.showMessage(StringUtils.format(gdk.i18n.t("i18n:RESONATING_TIP5"), itemCfg1.name))//(itemCfg1.name + "不足,无法解锁")
                            } else if (num2 < needNum2) {
                                gdk.gui.showMessage(StringUtils.format(gdk.i18n.t("i18n:RESONATING_TIP5"), itemCfg2.name))//(itemCfg2.name + "不足,无法解锁")
                            }
                        }

                    },
                });

                // if (num1 >= needNum1 && num2 >= needNum2) {
                //     let descStr2 = StringUtils.format(gdk.i18n.t("i18n:RESONATING_TIP8"), needNum1, itemCfg1.name, needNum2, itemCfg2.name)//`是否消耗${needNum1}${itemCfg1.name},${needNum2}${itemCfg2.name}解锁槽位？`
                //     GlobalUtil.openAskPanel({
                //         title: gdk.i18n.t("i18n:TIP_TITLE"),
                //         descText: descStr2,
                //         thisArg: this,
                //         sureText: gdk.i18n.t("i18n:OK"),
                //         sureCb: () => {
                //             let msg = new icmsg.ResonatingUnlockReq();
                //             NetManager.send(msg, (rsp: icmsg.ResonatingUnlockRsp) => {
                //                 let temData = new icmsg.ResonatingGrid()
                //                 temData.heroId = 0
                //                 temData.heroLv = 0
                //                 temData.offTime = 0
                //                 temData.heroLv0 = 0
                //                 this.model.Lower[rsp.gridId] = temData;
                //                 this._updateDataLater()
                //             }, this);
                //         },
                //     });
                // } else {
                // if (num1 < needNum1) {
                //     gdk.gui.showMessage(StringUtils.format(gdk.i18n.t("i18n:RESONATING_TIP5"), itemCfg1.name))//(itemCfg1.name + "不足,无法解锁")
                // } else if (num2 < needNum2) {
                //     gdk.gui.showMessage(StringUtils.format(gdk.i18n.t("i18n:RESONATING_TIP5"), itemCfg2.name))//(itemCfg2.name + "不足,无法解锁")
                // }
                // }

            } else {
                gdk.gui.showMessage(StringUtils.format(gdk.i18n.t("i18n:RESONATING_TIP6"), cfg.level))
            }
        }
    }

    sortFunc1(a: any, b: any) {
        let heroInfoA = <icmsg.HeroInfo>a.extInfo;
        let heroInfoB = <icmsg.HeroInfo>b.extInfo;
        if (heroInfoA.level == heroInfoB.level) {
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
        } else {
            return heroInfoB.level - heroInfoA.level;
        }

    }

}
