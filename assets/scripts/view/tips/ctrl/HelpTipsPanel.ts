import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import HelpTipsItemCtrl from './HelpTipsItemCtrl';
import PanelId from '../../../configs/ids/PanelId';
import { TipsCfg } from '../../../a/config';

/** 
  * @Description:  通用帮助提示弹出框
  * @Author: chengyou.lin  
  * @Date: 2019-05-29 20:35:10 
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-09-10 21:28:40
*/

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/tips/HelpTipsPanel")
export default class HelpTipsPanel extends gdk.BasePanel {
    // @property(cc.Node)
    // panelBg: cc.Node = null;
    @property(cc.Node)
    bottomFrame: cc.Node = null;
    @property(cc.Node)
    topFrame: cc.Node = null;
    @property(cc.Node)
    contentBg: cc.Node = null;
    @property(cc.Node)
    titleBg: cc.Node = null;
    @property(cc.Node)
    titleNode: cc.Node = null;
    @property(cc.Sprite)
    titleImg: cc.Sprite = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Prefab)
    tipsItemPrefab: cc.Prefab = null;

    @property(cc.Node)
    contentNode: cc.Node = null;

    onLoad() {
        let args: any = gdk.panel.getArgs(PanelId.HelpTipsPanel);
        if (args && args[0]) {
            let arg = args[0];
            if (cc.js.isNumber(arg)) {
                let tipsCfg = ConfigManager.getItemById(TipsCfg, arg);
                this.showTips(tipsCfg as TipsCfg);
            } else {
                this.showTips(arg as TipsCfg);
            }
        }
    }

    showTips(tipsCfg: TipsCfg) {
        GlobalUtil.setSpriteIcon(
            this.node,
            this.titleImg,
            `view/tips/texture/text_${tipsCfg.title_resource}`
        );
        // this._titleLabel.string = tipsCfg.title1;
        // this._titleLabel.node.on(cc.Node.EventType.SIZE_CHANGED, () => {
        //     this.titleBg.width = this._titleLabel.node.width + 160;
        // })

        let height: number = 0;
        let itemCfgs = [[tipsCfg.title21, tipsCfg.desc21]];
        if (tipsCfg.title22) {
            itemCfgs.push([tipsCfg.title22, tipsCfg.desc22]);
        }
        if (tipsCfg.title23) {
            itemCfgs.push([tipsCfg.title23, tipsCfg.desc23]);
        }
        let tipsItems: HelpTipsItemCtrl[] = [];
        for (let index = 0; index < itemCfgs.length; index++) {
            const itemCfg = itemCfgs[index];
            let tipsItem = cc.instantiate(this.tipsItemPrefab);
            this.contentNode.addChild(tipsItem);
            let itemCtrl = tipsItem.getComponent(HelpTipsItemCtrl) as HelpTipsItemCtrl;
            itemCtrl.setData(itemCfg[0], itemCfg[1]);
            tipsItems.push(itemCtrl);

            height += itemCtrl.height;
        }
        this.contentNode.height = height;

        let ctHeight = 60 + height;
        if (ctHeight > 1000) {
            ctHeight = 1000;
            height = 1000 - 60;
            this.scrollView.vertical = true;
        } else {
            this.scrollView.vertical = false;
        }
        this.scrollView.node.height = height;

        let offsetY = 0;
        for (let index = 0; index < tipsItems.length; index++) {
            const tipsItem = tipsItems[index];
            tipsItem.node.y = offsetY;
            offsetY -= tipsItem.height;
            // this.contentNode.addChild(tipsItem.node);
        }
        this.scrollView.scrollToTop();

        this.contentBg.height = height + 64;
        this.topFrame.y = this.contentBg.height / 2;
        this.bottomFrame.y = - this.contentBg.height / 2 + 4;
        // this.panelBg.height = 50 + ctHeight;
        // this.panelBg.y = 10;
        this.titleNode.y = this.topFrame.y + 21;
    }
}