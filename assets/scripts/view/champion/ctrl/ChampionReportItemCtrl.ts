import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import RoleModel from '../../../common/models/RoleModel';
import UiListItem from '../../../common/widgets/UiListItem';
/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-11-23 11:59:52 
  */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/champion/ChampionReportItemCtrl")
export default class ChampionReportItemCtrl extends UiListItem {
  @property([cc.Node])
  players: cc.Node[] = [];

  @property(cc.Node)
  state: cc.Node = null;

  @property(cc.Label)
  timeLab: cc.Label = null;

  @property(cc.Label)
  scoreLab: cc.Label = null;

  @property(cc.Label)
  changeLab: cc.Label = null;

  get rModel(): RoleModel { return ModelManager.get(RoleModel); }
  updateView() {
    //TODO
    let datas: icmsg.ChampionRecord = this.data;
    let colors = ['#FF0000', '#00FF00'];
    let myInfo = new icmsg.RoleBrief();
    myInfo.name = this.rModel.name;
    myInfo.headFrame = this.rModel.frame;
    myInfo.head = this.rModel.head;
    myInfo.level = this.rModel.level;
    let infos = [myInfo, datas.opponent];
    this.players.forEach((p, idx) => {
      let info = infos[idx];
      p.getChildByName('name').getComponent(cc.Label).string = info.name;
      p.getChildByName('lv').getComponent(cc.Label).string = info.level + '';
      GlobalUtil.setSpriteIcon(this.node, p.getChildByName('headFrame'), GlobalUtil.getHeadFrameById(info.headFrame));
      GlobalUtil.setSpriteIcon(this.node, cc.find('mask/icon', p), GlobalUtil.getHeadIconById(info.head));
    });
    let str1 = datas.isAtk ? 'atk' : 'def';
    let str2 = datas.isWin ? 'win' : 'lose';
    GlobalUtil.setSpriteIcon(this.node, this.state, `view/champion/texture/guess/jbs_${str1}_${str2}`);
    this.scoreLab.string = `${datas.newPoints}`;
    this.changeLab.string = `(${datas.addPoints >= 0 ? `+${datas.addPoints}` : datas.addPoints})`;
    this.changeLab.node.color = cc.color().fromHEX(colors[datas.addPoints >= 0 ? 1 : 0]);
    let time = new Date(datas.time * 1000);
    this.timeLab.string = `${time.getMonth() + 1}/${time.getDate()} ${time.getHours() >= 10 ? '' : '0'}${time.getHours()}:${time.getMinutes() >= 10 ? '' : '0'}${time.getMinutes()}:${time.getSeconds() >= 10 ? '' : '0'}${time.getSeconds()}`;
  }
}
