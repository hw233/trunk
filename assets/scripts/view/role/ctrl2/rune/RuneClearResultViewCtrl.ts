import ConfigManager from '../../../../common/managers/ConfigManager';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { Rune_clearCfg, RuneCfg } from '../../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-03-01 19:55:19 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/lottery/RuneClearResultViewCtrl")
export default class RuneClearResultViewCtrl extends gdk.BasePanel {
  @property(cc.Node)
  winBg: cc.Node = null;

  @property(cc.Node)
  failBg: cc.Node = null;

  @property(cc.Node)
  slot: cc.Node = null

  @property(cc.Label)
  nameLab: cc.Label = null;

  @property(cc.Label)
  lv: cc.Label = null;

  @property([cc.Label])
  oldLabs: cc.Label[] = [];

  @property([cc.Label])
  newLabs: cc.Label[] = [];

  resp: icmsg.RuneWashRsp;
  onEnable() {
    this.resp = this.args[0];
    this._updateView();
  }

  onDisable() {
  }

  _updateView() {
    let newCfg = ConfigManager.getItemByField(RuneCfg, 'rune_id', parseInt(this.resp.newRuneId.toString().slice(0, 6)))
    let oldCfg = ConfigManager.getItemByField(RuneCfg, 'rune_id', parseInt(this.resp.oldRuneId.toString().slice(0, 6)))
    let newLv = parseInt(this.resp.newRuneId.toString().slice(6));
    let oldLv = parseInt(this.resp.oldRuneId.toString().slice(6));
    let isSucc = newLv > oldLv;
    this.failBg.active = !isSucc;
    this.winBg.active = isSucc;
    let ctrl = this.slot.getComponent(UiSlotItem);
    ctrl.updateItemInfo(newCfg.rune_id);
    this.lv.string = newCfg.level + '';
    this.nameLab.string = `${newCfg.name}+${newLv}`;
    this.nameLab.node.color = cc.color().fromHEX(isSucc ? '#FFCE4B' : '#FFFFFF');
    let infos = [
      ConfigManager.getItemByField(Rune_clearCfg, 'clear_lv', newLv, { type: 1 }),
      ConfigManager.getItemByField(Rune_clearCfg, 'clear_lv', oldLv, { type: 1 })
    ];
    [this.newLabs, this.oldLabs].forEach((n, idx) => {
      let [lvLab, attrLab] = n;
      lvLab.string = `+${infos[idx].clear_lv}`;
      attrLab.string = `+${Math.floor(infos[idx].add)}%`;
      attrLab.node.color = cc.color().fromHEX(isSucc ? '#00FF00' : '#FF0000');
      lvLab.node.color = cc.color().fromHEX(isSucc ? '#00FF00' : '#FF0000');
    });
  }
}
