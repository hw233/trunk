/** 
 * @Author: weiliang.huang  
 * @Description: 
 * @Date: 2019-03-23 09:39:18 
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2019-12-16 16:12:59
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/chat/FaceItemCtrl")
export default class FaceItemCtrl extends gdk.ItemRenderer {

    @property(cc.Sprite)
    icon: cc.Sprite = null;

    @property(cc.SpriteAtlas)
    atlas: cc.SpriteAtlas = null;

    updateView() {
        this.icon.spriteFrame = this.atlas.getSpriteFrame(this.data.icon);
    }
}
