import ActUtil from '../util/ActUtil';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import JumpUtils from '../../../common/utils/JumpUtils';
import LimitActivityItemCtrl from './LimitActivityItemCtrl';
import PanelId from '../../../configs/ids/PanelId';
import RedPointUtils from '../../../common/utils/RedPointUtils';
import { MainInterface_timeplayCfg } from '../../../a/config';


/** 
 * @Description: 限时活动
 * @Author: yaozu.hu  
 * @Date: 2019-03-27 16:57:13 
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-07-29 09:49:49
 */
const { ccclass, property, menu } = cc._decorator;


@ccclass
@menu("qszc/view/act/LimitTimeActivityCtrl")
export default class LimitTimeActivityCtrl extends gdk.BasePanel {

    @property(cc.Node)
    ListNode: cc.Node = null;
    @property(cc.Prefab)
    itemPre: cc.Prefab = null;

    onEnable() {
        let asg = gdk.panel.getArgs(PanelId.LimitTimeActivity)
        let pos = this.node.parent.convertToNodeSpaceAR(asg[0])
        this.node.setPosition(pos);
        if (this.node.x < -250) {
            this.node.x = -250
        } else if (this.node.x > 250) {
            this.node.x = 250
        }

        let temCfgs = ConfigManager.getItems(MainInterface_timeplayCfg);
        let listData = []
        let nowTime = GlobalUtil.getServerTime();
        temCfgs.forEach(cfg => {
            //type 0多久后开启 1多久后结束
            if (!ActUtil.ifActOpen(cfg.activity_id)) {
                if (!cc.js.isString(cfg.before_open)) {
                    let before = cfg.before_open as any;
                    let startTime = ActUtil.getActStartTime(cfg.activity_id) || 0;
                    let beforTime = startTime - (before[2] * 24 * 60 * 60 + before[3] * 60 * 60 + before[4] * 60) * 1000;
                    if (nowTime < startTime && nowTime > beforTime && (cfg.show != '' || JumpUtils.ifSysOpen(cfg.system))) {
                        listData.push({ cfg: cfg, type: 0, time: startTime - nowTime })
                    }
                }
            } else if (cfg.show != '' || JumpUtils.ifSysOpen(cfg.system)) {
                let endTime = ActUtil.getActEndTime(cfg.activity_id)
                listData.push({ cfg: cfg, type: 1, time: endTime - nowTime })
            }
        })
        if (listData.length == 0) {
            this.close()
            return
        }

        listData.sort((a: any, b: any) => {
            return a.cfg.sorting - b.cfg.sorting
        })

        if (listData.length == 1) {
            this.activityClick(listData[0].cfg, null, 1);
            return;
        }

        this.ListNode.removeAllChildren();

        gdk.Timer.once(100, this, () => {
            listData.forEach(data => {
                let node = cc.instantiate(this.itemPre);
                let ctrl = node.getComponent(LimitActivityItemCtrl);
                ctrl.initData(data.cfg, data.type, data.time, this.activityClick, this);
                node.setParent(this.ListNode);
            })
        })

    }

    /**
     * Item反馈事件
     * @param cfg 
     * @param state 1:点击 2:活动消失
     */
    activityClick(cfg: MainInterface_timeplayCfg, node: cc.Node, state: number) {
        if (state == 1) {
            if (24 <= cfg.activity_id && cfg.activity_id <= 30) {
                if (JumpUtils.ifSysOpen(RedPointUtils.get_copy_open_lv(15), true)) {
                    gdk.panel.open(PanelId.EternalCopyView);
                }
            }
            this.close();
        } else {
            let index = this.ListNode.children.indexOf(node);
            if (index >= 0) {
                this.ListNode.removeChild(node)
                node.destroy();
            }
        }
    }
}
