import ArenaHonorModel from '../../../common/models/ArenaHonorModel';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import UiListItem from '../../../common/widgets/UiListItem';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-06-07 16:42:03 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/arenahonor/ArenaHonorGuessReportItemCtrl")
export default class ArenaHonorGuessReportItemCtrl extends UiListItem {
  @property([cc.Node])
  players: cc.Node[] = [];

  @property(cc.Node)
  stateNode: cc.Node = null;

  @property(cc.Label)
  timeLab: cc.Label = null;

  @property(cc.Label)
  scoreLab: cc.Label = null;

  get model(): ArenaHonorModel { return ModelManager.get(ArenaHonorModel); }

  updateView() {
    let data: icmsg.ArenaHonorMatch = this.data;
    let playerInfos = data.players;
    // if (data.guess !== 1) {
    //   playerInfos.reverse();
    // }
    this.players.forEach((node, idx) => {
      let info = playerInfos[idx];
      node.getChildByName('name').getComponent(cc.Label).string = this.model.playersInfoMap[info.id].name;
      GlobalUtil.setSpriteIcon(this.node, node.getChildByName('headFrame'), GlobalUtil.getHeadFrameById(this.model.playersInfoMap[info.id].headFrame));
      GlobalUtil.setSpriteIcon(this.node, cc.find('mask/icon', node), GlobalUtil.getHeadIconById(this.model.playersInfoMap[info.id].head));
      let flag = node.getChildByName('flag');
      if (data.guessWinner == 0) {
        flag.active = false;
      }
      else {
        flag.active = true;
        let url = data.guessWinner - 1 == idx ? 'common/texture/arena/gh_shengzi' : 'common/texture/arena/gh_fuzi';
        GlobalUtil.setSpriteIcon(this.node, flag, url);
      }
    });
    let time = new Date(data.guessTime * 1000);
    this.timeLab.string = `${time.getMonth() + 1}/${time.getDate()} ${time.getHours()}:${time.getMinutes() >= 10 ? '' : '0'}${time.getMinutes()}:${time.getSeconds() >= 10 ? '' : '0'}${time.getSeconds()}`;
    let url: string = '';
    if (data.guessWinner == 0) {
      url = 'view/champion/texture/guess/jbs_weikaishi';
      this.scoreLab.string = '0';
    }
    else {
      url = data.guessWinner == data.guess ? 'view/champion/texture/guess/guess' : 'view/champion/texture/guess/jbs_weicaizhong';
      this.scoreLab.string = data.guessWinner == data.guess ? `+${GlobalUtil.numberToStr2(data.addScore, true)}` : `${GlobalUtil.numberToStr2(data.addScore, true)}`;
      this.scoreLab.node.color = cc.color().fromHEX(data.addScore > 0 ? '#00FF00' : '#FF0000');
    }
    GlobalUtil.setSpriteIcon(this.node, this.stateNode, url);
    GlobalUtil.setSpriteIcon(this.node, cc.find('icon', this.node.getChildByName('layout')), GlobalUtil.getIconById(31));
  }
}
