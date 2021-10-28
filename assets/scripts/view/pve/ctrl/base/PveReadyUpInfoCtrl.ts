import BagModel from '../../../../common/models/BagModel';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import JumpUtils from '../../../../common/utils/JumpUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import PanelId from '../../../../configs/ids/PanelId';
import RoleModel from '../../../../common/models/RoleModel';
import SdkTool from '../../../../sdk/SdkTool';
import VipFlagCtrl from '../../../../common/widgets/VipFlagCtrl';
import { GeneralCfg } from '../../../../a/config';

/**
 * Pve场景上方玩家信息
 * @Author: luoyong
 * @Date: 2019-09-29 10:30:26
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-10-08 14:44:16
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/pve/base/PveReadyUpInfoCtrl")
export default class PveReadyUpInfoCtrl extends cc.Component {

    @property(cc.Label)
    roleName: cc.Label = null;

    @property(cc.Node)
    headFrame: cc.Node = null;

    @property(cc.Node)
    headIcon: cc.Node = null;

    @property(cc.Node)
    titleIcon: cc.Node = null;

    @property(cc.Label)
    diamondNum: cc.Label = null;

    @property(cc.Label)
    goldNum: cc.Label = null;

    // @property(cc.Label)
    // sweepNum: cc.Label = null;

    @property(cc.Label)
    lvLab: cc.Label = null;

    @property(cc.Label)
    expLab: cc.Label = null;

    @property(cc.ProgressBar)
    expPro: cc.ProgressBar = null;

    @property(cc.Label)
    fightLab: cc.Label = null;

    @property(cc.Node)
    vipFlag: cc.Node = null;

    roleModel: RoleModel;
    get bagModel(): BagModel { return ModelManager.get(BagModel); }

    sweepItemId: number = 150001;
    onEnable() {
        // 不显示充值按钮
        if (!SdkTool.tool.can_charge) {
            let n = cc.find('bg/layout2/bg1/diamondAdd', this.node);
            if (n) {
                n.active = false;
            }
        }
        this.roleModel = ModelManager.get(RoleModel);
        this._updateInfo()
        // gdk.e.on(BagEvent.UPDATE_BAG_ITEM, this._updateSweepNum, this);
        // gdk.e.on(BagEvent.UPDATE_ONE_ITEM, this._updateSweepNum, this);
    }

    _updateInfo() {
        this.roleName.string = this.roleModel.name
        //GlobalUtil.setSpriteIcon(this.node, this.headFrame, GlobalUtil.getHeadFrameById(this.roleModel.frame))
        //GlobalUtil.setSpriteIcon(this.node, this.headIcon, GlobalUtil.getHeadIconById(this.roleModel.head))

        this.diamondNum.string = GlobalUtil.numberToStr(this.roleModel.gems)
        this.goldNum.string = GlobalUtil.numberToStr(this.roleModel.gold, true)
        // this.sweepNum.string = BagUtils.getItemNumById(this.sweepItemId) + '';

        let vipCtrl = this.vipFlag.getComponent(VipFlagCtrl)
        vipCtrl.updateVipLv(this.roleModel.vipLv)
    }


    /**更新等级,经验信息 */
    @gdk.binding("roleModel.exp")
    @gdk.binding("roleModel.level")
    _updateLevel() {
        let maxLv = ConfigManager.getItems(GeneralCfg).length
        this.lvLab.string = `Lv${this.roleModel.level}`;
        let data = ConfigManager.getItemById(GeneralCfg, this.roleModel.level);
        let maxExp = data ? data.exp : 0
        if (this.roleModel.level >= maxLv) {
            this.expLab.string = "已满级"
            this.expPro.progress = 1
        } else {
            let p = this.roleModel.exp / maxExp;
            p = Math.min(p, 1)
            this.expPro.progress = p;
            this.expLab.string = ''//`${this.roleModel.exp}/${maxExp}`;
        }
    }

    /**更新金币数量 */
    @gdk.binding("roleModel.gold")
    _updateGold() {
        this.goldNum.string = GlobalUtil.numberToStr(this.roleModel.gold, true);
    }

    // _updateSweepNum() {
    //     this.sweepNum.string = BagUtils.getItemNumById(this.sweepItemId) + '';
    // }

    /**更新钻石数量 */
    @gdk.binding("roleModel.gems")
    _updateYuanBao() {
        this.diamondNum.string = GlobalUtil.numberToStr(this.roleModel.gems);
    }

    /**更新战力 */
    @gdk.binding("roleModel.power")
    _updateFight() {
        this.fightLab.string = `${this.roleModel.power}`;
    }

    /**更新头像 */
    @gdk.binding("roleModel.head")
    @gdk.binding("roleModel.setting")
    _updateHead() {
        GlobalUtil.setSpriteIcon(this.node, this.headIcon, GlobalUtil.getHeadIconById(this.roleModel.head))
    }

    /**更新头像框*/
    @gdk.binding("roleModel.frame")
    _updateHeadFrame() {
        let path = GlobalUtil.getHeadFrameById(this.roleModel.frame)
        GlobalUtil.setSpriteIcon(this.node, this.headFrame, path)
    }

    @gdk.binding("roleModel.title")
    _updateTitle() {
        let path = GlobalUtil.getHeadTitleById(this.roleModel.title)
        GlobalUtil.setSpriteIcon(this.node, this.titleIcon, path)
    }


    /**更新头像框*/
    @gdk.binding("roleModel.name")
    _updateRoleName() {
        this.roleName.string = this.roleModel.name
    }

    onDisable() {
        gdk.e.targetOff(this);
        GlobalUtil.setSpriteIcon(this.node, this.headFrame, null)
        GlobalUtil.setSpriteIcon(this.node, this.headIcon, null)
    }

    /**跳转购买金币 */
    buyGoldFunc() {
        if (!JumpUtils.ifSysOpen(2830, true)) {
            return
        }
        gdk.panel.open(PanelId.Alchemy)
    }

    /**跳转购买钻石 */
    buyDiamondFunc() {

        gdk.panel.open(PanelId.Recharge)
    }
}
