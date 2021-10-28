import ConfigManager from '../../../../common/managers/ConfigManager';
import CopyModel from '../../../../common/models/CopyModel';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import GuardianModel from '../../model/GuardianModel';
import GuardianUtils from './GuardianUtils';
import HeroModel from '../../../../common/models/HeroModel';
import HeroUtils from '../../../../common/utils/HeroUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import RoleHeroItemCtrl2 from '../selector/RoleHeroItemCtrl2';
import StringUtils from '../../../../common/utils/StringUtils';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { BagItem } from '../../../../common/models/BagModel';
import { Copy_stageCfg, Copy_towerlistCfg, GlobalCfg } from '../../../../a/config';
import { GuardianItemInfo } from './GuardianListCtrl';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';
/** 
 * @Description:守护者出站设置
 * @Author: yaozu.hu
 * @Date: 2019-05-08 14:30:43 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-04-21 18:16:51
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/guardian/GuardianFightSetViewCtrl")
export default class GuardianFightSetViewCtrl extends gdk.BasePanel {

    @property([cc.Node])
    upHeroList: cc.Node[] = []

    @property([cc.Node])
    guardianList: cc.Node[] = []

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;


    get heroModel(): HeroModel { return ModelManager.get(HeroModel); }
    get copyModel(): CopyModel { return ModelManager.get(CopyModel); }
    get guardianModel(): GuardianModel { return ModelManager.get(GuardianModel) }

    copyCfg: Copy_towerlistCfg;
    selectHeros: number[] = []
    selectHeroInfos: BagItem[] = []
    selectHeroItemIds: number[] = []

    selectGuardianIdMap: { [index: number]: number } = {}//序号： 守护者唯一id
    canPutNum = 0 //可以添加守护者的数量
    hasPutNum = 0 // 已经添加守护者的数量
    freeGuardianIds = [] //可携带的守护者唯一id

    list: ListView;

    onEnable() {
        NetManager.on(icmsg.GuardianPutOnRsp.MsgType, this._onGuardianPutOnRsp, this)

        this.initUpHeroData()
        this.initUpGuardianList()
        this.initDownGuardianList()
    }

    onDisable() {
        if (this.list) {
            this.list.destroy()
            this.list = null;
        }
    }


    initUpHeroData() {
        let tems = ConfigManager.getItems(Copy_towerlistCfg, (item: Copy_towerlistCfg) => {
            if (item.general_lv <= this.copyModel.lastCompleteStageId) {
                return true;
            }
            return false;
        });
        this.copyCfg = tems[tems.length - 1];

        let datas = this.heroModel.heroInfos.concat();
        datas.sort(this.sortFunc2)
        this.selectHeros = this.heroModel.PveUpHeroList;

        for (let i = 0; i < 6; i++) {
            this.selectHeroInfos[i] = null;
            this.selectHeroItemIds[i] = -1;
        }
        if (!this.selectHeros || this.selectHeros.length == 0) {
            this.selectHeros = []
            for (let i = 0; i < 6; i++) {
                this.selectHeros[i] = 0;
            }
            this.selectHeros[0] = datas[0].series;
        } else {
            let have = false;
            this.selectHeros.forEach(heroId => {
                if (heroId > 0) {
                    have = true;
                }
            })
            if (!have) {
                this.selectHeros[0] = datas[0].series;
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
                this.heroModel.PveUpHeroList = this.selectHeros;
            }
            i++;
        })
        this.refreshTopInfo()
    }

    refreshTopInfo() {
        let list: cc.Node[] = this.upHeroList;
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

    /**已出战的数据 */
    initUpGuardianList() {
        this.canPutNum = 0
        this.hasPutNum = 0
        for (let i = 0; i < this.selectHeroInfos.length; i++) {
            let item = this.guardianList[i]
            let lock = item.getChildByName("lock")
            let slot = item.getChildByName("UiSlotItem")
            lock.active = false
            slot.active = false
            if (!this.selectGuardianIdMap[i]) {
                this.selectGuardianIdMap[i] = -1
            }
            let bagItem = this.selectHeroInfos[i]
            if (bagItem) {
                let heroInfo = HeroUtils.getHeroInfoBySeries(bagItem.series).extInfo as icmsg.HeroInfo
                let guardian_open = ConfigManager.getItemById(GlobalCfg, "guardian_open").value[0]
                if (heroInfo.star >= guardian_open) {
                    this.canPutNum++
                }
                if (heroInfo.guardian) {
                    slot.active = true
                    let gInfo = heroInfo.guardian
                    let ctrl = slot.getComponent(UiSlotItem)
                    ctrl.updateItemInfo(gInfo.type)
                    ctrl.updateStar(gInfo.star)
                    let lv = slot.getChildByName('lv').getComponent(cc.Label)
                    lv.string = `.${gInfo.level}`
                    this.hasPutNum++
                    this.selectGuardianIdMap[i] = gInfo.id
                } else {
                    if (heroInfo.star < 10) {
                        lock.active = true
                    }
                }
            }
        }
    }

    onTakeOffFunc(e, utype) {
        let index = parseInt(utype)
        if (this.selectGuardianIdMap[index] == -1) {
            return
        }
        let bagItem = this.selectHeroInfos[index]
        let heroInfo = bagItem.extInfo as icmsg.HeroInfo

        let msg = new icmsg.GuardianTakeOffReq()
        msg.heroId = heroInfo.heroId
        NetManager.send(msg, (data: icmsg.GuardianTakeOffRsp) => {
            HeroUtils.updateHeroInfo(data.hero.heroId, data.hero)
            if (this.heroModel.curHeroInfo && this.heroModel.curHeroInfo.heroId == data.hero.heroId) {
                this.heroModel.curHeroInfo = data.hero
            }
            this.selectGuardianIdMap[index] = -1
            this.initDownGuardianList()
            this.initUpGuardianList()

        })
    }

    /**设置出战的数据 */
    initDownGuardianList() {
        this._initListView()
        let guardianItems = this.guardianModel.guardianItems
        let datas: GuardianItemInfo[] = []
        this.freeGuardianIds = []
        guardianItems.forEach(element => {
            let extInfo = element.extInfo as icmsg.Guardian
            let info: GuardianItemInfo = {
                bagItem: element,
                selected: false,
                power: GuardianUtils.getGuardianPower(element.itemId, extInfo.level, extInfo.star),
            }
            datas.push(info)
        });
        GlobalUtil.sortArray(datas, this.sortFunc)

        datas.forEach(element => {
            let heroInfo = GuardianUtils.getGuardianHeroInfo(element.bagItem.series)
            if (!heroInfo) {
                this.freeGuardianIds.push(element.bagItem.series)
            }
        });

        this.list.set_data(datas)
    }

    _initListView() {
        if (!this.list) {
            this.list = new ListView({
                scrollview: this.scrollView,
                mask: this.scrollView.node,
                content: this.content,
                item_tpl: this.itemPrefab,
                cb_host: this,
                column: 4,
                gap_x: 30,
                gap_y: 15,
                async: true,
                direction: ListViewDir.Vertical,
            })
            this.list.onClick.on(this._selectItem, this);
        }
    }

    _selectItem(itemInfo: GuardianItemInfo, index: number) {
        if (this.hasPutNum >= this.canPutNum) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:GUARDIAN_TIP6"))
            return
        }

        let heroInfo = GuardianUtils.getGuardianHeroInfo(itemInfo.bagItem.series)
        if (heroInfo && heroInfo.heroId > 0) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:GUARDIAN_TIP7"))
            return
        }

        let heroId = 0
        let idIndex = 0
        for (let key in this.selectGuardianIdMap) {
            let guardianId = this.selectGuardianIdMap[key]
            if (guardianId == -1) {
                let bagItem = this.selectHeroInfos[parseInt(key)]
                if (bagItem) {
                    let heroInfo = bagItem.extInfo as icmsg.HeroInfo
                    if (heroInfo.star >= 10 && !heroInfo.guardian) {
                        heroId = heroInfo.heroId
                        idIndex = parseInt(key)
                        break
                    }
                }
            }
        }

        if (heroId > 0) {
            let msg = new icmsg.GuardianPutOnReq()
            msg.heroId = heroId
            msg.guardianId = itemInfo.bagItem.series
            NetManager.send(msg)
        }
    }

    onOneKeySetFunc() {
        if (this.hasPutNum >= this.canPutNum) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:GUARDIAN_TIP6"))
            return
        }

        let heroIds = []
        for (let key in this.selectGuardianIdMap) {
            let guardianId = this.selectGuardianIdMap[key]
            if (guardianId == -1) {
                let bagItem = this.selectHeroInfos[parseInt(key)]
                if (bagItem) {
                    let heroInfo = bagItem.extInfo as icmsg.HeroInfo
                    let guardian_open = ConfigManager.getItemById(GlobalCfg, "guardian_open").value[0]
                    if (heroInfo.star >= guardian_open && !heroInfo.guardian) {
                        heroIds.push(heroInfo.heroId)
                    }
                }
            }
        }

        if (heroIds.length > 0) {
            for (let i = 0; i < heroIds.length; i++) {
                if (this.freeGuardianIds[i]) {
                    let heroId = heroIds[i]
                    let guardianId = this.freeGuardianIds[i]
                    gdk.Timer.callLater(this, () => {
                        let msg = new icmsg.GuardianPutOnReq()
                        msg.heroId = heroId
                        msg.guardianId = guardianId
                        NetManager.send(msg)
                    })

                }
            }
        }
    }

    _onGuardianPutOnRsp(data: icmsg.GuardianPutOnRsp) {
        HeroUtils.updateHeroInfo(data.hero.heroId, data.hero)
        if (this.heroModel.curHeroInfo && this.heroModel.curHeroInfo.heroId == data.hero.heroId) {
            this.heroModel.curHeroInfo = data.hero
        }
        this.initDownGuardianList()
        this.initUpGuardianList()
    }


    /**排序方法 */
    sortFunc(a: GuardianItemInfo, b: GuardianItemInfo) {
        if (a.power == b.power) {
            return b.bagItem.itemId - a.bagItem.itemId
        }
        return b.power - a.power
    }
}