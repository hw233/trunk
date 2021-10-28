import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import UiListItem from '../../../common/widgets/UiListItem';
import { Copy_stageCfg } from '../../../a/config';

/** 
  * @Description: 
  * @Author: luoyong 
  * @Date: 2019-09-12 14:24:36
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-01-06 10:56:00
*/
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/KfcbActNoticeItemCtrl")
export default class KfcbActNoticeItemCtrl extends UiListItem {

  @property(cc.Node)
  rankIcon: cc.Node = null

  @property(cc.Node)
  frame: cc.Node = null

  @property(cc.Node)
  head: cc.Node = null

  @property(cc.Label)
  lvLab: cc.Label = null

  @property(cc.Label)
  roleName: cc.Label = null

  @property(cc.Label)
  stageName: cc.Label = null

  updateView() {

    let roleInfo: icmsg.ActivityRankingRole = this.data.info
    let rank = this.data.rank

    GlobalUtil.setSpriteIcon(this.node, this.rankIcon, `common/texture/main/gh_gxbhuizhang0${rank}`)
    GlobalUtil.setSpriteIcon(this.node, this.head, GlobalUtil.getHeadIconById(roleInfo.brief.head))
    this.lvLab.string = `${roleInfo.brief.level}`
    this.roleName.string = roleInfo.brief.name
    let stageCfg = ConfigManager.getItemById(Copy_stageCfg, roleInfo.stageId)
    if (stageCfg) {
      this.stageName.string = stageCfg.name.split(" ")[0]
    } else {
      this.stageName.string = gdk.i18n.t("i18n:KFCB_TIP4")
    }

  }

}