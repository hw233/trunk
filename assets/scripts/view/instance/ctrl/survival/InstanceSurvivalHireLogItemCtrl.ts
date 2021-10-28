import BagUtils from '../../../../common/utils/BagUtils';
import ChatEventCtrl from '../../../chat/ctrl/ChatEventCtrl';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import UiListItem from '../../../../common/widgets/UiListItem';
import { config } from 'process';
import { Hero_starCfg } from '../../../../a/config';
import { HeroCfg } from '../../../../../boot/configs/bconfig';

/** 
 * @Description: 新 生存训练 物品展示 
 * @Author: luoyong
 * @Date: 2019-04-18 11:02:40
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-10-08 17:11:28
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/instance/survival/InstanceSurvivalHireLogItemCtrl")
export default class InstanceSurvivalHireLogItemCtrl extends UiListItem {

    @property(cc.Label)
    timeLab1: cc.Label = null;

    @property(cc.Label)
    timeLab2: cc.Label = null;

    @property(cc.RichText)
    content: cc.RichText = null;

    _record: icmsg.SurvivalMerRecord

    start() {
        if (!this.content.getComponent(ChatEventCtrl)) {
            this.content.addComponent(ChatEventCtrl)
        }
    }

    updateView() {
        this._record = this.data
        let time = new Date(this._record.time * 1000);
        let mon = time.getMonth() + 1;
        let d = time.getDate();
        let h = time.getHours();
        let m = time.getMinutes()
        let timeStr = `${mon >= 10 ? mon : `0${mon}`}/${d >= 10 ? d : `0${d}`} ${h >= 10 ? h : `0${h}`}:${m >= 10 ? m : `0${m}`}`;
        let strs = timeStr.split(' ');
        this.timeLab1.string = strs[0];
        this.timeLab2.string = strs[1];


        let heroCfg = ConfigManager.getItemById(HeroCfg, this._record.hero.typeId)
        let starCfg = ConfigManager.getItemById(Hero_starCfg, this._record.hero.star)
        let nameColor = GlobalUtil.getHeroNameColor(starCfg.color)
        let nameOutlineColor = GlobalUtil.getHeroNameColor(starCfg.color, true)

        let itemStr = ''
        for (let i = 0; i < this._record.rewards.length; i++) {
            let itemCfg = BagUtils.getConfigById(this._record.rewards[i].typeId)
            if (i == this._record.rewards.length - 1) {
                itemStr += `<on click='itemClick' param='{${itemCfg.id}}'><color=${BagUtils.getColorInfo(itemCfg.color).color}>${itemCfg.name}</color>x${this._record.rewards[i].num}</on>`
            } else {
                itemStr += `<on click='itemClick' param='{${itemCfg.id}}'><color=${BagUtils.getColorInfo(itemCfg.color).color}>${itemCfg.name}</color>x${this._record.rewards[i].num}</on>,`
            }
        }
        this.content.string = `公会成员<color=#fff000><on click='playerClick' param='${this._record.borrowId}'>[${this._record.borrow}]</on></color>雇佣了<color=#fff000><on click='playerClick' param='${this._record.lendId}'>[${this._record.lend}]</on></color>的英雄<outline width=2 color=${nameOutlineColor}><color=${nameColor}><on click='heroImageClick' param='${JSON.stringify(this._record.hero)}'>[${heroCfg.name}]</on></c></outline>,<color=#fff000><on click='playerClick' param='${this._record.lendId}'>[${this._record.lend}]</on></color>获得了${itemStr}`
    }
}