import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import ServerModel from '../../../common/models/ServerModel';
import UiListItem from '../../../common/widgets/UiListItem';

/**
 * @Description: 合服狂欢 合服排行
 * @Author: luoyong
 * @Date: 2019-07-19 16:45:14
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-05-19 16:57:41
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/combine/CombineServerRankItemCtrl")
export default class CombineServerRankItemCtrl extends UiListItem {

    @property(cc.Node)
    bgNode: cc.Node = null;
    @property(cc.Node)
    bg2Node: cc.Node = null;
    @property(cc.Node)
    bg3Node: cc.Node = null;
    @property(cc.Sprite)
    rankSp: cc.Sprite = null;
    @property(cc.Label)
    rankNum: cc.Label = null;
    @property(cc.Label)
    serverName: cc.Label = null;
    @property(cc.Label)
    serverScore: cc.Label = null;

    maxScore: number = null;
    info: icmsg.CarnivalServerInfo;
    maxH: number = 360;
    rankSpriteName: string[] = [
        'common/texture/main/gh_gxbhuizhang01',
        'common/texture/main/gh_gxbhuizhang02',
        'common/texture/main/gh_gxbhuizhang03',
    ];
    rankBgStr: string[] = ['kfkh_jingduhongse01', 'kfkh_jingduhuangse01', 'kfkh_jingduzise01', 'kfkh_jingdulanse01']
    rankBg2Str: string[] = ['kfkh_jingduhongse02', 'kfkh_jingduhuangse02', 'kfkh_jingduzise02', 'kfkh_jingdulanse002']
    updateView() {
        this.maxScore = this.data.maxScore;
        this.info = this.data.data;
        this.bgNode.height = Math.floor(this.info.serverScore / this.maxScore * this.maxH);
        this.bgNode.height > this.maxH ? this.bgNode.height = this.maxH : false;
        this.serverName.string = 'X' + (this.info.serverId % 10000) + '  ' + ModelManager.get(ServerModel).serverNameMap[this.info.serverId]
        this.serverScore.string = this.info.serverScore + ''
        let bgPath = 'view/act/texture/cServer/'
        let bg2Path = 'view/act/texture/cServer/'
        let bg3Path = 'view/act/texture/cServer/'
        if (this.info.ranking > 0 && this.info.ranking <= 3) {
            bgPath = 'view/act/texture/cServer/' + this.rankBgStr[this.info.ranking - 1]
            bg2Path = 'view/act/texture/cServer/' + this.rankBg2Str[this.info.ranking - 1]
            bg3Path = 'view/act/texture/cServer/' + this.rankBg2Str[this.info.ranking - 1]
            this.rankSp.node.active = true;
            this.rankNum.node.parent.active = false;
            let path = this.rankSpriteName[this.info.ranking - 1];
            GlobalUtil.setSpriteIcon(this.node, this.rankSp, path);
        } else {
            bgPath = 'view/act/texture/cServer/' + this.rankBgStr[3]
            bg2Path = 'view/act/texture/cServer/' + this.rankBg2Str[3]
            bg3Path = 'view/act/texture/cServer/' + this.rankBg2Str[3]
            this.rankSp.node.active = false;
            this.rankNum.node.parent.active = true;
            this.rankNum.string = this.info.ranking + ''
        }
        GlobalUtil.setSpriteIcon(this.node, this.bgNode, bgPath);
        GlobalUtil.setSpriteIcon(this.node, this.bg2Node, bg2Path);
        GlobalUtil.setSpriteIcon(this.node, this.bg3Node, bg3Path);
    }
}