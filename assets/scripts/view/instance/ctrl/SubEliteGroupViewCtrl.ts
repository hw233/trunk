import ConfigManager from '../../../common/managers/ConfigManager';
import CopyModel, { CityData } from '../../../common/models/CopyModel';
import CopyUtil from '../../../common/utils/CopyUtil';
import EliteCityStageGroupCtrl from '../../map/ctrl/EliteCityStageGroupCtrl';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import SubEliteGroupRewardItemCtrl from './SubEliteGroupRewardItemCtrl';
import { Copycup_prizeCfg } from '../../../a/config';
import { StageData, StageState } from '../../map/ctrl/CityStageItemCtrl';
/** 
 * @Description: 精英副本关卡选择界面
 * @Author: luoyong  
 * @Date: 2020-07-02 14:00:53
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-12-22 12:37:56
 */



const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/instance/SubEliteGroupViewCtrl")
export default class SubEliteGroupViewCtrl extends gdk.BasePanel {

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    eliteGroupPre: cc.Prefab = null;

    @property(cc.Label)
    titelLabel: cc.Label = null;

    curCityId: number = 0;
    cityData: CityData = null;

    @property(cc.Node)
    rewardContent: cc.Node = null

    // @property(cc.Prefab)
    // uiSlotItem: cc.Prefab = null

    @property(cc.Prefab)
    rewardItemPre: cc.Prefab = null;

    @property(cc.ProgressBar)
    cupPro: cc.ProgressBar = null;

    get copyModel() { return ModelManager.get(CopyModel); }

    proW = 600;
    curIndex = 1;
    onEnable() {
        let args = this.args;
        if (args && args.length > 0) {
            this.curCityId = args[0];
            this.curIndex = args[1] + 1;
        }
        let cityData = this.copyModel.getCityData(this.curCityId, this.curIndex);
        this.updateData(cityData);

        NetManager.on(icmsg.DungeonElitesChapterRewardsRsp.MsgType, this._cupRewardRsp, this)
    }

    onDisable() {
        NetManager.targetOff(this)

    }

    updateData(data: CityData) {

        this.cityData = data;
        this.titelLabel.string = `${data.cityId}.` + data.cityName;
        let stageDatas = data.stageDatas;
        let stageNum = stageDatas.length;
        let groupDatas: StageData[][] = [];
        let passData = this.curIndex == 1 ? this.copyModel.eliteNovice : this.copyModel.eliteChallenge;
        let temData: icmsg.DungeonElitesStage[] = []
        passData.sort((a: icmsg.DungeonElitesStage, b: icmsg.DungeonElitesStage) => {
            return a.stageId - b.stageId
        })
        passData.forEach(stageData => {
            let temChap = CopyUtil.getChapterId(stageData.stageId)
            if (data.cityId == temChap) {
                temData.push(stageData);
            }
        })
        let stageId = temData.length == 0 ? 0 : temData[temData.length - 1].stageId;
        let num = 5
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

            if (stageData.state != StageState.Pass && stageData.stageCfg.target == 1 && !isDanger) {
                stageData.isDanger = true;
                isDanger = true;
            } else {
                stageData.isDanger = false;
            }
        }
        let eliteStageGroupCtrls = [];
        let offsetY = 0;
        let totalHeight = 0;
        this.content.removeAllChildren(false);
        for (let i = 0; i < groupDatas.length; i++) {
            const datas: StageData[] = groupDatas[i];
            let node = cc.instantiate(this.eliteGroupPre);
            this.content.addChild(node);
            let ctrl = node.getComponent(EliteCityStageGroupCtrl);
            ctrl.updateDatas(datas, i, this.curIndex);
            node.y = offsetY;
            node.zIndex = -i;
            offsetY -= ctrl.getHeight();
            totalHeight += ctrl.getHeight();
            eliteStageGroupCtrls.push(ctrl);
        }
        this.content.height = totalHeight;


        this.refreshCupData();
        // let cfg = ConfigManager.getItemByField(Copy_prizeCfg, "prize_id", data.cityId)

        // for (let index = 0; index < cfg.drop.length; index++) {
        //     let item = cc.instantiate(this.uiSlotItem)
        //     let comp = item.getComponent(UiSlotItem);
        //     this.rewardContent.addChild(item)
        //     comp.updateItemInfo(cfg.drop[index][0], cfg.drop[index][1])
        //     comp.itemInfo = {
        //         itemId: cfg.drop[index][0],
        //         series: 0,
        //         type: BagUtils.getItemTypeById(cfg.drop[index][0]),
        //         itemNum: cfg.drop[index][1],
        //         extInfo: null,
        //     }
        // }

    }

    refreshCupData() {

        let nums = CopyUtil.getEliteStageCurChaterData(this.cityData.cityId, this.curIndex - 1)
        let i = 1;
        //let dis = this.proW / data.stageDatas.length;

        //获取奖励信息
        let curCupNum = nums[0];
        let cfgs = ConfigManager.getItems(Copycup_prizeCfg, { 'copy_id': this.curIndex == 1 ? 12 : 13, 'chapter': this.cityData.cityId })
        let dis = this.proW / cfgs.length;
        let bit: number[] = this.curIndex == 1 ? this.copyModel.eliteNoviceBits : this.copyModel.eliteChallengeBits;
        this.rewardContent.removeAllChildren();
        cfgs.forEach(cfg => {
            let item = cc.instantiate(this.rewardItemPre)
            let ctrl = item.getComponent(SubEliteGroupRewardItemCtrl);
            let lock = i * 3 > curCupNum;
            let over = false;
            let old = bit[Math.floor((cfg.id - 1) / 8)];
            if ((old & 1 << (cfg.id - 1) % 8) >= 1) over = true;
            if (ctrl) ctrl.initData(cfg, lock, over);

            //判断当前奖励是否开启（开启是否已经领取）
            item.setParent(this.rewardContent);
            item.setPosition(dis * (i - 1) + dis / 2, 0);
            i++;
        })
        this.cupPro.progress = (nums[0] / nums[1])
    }

    _cupRewardRsp(rsp: icmsg.DungeonElitesChapterRewardsRsp) {
        if (rsp.copyId == 12) {
            this.copyModel.eliteNoviceBits = rsp.bits;
        } else {
            this.copyModel.eliteChallengeBits = rsp.bits;
        }
        this.refreshCupData();
        GlobalUtil.openRewadrView(rsp.rewards);
    }

}