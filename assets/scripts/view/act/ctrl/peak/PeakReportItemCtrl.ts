import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import RoleModel from '../../../../common/models/RoleModel';
import UiListItem from '../../../../common/widgets/UiListItem';
import { Peak_divisionCfg } from '../../../../a/config';

/** 
 * @Description: 巅峰之战挑战记录Item
 * @Author: yaozu.hu
 * @Date: 2021-02-22 11:30:49
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-03-24 17:24:04
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/peak/PeakReortItemCtrl")
export default class PeakReortItemCtrl extends UiListItem {

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
        let datas: icmsg.PeakRecord = this.data;
        let colors = ['#FF0000', '#00FF00'];
        let infos = datas.brief.concat()
        if (datas.brief[0].id != this.rModel.id) {
            infos = [datas.brief[1], datas.brief[0]]
        }

        let divisionData = [[datas.rank, datas.points, datas.addPoints], [datas.enemyRank, datas.enemyPoints, datas.enemyAddPoints]]
        if (datas.brief[0].id != this.rModel.id) {
            divisionData = [[datas.enemyRank, datas.enemyPoints, datas.enemyAddPoints], [datas.rank, datas.points, datas.addPoints]]
        }

        this.players.forEach((p, idx) => {
            let info = infos[idx];
            p.getChildByName('name').getComponent(cc.Label).string = info.name;
            p.getChildByName('lv').getComponent(cc.Label).string = info.level + '';
            GlobalUtil.setSpriteIcon(this.node, p.getChildByName('headFrame'), GlobalUtil.getHeadFrameById(info.headFrame));
            GlobalUtil.setSpriteIcon(this.node, cc.find('mask/icon', p), GlobalUtil.getHeadIconById(info.head));
            let divisionSp = p.getChildByName('divisionSp').getComponent(cc.Sprite)
            let divisionLb = p.getChildByName('divisionLb').getComponent(cc.Label)
            let score = p.getChildByName('score').getComponent(cc.Label);
            let data = divisionData[idx];
            let cfg = ConfigManager.getItemByField(Peak_divisionCfg, 'division', data[0]);
            let path = 'view/act/texture/peak/' + cfg.icon;
            GlobalUtil.setSpriteIcon(this.node, divisionSp, path)
            divisionLb.string = cfg.name
            score.string = data[1] + '';
        });
        let isAtk = datas.brief[0].id == this.rModel.id
        let isWin = isAtk ? datas.addPoints > 0 : datas.enemyAddPoints > 0;
        let str1 = isAtk ? 'atk' : 'def';
        let str2 = isWin ? 'win' : 'lose';
        GlobalUtil.setSpriteIcon(this.node, this.state, `view/champion/texture/guess/jbs_${str1}_${str2}`);
        let temPoints = isAtk ? datas.points : datas.enemyPoints;
        let temAddPoints = isAtk ? datas.addPoints : datas.enemyAddPoints;
        this.scoreLab.string = `${temPoints + temAddPoints}`;
        this.changeLab.string = `(${temAddPoints >= 0 ? `+${temAddPoints}` : temAddPoints})`;
        this.changeLab.node.color = cc.color().fromHEX(colors[temAddPoints >= 0 ? 1 : 0]);
        let time = new Date(datas.time * 1000);
        this.timeLab.string = `${time.getMonth() + 1}/${time.getDate()} ${time.getHours() >= 10 ? '' : '0'}${time.getHours()}:${time.getMinutes() >= 10 ? '' : '0'}${time.getMinutes()}:${time.getSeconds() >= 10 ? '' : '0'}${time.getSeconds()}`;
    }


}
