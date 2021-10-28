import StringUtils from '../../../common/utils/StringUtils';
import UiListItem from '../../../common/widgets/UiListItem';
import VaultListHeroItem from './VaultListHeroItemCtrl';

const { ccclass, property } = cc._decorator;

@ccclass
export default class VaultAttackListViewItemCtrl extends UiListItem {

    @property(cc.Label)
    playerName: cc.Label = null;

    @property(cc.Label)
    playerPower: cc.Label = null;
    @property(cc.Label)
    timeLb: cc.Label = null;

    @property(cc.RichText)
    attackNum: cc.RichText = null;

    @property(cc.Node)
    heroLayout: cc.Node = null
    @property(cc.Prefab)
    heroItem: cc.Prefab = null;

    info: icmsg.VaultRecord

    updateView() {
        this.info = this.data;
        let serverNum = Math.floor((this.info.playerId % (10000 * 100000)) / 100000)
        //this.serverName.string = 'S' + serverNum + '  ' + this.posData.guildName;
        this.playerName.string = 'S' + serverNum + '.' + this.info.playerName;
        this.playerPower.string = this.info.power + '';
        let temTime = new Date(this.info.date * 1000);
        let Hours = temTime.getHours() < 10 ? '0' + temTime.getHours() : temTime.getHours();
        let Minutes = temTime.getMinutes() < 10 ? '0' + temTime.getMinutes() : temTime.getMinutes();
        let Seconds = temTime.getSeconds() < 10 ? '0' + temTime.getSeconds() : temTime.getSeconds();
        this.timeLb.string = `${temTime.getFullYear()}.${temTime.getMonth() + 1}.${temTime.getDate()}  ${Hours}:${Minutes}:${Seconds}`;
        this.attackNum.string = StringUtils.format(gdk.i18n.t("i18n:VAULT_TIP7"), this.info.difficulty)

        this.heroLayout.removeAllChildren()
        this.info.heroList.forEach(data => {
            if (data.typeId > 0) {
                let node = cc.instantiate(this.heroItem);
                let ctrl = node.getComponent(VaultListHeroItem);
                ctrl.data = { heroData: data, playerId: this.info.playerId }
                ctrl.updateView();
                node.setParent(this.heroLayout);
            }
        })
    }

}
