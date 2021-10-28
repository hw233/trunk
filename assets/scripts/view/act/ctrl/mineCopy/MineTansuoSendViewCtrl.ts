import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import HeroModel from '../../../../common/models/HeroModel';
import HeroUtils from '../../../../common/utils/HeroUtils';
import MineModel from '../../model/MineModel';
import MineTansuoHeroSelectViewCtrl from './MineTansuoHeroSelectViewCtrl';
import MineUtil from '../../util/MineUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import StringUtils from '../../../../common/utils/StringUtils';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { Activitycave_tansuoCfg, GroupCfg, HeroCfg } from '../../../../a/config';
import { ActivityEventId } from '../../enum/ActivityEventId';
import { BagItem } from '../../../../common/models/BagModel';

/** 
  * @Description: 矿洞大作战探索英雄选择界面
  * @Author: yaozu.hu 
  * @Date: 2019-05-23 18:03:11 
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-12-22 11:36:15
*/


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/mineCopy/MineTansuoSendViewCtrl")
export default class MineTansuoSendViewCtrl extends gdk.BasePanel {
    @property(cc.Label)
    nameLabel: cc.Label = null;

    @property(cc.Label)
    decLabel: cc.Label = null;

    @property([cc.Node])
    slots: cc.Node[] = [];

    @property(cc.Node)
    heroList: cc.Node = null;

    @property(cc.Node)
    qualityNode: cc.Node = null;

    @property(cc.Node)
    groupList: cc.Node = null;

    @property(cc.Button)
    allSendBtn: cc.Button = null;

    @property(cc.Button)
    sendBtn: cc.Button = null;

    @property(cc.Node)
    numStatusNode: cc.Node = null;

    data: any = null;
    cfg: Activitycave_tansuoCfg = null;
    upHeroList: any = {};
    needHeroNum: number = null;
    onEnable() {
        let args = gdk.panel.getArgs(PanelId.MineTansuoSendView);
        if (args) this.data = args[0];
        this._addEventListener();

        let req = new icmsg.ActivityCaveExploreColorReq();
        req.chapterId = this.data.id;
        NetManager.send(req, (rsp: icmsg.ActivityCaveExploreColorRsp) => {
            this.data.quality = rsp.colorId;//resp.colorId;
            this.data.groups = rsp.groupIds //: 3, groups: [9, 7]
            this._updateView();
            this.onHeroClick(null, '1');
        });
        // this.data.quality = 3;//resp.colorId;
        // this.data.groups = [9, 7] //: 3, groups: [9, 7]
        // this._updateView();
        // this.onHeroClick(null, '1');
    }

    onDisable() {
        if (gdk.panel.isOpenOrOpening(PanelId.MineTansuoHeroSelectView)) {
            gdk.panel.hide(PanelId.MineTansuoHeroSelectView);
        }
        this.data = null;
        this.cfg = null;
        this.upHeroList = {};
        this.needHeroNum = null;
        gdk.e.targetOff(this);
    }

    _addEventListener() {
        gdk.e.on(ActivityEventId.ACTIVITY_MINE_HERO_CHOOSE_PANEL_CLICK, this._onHeroSelected, this);
    }

    _updateView() {
        if (!this.data) return;
        this.cfg = ConfigManager.getItemById(Activitycave_tansuoCfg, this.data.id);
        this.nameLabel.string = gdk.i18n.t("i18n:MINECOPY_HEROSELECT_TIP1")//'矿洞探索'//this.cfg.name;
        //this.nameLabel.node.color = BagUtils.getColor(this.cfg.quality);
        //this.nameLabel.node.getComponent(cc.LabelOutline).color = BagUtils.getOutlineColor(this.cfg.quality);
        this.decLabel.string = '';//'当前矿洞描述当前矿洞描述当前矿洞描述'//this.cfg.des;

        for (let i = 1; i <= 4; i++) {
            let rewardData = this.cfg['reward' + i];
            if (rewardData.length > 0) {
                let solt = this.slots[i - 1].getComponent(UiSlotItem)
                let itemId = rewardData[0];
                solt.updateItemInfo(itemId, rewardData[1]);
                let item: BagItem = {
                    series: itemId,
                    itemId: itemId,
                    itemNum: 1,
                    type: BagUtils.getItemTypeById(itemId),
                    extInfo: null
                }
                solt.itemInfo = item
            } else {
                this.slots[i - 1].active = false;
            }
        }
        //this.slot.getComponent(UiSlotItem).updateItemInfo(this.cfg.reward[0], this.cfg.reward[1]);

        this.needHeroNum = this.cfg.hero_num;
        let heroNodes = this.heroList.children;
        heroNodes.forEach(node => {
            let str = node.name.substring('hero'.length);
            if (parseInt(str) <= this.needHeroNum) {
                node.active = true;
            }
            else {
                node.active = false;
            }
        });
        GlobalUtil.setSpriteIcon(this.node, this.qualityNode, `view/lottery/texture/common/ck_quality${5 - this.data.quality}`);
        let groupNodes = this.groupList.children;
        this.data.groups.sort((a, b) => { return a - b; });
        for (let i = 0; i < groupNodes.length; i++) {
            if (this.data.groups[i]) {
                groupNodes[i].active = true;
                let icon = ConfigManager.getItemById(GroupCfg, this.data.groups[i]).icon;
                GlobalUtil.setSpriteIcon(this.node, groupNodes[i], `view/role/texture/up/${icon}_icon`);
            }
            else {
                groupNodes[i].active = false;
            }
        }

        this.checkConditions();
    }

    /**
     * 英雄选择回调
     */
    _onHeroSelected(e) {
        let group = e.data[0].group;
        let heroTypeId = e.data[0].info.typeId;
        let upList = [];
        let cfg = ConfigManager.getItemById(HeroCfg, heroTypeId);
        for (let key in this.upHeroList) {
            this.upHeroList[key] && upList.push(this.upHeroList[key]);
        }
        let isUp = upList.indexOf(heroTypeId) != -1;
        if (!isUp && this.needHeroNum <= upList.length) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:MINECOPY_HEROSELECT_TIP2"));
            return;
        }

        for (let i = 0; i < this.needHeroNum; i++) {
            let node = this.heroList.getChildByName(`hero${i + 1}`).getChildByName('upHero');
            if (!isUp && !this.upHeroList[i]) {
                this.upHeroList[i] = heroTypeId;
                node.active = true;
                GlobalUtil.setSpriteIcon(this.node, node.getChildByName('hero'), cfg.iconPath + '_s');
                GlobalUtil.setSpriteIcon(this.node, node.getChildByName('qualityBg'), `common/texture/sub_itembg0${e.data[0].info.color}`);
                let path = 'view/role/texture/up/' + ConfigManager.getItemById(GroupCfg, group).icon + '_icon';
                GlobalUtil.setSpriteIcon(this.node, node.getChildByName('group'), path);
                gdk.e.emit(ActivityEventId.ACTIVITY_MINE_HERO_SELECTED, [heroTypeId]); // 派发英雄上阵
                this.checkConditions();
                return;
            }
            else if (isUp && this.upHeroList[i] && this.upHeroList[i] == heroTypeId) {
                this.upHeroList[i] = null;
                node.active = false;
                GlobalUtil.setSpriteIcon(this.node, node, '');
                gdk.e.emit(ActivityEventId.ACTIVITY_MINE_HERO_UN_SELECTED, [heroTypeId]); // 派发英雄下阵
                this.checkConditions();
                return;
            }
        }
    }

    /**
     * 一键上阵 
     * 满足顺序 颜色->阵营->数量
     */
    onAKetToBattleBtnClick() {
        let alreadyUpHeroList = MineUtil.getTansuoUpHeroIdList();
        let recommandHeros: { group: number, info: icmsg.HeroInfo }[] = [];
        let recommandIds: number[] = []
        let quality = this.data.quality;
        let groups = [...this.data.groups];
        //满足品质的英雄列表
        let satisfyQualityHeroInfos = HeroUtils.getHerosByQuality(quality).filter(info => {
            return alreadyUpHeroList.indexOf(info.typeId) == -1;
        });
        //品质低-->高
        satisfyQualityHeroInfos.sort((a, b) => {
            return a.color - b.color;
        });
        if (satisfyQualityHeroInfos.length <= 0) {
            let str = StringUtils.format(gdk.i18n.t("i18n:MINECOPY_HEROSELECT_TIP3"), BagUtils.getColorInfo(quality).title)
            gdk.gui.showMessage(str);
            return;
        }
        for (let i = 0; i < groups.length; i++) {
            //同时满足品质和某阵营的英雄列表, 任取一个
            let satisfyHeroInfos = HeroUtils.getHerosByGroup(groups[i], satisfyQualityHeroInfos).filter(info => {
                return alreadyUpHeroList.indexOf(info.typeId) == -1;
            });
            if (satisfyHeroInfos.length >= 1) {
                recommandHeros.push({
                    group: groups[i],
                    info: satisfyHeroInfos[0]
                });
                recommandIds.push(satisfyHeroInfos[0].typeId);
                //剔除条件已满足的阵营
                let cfg = ConfigManager.getItemById(HeroCfg, satisfyHeroInfos[0].typeId);
                cfg.group.forEach(group => {
                    let idx = groups.indexOf(group);
                    if (idx != -1) {
                        groups.splice(idx, 1);
                    }
                });
                break;
            }
        }
        //满足品质的英雄不满足任何一个要求阵营,任取一个
        if (recommandHeros.length == 0) {
            recommandHeros.push({
                group: ConfigManager.getItemById(HeroCfg, satisfyQualityHeroInfos[0].typeId).group[0],
                info: satisfyQualityHeroInfos[0]
            });
            recommandIds.push(satisfyQualityHeroInfos[0].typeId);
        }
        //筛选符合阵营条件的英雄
        for (let i = 0; i < groups.length;) {
            let heroInfos = HeroUtils.getHerosByGroup(groups[i]).filter(info => {
                return alreadyUpHeroList.indexOf(info.typeId) == -1;
            });
            //品质低-->高
            heroInfos.sort((a, b) => {
                return a.color - b.color;
            });
            if (heroInfos.length <= 0) {
                let str = StringUtils.format(gdk.i18n.t("i18n:MINECOPY_HEROSELECT_TIP4"), ConfigManager.getItemById(GroupCfg, groups[i]).name)
                gdk.gui.showMessage(str);
                return;
            }
            else {
                for (let j = 0; j < heroInfos.length; j++) {
                    if (recommandIds.indexOf(heroInfos[j].typeId) == -1) {
                        let cfg = ConfigManager.getItemById(HeroCfg, heroInfos[j].typeId);
                        recommandHeros.push({
                            group: groups[0],
                            info: heroInfos[j]
                        });
                        recommandIds.push(heroInfos[j].typeId);

                        //剔除条件已满足的阵营
                        cfg.group.forEach(group => {
                            let idx = groups.indexOf(group);
                            if (idx != -1) {
                                groups.splice(idx, 1);
                            }
                        });
                        break;
                    }
                    else {
                        if (j == heroInfos.length - 1) {
                            let str = StringUtils.format(gdk.i18n.t("i18n:MINECOPY_HEROSELECT_TIP4"), ConfigManager.getItemById(GroupCfg, groups[i]).name)
                            gdk.gui.showMessage(str);
                            return;
                        }
                    }
                }
            }
            //上阵英雄已满,但阵营要求尚未满足.   触发情况 符合品质的英雄不满足任一要求的阵营时,上阵英雄数量 <= 阵营数量
            if (groups.length >= 1 && recommandIds.length >= this.needHeroNum) {
                let str = StringUtils.format(gdk.i18n.t("i18n:MINECOPY_HEROSELECT_TIP4"), ConfigManager.getItemById(GroupCfg, groups[0]).name)
                gdk.gui.showMessage(str);
                return;
            }

            i = 0; //始终匹配第一个阵营
        }

        //品质/阵营要求均满足的情况下,还有剩余上阵位时   补充最低品质的英雄
        let leftNum = this.needHeroNum - recommandIds.length;
        while (leftNum > 0) {
            let allHeroInfos = [...ModelManager.get(HeroModel).heroInfos].filter(info => {
                return alreadyUpHeroList.indexOf(info.extInfo['typeId']) == -1;
            });
            allHeroInfos.sort((a, b) => {
                return (<icmsg.HeroInfo>a.extInfo).color - (<icmsg.HeroInfo>b.extInfo).color;
            });
            for (let i = 0; i < allHeroInfos.length; i++) {
                if (recommandIds.indexOf(allHeroInfos[i].extInfo['typeId']) == -1) {
                    let cfg = ConfigManager.getItemById(HeroCfg, allHeroInfos[i].extInfo['typeId']);
                    recommandHeros.push({
                        group: cfg.group[0],
                        info: <icmsg.HeroInfo>(allHeroInfos[i].extInfo)
                    });
                    recommandIds.push(allHeroInfos[i].extInfo['typeId']);
                    leftNum -= 1;
                    break;
                }
                else {
                    if (i == allHeroInfos.length - 1 && leftNum > 0) {
                        gdk.gui.showMessage(gdk.i18n.t("i18n:MINECOPY_HEROSELECT_TIP5"));
                        return;
                    }
                }
            }
        }

        //下阵玩家所有选择的英雄
        for (let key in this.upHeroList) {
            let node = this.heroList.getChildByName(`hero${parseInt(key) + 1}`).getChildByName('upHero');
            gdk.e.emit(ActivityEventId.ACTIVITY_MINE_HERO_UN_SELECTED, [this.upHeroList[parseInt(key)]]); // 派发英雄下阵
            this.upHeroList[parseInt(key)] = null;
            node.active = false;
            GlobalUtil.setSpriteIcon(this.node, node, '');
            this.checkConditions();
        }

        //一键上阵
        for (let key in recommandHeros) {
            gdk.e.emit(ActivityEventId.ACTIVITY_MINE_HERO_CHOOSE_PANEL_CLICK, [recommandHeros[key]]);
        }
    }

    /**
     * 英雄选择
     * @param idx 
     */
    onHeroClick(e, idx: string) {
        if (this.upHeroList[parseInt(idx) - 1]) {
            let node = this.heroList.getChildByName(`hero${parseInt(idx)}`).getChildByName('upHero');
            gdk.e.emit(ActivityEventId.ACTIVITY_MINE_HERO_UN_SELECTED, [this.upHeroList[parseInt(idx) - 1]]); // 派发英雄下阵
            this.upHeroList[parseInt(idx) - 1] = null;
            node.active = false;
            GlobalUtil.setSpriteIcon(this.node, node, '');
            this.checkConditions();
        }
        else {
            let unMatchGroup;
            let matchQualityNum = 0;
            let group = [];
            let upList = [];
            for (let key in this.upHeroList) {
                this.upHeroList[key] && upList.push(this.upHeroList[key]);
                let cfg = ConfigManager.getItemById(HeroCfg, this.upHeroList[key]);
                if (!cfg) continue;
                if (cfg.defaultColor >= this.data.quality) {
                    matchQualityNum += 1;
                }
                group.push(...cfg.group);
            }

            for (let j = 1; j <= this.needHeroNum; j++) {
                let idx = group.indexOf(this.data.groups[j - 1]);
                if (idx != -1) {
                    group.splice(idx, 1);
                }
                else {
                    unMatchGroup = this.data.groups[j - 1];
                    break;
                }
            }
            if (matchQualityNum == 0 && !unMatchGroup) {
                let heroInfos = HeroUtils.getHerosByQuality(this.data.quality);
                if (heroInfos) {
                    let cfg = ConfigManager.getItemById(HeroCfg, heroInfos[0].typeId);
                    unMatchGroup = cfg.group[0];
                }
            }
            if (!unMatchGroup) unMatchGroup = 3;

            let panel = gdk.panel.get(PanelId.MineTansuoHeroSelectView);
            if (panel) {
                let ctrl = panel.getComponent(MineTansuoHeroSelectViewCtrl);
                ctrl.selectPage(unMatchGroup);
            }
            else {
                gdk.panel.setArgs(PanelId.MineTansuoHeroSelectView, unMatchGroup);
                if (!gdk.panel.isOpenOrOpening(PanelId.MineTansuoHeroSelectView)) {
                    gdk.panel.open(PanelId.MineTansuoHeroSelectView);
                }
            }
        }
    }

    /**
     * 检查条件
     */
    checkConditions() {
        let qualityLabel = this.qualityNode.getChildByName('label').getComponent(cc.Label);
        let statusSpriteNode = [];
        //品质、阵营 条件满足标志
        statusSpriteNode.push(this.qualityNode.getChildByName('sub_gouxuan'));
        this.groupList.children.forEach(child => {
            statusSpriteNode.push(child.getChildByName('sub_gouxuan'));
        })

        let matchQualityNum = 0;
        let group = [];
        let upList = [];
        for (let key in this.upHeroList) {
            this.upHeroList[key] && upList.push(this.upHeroList[key]);
            let cfg = ConfigManager.getItemById(HeroCfg, this.upHeroList[key]);
            if (!cfg) continue;
            if (cfg.defaultColor >= this.data.quality) {
                matchQualityNum += 1;
            }
            group.push(...cfg.group);
            // group = Array.from(new Set(group));
        }

        statusSpriteNode[0].active = matchQualityNum >= 1;
        qualityLabel.string = `${matchQualityNum}/1`;
        for (let j = 1; j <= this.needHeroNum; j++) {
            let idx = group.indexOf(this.data.groups[j - 1]);
            statusSpriteNode[j].active = idx != -1;
            if (idx != -1) {
                group.splice(idx, 1);
            }
        }

        //上阵数量
        if (upList.length == this.needHeroNum) {
            this.sendBtn.node.active = true;
            this.numStatusNode.active = false;
        }
        else {
            this.sendBtn.node.active = false;
            this.numStatusNode.active = true;
            this.numStatusNode.getChildByName('label').getComponent(cc.Label).string = `${upList.length}/${this.needHeroNum}`
        }
    }

    /**派遣 */
    onSendBtnClick() {
        let isSatisfyQuality = false;
        let list = [];
        for (let key in this.upHeroList) {
            if (this.upHeroList[key]) {
                list.push(this.upHeroList[key]);
                let cfg = ConfigManager.getItemById(HeroCfg, this.upHeroList[key]);
                if (cfg.defaultColor >= this.data.quality) {
                    isSatisfyQuality = true;
                }
            }
        }

        if (list.length < this.needHeroNum) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:MINECOPY_HEROSELECT_TIP6"));
            return;
        }

        if (!isSatisfyQuality) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:MINECOPY_HEROSELECT_TIP7"));
            return;
        }

        let group = [];
        let satisfyGroupNum = 0;
        for (let key in this.upHeroList) {
            let cfg = ConfigManager.getItemById(HeroCfg, this.upHeroList[key]);
            if (!cfg) continue;
            group.push(...cfg.group);
        }

        for (let j = 1; j <= this.needHeroNum; j++) {
            let idx = group.indexOf(this.data.groups[j - 1]);
            if (idx != -1) {
                satisfyGroupNum += 1;
                group.splice(idx, 1);
            }
        }

        if (satisfyGroupNum < this.data.groups.length) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:MINECOPY_HEROSELECT_TIP8"));
            return;
        }

        let req = new icmsg.ActivityCaveStartExploreReq();
        req.heroIds = list;
        req.chapterId = this.data.id;
        NetManager.send(req, (rsp: icmsg.ActivityCaveStartExploreRsp) => {

            //刷新model数据
            let model = ModelManager.get(MineModel)
            let haveData = false;
            let team = model.curCaveSstate.team
            team.forEach(temData => {
                if (temData.chapterId == rsp.chapterId) {
                    haveData = true;
                    //替换数据
                    temData.heroIds = rsp.heroIds;
                    temData.startTime = rsp.startTime;
                }
            })
            if (!haveData) {
                let data = new icmsg.ActivityCaveTeam()
                data.chapterId = rsp.chapterId
                data.heroIds = rsp.heroIds
                data.startTime = rsp.startTime
                team.push(data);
            }

            gdk.e.emit(ActivityEventId.ACTIVITY_MINE_TANSUOUPHERO, this.data.id);

            gdk.Timer.callLater(this, () => {
                this.close();
            })
        });
    }
}
