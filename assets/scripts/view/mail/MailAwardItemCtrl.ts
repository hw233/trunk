import BagUtils, { ColorInfo } from '../../common/utils/BagUtils';
import ConfigManager from '../../common/managers/ConfigManager';
import GlobalUtil from '../../common/utils/GlobalUtil';
import UiListItem from '../../common/widgets/UiListItem';
import UiSlotItem from '../../common/widgets/UiSlotItem';
import { AwardInfo } from '../task/model/TaskModel';
import { BagType } from '../../common/models/BagModel';
import { Item_rubyCfg } from '../../a/config';
/*
 * @Author: your name
 * @Date: 2020-04-29 19:36:56
 * @LastEditTime: 2020-05-23 15:23:55
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \client\assets\scripts\view\mail2\MailAwardItemCtrl.ts
 */
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


const { ccclass, property } = cc._decorator;

@ccclass
export default class MailAwardItemCtrl extends UiListItem {


    @property(cc.Label)
    numLab: cc.Label = null;

    @property(cc.Node)
    Icon: cc.Node = null;

    @property(cc.Node)
    qualityIcon: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {

    }

    init(attach: icmsg.MailAttach) {
        this.numLab.string = "" + attach.num;
        let type = BagUtils.getItemTypeById(attach.typeId);
        let icon = GlobalUtil.getIconById(attach.typeId, BagType.ITEM)
        let qualityIcon = GlobalUtil.getQualityById(attach.typeId, type)
        this.Icon.active = true
        GlobalUtil.setSpriteIcon(this.Icon, this.Icon, icon)
        GlobalUtil.setSpriteIcon(this.qualityIcon, this.qualityIcon, qualityIcon)
    }




    // update (dt) {}
}
