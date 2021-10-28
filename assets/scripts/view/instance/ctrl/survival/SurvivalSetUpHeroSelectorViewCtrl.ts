import CopyModel from '../../../../common/models/CopyModel';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import MercenaryModel from '../../../mercenary/model/MercenaryModel';
import ModelManager from '../../../../common/managers/ModelManager';
import UiTabMenuCtrl from '../../../../common/widgets/UiTabMenuCtrl';


/** 
 * @Description: 角色英雄面板-选择面板
 * @Author:yaozu.hu  
 * @Date: 2019-03-28 17:21:18 
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-12-22 12:32:49
 */


const { ccclass, property, menu } = cc._decorator;


@ccclass
@menu("qszc/view/instance/SurvivalSetUpHeroSelectorViewCtrl")
export default class SurvivalSetUpHeroSelectorViewCtrl extends gdk.BasePanel {

    @property(cc.Node)
    mercenary: cc.Node = null;
    @property(cc.Node)
    setUpHero: cc.Node = null;
    @property(cc.Sprite)
    titleSp: cc.Sprite = null;

    @property(UiTabMenuCtrl)
    btnMenu: UiTabMenuCtrl = null;
    @property(cc.Node)
    red1: cc.Node = null;
    @property(cc.Node)
    red2: cc.Node = null;

    curIndex: number = -1;

    get copyModel() { return ModelManager.get(CopyModel); }
    get mercenaryModel() { return ModelManager.get(MercenaryModel); }

    onEnable() {
        this.btnMenu.setSelectIdx(0);
    }
    pageSelect(event, index, refresh: boolean = false) {
        if (this.curIndex == index && !refresh) return;
        this.curIndex = index;
        if (index == 0) {
            GlobalUtil.setSpriteIcon(this.node, this.titleSp, 'view/role/texture/select/yx_zhenyingjiacheng')
            this.mercenary.active = true;
            this.setUpHero.active = false;
        } else {
            GlobalUtil.setSpriteIcon(this.node, this.titleSp, 'view/role/texture/select/yx_chuzhanliebiao')
            this.mercenary.active = false;
            this.setUpHero.active = true;
        }
    }

    @gdk.binding('mercenaryModel.borrowedListHero')
    refreshRed1() {
        this.red1.active = this.mercenaryModel.borrowedListHero.length < 3
    }

    @gdk.binding('copyModel.survivalStateMsg.heroes')
    refreshRed2() {
        let datas: icmsg.SurvivalHeroesInfo[] = this.copyModel.survivalStateMsg.heroes
        this.red2.active = datas.length < 9
    }

}
