import BagUtils from '../../../common/utils/BagUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import RoleModel from '../../../common/models/RoleModel';
import ShaderHelper from '../../../common/shader/ShaderHelper';
import StoreModel from '../../store/model/StoreModel';
import TaskUtil from '../../task/util/TaskUtil';
import UiListItem from '../../../common/widgets/UiListItem';
import { BagItem } from '../../../common/models/BagModel';
import { Mission_welfare2Cfg } from '../../../a/config';
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/KfflRewardItem2Ctrl")
export default class KfflRewardItem2Ctrl extends UiListItem {

    @property(cc.Label)
    targetLoginDaysLabel: cc.Label = null;

    @property(cc.Node)
    leftLoginDaysTips: cc.Node = null;

    @property(cc.Label)
    rewardDec: cc.Label = null;

    @property(cc.Node)
    rewardNode: cc.Node = null;

    @property(cc.Node)
    progressFlag: cc.Node = null;

    @property(sp.Skeleton)
    spine: sp.Skeleton = null;

    // @property(cc.Label)
    // predictTime: cc.Label = null;

    state: number = 0; // 0-未完成 1-可领取 2-已领取
    isCurTask: boolean = false; //当前任务是否正在进行

    onDisable() {
        this.progressFlag.stopAllActions();
    }

    updateView() {
        let cfg: Mission_welfare2Cfg = this.data;
        let preCfg = ConfigManager.getItemByField(Mission_welfare2Cfg, 'index', cfg.index - 1);
        this.targetLoginDaysLabel.string = `${cfg.days}`;
        this.rewardDec.string = cfg.name;
        let loginDays = ModelManager.get(RoleModel).loginDays;
        this.leftLoginDaysTips.active = false;
        this.isCurTask = false;
        // this.predictTime.string = cfg.time;
        if (loginDays < cfg.days) {
            if (!preCfg || preCfg.days <= loginDays) {
                this.leftLoginDaysTips.active = true;
                this.leftLoginDaysTips.getChildByName('chapterLeftNum').getComponent(cc.Label).string = `${cfg.days - loginDays}`;
                this.isCurTask = true;
            }
        }
        // if (cfg.args == 110101) {
        //     GuideUtil.bindGuideNode(1701, this.rewardNode.getChildByName('btn'))
        // }
        this.updateRewardNode();
        this.setProgressFlag();
    }

    updateRewardNode() {
        let loginDays = ModelManager.get(RoleModel).loginDays;
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
        if (loginDays < this.data.days) {
            GlobalUtil.setAllNodeGray(this.rewardNode, 1);
            shader1.enabled = true;
            shader2.enabled = true;
            this.state = 0;
            this.spine.node.active = false;
        }
        else {
            if (TaskUtil.getWelfare2TaskState(this.data.id)) {
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
        let loginDays = ModelManager.get(RoleModel).loginDays;
        if (this.data.days <= loginDays) {
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
            if (!ModelManager.get(StoreModel).isBuyWelfare2) {
                gdk.gui.showMessage(gdk.i18n.t("i18n:KFFL_TIP4"));
                return;
            }
            let req = new icmsg.MissionWelfare2AwardReq();
            req.id = this.data.id;
            NetManager.send(req, (resp: icmsg.MissionWelfare2AwardRsp) => {
                let mask = this.node.getChildByName('mask');
                let getFlag = this.rewardNode.getChildByName('sub_lingqu');
                mask.active = true;
                getFlag.active = true;
                this.state = 2;
                this.spine.node.active = false;
                GlobalUtil.openRewadrView(resp.list);
            });
        }
    }
}
