import ConfigManager from '../../../../../common/managers/ConfigManager';
import CopyModel from '../../../../../common/models/CopyModel';
import CopyUtil from '../../../../../common/utils/CopyUtil';
import ErrorManager from '../../../../../common/managers/ErrorManager';
import JumpUtils from '../../../../../common/utils/JumpUtils';
import ModelManager from '../../../../../common/managers/ModelManager';
import NetManager from '../../../../../common/managers/NetManager';
import PveEventId from '../../../enum/PveEventId';
import PveFightModel from '../../../core/PveFightModel';
import PvePool from '../../../utils/PvePool';
import PveSceneState from '../../../enum/PveSceneState';
import PveSkillModel from '../../../model/PveSkillModel';
import PveTool from '../../../utils/PveTool';
import { Copysurvival_equipCfg } from '../../../../../a/config';
import { ListView, ListViewDir } from '../../../../../common/widgets/UiListview';
import { PveSkillType } from '../../../const/PveSkill';


/** 
 * 生存副本装备购买
 * @Author: sthoo.huang
 * @Date: 2020-07-16 11:50:54
 * @Last Modified by: jiangping
 * @Last Modified time: 2020-12-22 12:28:11
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/pve/view/equip/PveEquipBuyPanelCtrl")
export default class PveEquipBuyPanelCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;
    @property(cc.Node)
    content: cc.Node = null;
    @property(cc.Prefab)
    equipItem: cc.Prefab = null;

    @property(cc.Label)
    changeLb: cc.Label = null;

    private list: ListView = null;
    model: PveFightModel;
    equips: number[];

    onEnable() {
        let args = this.args;
        this.model = args[0];
        this.node.scale = 1;
        this.node.setPosition(cc.v2(0, 0))
        this.reqEquips();
    }

    onDisable() {
        ErrorManager.targetOff(this);
        NetManager.targetOff(this);
        this.list && this.list.destroy();
        this.list = null;
    }

    _initListView() {
        if (this.list) {
            return;
        }
        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.equipItem,
            cb_host: this,
            column: 3,
            gap_x: 12.5,
            gap_y: 30,
            async: true,
            direction: ListViewDir.Vertical,
        });
        this.list.onClick.on(this.onSelectItem, this);
    }

    // 请求装备列表
    reqEquips() {
        let smsg = new icmsg.SurvivalEquipPocketReq();
        JumpUtils.showGuideMask(); // 禁止操作，直到获取列表成功
        NetManager.send(smsg, (rmsg: icmsg.SurvivalEquipPocketRsp) => {
            // 获取装备列表成功返回
            JumpUtils.hideGuideMask();
            this.equips = rmsg.equipIds;
            this.updateView();
        }, this);
    }

    // 选择某项装备
    onSelectItem(data: number, index: number) {
        this.changeLb.string = 'x' + CopyUtil.getSurvivalHeroEquipChange();
    }

    updateView() {
        this._initListView();
        let a: number[][] = [];
        this.equips.forEach(id => id > 0 && a.push([id]));
        this.list.set_data(a);
        this.list.select_item(0);
    }

    // 刷新装备列表
    refreshEquip() {
        let smsg = new icmsg.SurvivalRefreshEquipPocketReq();
        JumpUtils.showGuideMask(); // 禁止操作，直到更换成功
        ErrorManager.on([3206, 114], () => {
            // 积分不足
            JumpUtils.hideGuideMask();
        }, this);
        NetManager.send(smsg, (rmsg: icmsg.SurvivalRefreshEquipPocketRsp) => {
            // 刷新装备成功返回
            JumpUtils.hideGuideMask();
            this.equips = rmsg.equipIds;
            this.updateView();
        }, this);
    }

    // 购买装备
    buyEquip() {
        let index = this.list.selected_index;
        let data: number[] = this.list.datas[index];
        if (index < 0 || !data) {
            return;
        }
        // let equipId = data[1];
        let smsg = new icmsg.SurvivalEquipBuyReq();
        smsg.equipIdx = index;
        JumpUtils.showGuideMask(); // 禁止操作，直到购买成功
        ErrorManager.on([3206, 114], () => {
            // 积分不足
            JumpUtils.hideGuideMask();
        }, this);
        NetManager.send(smsg, (rmsg: icmsg.SurvivalEquipBuyRsp) => {
            // 购买成功，允许操作
            JumpUtils.hideGuideMask();
            // 更新技能
            let m = this.model;
            if (m != null) {
                let t = m.ctrl;
                let e = rmsg.equipInfo;
                let c = ConfigManager.getItemById(Copysurvival_equipCfg, e.equipId);
                let s = m.getSkill(c.skill);
                // 存在旧的技能，并且为光环技能
                if (s && PveSkillType.isHalo(s.type)) {
                    // 清除旧的光环
                    if (!cc.js.isString(s.config.halo_id)) {
                        let a: any[] = s.config.halo_id;
                        if (cc.js.isNumber(a)) {
                            a = [a];
                        }
                        a.forEach(id => t.removeHalo(id));
                    }
                    // 清除BUFF
                    if (!cc.js.isString(s.config.buff_id)) {
                        let a: any[] = s.config.buff_id;
                        if (cc.js.isNumber(a)) {
                            a = [a];
                        }
                        a.forEach(id => t.removeBuff(id));
                    }
                }
                // 应用技能
                switch (t.sceneModel.state) {
                    case PveSceneState.Entering:
                    case PveSceneState.NextLevel:
                    case PveSceneState.Fight:
                    case PveSceneState.Pause:
                        // 添加新的技能，并且技能为光环技能，则主动使用
                        s = m.addSkill(c.skill, e.equipLv, true);
                        if (s && PveSkillType.isHalo(s.type)) {
                            let model: PveSkillModel = PvePool.get(PveSkillModel);
                            model.config = s.prop;
                            model.attacker = t;
                            model.addTarget(t);
                            PveTool.useSkill(model, t.sceneModel);
                        }
                        break;
                }
            }
            let copyModel = ModelManager.get(CopyModel)
            copyModel.survivalStateMsg.lastBuy = true;
            gdk.e.emit(PveEventId.PVE_SURVIVAL_EQUIOBUR);
            // 关闭界面
            this.close(-1);
        }, this);
    }

    //close()
    close(buttonIndex: number = -1) {
        let copyModel = ModelManager.get(CopyModel)
        let end = cc.v2(300, -(cc.winSize.height / 2 - 200))
        if (!copyModel.survivalStateMsg.lastBuy) {
            let tween = new cc.Tween();
            let mask = this.node.getChildByName('Mask');
            mask.active = false;
            tween.target(this.node)
                .to(0.3, { position: end, scale: 0 })
                .call(() => {
                    super.close(buttonIndex);
                    mask.active = true;
                })
                .start()
        } else {
            super.close(buttonIndex);
        }
    }
}
