import ActUtil from '../util/ActUtil';
import BagUtils from '../../../common/utils/BagUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import CopyModel from '../../../common/models/CopyModel';
import CopyUtil from '../../../common/utils/CopyUtil';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import GuideUtil from '../../../common/utils/GuideUtil';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import ShaderHelper from '../../../common/shader/ShaderHelper';
import TaskUtil from '../../task/util/TaskUtil';
import UiListItem from '../../../common/widgets/UiListItem';
import { ActivityEventId } from '../enum/ActivityEventId';
import { BagItem } from '../../../common/models/BagModel';
import { Copy_stageCfg, Mission_welfareCfg } from '../../../a/config';
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/KfflActView")
export default class KfflRewardItemCtrl extends UiListItem {

    @property(cc.Label)
    targetChapterLabel: cc.Label = null;

    @property(cc.Node)
    leftChapterTips: cc.Node = null;

    @property(cc.Label)
    rewardDec: cc.Label = null;

    @property(cc.Node)
    rewardNode: cc.Node = null;

    @property(cc.Node)
    progressFlag: cc.Node = null;

    @property(cc.Label)
    predictTime: cc.Label = null;

    @property(sp.Skeleton)
    spine: sp.Skeleton = null;

    state: number = 0; // 0-未完成 1-可领取 2-已领取
    isCurTask: boolean = false; //当前任务是否正在进行

    onDisable() {
        // this.progressFlag.stopAllActions();
    }

    updateView() {
        let cfg: Mission_welfareCfg = this.data;
        let preLvCfg = ConfigManager.getItemByField(Mission_welfareCfg, 'index', cfg.index - 1);
        let sid = cfg.args;
        this.targetChapterLabel.string = `${CopyUtil.getChapterId(sid)}/${CopyUtil.getSectionId(sid)}`;
        this.rewardDec.string = cfg.name;
        let lastSid = ModelManager.get(CopyModel).lastCompleteStageId;
        this.leftChapterTips.active = false;
        this.isCurTask = false;
        this.predictTime.string = cfg.time;
        if (lastSid < sid) {
            if (!preLvCfg || preLvCfg.args <= lastSid) {
                let cfgs = ConfigManager.getItemsByField(Copy_stageCfg, 'copy_id', 1);
                let ids = [];
                cfgs.forEach(cfg => {
                    ids.push(cfg.id);
                });
                let num = Math.max(0, ids.indexOf(lastSid));
                let targetIdx = ids.indexOf(sid);
                this.leftChapterTips.active = true;
                this.leftChapterTips.getChildByName('chapterLeftNum').getComponent(cc.Label).string = `${targetIdx - num}`;
                this.isCurTask = true;
            }
        }
        if (cfg.args == 110101) {
            GuideUtil.bindGuideNode(1701, this.rewardNode.getChildByName('btn'))
        }
        this.updateRewardNode();
        this.setProgressFlag();
    }

    updateRewardNode() {
        let lastSid = ModelManager.get(CopyModel).lastCompleteStageId;
        let mask = this.node.getChildByName('mask');
        let getFlag = this.rewardNode.getChildByName('sub_lingqu');
        let num = this.rewardNode.getChildByName('num').getComponent(cc.Label);
        let shader1 = num.node.getComponent(ShaderHelper);
        let shader2 = this.rewardNode.getChildByName('hdck_txt02').getComponent(ShaderHelper);
        num.string = this.data.reward[0][1] + '';
        mask.active = false;
        getFlag.active = false;
        GlobalUtil.setAllNodeGray(this.rewardNode, 0);
        shader1.enabled = false;
        shader2.enabled = false;
        if (lastSid < this.data.args) {
            GlobalUtil.setAllNodeGray(this.rewardNode, 1);
            shader1.enabled = true;
            shader2.enabled = true;
            this.state = 0;
            this.spine.node.active = false;
        }
        else {
            if (TaskUtil.getWelfareTaskState(this.data.id)) {
                mask.active = true;
                getFlag.active = true;
                this.state = 2;
                this.spine.node.active = false;
            }
            else {
                this.state = 1;
                this.spine.node.active = true;
            }
        }
    }

    /**
     * 设置进度状态标志
     */
    setProgressFlag() {
        this.progressFlag.active = false;
        let lastSid = ModelManager.get(CopyModel).lastCompleteStageId;
        if (this.data.args <= lastSid) {
            this.progressFlag.active = true;
            GlobalUtil.setSpriteIcon(this.node, this.progressFlag, `view/act/texture/kffl/hdck_jingdutiao04`);
        }
        else {
            this.progressFlag.active = false;
        }
        // if (this.isCurTask) {
        //     this.progressFlag.active = true;
        //     GlobalUtil.setSpriteIcon(this.node, this.progressFlag, `view/act/texture/kffl/hdck_jingdutiao03`);
        //     this.progressFlag.runAction(cc.repeatForever(
        //         cc.sequence(
        //             cc.scaleTo(1, 1.5),
        //             cc.scaleTo(1, 1)
        //         )
        //     ))
        // }
    }

    onRewardClick() {
        if (!ActUtil.ifActOpen(6)) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:KFFL_TIP5"));
            if (gdk.panel.isOpenOrOpening(PanelId.KfflActView)) {
                gdk.panel.hide(PanelId.KfflActView);
            }
            gdk.e.emit(ActivityEventId.KFFL_CLOSE);
            return;
        }
        if (this.state != 1) {
            let itemInfo: BagItem = {
                series: 0,
                itemId: this.data.reward[0][0],
                itemNum: 1,
                type: BagUtils.getItemTypeById(this.data.reward[0][0]),
                extInfo: null,
            }
            GlobalUtil.openItemTips(itemInfo);
        }
        else {
            let req = new icmsg.MissionWelfareAwardReq();
            req.id = this.data.id;
            NetManager.send(req, (resp: icmsg.MissionWelfareAwardRsp) => {
                let mask = this.node.getChildByName('mask');
                let getFlag = this.rewardNode.getChildByName('sub_lingqu');
                mask.active = true;
                getFlag.active = true;
                this.spine.node.active = false;
                this.state = 2;
                GlobalUtil.openRewadrView(resp.list);
            });
        }
    }
}
