import ConfigManager from '../../../../common/managers/ConfigManager';
import MineGiftItemCtrl from './MineGiftItemCtrl';
import MineModel from '../../model/MineModel';
import MineUtil from '../../util/MineUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import { Activitycave_giftCfg } from '../../../../a/config';
import { ActivityEventId } from '../../enum/ActivityEventId';

/** 
 * @Description: 矿洞大作战兑换界面
 * @Author:yaozu.hu yaozu
 * @Date: 2020-08-04 11:29:25
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-12-22 11:34:58
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/mineCopy/MineGiftViewCtrl")
export default class MineGiftViewCtrl extends gdk.BasePanel {

    @property([cc.Node])
    prizeBtns: cc.Node[] = [];

    @property(cc.Node)
    lineList1: cc.Node = null;
    @property(cc.Node)
    lineList2: cc.Node = null;
    @property(cc.Node)
    itemList: cc.Node = null;
    @property(cc.Label)
    jifen: cc.Label = null;
    @property(cc.Prefab)
    giftItemPre: cc.Prefab = null;

    btnNameColor: string[] = ['#FFEBBA', '#BB9168'];
    btnNameLineColor: string[] = ['#7B4615', '#34190C'];

    curSelectNum: number = -1;
    //(-210,-275) (140,130)
    model: MineModel;
    onEnable() {
        this.model = ModelManager.get(MineModel)
        this.selectPrizeExchange(0);

        this.jifen.string = MineUtil.getCurGiftNum() + '';

    }
    selectPrizeExchange(index: number) {
        //更新按钮状态
        if (this.curSelectNum < 0) {
            this.curSelectNum = index
            let newNode = this.prizeBtns[index];
            let newSelect = newNode.getChildByName('select');
            let newName = newNode.getChildByName('name');
            let newOutline = newName.getComponent(cc.LabelOutline);
            newName.color = cc.color(this.btnNameColor[0])
            newOutline.color = cc.color(this.btnNameLineColor[0])
            newSelect.active = true;
        } else {
            let oldNode = this.prizeBtns[this.curSelectNum];
            let oldSelect = oldNode.getChildByName('select');
            let oldName = oldNode.getChildByName('name');
            let oldOutline = oldName.getComponent(cc.LabelOutline);
            oldName.color = cc.color(this.btnNameColor[1])
            oldOutline.color = cc.color(this.btnNameLineColor[1])
            oldSelect.active = false;
            this.curSelectNum = index;
            let newNode = this.prizeBtns[index];
            let newSelect = newNode.getChildByName('select');
            let newName = newNode.getChildByName('name');
            let newOutline = newName.getComponent(cc.LabelOutline);
            newName.color = cc.color(this.btnNameColor[0])
            newOutline.color = cc.color(this.btnNameLineColor[0])
            newSelect.active = true;
        }

        this.refreshItemInfo();

    }

    refreshItemInfo() {

        this.lineList1.children.forEach(child => {
            child.active = false;
        })
        this.lineList2.children.forEach(child => {
            child.active = false;
        })

        this.itemList.children.forEach(child => {
            child.destroy();
        })
        let cfgs = ConfigManager.getItemsByField(Activitycave_giftCfg, 'page', this.curSelectNum + 1);
        //刷新线路
        cfgs.forEach(cfg => {
            let node: cc.Node = cc.instantiate(this.giftItemPre);//PvePool.get(this.giftItemPre);
            //获取天赋是否解锁
            let level = MineUtil.getCurGiftItemLockState(cfg.gift);
            let type = cfg.group
            let pos = cfg.coordinate.split(',')
            let numX = parseInt(pos[0]);
            let numY = parseInt(pos[1]);
            if (numX > 1) {
                let temNode = type == 1 ? this.lineList1 : this.lineList2;
                let graylineNode = temNode.getChildByName(`grayline_${numX}_${numY}`)
                graylineNode.active = true;
                if (level >= 0) {
                    let lineNode = temNode.getChildByName(`line_${numX}_${numY}`)
                    lineNode.active = true;
                }
            }
            node.setParent(this.itemList)
            node.setPosition(cc.v2(-210 + 280 * (type - 1) + 140 * (numY - 1), -275 + 130 * (numX - 1)))
            let ctrl = node.getComponent(MineGiftItemCtrl);
            ctrl.initData(cfg, level, this.refreshCurgiftNum, this)

        })
    }

    pageBtnClick(e, index) {
        this.selectPrizeExchange(parseInt(index))
    }

    //重置天赋按钮点击事件
    resetGiftBtnClick() {

        let msg = new icmsg.ActivityCaveResetGiftReq();
        let page = this.curSelectNum + 1;
        msg.page = page;
        NetManager.send(msg, (rsp: icmsg.ActivityCaveResetGiftRsp) => {
            let gifts = this.model.curCaveSstate.gift;
            if (gifts.length > 0) {
                for (let i = gifts.length - 1; i >= 0; i--) {
                    if (Math.floor(gifts[i].giftId / 1000) == page) {
                        gifts.splice(i, 1);
                    }
                }
            }
            gdk.e.emit(ActivityEventId.ACTIVITY_MINE_GIFT_CHANGE);
            this.selectPrizeExchange(page - 1);
            this.refreshCurgiftNum();
        })
    }

    //刷新当前积分
    refreshCurgiftNum(refresh: boolean = false) {
        let str = MineUtil.getCurGiftNum() + '';
        this.jifen.string = str
        if (refresh) {
            this.selectPrizeExchange(this.curSelectNum);
        }
    }
}
