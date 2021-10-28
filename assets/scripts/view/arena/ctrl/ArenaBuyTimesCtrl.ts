import ArenaModel from '../../../common/models/ArenaModel';
import ConfigManager from '../../../common/managers/ConfigManager';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import { Arena_buyCfg } from '../../../a/config';

/** 
 * 购买竞技次数
 * @Author: weiliang.huang  
 * @Description: 
 * @Date: 2019-03-21 09:57:55 
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-12-22 11:48:29
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/arena/ArenaBuyTimesCtrl")
export default class ArenaBuyTimesCtrl extends gdk.BasePanel {

    @property(cc.Label)
    timesLabel: cc.Label = null;

    @property(cc.Label)
    priceLabel: cc.Label = null;

    model: ArenaModel = ModelManager.get(ArenaModel);

    num: number = 0;
    money: number = 0;
    id: number = 0;
    cfg: Arena_buyCfg[];

    onLoad() {
        this.cfg = ConfigManager.getItems(Arena_buyCfg);
        if (!this.check()) {
            this.close();
        }
    }

    onEnable() {
        let cfg = this.cfg;
        this.num = this.model.buyNum >= cfg.length ? 0 : cfg[this.model.buyNum].buy_number;
        this.money = this.model.buyNum >= cfg.length ? 0 : cfg[this.model.buyNum].money_cost[1];
        this.timesLabel.string = '' + this.num;
        this.priceLabel.string = this.money + '';
        this.id = this.model.buyNum >= cfg.length ? -1 : cfg[this.model.buyNum].id;
    }

    check(): boolean {
        if (!this.model.isArenaInfoGet) {
            gdk.gui.showMessage(gdk.i18n.t('i18n:GET_ARENA_DATA'));
            return false;
        } else {
            if (this.model.buyNum >= this.cfg.length) {
                gdk.gui.showMessage(gdk.i18n.t('i18n:BUY_TIME_OUT'));
                return false;
            }
        }
        return true;
    }

    buy() {
        if (!this.check()) return;
        NetManager.send(new icmsg.ArenaBuyReq(), () => {
            if (!cc.isValid(this.node)) return;
            if (!this.enabled) return;
            gdk.gui.showMessage(gdk.i18n.t('i18n:BUY_ARENA_TIME_SUCCESS'));
            this.close();
        });
    }
}
