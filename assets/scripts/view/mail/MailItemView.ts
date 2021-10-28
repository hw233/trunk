import AwardScrollCtrl from '../task/ctrl/AwardScrollCtrl';
import GlobalUtil from '../../common/utils/GlobalUtil';
import StringUtils from '../../common/utils/StringUtils';
import UiListItem from '../../common/widgets/UiListItem';
import { AwardInfo } from '../task/model/TaskModel';
/*
 * @Author: yanshan.gao
 * @Date: 2020-04-28 10:51:07
 * @LastEditTime: 2020-05-26 11:41:39
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \client\assets\scripts\view\mail2\ctrl\MailItemCtrl.ts
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/mail2/MailItemView")
export default class MailItemView extends UiListItem {


    @property(cc.Label)
    title: cc.Label = null;

    @property(cc.Label)
    readState: cc.Label = null;

    @property(cc.Label)
    timeLab: cc.Label = null;

    @property(cc.Node)
    MailIcon: cc.Node = null;


    @property(cc.Node)
    awardNode: cc.Node = null


    @property(cc.Prefab)
    awardItem: cc.Prefab = null

    @property(cc.Node)
    mask: cc.Node = null;


    @property(cc.Node)
    rewardSprite: cc.Node = null;

    @property(AwardScrollCtrl)
    awardScroll: AwardScrollCtrl = null;

    mail: icmsg.MailInfo = null;
    // LIFE-CYCLE CALLBACKS:

    onLoad() {

    }
    updateView() {
        this.rewardSprite.active = false
        let info = this.data
        this.mail = info
        let titleText = info.title
        if (titleText.length > 8) {
            titleText = titleText.substr(0, 8) + "...";
        }
        this.title.string = titleText;
        this.awardScroll.initListView(5);
        if (info.attachs.length !== 0) {
            this.awardScroll.node.active = true
            this.MailIcon.active = false
            if (info.isRead) {
                this.readState.string = ""
                this.rewardSprite.active = true
            } else {
                this.readState.string = gdk.i18n.t("i18n:MAIL_TIP4")
            }

            //附件列表
            let attachs: Array<icmsg.MailAttach> = info.attachs;
            let awardInfos: AwardInfo[] = []
            for (let index = 0; index < attachs.length; index++) {
                const item: icmsg.MailAttach = attachs[index];
                awardInfos.push({
                    itemId: item.typeId,
                    num: item.num
                })
            }
            this.awardScroll.initAwardInfos(awardInfos)
        } else {
            this.awardScroll.node.active = false
            this.MailIcon.active = true
            this.readState.string = info.isRead ? gdk.i18n.t("i18n:MAIL_TIP5") : gdk.i18n.t("i18n:MAIL_TIP6")
        }
        if (info.isRead) {
            this.timeLab.node.color = cc.color(254, 236, 175)
        } else {
            //115,215,105
            this.timeLab.node.color = cc.color(115, 215, 105)
        }
        // this.awardScroll.node.off(cc.Node.EventType.MOUSE_WHEEL,null,this,true)
        // this.awardScroll.node.off(cc.Node.EventType.TOUCH_START, this._onStart, this, true)
        this.awardScroll.node.pauseSystemEvents(false);
        this.mask.active = info.isRead
        //更新时间提示文字
        this._updateTimeText(info)
    }
    _updateTimeText(info: icmsg.MailInfo) {
        let nowTime = GlobalUtil.getServerTime()
        let pastTime = Math.floor((nowTime - info.startTime) / 1000)
        let day = Math.floor(pastTime / 3600 / 24)
        let hour = Math.floor(pastTime / 3600)
        let min = Math.floor(pastTime / 60)
        let text = ""
        if (day > 0) {
            text = StringUtils.format(gdk.i18n.t("i18n:MAIL_TIP7"), day)//`${day}天前`
        } else if (hour > 0) {
            text = StringUtils.format(gdk.i18n.t("i18n:MAIL_TIP8"), hour)//`${hour}小时前`
        } else if (min > 0) {
            text = StringUtils.format(gdk.i18n.t("i18n:MAIL_TIP9"), min)//`${min}分钟前`
        } else {
            text = gdk.i18n.t("i18n:MAIL_TIP10")
        }
        this.timeLab.string = text
    }

    _onStart() {

    }
    // _itemSelect() {

    // }
}
