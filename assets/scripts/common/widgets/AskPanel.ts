import LoginModel from '../models/LoginModel';
import ModelManager from '../managers/ModelManager';

/** 
  * @Description: 2个按钮的提示面板
  * @Author: weiliang.huang  
  * @Date: 2019-04-19 10:57:57 
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-07-30 19:25:26
*/

export enum AskInfoCacheType {
    hero_fm_tip = "hero_fm_tip",
    enter_stage_tip = "enter_stage_tip",
    guild_setCamp_tip = "guild_setCamp_tip",
    career_up_item_tip = "career_up_item_tip",
    tower_check_tip = "tower_check_tip",
    refresh_store_tip = "refresh_store_tip",
    lottery_diamon_tip = "lottery_diamon_tip",
    guardian_change_tip = "guardian_change_tip",
    black_store_buy_tip = "black_store_buy_tip",
    expedition_select_hero = "expedition_select_hero",
    by_energize_tip = "by_energize_tip",
    guardian_star_up = "guardian_star_up",
    guardian_lv_up = "guardian_lv_up",
}

export interface AskInfoType {
    closeText?: string,
    sureText?: string,
    thisArg?: any,
    title?: any,
    closeCb?: Function,
    sureCb?: Function,
    descText?: string,
    isShowTip?: boolean,//是否显示勾选项
    tipText?: string,//勾选项内容
    tipSaveCache?: string,//勾选的保存缓存
    oneBtn?: boolean,//单按钮
    closeBtnCb?: Function,//右上角关闭按钮
}
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/common/widgets/AskPanel")
export default class AskPanel extends gdk.BasePanel {

    @property(cc.RichText)
    askLab: cc.RichText = null

    @property(cc.Label)
    sureLab: cc.Label = null

    @property(cc.Label)
    closeLab: cc.Label = null

    @property(cc.Node)
    tipNode: cc.Node = null

    @property(cc.Node)
    tipSelect: cc.Node = null

    @property(cc.Label)
    tipText: cc.Label = null

    closeCb: Function = null

    sureCb: Function = null

    closeBtnCb: Function = null

    tipSaveCache: string = ""

    thisArg: any = null
    _info: AskInfoType

    get loginModel(): LoginModel {
        return ModelManager.get(LoginModel)
    }

    clickBtn: boolean = false;

    onLoad() {

    }

    updatePanelInfo(info: AskInfoType) {
        this._info = info
        this.closeCb = info.closeCb
        this.sureCb = info.sureCb
        this.closeBtnCb = info.closeBtnCb
        this.thisArg = info.thisArg
        this.clickBtn = false;
        if (info.closeText) {
            this.closeLab.string = info.closeText
        }
        if (info.sureText) {
            this.sureLab.string = info.sureText
        }

        if (info.title) {
            this.title = info.title
        }
        if (info.descText) {
            this.askLab.string = info.descText
        }

        if (info.isShowTip) {
            this.tipNode.active = true
            this.tipSelect.active = !!this.loginModel.operateMap[this.tipSaveCache]
            this.tipText.string = info.tipText ? info.tipText : "本次登录不再提示"
            this.tipSaveCache = info.tipSaveCache
        }

        if (info.oneBtn) {
            this.closeLab.node.parent.active = false
            this.sureLab.node.parent.x = 0
        }
    }

    cancelFunc() {
        this.clickBtn = true;
        if (this.closeCb) {
            this.closeCb.call(this.thisArg)
        }
        this.close()
    }

    sureFunc() {
        this.clickBtn = true;
        if (this.sureCb) {
            this.sureCb.call(this.thisArg)
        }
        this.close()
    }

    //更新提示框
    updateTipInfo(info: AskInfoType) {

    }


    clickTipNode() {
        this.tipSelect.active = !this.tipSelect.active
        this.loginModel.operateMap[this.tipSaveCache] = this.tipSelect.active
    }

    close() {
        if (!this.clickBtn && this.closeBtnCb) {
            this.closeBtnCb.call(this.thisArg)
        }
        super.close();
    }

}