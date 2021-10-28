/** 
  * @Description: 长文本提示窗口,支持富文本
  * @Author: weiliang.huang  
  * @Date: 2019-05-29 20:35:10 
 * @Last Modified by: weiliang.huang
 * @Last Modified time: 2019-05-29 20:35:45
*/
const { ccclass, property, menu } = cc._decorator;

export type TipType = {
    /**标题 */
    title?: string,
    /**文本内容 */
    desc: string | string[],
}

@ccclass
@menu("qszc/common/widgets/TipsPanel")
export default class TipsPanel extends gdk.BasePanel {

    @property(cc.RichText)
    richText: cc.RichText = null
    // onLoad () {}

    start() {

    }

    showTips(info: TipType) {
        if (info.title) {
            this.title = info.title
        }
        let desc = info.desc
        if (typeof (desc) == "string") {
            this.richText.string = desc
        } else if (typeof (desc) == "object") {
            let text = ""
            for (let index = 0; index < desc.length; index++) {
                const s = desc[index];
                text = `${text}${s}`
                if (index != desc.length - 1) {
                    text = text + "\n"
                }
            }
            this.richText.string = text
        }
    }
}
