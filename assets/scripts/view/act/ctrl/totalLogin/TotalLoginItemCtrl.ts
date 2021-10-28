import ActivityModel from '../../model/ActivityModel';
import ActivityUtils from '../../../../common/utils/ActivityUtils';
import ActUtil from '../../util/ActUtil';
import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { Activity_cumloginCfg } from '../../../../a/config';
import { ActivityEventId } from '../../enum/ActivityEventId';
/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-08-06 09:51:12 
  */// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/totalLogin/TotalLoginItemCtrl")
export default class TotalLoginItemCtrl extends cc.Component {
    @property(cc.Node)
    bg: cc.Node = null;

    @property(cc.Node)
    dayLabel: cc.Node = null;

    @property(UiSlotItem)
    slot: UiSlotItem = null;

    @property(cc.Node)
    mask: cc.Node = null;

    @property(sp.Skeleton)
    spine: sp.Skeleton = null;

    @property(cc.Node)
    getTips: cc.Node = null;

    day: number;
    cfg: Activity_cumloginCfg;
    updateView(day: number, rewardType: number) {
        // #F3D775    #2FFFF3
        this.day = day;
        let loginDay = ModelManager.get(ActivityModel).totalLoginDays;
        this.cfg = ConfigManager.getItem(Activity_cumloginCfg, (cfg: Activity_cumloginCfg) => {
            if (cfg.days == day && cfg.type == rewardType) return true;
        });
        let slotCfg = BagUtils.getConfigById(this.cfg.rewards[0]);
        // this.select.active = day == loginDay;
        this.spine.node.active = false;
        this.mask.active = false;
        if (day <= loginDay) {
            if (ActivityUtils.getTotalLoginRewardState(this.cfg.index)) {
                this.getTips.active = false;
                GlobalUtil.setSpriteIcon(this.node, this.bg, `view/act/texture/totalLogin/ljdl_putongdi`);
                GlobalUtil.setSpriteIcon(this.node, this.dayLabel, `view/act/texture/totalLogin/ljdl_${day}`);
                this.mask.active = true;
            }
            else {
                this.spine.node.active = true;
                this.spine.setAnimation(0, 'stand2', true);
                this.getTips.active = true;
                GlobalUtil.setSpriteIcon(this.node, this.bg, `view/act/texture/totalLogin/ljdl_dangtian`);
                GlobalUtil.setSpriteIcon(this.node, this.dayLabel, `view/act/texture/totalLogin/ljdl_huang${day}`);
            }
        }
        else {
            this.getTips.active = false;
            GlobalUtil.setSpriteIcon(this.node, this.bg, `view/act/texture/totalLogin/ljdl_putongdi`);
            GlobalUtil.setSpriteIcon(this.node, this.dayLabel, `view/act/texture/totalLogin/ljdl_${day}`);
        }

        this.slot.updateItemInfo(this.cfg.rewards[0], this.cfg.rewards[1]);
        this.slot.onClick.on(() => {
            if (day > loginDay) {
                let itemInfo = {
                    series: null,
                    itemId: this.cfg.rewards[0],
                    itemNum: this.cfg.rewards[1],
                    type: BagUtils.getItemTypeById(this.cfg.rewards[0]),
                    extInfo: null,
                }
                GlobalUtil.openItemTips(itemInfo, true, false);
            }
            else {
                this.onClick();
            }
        });
    }

    onClick() {
        if (!ActUtil.ifActOpen(10)) {
            gdk.e.emit(ActivityEventId.ACTIVITY_TIME_IS_OVER);
            return;
        }

        let loginDay = ModelManager.get(ActivityModel).totalLoginDays;
        if (this.day > loginDay) {
            GlobalUtil.showMessageAndSound(gdk.i18n.t("i18n:ACT_LOGIN_TIP1"));
            return;
        }

        let req = new icmsg.ActivityCumloginAwardReq();
        req.loginDays = this.cfg.days;
        NetManager.send(req, (resp: icmsg.ActivityCumloginAwardRsp) => {
            this.getTips.active = false;
            this.spine.node.active = false;
            GlobalUtil.setSpriteIcon(this.node, this.bg, `view/act/texture/totalLogin/ljdl_putongdi`);
            GlobalUtil.setSpriteIcon(this.node, this.dayLabel, `view/act/texture/totalLogin/ljdl_${this.day}`);
            this.mask.active = true;
            GlobalUtil.openRewadrView(resp.list);
        });
    }
}
