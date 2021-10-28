import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import StringUtils from '../../../../common/utils/StringUtils';
import TrialInfo from '../../trial/model/TrialInfo';
import UiListItem from '../../../../common/widgets/UiListItem';
import { Copy_stageCfg, ItemCfg } from '../../../../a/config';
import { InstanceEventId } from '../../enum/InstanceEnumDef';

/**
 * @Description: 
 * @Author: yaozu.hu
 * @Date: 2020-09-17 19:44:23
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-12-22 12:33:48
 */
const { ccclass, property, menu } = cc._decorator;
@ccclass
@menu("qszc/view/instance/tower/TowerRewardItem2Ctrl")
export default class TowerRewardItem2Ctrl extends UiListItem {

    @property(cc.Sprite)
    bg: cc.Sprite = null;
    @property(cc.Label)
    nameLb: cc.Label = null;
    @property(cc.LabelOutline)
    nameLbline: cc.LabelOutline = null;
    @property(cc.Label)
    numLb: cc.Label = null;
    @property(cc.LabelOutline)
    numLbline: cc.LabelOutline = null;
    @property(cc.Node)
    rewardtip: cc.Node = null;

    @property(gdk.List)
    rewardList: gdk.List = null;
    @property(cc.Button)
    btn: cc.Button = null;

    @property(cc.Node)
    over: cc.Node = null;

    stageCfg: Copy_stageCfg

    model: TrialInfo = ModelManager.get(TrialInfo);
    click = false;

    bgStr: string[] = ['slt_xinxi01', 'slt_xinxi02']
    nameColors: cc.Color[] = [cc.color('#FFFC00'), cc.color('#35eaff')]
    namelineColors: cc.Color[] = [cc.color('#300E00'), cc.color('#003761')]

    numColors: cc.Color[] = [cc.color('#FFFC00'), cc.color('#a0aeae')]
    numlineColors: cc.Color[] = [cc.color('#300E00'), cc.color('#042640')]

    updateView() {
        this.click = false;
        this.stageCfg = this.data.data

        let cur = this.model.lastStageId % 10000
        let num1 = this.stageCfg.id % 10000
        this.nameLb.string = StringUtils.format(gdk.i18n.t("i18n:TOWER_REWARD_TIP1"), this.stageCfg.id % 10000);//'通关' + this.stageCfg.id % 10000 + '层'
        this.numLb.string = '(' + cur + '/' + num1 + ')'
        //type 1未通关 2可领取 3已领取
        this.btn.interactable = this.data.type == 2
        let index = this.data.type > 1 ? 0 : 1;

        if (this.data.type < 3) {
            this.over.active = false;
            this.rewardtip.active = this.data.type > 1
        } else {
            this.rewardtip.active = false;
            this.over.active = true;
        }
        let path = 'view/instance/texture/bg/tower/' + this.bgStr[index];
        GlobalUtil.setSpriteIcon(this.node, this.bg, path);
        this.nameLb.node.color = this.nameColors[index];
        this.nameLbline.color = this.namelineColors[index];
        this.numLb.node.color = this.numColors[index]
        this.numLbline.color = this.numlineColors[index]

        let listData: number[][] = [];
        for (let i = 0, l = this.stageCfg.drop_2.length; i + 1 < l; i += 2) {
            let data = [];
            data[0] = this.stageCfg.drop_2[i];
            data[1] = this.stageCfg.drop_2[i + 1];
            listData.push(data);
        }
        this.rewardList.datas = listData;

    }

    rewardBtnClick() {
        if (this.click) return;
        if (this.data.type != 2) return;
        this.click = true;
        let msg = new icmsg.DungeonTrialRewardsReq()
        msg.stageId = this.stageCfg.id
        NetManager.send(msg, (rsp: icmsg.DungeonTrialRewardsRsp) => {
            this.click = false;
            //判断是否包含技能
            let haveSkill = false;
            let skillInfo: icmsg.GoodsInfo;
            for (let i = 0; i < rsp.rewards.length; i++) {
                let info = rsp.rewards[i]
                let cfg = ConfigManager.getItemById(ItemCfg, info.typeId);
                if (cfg && cfg.func_id == "gnr_skill_lvup") {
                    haveSkill = true;
                    skillInfo = info;
                    break;
                }
            }
            if (haveSkill) {
                gdk.panel.setArgs(PanelId.TowerGetSkill, skillInfo)
                gdk.panel.open(PanelId.TowerGetSkill);
            } else {
                GlobalUtil.openRewadrView(rsp.rewards);
            }


            this.model.rewardBit = rsp.rewardFlag;
            gdk.e.emit(InstanceEventId.RSP_TOWER_REWARD_REFRESH)
        }, this)
    }
}
