import {
    Copy_stageCfg,
    Copy_towerhaloCfg,
    Copy_towerlistCfg,
    GlobalCfg,
    HeroCfg,
    Royal_sceneCfg,
    SystemCfg
} from '../../../../a/config';
import ConfigManager from '../../../../common/managers/ConfigManager';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import ArenaModel from '../../../../common/models/ArenaModel';
import { BagItem } from '../../../../common/models/BagModel';
import CopyModel from '../../../../common/models/CopyModel';
import HeroModel from '../../../../common/models/HeroModel';
import RoleModel from '../../../../common/models/RoleModel';
import RoyalModel from '../../../../common/models/RoyalModel';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import GuideUtil from '../../../../common/utils/GuideUtil';
import HeroUtils from '../../../../common/utils/HeroUtils';
import JumpUtils from '../../../../common/utils/JumpUtils';
import { RedPointEvent } from '../../../../common/utils/RedPointUtils';
import StringUtils from '../../../../common/utils/StringUtils';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';
import UiTabMenuCtrl from '../../../../common/widgets/UiTabMenuCtrl';
import PanelId from '../../../../configs/ids/PanelId';
import ActUtil from '../../../act/util/ActUtil';
import PveSceneCtrl from '../../../pve/ctrl/PveSceneCtrl';
import PvpDefenderCtrl from '../../../pve/ctrl/PvpDefenderCtrl';
import PveFsmEventId from '../../../pve/enum/PveFsmEventId';
import { ResonatingEventId } from '../../../resonating/enum/ResonatingEventId';
import { RoleEventId } from '../../enum/RoleEventId';
import HeroLockTipsCtrl from '../main/common/HeroLockTipsCtrl';
import RoleHeroItemCtrl2 from './RoleHeroItemCtrl2';

/** 
 * @Description: 角色英雄面板-选择面板
 * @Author:yaozu.hu  
 * @Date: 2019-03-28 17:21:18 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-08-26 22:29:45
 */

const { ccclass, property, menu } = cc._decorator;


@ccclass
@menu("qszc/view/role2/selector/RoleSetUpHeroSelectorCtrl")
export default class RoleSetUpHeroSelectorCtrl extends gdk.BasePanel {

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

    @property(cc.Node)
    upHero1Node: cc.Node = null;
    @property([cc.Node])
    upHero1List: cc.Node[] = []

    // @property([cc.Node])
    // groupBg: cc.Node[] = []
    // @property(cc.Prefab)
    // groupNumPre: cc.Prefab = null;
    // @property(cc.Node)
    // groupNumNode: cc.Node = null;

    @property(cc.Node)
    infoBg: cc.Node = null;

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

    @property(UiTabMenuCtrl)
    menuCtrl: UiTabMenuCtrl = null;

    @property(cc.Prefab)
    effectPre: cc.Prefab = null;

    @property(cc.Node)
    effectNode: cc.Node = null;

    @property(cc.Node)
    recommendNode: cc.Node = null;

    @property(cc.Sprite)
    groupSp1: cc.Sprite = null;
    @property(cc.Sprite)
    groupSp2: cc.Sprite = null;
    @property(cc.Label)
    lockNode: cc.Label = null;
    @property(cc.Node)
    addItemsNode: cc.Node = null;


    //防御阵营设置
    @property(cc.Node)
    leftNode: cc.Node = null;
    @property(cc.Label)
    leftName: cc.Label = null;
    @property(cc.Node)
    rightNode: cc.Node = null;
    @property(cc.Label)
    rightName: cc.Label = null;
    @property(cc.Node)
    curNode: cc.Node = null;
    @property(cc.Label)
    curName: cc.Label = null;
    @property(cc.Node)
    defendNode: cc.Node = null;
    @property(cc.Node)
    tabUpNode: cc.Node = null;
    @property(cc.Node)
    btnNode: cc.Node = null;
    @property(cc.Node)
    changeDefendBtn: cc.Node = null;


    //--------------------------皇家竞技场-----------------------
    @property(cc.Node)
    royalNode: cc.Node = null;
    @property(cc.Node)
    midNode: cc.Node = null;
    @property(cc.Node)
    upTipNode: cc.Node = null;

    @property(cc.Node)
    mapNode: cc.Node = null;
    @property([cc.Node])
    royalUpHero1List: cc.Node[] = []

    @property([cc.Node])
    selectNodeList: cc.Node[] = []
    @property([cc.Sprite])
    mapSpriteList: cc.Sprite[] = []
    @property([cc.Node])
    defendBtnList: cc.Node[] = []

    @property([cc.Node])
    Btn2List: cc.Node[] = []

    @property(cc.Node)
    searchBtn: cc.Node = null;



    list: ListView = null
    selectGroup: number = 0     // 筛选阵营
    selectCareer: number = 0    //筛选职业
    isShowCareer: boolean = false
    get model(): HeroModel { return ModelManager.get(HeroModel); }
    get roleModel(): RoleModel { return ModelManager.get(RoleModel); }
    get copyModel(): CopyModel { return ModelManager.get(CopyModel); }
    get arenaModel(): ArenaModel { return ModelManager.get(ArenaModel); }
    get royalModel(): RoyalModel { return ModelManager.get(RoyalModel); }
    curIndex: number = -1;

    copyCfg: Copy_towerlistCfg;
    curConnon: number = 0;  //上阵炮兵数
    curGuard: number = 0;   //上阵守卫数
    curGun: number = 0;     //上阵枪兵数
    tempList: BagItem[] = []; //所有英雄的临时数据(区分后的)
    datas: BagItem[] = []; //所有英雄的临时数据
    selectHeros: number[] = []
    selectHeroInfos: BagItem[] = []
    selectHeroItemIds: number[] = []

    addCfgs: Copy_towerhaloCfg[] = [];
    lastAlive: boolean = false;
    groupBgData: number[][] = []
    groupBgNames: string[] = ['yx_zhengyingsekuai', 'yx_zhengyingsekuai2', 'yx_zhengyingsekuai3', 'yx_zhengyingsekuai4', 'yx_zhengyingsekuai5', 'yx_zhengyingsekuai6']

    effectNames: string[] = ['UI_yingxiongxuanzelv', 'UI_yingxiongxuanzelan', 'UI_yingxiongxuanzezi', 'UI_yingxiongxuanzejin', 'UI_yingxiongxuanzehong']
    effectPos1: cc.Vec2[] = [cc.v2(-264, -146), cc.v2(-157, -146), cc.v2(-52, -146), cc.v2(52, -146), cc.v2(157, -146), cc.v2(264, -146)]
    effectPos2: cc.Vec2[] = [cc.v2(-264, -106), cc.v2(-157, -106), cc.v2(-52, -106), cc.v2(52, -106), cc.v2(157, -106), cc.v2(264, -106), cc.v2(-264, -186), cc.v2(-157, -186), cc.v2(-52, -186)]
    endPos: cc.Vec2 = cc.v2(0, 20);
    //当前上阵的位置
    upHeroIndex: number = -1;


    defenderStr: string[] = ['竞技场', '据点战', '战争遗迹', '锦标赛', '组队竞技场', '皇家竞技场'];
    defenderType: number[] = [1, 2, 3, 4, 5, 8];
    defenderOpenSys: number[] = [901, 2401, 2861, 2856, 2877, 2954];

    atkStr: string[] = ["六人阵容", "九人阵容", "皇家竞技场"]
    atkType: number[] = [0, 7, 8]
    atkOpenSys: number[] = [2950]


    defenderTemStr: any[] = ['ARENA', 'FOOTHOLD', 'RELIC', 'CHAMPION_MATCH', 'ARENATEAM', '', '', 'ROYAL'];

    //功能开启，但未开放
    grayType: number[] = []
    //当前防御类型下标
    curDefendIndex: number = 0;

    //当前进攻阵型下标
    curAtkIndex: number = 0

    //--------------------------皇家竞技场-----------------------
    curSelectNum = 0; //当前选择的梯队
    enterStage: boolean = false;
    curStageNum: number = 0;

    initDefenderData() {
        let temDefenderStr: string[] = ['竞技场', '据点战', '战争遗迹', '锦标赛', '组队竞技场', '皇家竞技场'];
        let temDefenderType: number[] = [1, 2, 3, 4, 5, 8];
        let openStr = [];
        let openType = [];
        let grayStr = [];
        //let grayType = [];
        this.grayType = []
        this.defenderOpenSys.forEach((sysId, idx) => {
            if (JumpUtils.ifSysOpen(sysId)) {
                openStr.push(temDefenderStr[idx]);
                openType.push(temDefenderType[idx])
            } else {
                let cfg = ConfigManager.getItemById(SystemCfg, sysId);
                if (this.roleModel.level >= cfg.openLv) {
                    //添加判断 后端的数据都是0时屏蔽页签
                    let temType = temDefenderType[idx]
                    let temHeroList = this.model.curUpHeroList(temType);
                    let have = false;
                    temHeroList.forEach(heroId => {
                        if (heroId > 0) {
                            have = true;
                        }
                    })
                    if (have) {
                        grayStr.push(temDefenderStr[idx]);
                        this.grayType.push(temDefenderType[idx])
                    }
                }
            }
        })

        this.defenderStr = openStr.concat(grayStr);
        this.defenderType = openType.concat(this.grayType);
    }

    initAtkData() {
        let openStr = ["六人阵容"];
        let openType = [0];
        if (JumpUtils.ifSysOpen(2950)) {
            openStr.push("九人阵容");
            openType.push(7)
        }
        if (JumpUtils.ifSysOpen(2954)) {
            openStr.push("皇家竞技场");
            openType.push(8)
        }
        this.atkStr = openStr
        this.atkType = openType
    }

    onEnable() {

        this.initDefenderData();
        this.initAtkData()



        this.upHeroIndex = -1;
        let tems = ConfigManager.getItems(Copy_towerlistCfg, (item: Copy_towerlistCfg) => {
            if (item.general_lv <= this.copyModel.lastCompleteStageId) {
                return true;
            }
            return false
        })
        this.copyCfg = tems[tems.length - 1];
        this.datas = this.model.heroInfos.concat();
        this.datas.sort(this.sortFunc1)
        gdk.e.on(RoleEventId.UPDATE_HERO_LIST, this._updateScroll, this);
        gdk.e.on(RoleEventId.REMOVE_ONE_HERO, this._updateScroll, this);
        gdk.e.on(RoleEventId.UPDATE_ONE_HERO, this._updateScroll, this);
        gdk.e.on(ResonatingEventId.ASSIST_ALLIANCE_INFO_PUSH, this._updateScroll, this);
        this.selectGroupFunc(null, 0)
        this.selectCareerFunc(null, 0)
        this.updateContentState()
        let args = this.args;
        let index = args && args.length > 0 ? args[0] : 0;

        if (index == 1 && args.length > 1) {
            let index = this.defenderType.indexOf(args[1]);
            this.curDefendIndex = index;
        } else {
            if (index == 0 && args.length > 1) {
                let index = this.atkType.indexOf(args[1]);
                this.curAtkIndex = index
            }
        }
        this.showState();
        this.menuCtrl.setSelectIdx(index);

    }

    onDisable() {
        gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE)
        gdk.Timer.clearAll(this)
        gdk.e.targetOff(this);
        if (this.list) {
            this.list.destroy();
            this.list = null;
        }
    }

    close() {
        let model = ModelManager.get(HeroModel);
        let infos = model.heroInfos;
        let upList = model.curUpHeroList(0);
        let list = [];
        infos.sort((a, b) => { return (<icmsg.HeroInfo>b.extInfo).star - (<icmsg.HeroInfo>a.extInfo).star; })
        infos.forEach(info => {
            let heroInfo = <icmsg.HeroInfo>info.extInfo;
            if (upList.indexOf(heroInfo.heroId) == -1) {
                if (heroInfo.level > 1 || heroInfo.careerLv > 1) {
                    list.push(heroInfo.heroId);
                }
            }
        });
        if (list.length > 0 && this.curIndex == 0) {
            let limitLv = ConfigManager.getItemByField(GlobalCfg, 'key', 'quick_reset_level').value[0];
            if (ModelManager.get(RoleModel).level < limitLv) {
                gdk.panel.setArgs(PanelId.HeroAllResetView, list);
                gdk.panel.open(PanelId.HeroAllResetView);
            }
        }
        super.close();
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
            gap_x: 35,
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

        this.tempList = [];
        if (this.selectGroup != 0) {
            //英雄阵营数据
            for (let i = 0; i < this.datas.length; i++) {
                let heroCfg = ConfigManager.getItemById(HeroCfg, this.datas[i].itemId);
                if (heroCfg.group.indexOf(this.selectGroup) != -1) {
                    this.tempList.push(this.datas[i])
                }
            }
        }
        else {
            this.tempList = this.datas
        }

        //全职业
        if (this.selectCareer != 0) {
            //英雄职业数据
            let groupDatas = []
            for (let i = 0; i < this.tempList.length; i++) {
                //let careerCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", (<HeroInfo>this.tempList[i].extInfo).careerId)
                let type = Math.floor((<icmsg.HeroInfo>this.tempList[i].extInfo).soldierId / 100);
                if (type == this.selectCareer) {
                    groupDatas.push(this.tempList[i])
                }
            }
            this.tempList = groupDatas
        }

        this.list.clear_items();
        let scollData = []
        this.model.selectHeros = [];
        this.tempList.forEach(info => {
            this.model.selectHeros.push({
                data: info,
            })
            let index = this.selectHeros.indexOf(info.series);
            let idx = this.selectHeroItemIds.indexOf(info.itemId);
            let isSelect = idx >= 0;
            let isHero = index >= 0;
            let royalNum = this.isRoyal ? this.curIndex + 1 : 0;
            scollData.push({ data: info, isSelect: isSelect, isHero: isHero, royalNum: royalNum })
        })
        this.list.set_data(scollData);

    }

    initUpHeroData() {

        //let str = this.getLocalStr(this.curIndex)
        // let type = this.curIndex == 0 ? this.curIndex : this.defenderType[this.curDefendIndex]
        let type = this.curIndex == 0 ? this.atkType[this.curAtkIndex] : this.defenderType[this.curDefendIndex]
        this.selectHeros = this.model.curUpHeroList(type)//GlobalUtil.getLocal(str);
        if (this.curIndex == 0 && this.atkType[this.curAtkIndex] == 8) {
            let str = this.getLocalStr(this.curIndex);
            let tem = GlobalUtil.getLocal(str);
            if (tem) {
                this.selectHeros = tem
                if (tem.length < 9) {
                    for (let i = tem.length; i < 9; i++) {
                        this.selectHeros[i] = 0;
                    }
                }
            } else {
                this.selectHeros = null;
            }
        }
        if (this.curIndex == 0) {
            if (this.curAtkIndex == 1) {
                let cfgs = ConfigManager.getItems(Copy_towerlistCfg)
                this.copyCfg = cfgs[cfgs.length - 1]
            } else {
                let tems = ConfigManager.getItems(Copy_towerlistCfg, (item: Copy_towerlistCfg) => {
                    if (item.general_lv <= this.copyModel.lastCompleteStageId) {
                        return true;
                    }
                    return false
                })
                this.copyCfg = tems[tems.length - 1];
            }
        } else {
            let tems = ConfigManager.getItems(Copy_towerlistCfg, (item: Copy_towerlistCfg) => {
                if (item.general_lv <= this.copyModel.lastCompleteStageId) {
                    return true;
                }
                return false
            })
            this.copyCfg = tems[tems.length - 1];
        }

        let heroNum = this.curAtkIndex == 0 ? 6 : 9
        heroNum = this.isRoyal ? 9 : heroNum;

        this.selectHeroInfos = []
        this.selectHeroItemIds = []
        for (let i = 0; i < heroNum; i++) {
            this.selectHeroInfos[i] = null;
            this.selectHeroItemIds[i] = -1;
        }
        let sendInfo = false;
        if (!this.selectHeros || this.selectHeros.length == 0) {
            this.selectHeros = []
            for (let i = 0; i < heroNum; i++) {
                this.selectHeros[i] = 0;
            }
            if (!this.isRoyal) {
                this.selectHeros[0] = this.datas[0].series;
            } else {
                //皇家竞技场特殊处理
                //获取三个不同的英雄
                let temHeroIds = [];
                let temHeroTypeId = [];
                let temNum = 0;
                for (let i = 0, n = this.datas.length; i < n; i++) {
                    let info = this.datas[i];
                    let hero = <icmsg.HeroInfo>info.extInfo
                    if (temHeroTypeId.indexOf(hero.typeId) < 0) {
                        temHeroIds.push(info.series);
                        temHeroTypeId.push(hero.typeId);
                        temNum++;
                    }
                    if (temNum >= 3) {
                        break;
                    }
                }
                if (temNum < 3) {
                    cc.log('英雄太少，无法进行皇家竞技场战斗');
                }
                this.selectHeros[0] = temHeroIds[0];
                this.selectHeros[3] = temNum > 1 ? temHeroIds[1] : 0;
                this.selectHeros[6] = temNum > 2 ? temHeroIds[2] : 0;

            }
            sendInfo = true;
        } else {
            if (this.isRoyal) {
                if (this.selectHeros[0] <= 0 || this.selectHeros[3] <= 0 || this.selectHeros[6] <= 0) {
                    let heroTypeIds = []
                    this.selectHeros.forEach(id => {
                        if (id > 0) {
                            let info = HeroUtils.getHeroInfoByHeroId(id)
                            if (heroTypeIds.indexOf(info.typeId) < 0) {
                                heroTypeIds.push(info.typeId)
                            }
                        }
                    })
                    for (let k = 0; k < 3; k++) {
                        if (this.selectHeros[k * 3] <= 0) {
                            for (let j = 0, n = this.datas.length; j < n; j++) {
                                let info = this.datas[j];
                                //let hero = <icmsg.HeroInfo>info.extInfo;
                                let index = heroTypeIds.indexOf(info.itemId)
                                if (index < 0) {
                                    this.selectHeros[k * 3] = info.series;
                                    heroTypeIds.push(info.itemId);
                                    break;
                                }
                            }
                        }
                    }
                    sendInfo = true;
                }
            } else {
                let have = false;
                this.selectHeros.forEach(heroId => {
                    if (heroId > 0) {
                        have = true;
                    }
                })
                if (!have) {
                    if (this.curIndex == 1) {
                        this.selectHeros = this.model.PveUpHeroList;
                    } else {
                        this.selectHeros[0] = this.datas[0].series;
                    }
                    //this.selectHeros[0] = this.datas[0].series;
                    sendInfo = true;
                }
            }

        }

        if (sendInfo) {
            this.sendHeroListChangeInfo()
        }

        this.datas.forEach(info => {
            let index = this.selectHeros.indexOf(info.series)
            if (index >= 0) {
                this.selectHeroInfos[index] = info;
                this.selectHeroItemIds[index] = info.itemId;
            }
        })

        let i = 0;
        let localStr = this.getLocalStr(this.curIndex)
        let change = false;
        this.selectHeroInfos.forEach(info => {
            if (info == null && this.selectHeros[i] > 0) {
                this.selectHeros[i] = 0;
                GlobalUtil.setLocal(localStr, this.selectHeros);
                change = true;
            }
            i++;
        })
        if (change) {
            this.sendHeroListChangeInfo()
        }

    }

    sendHeroListChangeInfo() {

        //皇家竞技场 进攻阵容保存在本地
        if (this.curIndex == 0 && this.isRoyal) {
            let str = this.getLocalStr(this.curIndex);
            //保存在本地
            GlobalUtil.setLocal(str, this.selectHeros);
            return;
        }

        let msg = new icmsg.BattleArraySetReq();
        // let type = this.curIndex == 0 ? this.curIndex + 1 : this.defenderType[this.curDefendIndex] + 1;
        let type = this.curIndex == 0 ? this.atkType[this.curAtkIndex] + 1 : this.defenderType[this.curDefendIndex] + 1;
        msg.type = type;
        msg.heroIds = this.selectHeros;
        NetManager.send(msg, (rsp: icmsg.BattleArraySetRsp) => {
            if (!cc.isValid(this.node)) return;
            this.model.refreshCurHeroList(type - 1, rsp.heroIds);
            if (this.curIndex == 0) {
                gdk.e.emit(RoleEventId.SHOW_UPHERO_INFO);
                this._updateGateConditions();
            } else {
                let defender = gdk.panel.isOpenOrOpening(PanelId.PvpDefender)
                if (defender && (type - 1) == this.model.curDefendType) {
                    let ctrl = gdk.panel.get(PanelId.PvpDefender).getComponent(PvpDefenderCtrl)
                    ctrl.fsm.broadcastEvent(PveFsmEventId.PVE_SCENE_REINIT);
                }
            }
        }, this);
    }

    //排序方法(颜色高低>星级高低>战力高低>等级高低)
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


    //排序方法(战力>星星>ID)
    sortFunc2(a: any, b: any) {
        let heroInfoA = <icmsg.HeroInfo>a.extInfo;
        let heroInfoB = <icmsg.HeroInfo>b.extInfo;
        if (heroInfoA.power == heroInfoB.power) {
            if (heroInfoA.star == heroInfoB.star) {
                return heroInfoA.typeId - heroInfoB.typeId;
            }
            else {
                return heroInfoB.star - heroInfoA.star;
            }
        }
        else {
            return heroInfoB.power - heroInfoA.power;
        }
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

        let temCfgs = this.addCfgs.concat();
        let change = false;
        this.addCfgs = [];

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

        let heroNum = 6

        for (let i = 1; i <= heroNum; i++) {
            if (a[i] == null && i < heroNum) continue;
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
            if (a[i] >= 4 || i == heroNum) {
                big4Type.push(i);
            }
            if (i == heroNum && (maxNum + addNum >= 2)) {
                let temNum = Math.min(heroNum, maxNum + addNum);
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
                let num = Math.min(heroNum, a[type])
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

        for (let i = 0; i < addCfgs.length; i++) {
            if (temCfgs.indexOf(addCfgs[i]) < 0) {
                change = true;
                break;
            }
        }
        this.addCfgs = addCfgs;

        //设置图片
        let tem1 = 1;
        if (addNum + maxNum >= 2) {
            tem1 = Math.min(heroNum, addNum + maxNum)
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

            let tem2 = Math.min(3, temMax - 3);
            if (tem2 > 0 && tem2 <= 3) {
                this.groupSp2.node.active = true;
                let path2 = 'common/texture/role/select/yx_zhenyingji_' + tem2;
                GlobalUtil.setSpriteIcon(this.node, this.groupSp2, path2);
            }
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

        //播放特效
        if (change && this.upHeroIndex >= 0 && !this.isRoyal) {
            this.showGroupEffect()
        }
    }

    //播放阵营加成特效
    showGroupEffect() {
        let node1 = cc.instantiate(this.effectPre);
        let node2 = cc.instantiate(this.effectPre);
        let posArr = this.effectPos1
        if (this.curIndex == 0 && this.curAtkIndex == 1) {
            posArr = this.effectPos2
        }
        let startPos = posArr[this.upHeroIndex];
        node1.parent = this.effectNode;
        node1.setPosition(startPos);

        node2.parent = this.effectNode;
        node2.setPosition(startPos);

        let spien1 = node1.getComponent(sp.Skeleton);
        let spien2 = node2.getComponent(sp.Skeleton);
        let info = this.selectHeroInfos[this.upHeroIndex];
        if (!info) return;
        let index = (<icmsg.HeroInfo>info.extInfo).color
        index = Math.min(5, index);
        let path = `spine/ui/${this.effectNames[index - 1]}/${this.effectNames[index - 1]}`
        GlobalUtil.setSpineData(this.node, spien1, path, true, 'stand1', false, true, (spine: sp.Skeleton) => {
            spine.node.destroy()
            this.upHeroIndex = -1;
        })

        GlobalUtil.setSpineData(this.node, spien2, path, true, 'stand2', true, true)
        let action: cc.Action = cc.speed(
            cc.sequence(
                cc.moveTo(0.5, this.endPos),
                cc.callFunc(() => {
                    spien2.setAnimation(0, 'stand3', false);
                    spien2.setCompleteListener((trackEntry, loopCount) => {
                        let name = trackEntry.animation ? trackEntry.animation.name : '';
                        if (name === "stand2") {
                            node2.destroy()
                            this.upHeroIndex = -1;
                        }
                    })
                }, this)
            ),
            1
        )
        node2.runAction(action);
    }

    refreshTopInfo() {
        //数据排序 上阵英雄>战力>星星>id
        let temList: BagItem[] = [];
        this.selectHeroInfos.forEach(info => {
            if (info) {
                let index = this.datas.indexOf(info);
                if (index >= 0) {
                    let tem = this.datas.splice(index, 1);
                    temList = temList.concat(tem);
                }
            }
        });
        temList.sort(this.sortFunc1)
        this.datas = temList.concat(this.datas);

        this.curGuard = 0;
        this.curConnon = 0
        this.curGun = 0;

        // let isRoyal = false;
        // if (this.curIndex == 0 && this.atkType[this.curAtkIndex] == 9) {
        //     isRoyal = true;
        // } else if (this.curIndex == 1 && this.defenderType[this.curDefendIndex] == 8) {
        //     isRoyal = true;
        // }

        let list = this.isRoyal ? this.royalUpHero1List : this.upHero1List;
        let heroNum = 6
        if ((this.curIndex == 0 && this.curAtkIndex == 1) || this.isRoyal) {
            heroNum = 9
        }
        for (let i = 0; i < list.length; i++) {
            list[i].active = i < heroNum
        }
        let power = 0;
        let temHeroId = []
        for (let i = 0; i < list.length; i++) {
            let heroItem = list[i];
            if (!heroItem.active) {
                continue
            }
            let add = heroItem.getChildByName('add');
            let roleHeroItem = heroItem.getChildByName('RoleHeroItem');
            let lock = heroItem.getChildByName('lock');
            add.active = false;
            roleHeroItem.active = false;
            lock.active = false;
            let temNum = this.copyCfg.num;
            temNum = this.isRoyal ? 9 : temNum;
            if (i < temNum) {
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
                if (this.selectHeros[i] > 0) {
                    temHeroId.push(i);
                }
            }
        }

        //上阵英雄出现在未解锁的位置容错处理
        if (temHeroId.length > 0) {
            let temNum = this.copyCfg.num;
            temNum = this.isRoyal ? 9 : temNum;
            //cc.log('上阵英雄出现在未解锁的位置')
            let temZoreIndex = []
            this.selectHeros.forEach((id, i) => {
                if (id <= 0 && i < temNum) {
                    temZoreIndex.push(i);
                }
            })
            if (temZoreIndex.length > 0) {
                for (let i = 0; i < temZoreIndex.length; i++) {
                    let zeroIndex = temZoreIndex[0];
                    if (i < temHeroId.length) {
                        let temIndex = temHeroId[i];
                        this.selectHeros[zeroIndex] = this.selectHeros[temIndex];
                        this.selectHeroInfos[zeroIndex] = this.selectHeroInfos[temIndex];
                        this.selectHeroItemIds[zeroIndex] = this.selectHeroItemIds[temIndex];
                        this.selectHeros[temIndex] = 0;
                        this.selectHeroInfos[temIndex] = null;
                        this.selectHeroItemIds[temIndex] = 0;
                    }
                }
                this.refreshTopInfo();
                return;
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

    downHero(e: Event, index) {
        //处于引导时不能下阵
        let guideCfg = GuideUtil.getCurGuide();
        if (guideCfg && guideCfg.bindBtnId == 6001) {
            //
            return
        }
        let tem = this.curSelectNum * 3;
        let i = parseInt(index);
        if (this.isRoyal) {

            if (!(i >= tem && i < tem + 3)) {
                gdk.gui.showMessage('只能下阵当前选择的梯队英雄')
                return;
            }
        }


        let num = 0;
        this.selectHeros.forEach(id => {
            if (id > 0) {
                num++;
            }
        })

        if (this.isRoyal) {
            num = 0;
            let n = tem + 3;
            for (let i = tem; i < n; i++) {
                let heroId = this.selectHeros[i]
                if (heroId > 0) {
                    num++;
                }
            }
        }

        let list = this.isRoyal ? this.royalUpHero1List : this.upHero1List;//this.upHero1List;
        let temNode = list[i];
        let roleHeroItem = temNode.getChildByName('RoleHeroItem');
        if (roleHeroItem.active) {
            if (num <= 1) {
                gdk.gui.showMessage(gdk.i18n.t("i18n:HEROTRIAL_SELECT_TIP3"))
                return
            }
            let ctrl = roleHeroItem.getComponent(RoleHeroItemCtrl2);
            let temData = <BagItem>ctrl.data.data;
            let idx = this.selectHeros.indexOf(temData.series);
            if (idx >= 0) {
                this.selectHeros.splice(idx, 1)
                this.selectHeroInfos.splice(idx, 1)
                this.selectHeroItemIds.splice(idx, 1)
                if (this.isRoyal) {
                    this.selectHeros.splice(tem + 2, 0, 0)
                    this.selectHeroInfos.splice(tem + 2, 0, null)
                    this.selectHeroItemIds.splice(tem + 2, 0, -1)
                } else {
                    this.selectHeros.push(0);
                    this.selectHeroInfos.push(null);
                    this.selectHeroItemIds.push(-1);
                }
                // this.selectHeros.splice(idx, 1)
                // this.selectHeros.push(0);
                // this.selectHeroInfos.splice(idx, 1)
                // this.selectHeroInfos.push(null);
                // this.selectHeroItemIds.splice(idx, 1)
                // this.selectHeroItemIds.push(-1);
            }

            this.upHeroIndex = -1;
            this.refreshTopInfo();
            // for (let i = 0; i < this.list.datas.length; i++) {
            //     let data = this.list.datas[i];
            //     if (data.data.series == temData.series) {
            //         data.isSelect = false;
            //         data.isHero = false;
            //     } else if (data.data.itemId == temData.itemId) {
            //         data.isSelect = false;
            //         data.isHero = false;
            //     }
            // }
            // this.list.refresh_items()
            this._updateDataLater();
            let str = this.getLocalStr(this.curIndex);
            //保存在本地
            GlobalUtil.setLocal(str, this.selectHeros);
            this.sendHeroListChangeInfo()
            // if (this.curIndex == 0) {
            //     gdk.e.emit(RoleEventId.SHOW_UPHERO_INFO);
            // }
        }
    }


    _selectItem(data: any, index) {
        if (data.isSelect) {
            let temIndex = this.selectHeroInfos.indexOf(data.data);
            if (temIndex >= 0) {
                if (this.isRoyal) {
                    let tem = this.curSelectNum * 3;
                    if (temIndex >= tem && temIndex < tem + 3) {
                        this.downHero(null, temIndex)
                    } else {
                        gdk.gui.showMessage('只能下阵当前选择的梯队英雄')
                        return;
                    }
                } else {
                    this.downHero(null, temIndex)
                }
            }
            return;
        }
        let info: BagItem = data.data;
        if (HeroUtils.heroLockCheck(<icmsg.HeroInfo>info.extInfo, false, [7])) {
            gdk.panel.open(PanelId.HeroLockTips, (node: cc.Node) => {
                let ctrl = node.getComponent(HeroLockTipsCtrl);
                ctrl.initArgs((<icmsg.HeroInfo>info.extInfo).heroId, [0, 1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 12], () => { this.list.select_item(index) });
            });
            return;
        }
        // //1.判断是否可以上阵
        // let type = Math.floor((<HeroInfo>info.extInfo).soldierId / 100);
        // let canUp = false;
        // let name = ''
        // let num = 0;
        // switch (type) {
        //     case 1:
        //         canUp = this.curGun < this.copyCfg.gun;
        //         name = '枪兵';
        //         num = this.copyCfg.gun;
        //         break;
        //     case 3:
        //         canUp = this.curConnon < this.copyCfg.cannon;
        //         num = this.copyCfg.cannon;
        //         name = '炮兵';
        //         break;
        //     case 4:
        //         canUp = this.curGuard < this.copyCfg.guard;
        //         num = this.copyCfg.guard;
        //         name = '守卫';
        //         break
        // }
        // if (!canUp) {
        //     gdk.gui.showMessage(`只能上阵${num}个${name}类型英雄`)
        //     return;
        // }
        let i = 0;
        let temNum = this.copyCfg.num
        this.selectHeros.forEach(heroId => {
            if (heroId > 0) {
                i++;
            }
        })

        if (this.isRoyal) {
            i = 0;
            let tem = this.curSelectNum * 3
            let n = this.curSelectNum * 3 + 3;
            for (let i = tem; i < n; i++) {
                let heroId = this.selectHeros[i]
                if (heroId > 0) {
                    i++;
                }
            }
            temNum = 3;
        }

        if (i >= temNum) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:HEROTRIAL_SELECT_TIP4"))
            return;
        }

        //基因链接限制
        let mysticLinkId = (<icmsg.HeroInfo>info.extInfo).mysticLink;
        if (mysticLinkId > 0 && this.selectHeros.indexOf(mysticLinkId) !== -1 && !this.isRoyal) {
            gdk.gui.showMessage(gdk.i18n.t('i18n:HERO_TIP81'));
            return;
        }

        //let temList = this.upHero1List;
        if (!this.isRoyal) {
            for (let i = 0; i < this.selectHeros.length; i++) {
                if (this.selectHeros[i] <= 0) {
                    this.selectHeros[i] = info.series;
                    this.selectHeroInfos[i] = info;
                    this.selectHeroItemIds[i] = info.itemId;
                    this.upHeroIndex = i;
                    break;
                }
            }
        } else {
            let tem = this.curSelectNum * 3;
            let n = tem + 3
            for (let i = tem; i < n; i++) {
                if (this.selectHeros[i] <= 0) {
                    this.selectHeros[i] = info.series;
                    this.selectHeroInfos[i] = info;
                    this.selectHeroItemIds[i] = info.itemId;
                    this.upHeroIndex = i;
                    break;
                }
            }
        }


        this.refreshTopInfo();
        //data.isSelect = true;
        // for (let i = 0; i < this.list.datas.length; i++) {
        //     let data = this.list.datas[i];
        //     if (data.data.series == info.series) {
        //         data.isSelect = true;
        //         data.isHero = true;
        //     } else if (data.data.itemId == info.itemId) {
        //         data.isSelect = true;
        //         data.isHero = false;
        //     }
        // }
        // this.list.refresh_items();
        this._updateDataLater()
        //保存在本地
        let str = this.getLocalStr(this.curIndex);
        GlobalUtil.setLocal(str, this.selectHeros);
        this.sendHeroListChangeInfo()

        // JumpUtils.openPanel({
        //     panelId: PanelId.RoleView2,
        //     currId: this.node
        // })

    }


    pageSelect(event, index, refresh: boolean = false) {

        if (index == 1) {
            if (!JumpUtils.ifSysOpen(901)) {
                gdk.gui.showMessage(gdk.i18n.t("i18n:ROLE_SELECT_TIP1"))//('竞技场未开启')
                this.menuCtrl.setSelectIdx(this.curIndex);
                return;
            }
        }
        if (this.curIndex == index && !refresh) return;
        this.curIndex = index;

        let hideArr = ["yx_tcbg02/SelectUpHeroNode", "effectNode", "SelectScroll", "tabUp", "layout", "yx_tcbg02/yx_tcbg01"]
        if (index == 2) {
            // 显示的节点
            hideArr && hideArr.forEach(name => {
                cc.find(name, this.node).active = false;
            });
            this.recommendNode.active = true
        } else {
            hideArr && hideArr.forEach(name => {
                cc.find(name, this.node).active = true;
            });
            this.recommendNode.active = false
        }

        // this.scrollView.node.parent.setPosition(cc.v2(0, 180))
        this.showState();
        this.upHero1Node.active = true;
        //this.infoBg.height = 270;
        //this.scrollView.node.parent.setPosition(cc.v2(0, 180))
        //this.scrollView.node.parent.height = 490;
        this.initUpHeroData();
        this.refreshTopInfo();
        this._updateDataLater()
    }

    isRoyal = false;
    showState() {

        // let temscrollW = this.scrollView.node.parent.getComponent(cc.Widget);
        // let temtabUpW = this.tabUpNode.getComponent(cc.Widget);
        // let tembtnUpW = this.btnNode.getComponent(cc.Widget);
        this.isRoyal = false;
        if (this.curIndex == 0) {
            // this.scrollView.node.parent.height = 490;
            // this.defendNode.active = false;
            // this.tabUpNode.setPosition(cc.v2(0, -395))
            // this.btnNode.setPosition(cc.v2(0, -430))
            // this.defendNode.active = true;
            // this.scrollView.node.parent.height = 380;
            // this.tabUpNode.setPosition(cc.v2(0, -310))
            // this.btnNode.setPosition(cc.v2(0, -350));
            this.defendNode.active = true;
            this.changeDefendBtn.active = false;
            // temscrollW.bottom = -310;
            // temtabUpW.bottom = -395;
            // tembtnUpW.bottom = -455;

            if (this.atkType[this.curAtkIndex] == 8) {
                this.royalNode.active = true;
                this.upTipNode.active = false;
                this.midNode.active = false;
                this.scrollView.node.parent.y = 88
                this.scrollView.node.parent.height = 340;
                this.mapNode.active = false;
                this.Btn2List.forEach(node => {
                    node.active = true;
                })
                this.curSelectNum = 0;
                if (gdk.panel.isOpenOrOpening(PanelId.PveScene)) {
                    let rm = this.royalModel//ModelManager.get(RoyalModel)
                    this.enterStage = true;
                    this.curStageNum = rm.curFightNum;
                }
                if (this.enterStage) {
                    this.curSelectNum = this.curStageNum;
                }
                this.isRoyal = true;
                this.changeSelectNum(this.curSelectNum)
                if (gdk.panel.isOpenOrOpening(PanelId.RoyalArenaView)) {
                    this.searchBtn.active = true;
                } else {
                    this.searchBtn.active = false;
                }
            } else {
                this.searchBtn.active = false;
                this.royalNode.active = false;
                this.upTipNode.active = true;
                this.midNode.active = true;
                this.scrollView.node.parent.y = 143
                this.scrollView.node.parent.height = 370;
            }

            this.tabUpNode.setPosition(cc.v2(0, -342))
            this.btnNode.setPosition(cc.v2(0, -382));

            if (this.atkStr.length == 1) {
                this.leftNode.active = false;
                this.rightNode.active = false;
                this.defendNode.active = false
                this.scrollView.node.parent.y = 143
                this.scrollView.node.parent.height = 450;
                this.tabUpNode.setPosition(cc.v2(0, -400))
                this.btnNode.setPosition(cc.v2(0, -447));

            } else if (this.atkStr.length == 2) {
                this.leftNode.active = false;
                this.rightNode.active = true;
            } else {
                this.leftNode.active = true;
                this.rightNode.active = true;
            }

            let length = this.atkStr.length;
            let leftIdx = this.curAtkIndex - 1 < 0 ? length - 1 : this.curAtkIndex - 1
            this.leftName.string = ""//this.atkStr[leftIdx];
            let rightIdx = this.curAtkIndex + 1 >= length ? 0 : this.curAtkIndex + 1;
            this.rightName.string = this.atkStr[rightIdx];
            this.curName.string = this.atkStr[this.curAtkIndex];

        } else if (this.curIndex == 1) {
            this.defendNode.active = true;
            this.searchBtn.active = false;
            // temscrollW.bottom = -200;
            // temtabUpW.bottom = -310;
            // tembtnUpW.bottom = -375;
            if (this.defenderType[this.curDefendIndex] == 8) {
                this.royalNode.active = true;
                this.upTipNode.active = false;
                this.midNode.active = false;
                this.scrollView.node.parent.y = 88
                this.scrollView.node.parent.height = 340;
                this.mapNode.active = true;
                this.Btn2List.forEach(node => {
                    node.active = false;
                })
                this.changeDefendBtn.active = false;
                this.curSelectNum = 0;
                this.isRoyal = true;
                this.refreshMapData();
                this.changeSelectNum(this.curSelectNum)
            } else {
                this.royalNode.active = false;
                this.upTipNode.active = true;
                this.midNode.active = true;
                this.scrollView.node.parent.y = 143
                this.scrollView.node.parent.height = 370;
                this.changeDefendBtn.active = true;

            }
            this.tabUpNode.setPosition(cc.v2(0, -342))
            this.btnNode.setPosition(cc.v2(0, -382));
            if (this.defenderStr.length == 1) {
                this.leftNode.active = false;
                this.rightNode.active = false;
            } else if (this.defenderStr.length == 2) {
                this.leftNode.active = false;
                this.rightNode.active = true;
            } else {
                this.leftNode.active = true;
                this.rightNode.active = true;
            }
            //this.model.curDefendType = this.defenderType[this.curDefendIndex];

            //this.changeDefendBtn.active = true;
            let length = this.defenderStr.length;
            let leftIdx = this.curDefendIndex - 1 < 0 ? length - 1 : this.curDefendIndex - 1
            this.leftName.string = this.defenderStr[leftIdx];
            let rightIdx = this.curDefendIndex + 1 >= length ? 0 : this.curDefendIndex + 1;
            this.rightName.string = this.defenderStr[rightIdx];
            this.curName.string = this.defenderStr[this.curDefendIndex];

            GlobalUtil.setAllNodeGray(this.curNode, this.grayType.indexOf(this.curDefendIndex) >= 0 ? 1 : 0)
            GlobalUtil.setAllNodeGray(this.leftNode, this.grayType.indexOf(leftIdx) >= 0 ? 1 : 0)
            GlobalUtil.setAllNodeGray(this.rightNode, this.grayType.indexOf(rightIdx) >= 0 ? 1 : 0);
        }
    }

    getLocalStr(index: number): string {
        let str = ''
        // switch (index) {
        //     case 0:
        //         str = 'Role_setUpHero_pve'
        //         break;
        //     case 1:
        //         str = 'Role_setUpHero_pvp_arena'
        //         break;
        //     case 2:
        //         str = 'Role_setUpHero_pve_copy'
        //         break;
        // }
        // return str;
        if (index == 0) {
            if (this.isRoyal) {
                str = 'Royal_setUpHero_atk'
            } else {
                str = 'Role_setUpHero_pve'
            }
        } else {
            if (this.isRoyal) {
                str = 'Royal_setUpHero_def'
            } else {
                str = 'Role_setUpHero_def'
            }
        }
        return str//index == 0 ? 'Role_setUpHero_pve' : 'Role_setUpHero_def';
    }


    onArrowClcik(e, data) {
        if (this.curIndex == 0) {
            let length = this.atkStr.length;
            if (data == 'left') {
                this.curAtkIndex = this.curAtkIndex - 1 < 0 ? length - 1 : this.curAtkIndex - 1
            } else {
                this.curAtkIndex = this.curAtkIndex + 1 >= length ? 0 : this.curAtkIndex + 1
            }

        } else {
            let length = this.defenderStr.length;
            if (data == 'left') {
                this.curDefendIndex = this.curDefendIndex - 1 < 0 ? length - 1 : this.curDefendIndex - 1
            } else {
                this.curDefendIndex = this.curDefendIndex + 1 >= length ? 0 : this.curDefendIndex + 1
            }
        }
        // this.leftName.string = this.curDefendIndex - 1 < 0 ? this.defenderStr[length - 1] : this.defenderStr[this.curDefendIndex - 1];
        // this.rightName.string = this.curDefendIndex + 1 >= length ? this.defenderStr[0] : this.defenderStr[this.curDefendIndex + 1];
        // this.curName.string = this.defenderStr[this.curDefendIndex];
        this.showState()
        //设置对应的防守阵营数据
        this.initUpHeroData();
        this.refreshTopInfo();
        this._updateDataLater()

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

    royalOnekeyUphero() {
        let temDatas = this.model.heroInfos.concat();
        temDatas.sort(this.sortFunc2)

        let change = false;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                let index = j * 3 + i;
                if (this.curIndex == 0 && this.enterStage && j < this.curStageNum) {
                    continue;
                }
                let heroId = this.selectHeros[index];
                if (heroId <= 0) {
                    for (let k = 0; k < temDatas.length; k++) {
                        let info = temDatas[k]
                        let mysticLinkId = (<icmsg.HeroInfo>info.extInfo).mysticLink;
                        if (this.selectHeroItemIds.indexOf(info.itemId) < 0 && (!mysticLinkId || this.selectHeros.indexOf(mysticLinkId) == -1)) {
                            this.selectHeros[index] = info.series;
                            this.selectHeroInfos[index] = info;
                            this.selectHeroItemIds[index] = info.itemId;
                            change = true;
                            break;
                        }
                    }
                }
            }
        }
        if (change) {
            // let index = 0;
            // this.selectHeroItemIds.forEach(id => {
            //     if (id > 0) {
            //         this.upHeroIndex = index;
            //     }
            //     index++;
            // })
            this.refreshTopInfo();
            this._updateDataLater();
            //保存在本地
            let str = this.getLocalStr(this.curIndex);
            GlobalUtil.setLocal(str, this.selectHeros);

            this.sendHeroListChangeInfo()
        }

    }

    //一键上阵按钮
    oneKeyUpHero() {

        if (this.isRoyal) {
            this.royalOnekeyUphero();
            return;
        }

        let have = false;
        let temDatas = this.model.heroInfos.concat();
        temDatas.sort(this.sortFunc2)
        let nums = [this.copyCfg.cannon, this.copyCfg.guard, this.copyCfg.gun]
        let curNums = [this.curConnon, this.curGuard, this.curGun];
        let types = [3, 4, 1]
        //let typeNames = { '3': '炮兵', '4': '守卫', '1': '枪兵' }
        let change = false;
        for (let i = 0; i < this.selectHeros.length; i++) {
            let heroId = this.selectHeros[i];
            if (i < this.copyCfg.num && heroId <= 0) {
                let index = 0;
                // let queshao = -1;
                // let queshaoType = '';
                let add = false;
                for (let j = 0; j < types.length; j++) {
                    let type = types[j];
                    let curNum = curNums[j];
                    let num = nums[j];
                    if (curNum < num) {
                        for (let k = 0; k < temDatas.length; k++) {
                            let info = temDatas[k]
                            let temtype = Math.floor((<icmsg.HeroInfo>info.extInfo).soldierId / 100);
                            let mysticLinkId = (<icmsg.HeroInfo>info.extInfo).mysticLink;
                            if (temtype == type && this.selectHeroItemIds.indexOf(info.itemId) < 0 && (!mysticLinkId || this.selectHeros.indexOf(mysticLinkId) == -1)) {
                                this.selectHeros[i] = info.series;
                                this.selectHeroInfos[i] = info;
                                this.selectHeroItemIds[i] = info.itemId;
                                curNums[j] = curNum + 1;
                                change = true;
                                add = true;
                                break;
                            }
                        }
                    }
                    if (add) break;
                }
            }
        }

        //检测是否还有空余位置
        for (let i = 0; i < this.selectHeros.length; i++) {
            let heroId = this.selectHeros[i];
            if (i < this.copyCfg.num && heroId <= 0) {
                for (let k = 0; k < temDatas.length; k++) {
                    let info = temDatas[k]
                    let mysticLinkId = (<icmsg.HeroInfo>info.extInfo).mysticLink;
                    if (this.selectHeroItemIds.indexOf(info.itemId) < 0 && (!mysticLinkId || this.selectHeros.indexOf(mysticLinkId) == -1)) {
                        this.selectHeros[i] = info.series;
                        this.selectHeroInfos[i] = info;
                        this.selectHeroItemIds[i] = info.itemId;
                        change = true;
                        break;
                    }
                }
            }
        }

        if (change) {
            let index = 0;
            this.selectHeroItemIds.forEach(id => {
                if (id > 0) {
                    this.upHeroIndex = index;
                }
                index++;
            })
            this.refreshTopInfo();
            this._updateDataLater();
            //保存在本地
            let str = this.getLocalStr(this.curIndex);
            GlobalUtil.setLocal(str, this.selectHeros);

            this.sendHeroListChangeInfo()
        }
    }

    //打开设置防御阵型界面
    openDefenderView() {

        this.model.curDefendType = this.defenderType[this.curDefendIndex];

        if (gdk.panel.isOpenOrOpening(PanelId.PveScene)) {
            let node = gdk.panel.get(PanelId.PveScene);
            let ctrl = node.getComponent(PveSceneCtrl);
            this.copyModel.enterDefenderStageId = ctrl.model.id;
        }
        if (gdk.panel.isOpenOrOpening(PanelId.PvpDefender)) {
            let node = gdk.panel.get(PanelId.PvpDefender);
            let ctrl = node.getComponent(PvpDefenderCtrl)
            ctrl.model.id = this.model.getDefenderStageId(this.model.curDefendType);
            ctrl.fsm.broadcastEvent(PveFsmEventId.PVE_SCENE_REINIT);
            this.close()
            return;
        }

        let roleModel = ModelManager.get(RoleModel);
        let player = new icmsg.ArenaPlayer();
        player.id = roleModel.id;
        player.robotId = null;
        player.name = roleModel.name;
        player.head = roleModel.head;
        player.frame = roleModel.frame;
        player.level = roleModel.level;
        player.power = roleModel.power;
        this.close()
        let temStr: 'FOOTHOLD' | 'ARENA' | 'CHAMPION_GUESS' | 'CHAMPION_MATCH' | 'RELIC' | "VAULT" | "ENDRUIN" | 'ARENATEAM' | 'PEAK' | 'FOOTHOLD_GATHER' | 'ARENAHONOR_GUESS' | 'WORLDHONOR_GUESS' = this.defenderTemStr[this.defenderType[this.curDefendIndex] - 1];
        JumpUtils.openPvpDefenderScene([player.id, 0, player], player.name, temStr);
    }

    _updateGateConditions() {
        let view = gdk.gui.getCurrentView();
        let ctrl = view.getComponent(PveSceneCtrl);
        //判断通关条件 各个阵营英雄数量和各个职业英雄数量
        if (ctrl && ctrl.model) {
            ctrl.model.gateconditionUtil && ctrl.model.gateconditionUtil.updateGateConditions();
        }
    }

    //皇家竞技场梯队选择
    nameBtnClicl(e, data) {
        let index = parseInt(data);
        if (this.curIndex == 0 && this.enterStage && index < this.curStageNum) {
            gdk.gui.showMessage('战斗中，已经完成的战斗梯队阵容暂时无法修改')
            return;
        }
        // if (this.curIndex == 0 && this.enterStage && this.royalModel.testSceneId != 0 && index != 0) {
        //     gdk.gui.showMessage('练习模式战斗中，只能修改第一梯队的阵容')
        //     return;
        // }
        if (this.curSelectNum != index) {
            this.curSelectNum = index;
            this.changeSelectNum(this.curSelectNum)
        }
    }

    //刷新防守地图信息
    @gdk.binding('royalModel.mapIds')
    refreshMapData() {
        let state: 0 | 1 = 0;
        if (!ActUtil.ifActOpen(133)) {
            state = 1;
        }
        if (this.royalModel.mapIds.length == 0) {
            return;
        }
        this.mapSpriteList.forEach((node, i) => {
            let sceneId = this.royalModel.mapIds[i]
            let sceneCfg = ConfigManager.getItemById(Royal_sceneCfg, sceneId)
            let path = 'view/royalArena/texture/map/' + sceneCfg.thumbnail
            GlobalUtil.setSpriteIcon(this.node, node, path);
            GlobalUtil.setGrayState(node, state);
        })
        this.defendBtnList.forEach((node, i) => {
            GlobalUtil.setGrayState(node, state);
        })
    }
    changeSelectNum(num: number) {
        this.selectNodeList.forEach((node, i) => {
            node.active = num == i;
        })
    }
    //皇家竞技场地图选择
    mapBtnClick(e, data) {
        let index = parseInt(data);
        //cc.log('皇家竞技场地图选择---》' + index)
        if (!ActUtil.ifActOpen(133)) {
            gdk.gui.showMessage(gdk.i18n.t('i18n:ROYAL_TIP6'))
            return;
        }
        this.royalModel.curIndex = index;
        this.royalModel.curSceneId = this.royalModel.mapIds[index]
        gdk.panel.open(PanelId.RoyalArenaMapSelectView)
    }

    //皇家竞技场防守站位调整
    openRoyalDefenderClick(e, data) {
        let index = parseInt(data);
        //cc.log('皇家竞技场防守站位调整---》' + index);
        if (!ActUtil.ifActOpen(133)) {
            gdk.gui.showMessage(gdk.i18n.t('i18n:ROYAL_TIP7'))
            return;
        }
        this.model.curDefendType = this.defenderType[this.curDefendIndex];

        this.royalModel.scenneIndex = index;
        let sceneId = this.royalModel.mapIds[index]
        this.royalModel.defenderSceneId = sceneId;
        let scenneCfg = ConfigManager.getItemById(Royal_sceneCfg, sceneId)

        if (gdk.panel.isOpenOrOpening(PanelId.PvpDefender)) {
            let node = gdk.panel.get(PanelId.PvpDefender);
            let ctrl = node.getComponent(PvpDefenderCtrl)
            ctrl.model.id = scenneCfg.stage_id + 1//this.model.getDefenderStageId(this.model.curDefendType);
            ctrl.fsm.broadcastEvent(PveFsmEventId.PVE_SCENE_REINIT);
            this.close()
            return;
        }

        let roleModel = ModelManager.get(RoleModel);
        let player = new icmsg.ArenaPlayer();
        player.id = roleModel.id;
        player.robotId = null;
        player.name = roleModel.name;
        player.head = roleModel.head;
        player.frame = roleModel.frame;
        player.level = roleModel.level;
        player.power = roleModel.power;
        this.close();
        JumpUtils.openPvpDefenderScene([player.id, 0, player], player.name, 'ROYAL');


    }

    royalSearchBtnClick() {
        //判断上阵英雄个数
        let num = 0;
        this.selectHeros.forEach(id => {
            if (id > 0) {
                num++;
            }
        })
        if (num < 9) {
            // 重置据点状态
            GlobalUtil.openAskPanel({
                descText: gdk.i18n.t('i18n:ROYAL_TIP2'),//'退出副本不返还进入次数,是否退出',
                sureCb: () => {
                    gdk.panel.open(PanelId.RoyalArenaSearchView)
                    this.close()
                }
            });
        } else {
            gdk.panel.open(PanelId.RoyalArenaSearchView)
            this.close()
        }

    }
}
