import ConfigManager from '../../../../../common/managers/ConfigManager';
import { Pieces_heroCfg } from '../../../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-05-26 10:01:08 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/pve/view/pieces/PvePiecesUpStarNoticeViewCtrl")
export default class PvePiecesUpStarNoticeViewCtrl extends gdk.BasePanel {
  @property(cc.Node)
  enemyNode: cc.Node = null;

  @property(cc.Node)
  myNode: cc.Node = null;

  EnemyInfos: PiecesUpStarInfo[] = []; //敌方弹幕
  myInfos: PiecesUpStarInfo[] = []; //我方弹幕

  onEnable() {
    let arg = this.args[0];
    let [type, pName, info] = arg;
    this.addBarrage(type, pName, info);
  }

  onDisable() {
    this.myInfos = []
    this.EnemyInfos = [];
  }

  _play() {
    if (!cc.isValid(this.node)) return;
    if (!this.node.activeInHierarchy) return;
    if (this.myInfos && this.myInfos.length > 0) {
      this._showBarrage(this.myNode, this.myInfos);
    }
    else {
      this.myNode.active = false;
    }

    if (this.EnemyInfos && this.EnemyInfos.length > 0) {
      this._showBarrage(this.enemyNode, this.EnemyInfos);
    }
    else {
      this.enemyNode.active = false;
    }
  }

  _showBarrage(n: cc.Node, infos: PiecesUpStarInfo[]) {
    let content = cc.find('mask/layout', n);
    let nameLab = cc.find('mask/layout/richTxt', n).getComponent(cc.RichText);
    let starLab = cc.find('mask/layout/label', n).getComponent(cc.Label);

    n.active = true;
    if (content.getNumberOfRunningActions() <= 0) {
      nameLab.string = `<outline color=#000000 width=2><color=#00FF00>${infos[0].playerName} </c><color=#FF0000>${infos[0].heroName}</c></outline>`;
      starLab.string = infos[0].star >= 6 ? '1'.repeat(infos[0].star - 5) : '0'.repeat(infos[0].star);
      content.setPosition(300, 3);
      content.runAction(cc.sequence(
        cc.moveTo(Math.max(10, Math.ceil(content.width / 130)), cc.v2(-300 - content.width, 0)),
        cc.callFunc(() => {
          //移除第一条数据
          infos.shift();
          //清除所有动作
          content.stopAllActions();
          if (infos.length <= 0) {
            n.active = false;
          }
          if ([...this.myInfos, ...this.EnemyInfos].length > 0) {
            gdk.Timer.callLater(this, this._play);
          }
          else {
            this.close();
          }
        }, this)
      ))
    }
  }

  /**
   * 
   * @param type 1-我方 2-敌方
   * @param pName 
   * @param info 
   */
  addBarrage(type: number, pName: string, info: icmsg.PiecesHero | icmsg.FightHero) {
    let typeId = info instanceof icmsg.PiecesHero ? info.typeId : info.heroType;
    let star = info instanceof icmsg.PiecesHero ? info.star : info.heroStar;
    let obj: PiecesUpStarInfo = {
      playerName: pName,
      heroName: ConfigManager.getItemByField(Pieces_heroCfg, 'hero_id', typeId).hero_name,
      star: star
    }
    if (type == 1) {
      this.myInfos.push(obj);
    }
    else {
      this.EnemyInfos.push(obj);
    }
    this._play();
  }
}

export type PiecesUpStarInfo = {
  playerName: string,
  heroName: string,
  star: number
}
