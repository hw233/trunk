import GlobalUtil from '../../../common/utils/GlobalUtil';
import UiListItem from '../../../common/widgets/UiListItem';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-11-26 11:51:56 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/champion/ChampionGuessReportItemCtrl")
export default class ChampionGuessReportItemCtrl extends UiListItem {
    @property([cc.Node])
    players: cc.Node[] = [];

    @property(cc.Node)
    stateNode: cc.Node = null;

    @property(cc.Label)
    timeLab: cc.Label = null;

    @property(cc.Label)
    scoreLab: cc.Label = null;

    updateView() {
        let data: icmsg.ChampionGuess = this.data;
        let playerInfos = [data.player1, data.player2];
        if (data.player1.playerId !== data.playerId) {
            playerInfos.reverse();
        }
        this.players.forEach((node, idx) => {
            let info = playerInfos[idx];
            node.getChildByName('name').getComponent(cc.Label).string = info.name;
            GlobalUtil.setSpriteIcon(this.node, node.getChildByName('headFrame'), GlobalUtil.getHeadFrameById(info.headFrame));
            GlobalUtil.setSpriteIcon(this.node, cc.find('mask/icon', node), GlobalUtil.getHeadIconById(info.head));
            let flag = node.getChildByName('flag');
            if (data.rewardScore == 0) {
                flag.active = false;
            }
            else {
                flag.active = true;
                let url = (data.rewardScore >= 0 && data.playerId == info.playerId) || (data.rewardScore < 0 && data.playerId !== info.playerId) ? 'common/texture/arena/gh_shengzi' : 'common/texture/arena/gh_fuzi';
                GlobalUtil.setSpriteIcon(this.node, flag, url);
            }
        });
        let time = new Date(data.guessTime * 1000);
        this.timeLab.string = `${time.getMonth() + 1}/${time.getDate()} ${time.getHours()}:${time.getMinutes() >= 10 ? '' : '0'}${time.getMinutes()}:${time.getSeconds() >= 10 ? '' : '0'}${time.getSeconds()}`;
        let url: string = '';
        if (data.rewardScore == 0) {
            url = 'view/champion/texture/guess/jbs_weikaishi';
            this.scoreLab.string = '0';
        }
        else {
            url = data.rewardScore > 0 ? 'view/champion/texture/guess/guess' : 'view/champion/texture/guess/jbs_weicaizhong';
            this.scoreLab.string = data.rewardScore > 0 ? `+${GlobalUtil.numberToStr2(data.rewardScore, true)}` : `${GlobalUtil.numberToStr2(data.rewardScore, true)}`;
            this.scoreLab.node.color = cc.color().fromHEX(data.rewardScore > 0 ? '#00FF00' : '#FF0000');
        }
        GlobalUtil.setSpriteIcon(this.node, this.stateNode, url);
        GlobalUtil.setSpriteIcon(this.node, cc.find('icon', this.node.getChildByName('layout')), GlobalUtil.getIconById(24));
    }
}
