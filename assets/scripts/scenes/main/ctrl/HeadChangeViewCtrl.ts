import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import HeroModel from '../../../common/models/HeroModel';
import JumpUtils from '../../../common/utils/JumpUtils';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import RoleModel from '../../../common/models/RoleModel';
import UiTabMenuCtrl from '../../../common/widgets/UiTabMenuCtrl';
import {
    Headframe_titleCfg,
    HeadframeCfg,
    Hero_awakeCfg,
    Hero_undersand_levelCfg,
    HeroCfg
    } from '../../../a/config';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';

/**
 * 头像 更换
 * @Author: luoyong
 * @Description:
 * @Date: 2019-10-17 15:07:39
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-10-08 11:29:10
 */
const { ccclass, property, menu } = cc._decorator;

export class HeadItemInfo {
    type: number;//0 头像 1头像框 2称号
    id: number;
    isActive: boolean;
    isSelect: boolean
}

@ccclass()
@menu("qszc/scene/main/HeadChangeViewCtrl")
export default class HeadChangeViewCtrl extends gdk.BasePanel {

    @property(cc.Node)
    head: cc.Node = null

    @property(cc.Node)
    frame: cc.Node = null

    @property(cc.Node)
    roleTitle: cc.Node = null

    @property(cc.Label)
    headName: cc.Label = null

    @property(cc.Button)
    tabBtns: cc.Button[] = []

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    headItem: cc.Prefab = null;

    @property(cc.Prefab)
    titleItem: cc.Prefab = null;

    @property(cc.Node)
    linkNode: cc.Node = null;

    @property(UiTabMenuCtrl)
    frameTabMenu: UiTabMenuCtrl = null;

    list: ListView = null
    _curSelect: number = 0
    _curFrameTabIdx: number = 0;
    clickTimes: number = 0;
    get heroModel(): HeroModel {
        return ModelManager.get(HeroModel)
    }

    get roleModel(): RoleModel {
        return ModelManager.get(RoleModel)
    }

    onEnable() {
        NetManager.send(new icmsg.RoleAllFramesInfoReq(), () => {
            if (!cc.isValid(this.node)) return;
            if (!this.node.activeInHierarchy) return;
            this.updateHead()
            this.updateHeadFrame()
            this.selectType(null, 0)
        }, this);

        NetManager.send(new icmsg.RoleAllTitlesInfoReq())
        this.updateHeadTitle()
    }

    onDestroy() {
        gdk.e.targetOff(this)
    }

    _initListView() {
        if (this.list) {
            this.list.destroy()
        }
        if (this._curSelect == 2) {
            this.list = new ListView({
                scrollview: this.scrollView,
                mask: this.scrollView.node,
                content: this.content,
                item_tpl: this.titleItem,
                cb_host: this,
                column: 1,
                gap_x: 3,
                gap_y: 3,
                async: true,
                direction: ListViewDir.Vertical,
            })
        } else {
            this.list = new ListView({
                scrollview: this.scrollView,
                mask: this.scrollView.node,
                content: this.content,
                item_tpl: this.headItem,
                cb_host: this,
                column: 4,
                gap_x: 35,
                gap_y: 20,
                async: true,
                direction: ListViewDir.Vertical,
            })
        }
        this.list.onClick.on(this._selectItem, this);
    }

    @gdk.binding("roleModel.head")
    updateHead() {
        GlobalUtil.setSpriteIcon(this.node, this.head, GlobalUtil.getHeadIconById(this.roleModel.head))
    }

    @gdk.binding("roleModel.frame")
    updateHeadFrame() {
        GlobalUtil.setSpriteIcon(this.node, this.frame, GlobalUtil.getHeadFrameById(this.roleModel.frame))
    }

    @gdk.binding("roleModel.title")
    updateHeadTitle() {
        GlobalUtil.setSpriteIcon(this.node, this.roleTitle, GlobalUtil.getHeadTitleById(this.roleModel.title))
    }

    /**选择页签, 筛选类型*/
    selectType(e, utype) {
        this.clickTimes = 0;
        this._curSelect = parseInt(utype)
        for (let index = 0; index < this.tabBtns.length; index++) {
            let btn = this.tabBtns[index]
            btn.interactable = index != this._curSelect
            let children = btn.node.children;
            children[0].active = index != this._curSelect
            children[1].active = index == this._curSelect
        }
        this.linkNode.active = this._curSelect == 1
        this.scrollView.node.height = this._curSelect == 1 ? 408 : 453  //scrollView H:290  254
        this.frameTabMenu.node.active = this._curSelect == 1
        this._curFrameTabIdx = 0;
        this.frameTabMenu.showSelect(this._curFrameTabIdx);
        this.udpateView()
    }

    onFrameTabMenuSelect(e, idx) {
        if (!e) return;
        this.clickTimes = 0;
        this._curFrameTabIdx = parseInt(idx);
        this.udpateView();
    }

    udpateView() {
        this._initListView()
        this.scrollView.stopAutoScroll()
        this.scrollView.scrollToTop()
        let datas = []
        let index = 0
        if (this._curSelect == 0) {
            let baseInfo: HeadItemInfo = {
                type: 0,
                id: 0,
                isActive: true,
                isSelect: false
            }
            datas.push(baseInfo)
            let heroInfos = this.heroModel.heroInfos
            let headIcons = []
            for (let i = 0; i < heroInfos.length; i++) {
                let heroCfg = ConfigManager.getItemById(HeroCfg, heroInfos[i].itemId)
                if (heroCfg.group[0] == 6) {
                    let curHero = heroInfos[i].extInfo as icmsg.HeroInfo;
                    let totalLv = curHero.mysticSkills[0] + curHero.mysticSkills[1] + curHero.mysticSkills[2] + curHero.mysticSkills[3];
                    let mysticSkillLv = ConfigManager.getItemByField(Hero_undersand_levelCfg, 'mystery_skill', totalLv).undersand_level;
                    if (mysticSkillLv >= 16) {
                        if (headIcons.indexOf(heroCfg.icon + 10000) == -1) {
                            let info: HeadItemInfo = {
                                type: 0,
                                id: heroCfg.icon + 10000,
                                isActive: true,
                                isSelect: false
                            }
                            headIcons.push(heroCfg.icon + 10000)

                            if (heroCfg.icon + 10000 == this.roleModel.head) {
                                index = headIcons.length
                                this.roleModel.selectHeadId = heroCfg.icon + 10000
                            }
                            datas.push(info)
                        }
                    }
                }

                if ((heroInfos[i].extInfo as icmsg.HeroInfo).star >= heroCfg.star_max) {
                    //觉醒头像
                    let awakeCfg = ConfigManager.getItemByField(Hero_awakeCfg, "hero_id", heroCfg.id, { star: heroCfg.star_max })
                    if (awakeCfg && awakeCfg.icon) {
                        if (headIcons.indexOf(awakeCfg.icon) == -1) {
                            let info: HeadItemInfo = {
                                type: 0,
                                id: awakeCfg.icon,
                                isActive: true,
                                isSelect: false
                            }
                            headIcons.push(awakeCfg.icon)

                            if (awakeCfg.icon == this.roleModel.head) {
                                index = headIcons.length
                                this.roleModel.selectHeadId = awakeCfg.id
                            }
                            datas.push(info)
                        }
                    }
                }


                if (headIcons.indexOf(heroCfg.icon) == -1) {
                    let info: HeadItemInfo = {
                        type: 0,
                        id: heroInfos[i].itemId,
                        isActive: true,
                        isSelect: false
                    }

                    headIcons.push(heroCfg.icon)
                    if (heroInfos[i].itemId == this.roleModel.head) {
                        index = headIcons.length
                        this.roleModel.selectHeadId = heroInfos[i].itemId
                    }
                    datas.push(info)
                }
            }
            GlobalUtil.setSpriteIcon(this.node, this.frame, GlobalUtil.getHeadFrameById(this.roleModel.frame))
            GlobalUtil.setSpriteIcon(this.node, this.roleTitle, GlobalUtil.getHeadTitleById(this.roleModel.title))
        } else if (this._curSelect == 1) {
            let cfgs = ConfigManager.getItems(HeadframeCfg, (cfg: HeadframeCfg) => {
                if (this._curFrameTabIdx == 0 || this._curFrameTabIdx == cfg.paging) {
                    return true;
                }
            });

            for (let i = 0; i < cfgs.length; i++) {
                let isActive = false
                if (cfgs[i].id == 1) {
                    isActive = true
                } else {
                    if (this.roleModel.frameList[cfgs[i].id]) {
                        isActive = true
                    }
                }
                let info: HeadItemInfo = {
                    type: 1,
                    id: cfgs[i].id,
                    isActive: isActive,
                    isSelect: false
                }
                if (cfgs[i].id == this.roleModel.frame) {
                    index = 0
                    this.roleModel.selectFrameId = cfgs[i].id
                }
                datas.push(info)
            }
            GlobalUtil.setSpriteIcon(this.node, this.roleTitle, GlobalUtil.getHeadTitleById(this.roleModel.title))
        } else if (this._curSelect == 2) {
            let showIds = []
            let cfgs = ConfigManager.getItems(Headframe_titleCfg)
            let dressList = []//穿戴的
            let ownList = []//拥有的
            let lockList = []//锁定的
            for (let i = 0; i < cfgs.length; i++) {
                if (cfgs[i].icon && showIds.indexOf(cfgs[i].title_id) == -1) {//去除重复的
                    showIds.push(cfgs[i].title_id)
                    let isActive = false

                    for (let id in this.roleModel.titleList) {
                        let ownCfg = ConfigManager.getItemById(Headframe_titleCfg, id)
                        if (ownCfg.title_id == cfgs[i].title_id) {
                            isActive = true
                            break
                        }
                    }

                    let info: HeadItemInfo = {
                        type: 2,
                        id: cfgs[i].id,
                        isActive: isActive,
                        isSelect: false
                    }
                    if (cfgs[i].id == this.roleModel.title) {
                        index = 0
                        this.roleModel.selectTitleId = cfgs[i].id
                    }

                    if (info.isActive) {
                        if (info.id == this.roleModel.title) {
                            dressList.push(info)
                        } else {
                            ownList.push(info)
                        }
                    } else {
                        lockList.push(info)
                    }

                }
            }
            ownList.sort(this.sortFunc)
            lockList.sort(this.sortFunc)

            datas = dressList.concat(ownList).concat(lockList)
        }
        this.list.clear_items()
        this.list.set_data(datas)
        this.list.scroll_to(index);
        this.list.select_item(index)
    }

    sortFunc(a: HeadItemInfo, b: HeadItemInfo) {
        let cfgA = ConfigManager.getItemById(Headframe_titleCfg, a.id)
        let cfgB = ConfigManager.getItemById(Headframe_titleCfg, b.id)
        if (cfgB.sub_order == cfgA.sub_order) {
            return cfgA.order - cfgB.order
        }
        return cfgA.sub_order - cfgB.sub_order
    }


    _selectItem(item: HeadItemInfo, index: number) {
        let datas = this.list.datas
        for (let i = 0; i < datas.length; i++) {
            datas[i].isSelect = false
        }
        this.list.refresh_items()

        item.isSelect = true;
        this.list.refresh_item(index);

        if (this._curSelect == 0) {
            GlobalUtil.setSpriteIcon(this.node, this.head, GlobalUtil.getHeadIconById(item.id))
            let heroCfg = ConfigManager.getItemById(HeroCfg, item.id)
            if (heroCfg) {
                this.headName.string = heroCfg.name
            } else if (item.id >= 310000) {
                if ([310149, 310150, 310151].indexOf(item.id) !== -1) {
                    let c = ConfigManager.getItem(HeroCfg, (cfg: HeroCfg) => {
                        if (cfg.icon == item.id - 10000 && cfg.group[0] == 6) {
                            return true;
                        }
                    });
                    this.headName.string = `${c.name}(${gdk.i18n.t('i18n:MAIN_SET_TIP12')})`;
                } else {
                    let c = ConfigManager.getItemById(HeroCfg, item.id - 10000);
                    this.headName.string = `${c.name}(${gdk.i18n.t('i18n:MAIN_SET_TIP11')})`;
                }
            }
            else {
                this.headName.string = gdk.i18n.t("i18n:MAIN_SET_TIP5");
            }
        } else if (this._curSelect == 1) {
            GlobalUtil.setSpriteIcon(this.node, this.frame, GlobalUtil.getHeadFrameById(item.id))
            let frameCfg = ConfigManager.getItemById(HeadframeCfg, item.id);
            if (frameCfg) {
                let lab = this.linkNode.getComponent(cc.RichText)
                lab.string = ''
                lab.string = `<u><outline color=#043104 width=2.0>${frameCfg.desc}</outline></u>`
            } else {
                this.linkNode.active = false
            }
            let id = typeof frameCfg.forward == 'string' ? parseInt(frameCfg.forward) : frameCfg.forward;
            if (id) {
                this.linkNode.on(cc.Node.EventType.TOUCH_END, () => {
                    if (JumpUtils.openView(id, true)) {
                        gdk.panel.hide(PanelId.HeadChangeView);
                        gdk.panel.hide(PanelId.MainSet);
                    }
                }, this);
            }
            else {
                this.linkNode.targetOff(this);
            }
            this.clickTimes += 1;
            if (this.clickTimes > 1) {
                gdk.panel.setArgs(PanelId.FrameDetailsView, item);
                gdk.panel.open(PanelId.FrameDetailsView);
            }
        } else if (this._curSelect == 2) {
            GlobalUtil.setSpriteIcon(this.node, this.roleTitle, GlobalUtil.getHeadTitleById(item.id))
        }
    }

    changFunc() {
        if (this._curSelect == 0) {
            if (this.roleModel.selectHeadId != this.list.selectd_data.id) {
                this.roleModel.selectHeadId = this.list.selectd_data.id
                let msg = new icmsg.RoleHeadReq()
                msg.heroId = this.roleModel.selectHeadId
                NetManager.send(msg, () => {
                    this.list.refresh_items()
                })
            }
        } else if (this._curSelect == 1) {
            if (this.list.selectd_data.id !== 1 && !this.roleModel.frameList[this.list.selectd_data.id]) {
                GlobalUtil.showMessageAndSound(gdk.i18n.t("i18n:MAIN_SET_TIP6"));
                return;
            }
            if (this.roleModel.selectFrameId != this.list.selectd_data.id) {
                this.roleModel.selectFrameId = this.list.selectd_data.id
                let msg = new icmsg.RoleFrameReq()
                msg.id = this.roleModel.selectFrameId
                NetManager.send(msg, () => {
                    this.list.refresh_items()
                })
            }
        } else if (this._curSelect == 2) {
            if (!this.roleModel.titleList[this.list.selectd_data.id]) {
                GlobalUtil.showMessageAndSound(gdk.i18n.t("i18n:MAIN_SET_TIP10"));
                return;
            }
            if (this.roleModel.selectTitleId != this.list.selectd_data.id) {
                this.roleModel.selectTitleId = this.list.selectd_data.id
                let msg = new icmsg.RoleTitleReq()
                msg.id = this.roleModel.selectTitleId
                NetManager.send(msg, () => {
                    this.list.refresh_items()
                })
            }
        }
    }

}