import ActivityModel from '../../model/ActivityModel';
import AwakeStarUpItemCtrl from './AwakeStarUpItemCtrl';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import HeroUtils from '../../../../common/utils/HeroUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import RedPointUtils from '../../../../common/utils/RedPointUtils';
import StringUtils from '../../../../common/utils/StringUtils';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { Store_awake_giftCfg } from '../../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-06-03 11:24:51 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/awakeStarUp/AwakeStarUpViewCtrl")
export default class AwakeStarUpViewCtrl extends gdk.BasePanel {
    @property(sp.Skeleton)
    heroSpine: sp.Skeleton = null;

    @property(cc.Node)
    n1: cc.Node = null;

    @property(cc.Node)
    n2: cc.Node = null;

    @property(cc.Node)
    heroSlot: cc.Node = null;

    @property(cc.Node)
    freeItem: cc.Node = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    giftItemPrefab: cc.Prefab = null;

    @property(cc.Node)
    tabs: cc.Node = null;

    @property(cc.Node)
    tabBtn: cc.Node = null;

    get actModel(): ActivityModel { return ModelManager.get(ActivityModel); }

    actId: number = 111;
    stars: number[] = [10, 9, 8, 7, 6];
    curSelectStar: number;
    onEnable() {
        //定位可领奖的最高星
        for (let i = 0; i < this.stars.length; i++) {
            let b = RedPointUtils.has_awake_star_up_gift_by_star(this.stars[i]);
            if (b) {
                this.curSelectStar = this.stars[i];
                break;
            }
        }

        //没有可领取奖励时,定位有奖励的最近星级
        if (!this.curSelectStar) {
            for (let j = this.stars.length - 1; j >= 0; j--) {
                let star = this.stars[j];
                let info = this.actModel.awakeStarUpGiftMap[star];
                if (!info || info.awardList.indexOf(0) !== -1) {
                    this.curSelectStar = this.stars[j];
                    break;
                }
            }
        }

        if (!this.curSelectStar) {
            this.curSelectStar = this.stars[0];
        }
        this._refresh();
        NetManager.on(icmsg.ActivityAwakeGiftSetRsp.MsgType, this._refresh, this);
        NetManager.on(icmsg.ActivityAwakeGiftInfoRsp.MsgType, this._refresh, this);
    }

    onDisable() {
        this.n1.getChildByName('arrow').stopAllActions();
        this.n1.getChildByName('arrow').setPosition(221, 136);
        NetManager.targetOff(this);
    }

    onAddHeroBtnClick(e, type) {
        // if (parseInt(type) >= 1) {
        //     let info = this.actModel.awakeStarUpGiftMap[this.curSelectStar];
        //     if (info && info.awardList[0] && info.awardList[1]) {
        //         gdk.gui.showMessage('该英雄已绑定,不可替换');
        //         return;
        //     }
        // }
        gdk.panel.setArgs(PanelId.AwakeStarUpSelectView, this.curSelectStar);
        gdk.panel.open(PanelId.AwakeStarUpSelectView);
    }

    _refresh() {
        this._updateBtns();
        this._updateView();
    }

    _updateBtns() {
        if (!cc.isValid(this.node)) return;
        if (!this.node.activeInHierarchy) return;

        this.tabs.removeAllChildren();
        this.stars.forEach((star, idx) => {
            let n = cc.find('btn' + star, this.tabBtn);
            if (!n) {
                n = cc.instantiate(this.tabBtn);
                n.name = 'btn' + star;
                n.parent = this.tabs;
                n.active = true;
                let desc = n.getChildByName('label').getComponent(cc.Label);
                desc.string = `${star}星`;
                let select = this.curSelectStar == star;
                if (select) {
                    this.curSelectStar = star;
                    n.targetOff(this);
                }
                else {
                    n.on('click', () => {
                        this.curSelectStar = star;
                        this._refresh();
                    }, this);
                }
                GlobalUtil.setSpriteIcon(
                    this.node,
                    cc.find('bg', n),
                    `common/texture/act/jxlb_yeqian0${select ? 2 : 1}`
                );
                desc.node.color = cc.color().fromHEX(`${select ? '#fff9df' : '#b5834f'}`);
                desc.node.getComponent(cc.LabelOutline).color = cc.color().fromHEX(`${select ? '#ff7a19' : '#502114'}`);
            }
        });
    }

    _updateView() {
        if (!cc.isValid(this.node)) return;
        if (!this.node.activeInHierarchy) return;
        if (!this.curSelectStar) return;
        let info = this.actModel.awakeStarUpGiftMap[this.curSelectStar];
        if (!this.actModel.awakeHeroId) {
            this.n1.active = true;
            this.n2.active = false;
            this.heroSpine.node.active = false;
            this.n1.getChildByName('arrow').stopAllActions();
            this.n1.getChildByName('arrow').setPosition(221, 136);
            this.n1.getChildByName('arrow').runAction(cc.repeatForever(
                cc.sequence(
                    cc.moveBy(1, 0, -20),
                    cc.moveBy(1, 0, 20)
                )
            ));
        }
        else {
            this.n1.active = false;
            this.n2.active = true;
            this.n1.getChildByName('arrow').stopAllActions();
            this.n1.getChildByName('arrow').setPosition(221, 136);
            this.heroSpine.node.active = true;
            let hero = HeroUtils.getHeroInfoByHeroId(this.actModel.awakeHeroId);
            let url = StringUtils.format("spine/hero/{0}/1/{0}", HeroUtils.getHeroSkin(hero.typeId, hero.star));
            GlobalUtil.setSpineData(this.node, this.heroSpine, url, false, "stand", true, false);
            let slot = this.heroSlot.getComponent(UiSlotItem);
            slot.starNum = hero.star;
            slot.updateItemInfo(hero.typeId);
            slot.updateStar(hero.star);
            let cfg = ConfigManager.getItemByField(Store_awake_giftCfg, 'star_total', info.totalStar, { hero_id: hero.typeId });
            let fixPos;
            [this.freeItem, ...this.content.children].forEach((n, idx) => {
                n.active = idx <= cfg.RMB_day;
                if (n.active) {
                    let ctrl = n.getComponent(AwakeStarUpItemCtrl);
                    ctrl.updateView(info, idx);
                    if (!fixPos) {
                        if (hero.star >= info.totalStar && ctrl.getBtn.active && ctrl.getBtn.getComponent(cc.Button).interactable) {
                            fixPos = idx;
                            this.scrollView.scrollTo(cc.v2((idx - 1) / cfg.RMB_day, 0), 0);
                        }
                    }
                }
            });
            cc.find('tips', this.n2).getComponent(cc.Label).string = `${this.curSelectStar}星专属礼包`;
        }
    }

    // @gdk.binding("actModel.awakeStarUpGiftMap")
    // _updateFlag() {
    //     let info = this.actModel.awakeStarUpGiftMap[this.curSelectStar];
    //     if (info) {
    //         cc.find('heroSelectNode/replaceFlag', this.n2).active = !info.awardList[0] || !info.awardList[1];
    //     }
    // }

    /**选项卡按钮红点 */
    tabRedPoint(e: any, node: cc.Node) {
        let star = parseInt(node.name.substr(3));
        return RedPointUtils.has_awake_star_up_gift_by_star(star);
    }
}
