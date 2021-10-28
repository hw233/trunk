import CityStageGroupCtrl from './CityStageGroupCtrl';
import CityStageItemCtrl, { StageData, StageState } from './CityStageItemCtrl';
import ConfigManager from '../../../common/managers/ConfigManager';
import CopyModel, { CityData } from '../../../common/models/CopyModel';
import CopyUtil from '../../../common/utils/CopyUtil';
import EliteCityStageGroupCtrl from './EliteCityStageGroupCtrl';
import EliteCityStageItemCtrl from './EliteCityStageItemCtrl';
import EnterStageViewCtrl from './EnterStageViewCtrl';
import GuideUtil from '../../../common/utils/GuideUtil';
import JumpUtils from '../../../common/utils/JumpUtils';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import StringUtils from '../../../common/utils/StringUtils';
import { Copy_stageCfg } from '../../../a/config';


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/map/CityMapViewCtrl")
export default class CityMapViewCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;
    @property(cc.Node)
    checkNode: cc.Node = null;
    @property(cc.Node)
    content: cc.Node = null;
    @property(cc.Prefab)
    stageGroupPre: cc.Prefab = null;
    @property(cc.Prefab)
    stageEliteGroupPre: cc.Prefab = null;
    @property(cc.Label)
    titelLabel: cc.Label = null;
    @property(cc.Node)
    worldBtn: cc.Node = null;
    @property(cc.Node)
    bottomNode: cc.Node = null;

    @property(cc.Node)
    eliteIcon: cc.Node = null;
    @property(cc.Node)
    storyIcon: cc.Node = null;
    //-------------------------精英副本地图修改-------------------------------
    @property(cc.Node)
    eliteIconG: cc.Node = null;
    @property(cc.Node)
    storyIconG: cc.Node = null;
    @property(cc.Node)
    eliteLock: cc.Node = null;
    @property(cc.Node)
    eliteStageNumNode: cc.Node = null;
    @property(cc.Node)
    eliteStagePro: cc.Node = null;
    @property(cc.Label)
    eliteStageNumLab: cc.Label = null;
    @property(cc.Node)
    leftBtn: cc.Node = null;
    @property(cc.Node)
    rightBtn: cc.Node = null;



    selectColor: cc.Color = cc.color('#F89797')
    numColor: cc.Color = cc.color('#FFFFFF')

    numPerGroup: number = 10;
    eliteNumPerGroup: number = 5;
    model: CopyModel;

    focusItemCtrl: CityStageItemCtrl | EliteCityStageItemCtrl;
    stageGroupCtrls: CityStageGroupCtrl[];
    eliteStageGroupCtrls: EliteCityStageGroupCtrl[];
    isSinglePanel: boolean;

    curCityId: number = 0;
    cityData: CityData = null;
    eliteOpen: boolean = false;

    eliteNeedPassStage: number;

    guideItemNode: CityStageItemCtrl[] = []; //绑定了引导的关卡
    contentOrginPos: cc.Vec2;

    onLoad() {
        this.model = ModelManager.get(CopyModel);
    }

    onEnable() {
        NetManager.on(icmsg.DungeonHangStatusRsp.MsgType, this.onDungeonHangStatusRsp, this)
        //获取精英副本通关数据
        let msg = new icmsg.DungeonElitesReq()
        NetManager.send(msg, this.onDungeonElitesRsp, this)

        let args = this.args;
        //有参数模式
        if (args && args.length > 0) {
            this.isSinglePanel = false;
            let data: CityData = args[0];
            this.updateData(data);
            this.curCityId = data.cityId;
            this.initEliteData();

        } else {
            this.isSinglePanel = true;
            this.worldBtn.active = true;
            if (this.curCityId == 0) {
                this.initData();
            }
            // this.requestData();
        }
        this.contentOrginPos = this.content.position;
        if (this.cityData && this.cityData.cityType != 7) {
            GuideUtil.activeGuide(`popup#CityMapView#${this.cityData.cityId}#open`);
        }
    }

    onDisable() {
        NetManager.targetOff(this);
        this.curCityId = 0;
        this.content.stopAllActions();
    }

    requestData() {
        let msg = new icmsg.DungeonListReq();
        NetManager.send(msg, this.onDungeonListRsp, this);
    }

    //刷新精英副本数据
    onDungeonElitesRsp(data: icmsg.DungeonElitesRsp) {
        if (this.cityData && this.cityData.cityType == 7) {
            this.initData(1);
        }
    }

    onDungeonListRsp(data: icmsg.DungeonListRsp) {
        if (this.curCityId == 0) {
            this.initData();
        }
    }

    //挂机状态修改
    onDungeonHangStatusRsp() {
        this.updateData(this.cityData);
    }

    initEliteData() {
        this.eliteOpen = CopyUtil.isOpenEliteStageChapter(this.curCityId);
        if (!this.eliteOpen) {
            let datas = ConfigManager.getItems(Copy_stageCfg, (item: Copy_stageCfg) => {
                if (item.copy_id == 7 && CopyUtil.getChapterId(item.id) == this.curCityId) {
                    return true;
                }
                return false;
            });
            if (datas.length > 0) {
                this.eliteNeedPassStage = datas[0].pre_condition;
            }
        }
        // this.eliteLock.active = !this.eliteOpen;
        // this.eliteStageNumNode.active = this.eliteOpen;
        if (this.eliteOpen) {
            let data = CopyUtil.getEliteStageCurChaterData(this.curCityId)
            this.eliteStagePro.width = 78 * data[0] / data[1];
            this.eliteStageNumLab.string = data[0] + '/' + data[1];
        }
    }

    //初始化关卡相关数据 stageType:0普通主线副本 1精英主线副本
    initData(stageType: number = 0) {
        //获取最新通关副本的章节ID
        let stageId = this.model.latelyStageId;
        let curCityId = this.curCityId > 0 ? this.curCityId : CopyUtil.getChapterId(stageId);
        if (this.curCityId == 0) {
            this.curCityId = curCityId;
        }
        this.cityData = this.model.getCityData(this.curCityId, stageType);
        this.initEliteData();
        this.updateData(this.cityData);
        GuideUtil.activeGuide(`popup#CityMapView#${this.curCityId}#open`);
    }

    updateData(data: CityData) {

        if (data.cityType == 7) {
            this.storyIcon.active = false;
            this.storyIconG.active = true;
            // this.eliteIcon.active = true;
            // this.eliteIconG.active = false;
        } else {
            if (data.cityId >= 3) {
                // this.eliteIcon.active = false;
                // this.eliteIconG.active = true;
            } else {
                // this.eliteIconG.active = false;
                // this.eliteIcon.active = false;
                // this.eliteStageNumNode.active = false;
                // this.eliteLock.active = false;
            }
            this.storyIcon.active = true;
            this.storyIconG.active = false;
        }

        this.cityData = data;
        this.titelLabel.string = `${data.cityId}.` + data.cityName;

        let stageDatas = data.stageDatas;
        let stageNum = stageDatas.length;
        let groupDatas: StageData[][] = [];

        let stageId = 0;
        if (data.cityType == 1) {
            stageId = this.model.latelyStageId;
            //判断切换章节按钮显示
            let lastCityId = CopyUtil.getChapterId(stageId);
            this.rightBtn.getComponent(cc.Button).interactable = data.cityId <= lastCityId - 1;
            this.leftBtn.getComponent(cc.Button).interactable = data.cityId > 1;

        } else {
            stageId = this.model.eliteStageData.length < data.cityId ? 0 : this.model.eliteStageData[data.cityId - 1];
            //判断切换章节按钮显示
            let temStageId = this.model.latelyStageId;
            let lastCityId = CopyUtil.getChapterId(temStageId);
            this.eliteOpen = CopyUtil.isOpenEliteStageChapter(this.curCityId);
            let num = this.eliteOpen ? lastCityId - 1 : lastCityId - 2;
            this.rightBtn.getComponent(cc.Button).interactable = CopyUtil.isOpenEliteStageChapter(this.curCityId + 1);
            this.leftBtn.getComponent(cc.Button).interactable = data.cityId > 3;
        }



        let curSid = stageId % 100;
        let curCityId = Math.floor((stageId % 10000) / 100);
        let num = this.cityData.cityType == 7 ? this.eliteNumPerGroup : this.numPerGroup;
        let isDanger = false;
        for (let i = 0; i < stageNum; i++) {
            const stageData = stageDatas[i];
            let groupId = Math.floor(i / num);
            let groupData = groupDatas[groupId];
            if (!groupData) {
                groupData = [];
                groupDatas[groupId] = groupData;
            }
            groupData.push(stageData);

            //填充状态
            if (data.cityType == 1) {
                if (data.cityId == curCityId) {
                    let sid = stageData.sid;
                    if (sid == curSid) {
                        stageData.state = StageState.Open;
                    } else if (sid < curSid) {
                        stageData.state = StageState.Pass;
                    } else {
                        stageData.state = StageState.Lock;
                    }
                } else if (data.cityId < curCityId) {
                    stageData.state = StageState.Pass;
                } else {
                    stageData.state = StageState.Lock;
                }
            } else {
                if (stageId == 0) {
                    if (i == 0) {
                        stageData.state = StageState.Open;
                    } else {
                        stageData.state = StageState.Lock;
                    }
                } else if (stageId == stageDatas[stageDatas.length - 1].stageCfg.id) {
                    stageData.state = StageState.Pass;
                } else {
                    if (stageData.stageCfg.id <= stageId) {
                        stageData.state = StageState.Pass;
                    } else if (stageData.stageCfg.id == stageId + 1) {
                        stageData.state = StageState.Open;
                    } else {
                        stageData.state = StageState.Lock;
                    }
                }
            }
            if (stageData.state != StageState.Pass && stageData.stageCfg.target == 1 && !isDanger) {
                stageData.isDanger = true;
                isDanger = true;
            } else {
                stageData.isDanger = false;
            }
        }
        if (data.cityType == 1) {
            let stageGroupCtrls = [];
            let offsetY = 0;
            let totalHeight = 0;
            this.content.removeAllChildren(false);
            for (let i = 0; i < groupDatas.length; i++) {
                const datas: StageData[] = groupDatas[i];
                let node = cc.instantiate(this.stageGroupPre);
                this.content.addChild(node);
                let ctrl = node.getComponent(CityStageGroupCtrl);
                ctrl.updateDatas(datas);
                node.y = offsetY;
                node.zIndex = -i;
                offsetY -= ctrl.getHeight();
                totalHeight += ctrl.getHeight();
                stageGroupCtrls.push(ctrl);
            }
            this.content.height = totalHeight;
            this.stageGroupCtrls = stageGroupCtrls;
        } else {
            let eliteStageGroupCtrls = [];
            let offsetY = 0;
            let totalHeight = 0;
            this.content.removeAllChildren(false);
            for (let i = 0; i < groupDatas.length; i++) {
                const datas: StageData[] = groupDatas[i];
                let node = cc.instantiate(this.stageEliteGroupPre);
                this.content.addChild(node);
                let ctrl = node.getComponent(EliteCityStageGroupCtrl);
                ctrl.updateDatas(datas, i);
                node.y = offsetY;
                node.zIndex = -i;
                offsetY -= ctrl.getHeight();
                totalHeight += ctrl.getHeight();
                eliteStageGroupCtrls.push(ctrl);
            }
            this.content.height = totalHeight;
            this.eliteStageGroupCtrls = eliteStageGroupCtrls;
        }

    }

    openStage(sid: number) {
        let data: StageData;
        if (!this.cityData) return;
        this.cityData.stageDatas.forEach(stageData => {
            if (stageData.stageCfg.id == sid) data = stageData;
        });
        if (!data) return;
        if (data.state == StageState.Lock) {
            gdk.gui.showMessage(`${data.cityId}-${data.sid}${gdk.i18n.t("i18n:MAP_TIP1")}`);
            return;
        }
        if (data.stageCfg.copy_id == 7 && data.state == StageState.Pass) {
            gdk.gui.showMessage(`${data.cityId}-${data.sid}${gdk.i18n.t("i18n:MAP_TIP2")}`);
            return;
        }
        gdk.panel.open(PanelId.EnterStageView, (node: cc.Node) => {
            let ctrl = node.getComponent(EnterStageViewCtrl);
            ctrl.updateData(data);
        });
    }

    onWorldBtnClick() {
        JumpUtils.openPanel({
            panelId: PanelId.WorldMapView,
            currId: PanelId.CityMapView,
        });
    }
    //精英副本按钮点击事件
    onEliteBtnClick() {
        //判断当前精英副本是否可以打开
        if (this.cityData.cityType == 7) {
            return;
        }
        if (this.cityData.cityId < 3) return;
        if (!this.eliteOpen) {
            let desc = gdk.i18n.t("i18n:PVE_ELITE_OPEN_TIP1");
            let stageStr = this.cityData.cityId + '-' + (this.eliteNeedPassStage % 100)
            let text = StringUtils.replace(desc, "@number", stageStr);
            gdk.gui.showMessage(text);
            return;
        }
        this.initData(1)
    }

    //主线副本按钮点击事件
    onStoryBtnClick() {
        if (this.cityData.cityType == 1) {
            return;
        }
        if (this.cityData) {
            if (this.cityData.cityType == 7) {
                this.initData()
            }
        } else {
            let args = this.args;
            //有参数模式
            if (args && args.length > 0) {
                this.isSinglePanel = false;
                // this.worldBtn.active = false;
                let data: CityData = args[0];
                this.updateData(data);
                this.curCityId = data.cityId;
                this.eliteOpen = CopyUtil.isOpenEliteStageChapter(this.curCityId);
            } else {
                this.isSinglePanel = true;
                this.worldBtn.active = true;
                this.requestData();
            }
        }
    }

    //切换章节按钮
    changeCityBtnClick(event, param) {
        let temNum = this.cityData.cityType == 7 ? 1 : 0;
        if (param == "1") {
            this.curCityId--;
        } else {
            this.curCityId++;
        }
        this.initData(temNum);
    }

    /**
    * 指定关卡移至视野中心
    * @param sid 
    */
    moveToCenter(sid: number) {
        this.stageGroupCtrls.forEach(group => {
            group.bindGuide();
            if (group.guideItems && group.guideItems.length > 0) this.guideItemNode.push(...group.guideItems);
        });

        if (!this.guideItemNode || this.guideItemNode.length <= 0) return;
        let trackCity: cc.Node;
        this.guideItemNode.forEach((item: any) => {
            if (item.data.stageCfg.id == sid) trackCity = item.node;
        })
        if (!trackCity) return;
        let ctrl = trackCity.getComponent(CityStageItemCtrl);
        let contentPos = this.content.position;
        let tempPos = trackCity.parent.convertToWorldSpaceAR(trackCity.position);
        let cityPosInScrollView = this.scrollView.node.convertToNodeSpaceAR(tempPos);
        let targetY = contentPos.y - cityPosInScrollView.y;
        if (targetY < this.contentOrginPos.y) {
            targetY = this.contentOrginPos.y; //上边界
        }
        else if (targetY - this.content.height > - this.scrollView.node.height / 2) {
            targetY = this.content.height - this.scrollView.node.height / 2;  // 下边界
        }
        targetY = Math.floor(targetY);
        let action = cc.sequence(
            cc.moveTo(.5, new cc.Vec2(this.content.x, targetY)),
            cc.callFunc(() => {
                ctrl && ctrl.setTrackIcon(false);
                if (GuideUtil.getCurGuide().activeCondition != '') {
                    ctrl && ctrl.setTrackIcon(true);
                }
                GuideUtil.activeGuide('trackAni#end');
            })
        );
        this.content.runAction(action);
    }
}