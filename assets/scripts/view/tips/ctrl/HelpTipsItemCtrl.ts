
/**
 * 通用帮助提示二级项
 * @Author: sthoo.huang
 * @Date: 2019-06-26 19:59:16
 * @Last Modified by: jiangping
 * @Last Modified time: 2020-03-20 19:55:26
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/tips/HelpTipsItemCtrl")
export default class HelpTipsItemCtrl extends cc.Component {

    @property(cc.Label)
    titleLabel: cc.Label = null;
    @property(cc.Node)
    titleNode: cc.Node = null;
    @property(cc.Node)
    content: cc.Node = null;
    @property(cc.Prefab)
    tipsLabelPrefab: cc.Prefab = null;
    height: number = 32;

    setData(title: string, txt: string) {
        // this.titleLabel.string = title;
        if (title && title.length >= 1) {
            this.titleLabel.string = title;
            this.titleNode.active = true;
        }
        let items = txt.split("<br>");
        let height = 20;
        let richTexts: cc.RichText[] = []
        for (let index = 0; index < items.length; index++) {
            const item = items[index];
            if (cc.js.isString(item) && item.length > 0) {
                let tipsLabel = cc.instantiate(this.tipsLabelPrefab);
                this.content.addChild(tipsLabel);
                let textNode = tipsLabel.getChildByName("richText");
                let richText = textNode.getComponent(cc.RichText) as cc.RichText;
                richTexts.push(richText);
                richText.string = item;
                height += textNode.height;
            }
        }
        let offsetY = this.titleNode.active == true ? this.titleNode.y - this.titleNode.height / 2 : -10;
        for (let index = 0; index < richTexts.length; index++) {
            const richText = richTexts[index];
            richText.node.parent.y = offsetY;
            offsetY -= richText.node.height;
        }
        height = this.titleNode.active == true ? this.titleNode.height + height : height;
        this.content.height = height;
        // this.height = 37 + height + 20;
        this.height = height;
    }
}
