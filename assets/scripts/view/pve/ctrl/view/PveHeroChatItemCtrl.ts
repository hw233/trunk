/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-05-06 14:02:13 
  */// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/pve/view/PveHeroChatItemCtrl")
export default class PveHeroChatItemCtrl extends cc.Component {

  @property(cc.Sprite)
  bg: cc.Sprite = null;

  @property(cc.RichText)
  label: cc.RichText = null;

  showTime: number = 4000;
  baseBgH: number = 63;
  baseBgW: number = 257;
  dh: number = 25;

  scaleNum = 1;
  onEnable() {
    this.node.stopAllActions();
    this.node.opacity = 0;
    this.node.scale = 0;
    this.node.runAction(cc.spawn(
      cc.sequence(
        cc.scaleTo(.35, this.scaleNum * 1.1, this.scaleNum * 1.1),
        cc.scaleTo(.15, this.scaleNum * 1, this.scaleNum * 1)
      ),
      cc.fadeIn(.5)
    )
    );
    gdk.Timer.once(this.showTime, this, this.hide);
  }

  onDisable() {
    gdk.Timer.clearAll(this);
    cc.isValid(this.node) && this.node.stopAllActions();
  }

  updateText(text: string) {
    this.label.string = text;
    gdk.Timer.callLater(this, () => {
      let labelSegments = this.label['_labelSegments'];
      let row = labelSegments.length;
      // let labelWidth = 0;
      // labelSegments.forEach(label => {
      //   labelWidth = Math.max(labelWidth, label.width);
      // });
      this.bg.node.height = this.label.node.height + 25//this.baseBgH + this.dh * (row - 1);
      this.bg.node.width = this.label.node.width + 7//labelWidth + 7;
      this.node.y += this.dh * (row - 1) - 10
      this.node.x += (this.baseBgW - this.bg.node.width);
    });
  }

  hide() {
    cc.isValid(this.node) && this.node.runAction(cc.sequence(
      cc.fadeOut(.25),
      cc.callFunc(() => {
        gdk.Timer.clearAll(this);
        cc.isValid(this.node) && this.node.removeFromParent(false);
      })
    ))
  }
}
