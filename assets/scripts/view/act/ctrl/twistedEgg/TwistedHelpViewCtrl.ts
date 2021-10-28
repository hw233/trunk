import ActUtil from '../../util/ActUtil';
import ConfigManager from '../../../../common/managers/ConfigManager';
import { Operation_egg_tipsCfg, TipsCfg } from '../../../../a/config';
/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-10-24 15:13:01 
  */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/twistedEgg/TwistedHelpViewCtrl")
export default class TwistedHelpViewCtrl extends gdk.BasePanel {
    @property(cc.Node)
    tipsContent: cc.Node = null;

    @property(cc.Node)
    tipsLabItem: cc.Node = null;

    @property(cc.Node)
    weightContent: cc.Node = null;

    @property(cc.Node)
    weightLabItem: cc.Node = null;

    onEnable() {
        this._updateTips();
        this._updateWidget();
    }

    onDisable() {
    }

    _updateTips() {
        let startTime = new Date(ActUtil.getActStartTime(47));
        let endTime = new Date(ActUtil.getActEndTime(47) - 5000); //time为零点,减去5s 返回前一天
        let timeLab = `${startTime.getFullYear()}.${startTime.getMonth() + 1}.${startTime.getDate()}-${endTime.getFullYear()}.${endTime.getMonth() + 1}.${endTime.getDate()}`;
        let tipsCfg = ConfigManager.getItemById(TipsCfg, 51);
        let desc: string = tipsCfg.desc21;
        let items = desc.split('<br>');
        this.tipsContent.removeAllChildren();
        for (let i = 0; i < items.length; i++) {
            let str = items[i].replace('s1', timeLab);
            let item = cc.instantiate(this.tipsLabItem);
            item.active = true;
            item.parent = this.tipsContent;
            item.x = 0;
            item.getChildByName('lab').getComponent(cc.RichText).string = str;
            item.height = item.getChildByName('lab').height + 5;
        }
    }

    _updateWidget() {
        let actCfg = ActUtil.getCfgByActId(47);
        let cfgs = ConfigManager.getItemsByField(Operation_egg_tipsCfg, 'reward_type', actCfg.reward_type);
        this.weightContent.removeAllChildren();
        for (let i = 0; i < cfgs.length; i++) {
            let item = cc.instantiate(this.weightLabItem);
            item.active = true;
            item.parent = this.weightContent;
            item.x = 0;
            let lab1 = item.getChildByName('lab1').getComponent(cc.Label);
            let lab2 = item.getChildByName('lab2').getComponent(cc.Label);
            let lab3 = item.getChildByName('lab3').getComponent(cc.Label);
            lab1.string = cfgs[i].stress;
            lab2.string = cfgs[i].item;
            lab3.string = cfgs[i].weight;
            let color = cfgs[i].stress == '' ? '#f1b77f' : '#f08f20';
            [lab1.node, lab2.node, lab3.node].forEach(node => {
                node.color = cc.color().fromHEX(color);
            });
            // item.height = item.getChildByName('lab').height + 5;
        }
    }
}
