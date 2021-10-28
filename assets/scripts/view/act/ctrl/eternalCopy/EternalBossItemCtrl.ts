import CopyModel from '../../../../common/models/CopyModel';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import { Eternal_stageCfg } from '../../../../a/config';

const { ccclass, property } = cc._decorator;

@ccclass
export default class EternalBossItemCtrl extends cc.Component {

    @property(cc.Sprite)
    bg: cc.Sprite = null;
    @property(cc.Sprite)
    icon: cc.Sprite = null;
    @property(cc.Sprite)
    type: cc.Sprite = null;
    @property(cc.Label)
    lv: cc.Label = null;
    @property(cc.Node)
    select: cc.Node = null;
    @property(cc.Node)
    ytg: cc.Node = null;
    bgPaths: string[] = ['whsl_lv', 'whsl_lan', 'whsl_zi', 'whsl_cheng', 'whsl_hong']
    typePaths: string[] = ['whsl_putong', 'whsl_jingying', 'whsl_kunnan', 'whsl_diyu', 'whsl_emeng']
    get copyModel(): CopyModel { return ModelManager.get(CopyModel) }

    index: number = 0;
    cfg: Eternal_stageCfg;
    selectState: boolean = false;
    click: Function;
    args: any;

    onDestroy() {
        this.click = null;
        this.args = null;
    }

    initData(cfg: Eternal_stageCfg, index: number, click: Function, args: any, select: boolean = false) {
        this.index = index;
        this.cfg = cfg;
        this.selectState = select;
        this.click = click;
        this.args = args;
        let head = cc.js.isString(cfg.head) ? '58' : cfg.head;
        let path1 = 'icon/monster/' + head + '_s';
        let bgPath = 'view/act/texture/eternalCopy/' + this.bgPaths[cfg.difficulty - 1];
        let typePath = 'view/act/texture/eternalCopy/' + this.typePaths[cfg.difficulty - 1];
        GlobalUtil.setSpriteIcon(this.node, this.icon, path1);
        GlobalUtil.setSpriteIcon(this.node, this.bg, bgPath);
        GlobalUtil.setSpriteIcon(this.node, this.type, typePath);
        this.lv.string = '.' + cfg.level;
        this.select.active = select;
        this.ytg.active = this.copyModel.eternalCopyStageIds.indexOf(cfg.id) >= 0;
    }

    refresh() {
        this.ytg.active = this.copyModel.eternalCopyStageIds.indexOf(this.cfg.id) >= 0;
    }

    itemClick() {
        this.select.active = true;
        if (this.click && this.args) {
            this.click.call(this.args, this.index);
        }
    }
}
