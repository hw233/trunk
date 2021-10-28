import {
    Copy_stageCfg,
    Copy_towerhaloCfg,
    Copy_towerlistCfg,
    GlobalCfg,

    HeroCfg, Hero_starCfg,

    SystemCfg
} from '../../../../a/config';
import ConfigManager from '../../../../common/managers/ConfigManager';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import ArenaModel from '../../../../common/models/ArenaModel';
import CopyModel from '../../../../common/models/CopyModel';
import HeroModel from '../../../../common/models/HeroModel';
import RoleModel from '../../../../common/models/RoleModel';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import GuideUtil from '../../../../common/utils/GuideUtil';
import JumpUtils from '../../../../common/utils/JumpUtils';
import { RedPointEvent } from '../../../../common/utils/RedPointUtils';
import StringUtils from '../../../../common/utils/StringUtils';
import { AskInfoType } from '../../../../common/widgets/AskPanel';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';
import UiTabMenuCtrl from '../../../../common/widgets/UiTabMenuCtrl';
import PanelId from '../../../../configs/ids/PanelId';
import SubInsSweepViewCtrl from '../../../instance/ctrl/SubInsSweepViewCtrl';
import { ActivityEventId } from '../../enum/ActivityEventId';
import PeakModel from '../../model/PeakModel';
import PeakUpHeroItemCtrl from './PeakUpHeroItemCtrl';

/** 
 * @Description: 角色英雄面板-选择面板
 * @Author:yaozu.hu  
 * @Date: 2019-03-28 17:21:18 
 * @Last Modified by: sthoo.huangangangang
 * @Last Modified time: 2021-05-13 21:00:25
 */

const { ccclass, property, menu } = cc._decorator;


@ccclass
@menu("qszc/view/peak/PeakSetUpHeroSelectorCtrl")
export default class PeakSetUpHeroSelectorCtrl extends gdk.BasePanel {

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

    list: ListView = null
    selectGroup: number = 0     // 筛选阵营
    selectCareer: number = 0    //筛选职业
    isShowCareer: boolean = false
    get model(): HeroModel { return ModelManager.get(HeroModel); }
    //get roleModel(): RoleModel { return ModelManager.get(RoleModel); }
    get copyModel(): CopyModel { return ModelManager.get(CopyModel); }
    get arenaModel(): ArenaModel { return ModelManager.get(ArenaModel); }
    get peakModel(): PeakModel { return ModelManager.get(PeakModel); }
    curIndex: number = -1;

    copyCfg: Copy_towerlistCfg;
    curConnon: number = 0;  //上阵炮兵数
    curGuard: number = 0;   //上阵守卫数
    curGun: number = 0;     //上阵枪兵数
    tempList: icmsg.PeakHero[] = []; //所有英雄的临时数据(区分后的)
    datas: icmsg.PeakHero[] = []; //所有英雄的临时数据
    selectHeros: number[] = []
    selectHeroInfos: icmsg.PeakHero[] = []
    selectHeroItemIds: number[] = []

    addCfgs: Copy_towerhaloCfg[] = [];
    lastAlive: boolean = false;
    groupBgData: number[][] = []
    groupBgNames: string[] = ['yx_zhengyingsekuai', 'yx_zhengyingsekuai2', 'yx_zhengyingsekuai3', 'yx_zhengyingsekuai4', 'yx_zhengyingsekuai5', 'yx_zhengyingsekuai6']

    effectNames: string[] = ['UI_yingxiongxuanzelv', 'UI_yingxiongxuanzelan', 'UI_yingxiongxuanzezi', 'UI_yingxiongxuanzejin', 'UI_yingxiongxuanzehong']
    effectPos1: cc.Vec2[] = [cc.v2(-264, -146), cc.v2(-157, -146), cc.v2(-52, -146), cc.v2(52, -146), cc.v2(157, -146), cc.v2(264, -146)]
    // effectPos2: cc.Vec2[] = [cc.v2(-150, -130), cc.v2(0, -130), cc.v2(150, -130), cc.v2(-150, -240), cc.v2(0, -240), cc.v2(150, -240)]
    endPos: cc.Vec2 = cc.v2(0, -34);
    //当前上阵的位置
    upHeroIndex: number = -1;

    enterIndex: number = 0;
    onEnable() {
        this.upHeroIndex = -1;
        let tems = ConfigManager.getItems(Copy_towerlistCfg, (item: Copy_towerlistCfg) => {
            if (item.general_lv <= this.copyModel.lastCompleteStageId) {
                return true;
            }
            return false
        })
        this.copyCfg = tems[tems.length - 1];
        this.datas = this.peakModel.peakStateInfo.heroes.concat();
        this.datas.sort(this.sortFunc1);
        gdk.e.on(ActivityEventId.ACTIVITY_PEAK_CHANGEHERO_OK_UPDATE, this.refreshHeroData, this)
        // gdk.e.on(RoleEventId.UPDATE_HERO_LIST, this._updateScroll, this);
        // gdk.e.on(RoleEventId.REMOVE_ONE_HERO, this._updateScroll, this);
        // gdk.e.on(RoleEventId.UPDATE_ONE_HERO, this._updateScroll, this);
        this.selectGroupFunc(null, 0)
        this.selectCareerFunc(null, 0)
        this.updateContentState()
        let args = this.args;
        this.enterIndex = args && args.length > 0 ? args[0] : 0;
        this.menuCtrl.node.active = true;
        if (this.enterIndex < 0) {
            this.menuCtrl.setSelectIdx(0);
            this.menuCtrl.node.active = false;
        } else {
            this.menuCtrl.setSelectIdx(this.enterIndex);
        }

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
        if (list.length > 0) {
            let limitLv = ConfigManager.getItemByField(GlobalCfg, 'key', 'quick_reset_level').value[0];
            if (ModelManager.get(RoleModel).level < limitLv) {
                gdk.panel.setArgs(PanelId.HeroAllResetView, list);
                gdk.panel.open(PanelId.HeroAllResetView);
            }
        }
        if (this.peakModel.randomData != null) {
            let descStr = gdk.i18n.t('i18n:PEAK_TIP10')//`重置后该池子内已转换过的英雄可再重新获得,是否进行重置？`
            let sureCb = () => {
                super.close();
                this.peakModel.randomData = null;
            };
            gdk.panel.open(PanelId.SubInsSweepView, (node: cc.Node) => {
                let ctrl = node.getComponent(SubInsSweepViewCtrl);
                ctrl.updateView(descStr, '', sureCb);
            });
            return;
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
                let heroCfg = ConfigManager.getItemById(HeroCfg, this.datas[i].typeId);
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
                let type = this.tempList[i].careerType//Math.floor(this.tempList[i].soldierId / 100);
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
            this.peakModel.selectHeros.push({
                data: info,
            })
            let index = this.selectHeros.indexOf(info.typeId);
            let idx = this.selectHeroItemIds.indexOf(info.typeId);
            let isSelect = idx >= 0;
            let isHero = index >= 0;
            scollData.push({ heroData: info, isSelect: isSelect, isHero: isHero, showInfo: false })
        })
        this.list.set_data(scollData);

    }

    initUpHeroData() {

        //let str = this.getLocalStr(this.curIndex)
        this.selectHeros = this.peakModel.peakStateInfo.heroIds//GlobalUtil.getLocal(str);

        for (let i = 0; i < 6; i++) {
            this.selectHeroInfos[i] = null;
            this.selectHeroItemIds[i] = -1;
        }
        let sendInfo = false;
        if (!this.selectHeros || this.selectHeros.length == 0) {
            this.selectHeros = []
            for (let i = 0; i < 6; i++) {
                this.selectHeros[i] = 0;
            }
            this.selectHeros[0] = this.datas[0].typeId;
            sendInfo = true;
        } else {
            let have = false;
            this.selectHeros.forEach(heroId => {
                if (heroId > 0) {
                    have = true;
                }
            })
            if (!have) {
                this.selectHeros[0] = this.datas[0].typeId;
                //this.selectHeros[0] = this.datas[0].series;
                sendInfo = true;
            }
        }

        if (sendInfo) {
            this.sendHeroListChangeInfo()
        }

        this.datas.forEach(info => {
            let index = this.selectHeros.indexOf(info.typeId)
            if (index >= 0) {
                this.selectHeroInfos[index] = info;
                this.selectHeroItemIds[index] = info.typeId;
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
        let msg = new icmsg.PeakHeroOnReq();
        msg.heroIds = this.selectHeros;
        NetManager.send(msg, (rsp: icmsg.PeakHeroOnRsp) => {
            if (!cc.isValid(this.node)) return;
            this.peakModel.peakStateInfo.heroIds = rsp.heroIds
            //this.peakModel.peakCopyUpHeroList['1'] = null;
            // if (this.curIndex == 0) {
            //     gdk.e.emit(RoleEventId.SHOW_UPHERO_INFO);
            // }
            if (this.enterIndex < 0) {
                NetManager.send(new icmsg.PeakFightReq, (rsp: icmsg.PeakFightRsp) => {
                    this.peakModel.arenaHeroList = rsp.mine.heroList;
                }, this)
            }
        }, this);
    }

    //排序方法(颜色高低>星级高低>战力高低>等级高低)
    sortFunc1(a: any, b: any) {
        let heroInfoA = <icmsg.PeakHero>a;
        let heroInfoB = <icmsg.PeakHero>b;
        let cfgA = ConfigManager.getItemByField(Hero_starCfg, 'star', heroInfoA.star)
        let cfgB = ConfigManager.getItemByField(Hero_starCfg, 'star', heroInfoB.star)
        if (cfgA.color == cfgB.color) {
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
            return cfgB.color - cfgA.color;
        }
    }


    //排序方法(战力>星星>ID)
    sortFunc2(a: any, b: any) {
        let heroInfoA = <icmsg.PeakHero>a;
        let heroInfoB = <icmsg.PeakHero>b;
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

        //播放特效
        if (change && this.upHeroIndex >= 0) {
            this.showGroupEffect()
        }
    }

    //播放阵营加成特效
    showGroupEffect() {
        let node1 = cc.instantiate(this.effectPre);
        let node2 = cc.instantiate(this.effectPre);
        let startPos = this.effectPos1[this.upHeroIndex];
        node1.parent = this.effectNode;
        node1.setPosition(startPos);

        node2.parent = this.effectNode;
        node2.setPosition(startPos);

        let spien1 = node1.getComponent(sp.Skeleton);
        let spien2 = node2.getComponent(sp.Skeleton);
        let info = this.selectHeroInfos[this.upHeroIndex];
        if (!info) return;
        let starCfg = ConfigManager.getItemByField(Hero_starCfg, 'star', info.star)
        let index = starCfg.color
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
        let temList: icmsg.PeakHero[] = [];
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

        let list = this.upHero1List;
        let power = 0;
        let temHeroId = []
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
                    let ctrl = roleHeroItem.getComponent(PeakUpHeroItemCtrl);
                    ctrl.data = { heroData: this.selectHeroInfos[i], isSelect: false, isHero: false, ordealHero: false, showInfo: false }
                    ctrl.updateView();
                    let tem = this.selectHeroInfos[i];
                    let type = tem.careerType//Math.floor(tem.soldierId / 100)
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
            //cc.log('上阵英雄出现在未解锁的位置')
            let temZoreIndex = []
            this.selectHeros.forEach((id, i) => {
                if (id <= 0) {
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
        let num = 0;
        this.selectHeros.forEach(id => {
            if (id > 0) {
                num++;
            }
        })
        let i = parseInt(index);
        let list = this.upHero1List;
        let temNode = list[i];
        let roleHeroItem = temNode.getChildByName('RoleHeroItem');
        if (roleHeroItem.active) {
            if (num <= 1) {
                gdk.gui.showMessage(gdk.i18n.t("i18n:HEROTRIAL_SELECT_TIP3"))
                return
            }
            let ctrl = roleHeroItem.getComponent(PeakUpHeroItemCtrl);
            let temData = ctrl.heroInfo;
            let idx = this.selectHeros.indexOf(temData.typeId);
            if (idx >= 0) {
                this.selectHeros.splice(idx, 1)
                this.selectHeros.push(0);
                this.selectHeroInfos.splice(idx, 1)
                this.selectHeroInfos.push(null);
                this.selectHeroItemIds.splice(idx, 1)
                this.selectHeroItemIds.push(-1);
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
            let temIndex = this.selectHeroInfos.indexOf(data.heroData);
            if (temIndex >= 0) {
                this.downHero(null, temIndex)
            }
            return;
        }
        let info: icmsg.PeakHero = data.heroData;

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
        this.selectHeros.forEach(heroId => {
            if (heroId > 0) {
                i++;
            }
        })
        if (i >= this.copyCfg.num) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:HEROTRIAL_SELECT_TIP4"))
            return;
        }

        let temList = this.upHero1List;
        for (let i = 0; i < this.selectHeros.length; i++) {
            if (this.selectHeros[i] <= 0) {
                this.selectHeros[i] = info.typeId;
                this.selectHeroInfos[i] = info;
                this.selectHeroItemIds[i] = info.typeId;
                this.upHeroIndex = i;
                break;
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

        // if (index == 1) {
        //     if (!JumpUtils.ifSysOpen(901)) {
        //         gdk.gui.showMessage(gdk.i18n.t("i18n:ROLE_SELECT_TIP1"))//('竞技场未开启')
        //         this.menuCtrl.setSelectIdx(this.curIndex);
        //         return;
        //     }
        // }
        if (this.curIndex == index && !refresh) return;
        this.curIndex = index;

        let hideArr = ["SelectUpHeroNode", "effectNode", "SelectScroll", "tabUp", "layout", "yx_tcbg02/yx_tcbg01"]
        if (index == 1) {
            // 显示的节点
            hideArr && hideArr.forEach(name => {
                cc.find(name, this.node).active = false;
            });
            this.recommendNode.active = true;
            return;
        } else {

            if (this.peakModel.randomData != null) {
                //this.menuCtrl.selectIdx = 1;
                // let descStr = gdk.i18n.t('i18n:PEAK_TIP10')//`重置后该池子内已转换过的英雄可再重新获得,是否进行重置？`
                // let sureCb = () => {
                //     //this.menuCtrl.selectIdx = 0;
                //     hideArr && hideArr.forEach(name => {
                //         cc.find(name, this.node).active = true;
                //     });
                //     this.recommendNode.active = false;
                // };
                // gdk.panel.open(PanelId.SubInsSweepView, (node: cc.Node) => {
                //     let ctrl = node.getComponent(SubInsSweepViewCtrl);
                //     ctrl.updateView(descStr, '', sureCb);
                // });
                let info: AskInfoType = {
                    title: gdk.i18n.t("i18n:TIP_TITLE"),
                    sureText: gdk.i18n.t("i18n:OK"),
                    sureCb: () => {
                        hideArr && hideArr.forEach(name => {
                            cc.find(name, this.node).active = true;
                        });
                        this.recommendNode.active = false;
                        this.peakModel.randomData = null;
                    },
                    closeText: gdk.i18n.t("i18n:CANCEL"),
                    closeCb: () => {
                        this.menuCtrl.selectIdx = 1;
                    },
                    closeBtnCb: () => {
                        this.menuCtrl.selectIdx = 1;
                    },
                    descText: gdk.i18n.t('i18n:PEAK_TIP10'),
                    thisArg: this,
                    isShowTip: false,
                }
                GlobalUtil.openAskPanel(info);

            } else {
                hideArr && hideArr.forEach(name => {
                    cc.find(name, this.node).active = true;
                });
                this.recommendNode.active = false;
            }
        }

        this.upHero1Node.active = true;
        // this.infoBg.height = 270;
        // this.scrollView.node.parent.setPosition(cc.v2(0, 180))
        // this.scrollView.node.parent.height = 490;
        this.initUpHeroData();
        this.refreshTopInfo();
        this._updateDataLater()
    }


    refreshHeroData() {
        this.datas = this.peakModel.peakStateInfo.heroes.concat();
        this.datas.sort(this.sortFunc1);
        this.initUpHeroData();
        // this.refreshTopInfo();
        // this._updateDataLater()
    }

    getLocalStr(index: number): string {
        // let str = ''
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
        return index == 0 ? 'Peak_setUpHero_pve' : 'Role_setUpHero_def';
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

    //一键上阵按钮
    oneKeyUpHero() {
        let have = false;
        let temDatas = this.peakModel.peakStateInfo.heroes.concat();
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
                            let temtype = info.careerType//Math.floor(info.soldierId / 100);
                            if (temtype == type && this.selectHeroItemIds.indexOf(info.typeId) < 0) {
                                this.selectHeros[i] = info.typeId;
                                this.selectHeroInfos[i] = info;
                                this.selectHeroItemIds[i] = info.typeId;
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
                    if (this.selectHeroItemIds.indexOf(info.typeId) < 0) {
                        this.selectHeros[i] = info.typeId;
                        this.selectHeroInfos[i] = info;
                        this.selectHeroItemIds[i] = info.typeId;
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


}
