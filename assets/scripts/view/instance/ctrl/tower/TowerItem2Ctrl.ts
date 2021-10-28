import BagUtils from '../../../../common/utils/BagUtils';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import PveRewardItemCtrl from '../../../pve/ctrl/view/PveRewardItemCtrl';
import TrialInfo from '../../trial/model/TrialInfo';
import UiListItem from '../../../../common/widgets/UiListItem';
import { Copy_stageCfg } from '../../../../a/config';

/**
 * @Description: 
 * @Author: luoyong
 * @Date: 2019-11-15 16:34:45
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2020-09-17 16:07:27
 */
const { ccclass, property, menu } = cc._decorator;
@ccclass
@menu("qszc/view/instance/tower/TowerItem2Ctrl")
export default class TowerItem2Ctrl extends UiListItem {

    @property(cc.Sprite)
    bg1: cc.Sprite = null;
    @property(cc.Sprite)
    bg2: cc.Sprite = null;
    @property(cc.Sprite)
    bg3: cc.Sprite = null;
    @property(cc.Label)
    nameLb: cc.Label = null;
    @property(cc.LabelOutline)
    nameLbLine: cc.LabelOutline = null;
    @property(cc.Node)
    rewardNode: cc.Node = null;
    @property(cc.Prefab)
    rewardItem: cc.Prefab = null;
    @property(cc.Node)
    tgNode: cc.Node = null;

    model: TrialInfo = ModelManager.get(TrialInfo);//爬塔信息
    stageCfg: Copy_stageCfg

    nameColors: cc.Color[] = [cc.color('#00E4FF'), cc.color('#f0ff01')]
    nameLineColors: cc.Color[] = [cc.color('#00266C'), cc.color('#6c1e00')]
    bg1Str: string[] = ['slt_ta01', 'slt_ta02']
    bg2Str: string[] = ['slt_tabeijing01', 'slt_tabeijing02']
    bg3Str: string[] = ['slt_biaoti01', 'slt_biaoti02']

    updateView() {
        this.stageCfg = this.data
        let index = 0;
        if (this.stageCfg.id == this.model.nextStage.id) {
            index = 1;
        }
        let path1 = 'view/instance/texture/tower/' + this.bg1Str[index]
        GlobalUtil.setSpriteIcon(this.node, this.bg1, path1);
        let path2 = 'view/instance/texture/tower/' + this.bg2Str[index]
        GlobalUtil.setSpriteIcon(this.node, this.bg2, path2);
        let path3 = 'view/instance/texture/tower/' + this.bg3Str[index]
        GlobalUtil.setSpriteIcon(this.node, this.bg3, path3);

        this.nameLb.string = this.stageCfg.name;
        this.nameLb.node.color = this.nameColors[index];
        this.nameLbLine.color = this.nameLineColors[index];

        this.rewardNode.active = this.stageCfg.id >= this.model.nextStage.id;
        this.tgNode.active = this.stageCfg.id < this.model.nextStage.id;

        if (this.stageCfg.id >= this.model.nextStage.id) {
            this._updateReward()
        }
    }
    _updateReward() {
        this.rewardNode.removeAllChildren()
        let rewards: any[], length: number;
        rewards = this.stageCfg.first_reward;
        length = rewards.length;
        for (let i = 0; i < length; i++) {
            let n: cc.Node = cc.instantiate(this.rewardItem);
            n.parent = this.rewardNode;
            n.scale = 0.9
            // 更新图标
            let c = n.getComponent(PveRewardItemCtrl);
            let extInfo = { itemId: rewards[i][0], itemNum: rewards[i][1] };
            let itemId = rewards[i][0];
            let type = BagUtils.getItemTypeById(itemId);
            let item = {
                series: itemId,
                itemId: itemId,
                itemNum: extInfo.itemNum,
                type: type,
                extInfo: extInfo
            };
            c.data = { index: i, info: item, delayShow: false, effect: false, isFirst: true, showItemInfo: true };
            c.updateView();
        }
    }
}
