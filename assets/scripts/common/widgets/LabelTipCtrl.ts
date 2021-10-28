import ConfigManager from '../managers/ConfigManager';
import { TipsCfg } from '../../a/config';

/**
 * 文本读取tipCfg 描述
 * @Author: luoyong
 * @Date:2019-08-20 14:29:01
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-12-18 11:59:03
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/common/widgets/LabelTipCtrl")
export default class LabelTipCtrl extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property(cc.RichText)
    richLabel: cc.RichText = null;

    @property({ type: cc.Integer, tooltip: "配置id，读取配置表tips对应的数据" })
    tipsId: number = 0;

    onEnable() {
        let tipCfg = ConfigManager.getItemById(TipsCfg, this.tipsId)
        if (this.label) {
            this.label.string = tipCfg.desc21
        }
        if (this.richLabel) {
            this.richLabel.string = tipCfg.desc21
        }
    }
}