import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import UiListItem from '../../../common/widgets/UiListItem';
import WorldHonorModel from '../../../common/models/WorldHonorModel';

/**
 * enemy世界巅峰赛竞猜投注结果Item
 * @Author: yaozu.hu
 * @Date: 2019-10-28 10:48:51
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-06-22 16:30:05
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/worldhonor/WorldHonorGuessReportItemCtrl")
export default class WorldHonorGuessReportItemCtrl extends UiListItem {
    @property([cc.Node])
    players: cc.Node[] = [];

    @property(cc.Node)
    stateNode: cc.Node = null;

    @property(cc.Label)
    timeLab: cc.Label = null;

    @property(cc.Label)
    scoreLab: cc.Label = null;

    get model(): WorldHonorModel { return ModelManager.get(WorldHonorModel); }

    updateView() {
        let data: icmsg.ArenaHonorMatch = this.data;
        let playerInfos = data.players;
        // if (data.guess !== 1) {
        //   playerInfos.reverse();
        // }
        this.players.forEach((node, idx) => {
            let info = playerInfos[idx];
            let roleBrief = this.model.playersInfoMap[info.id]
            node.getChildByName('name').getComponent(cc.Label).string = roleBrief.name;
            GlobalUtil.setSpriteIcon(this.node, node.getChildByName('headFrame'), GlobalUtil.getHeadFrameById(roleBrief.headFrame));
            GlobalUtil.setSpriteIcon(this.node, cc.find('mask/icon', node), GlobalUtil.getHeadIconById(roleBrief.head));
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
        GlobalUtil.setSpriteIcon(this.node, cc.find('icon', this.node.getChildByName('layout')), GlobalUtil.getIconById(32));
    }
}
