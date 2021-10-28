import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import { Justice_mercenaryCfg, Justice_skillCfg } from '../../../a/config';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/instance/MercenarySkillViewCtrl")
export default class MercenarySkillViewCtrl extends gdk.BasePanel {

    @property(cc.Sprite)
    headIcon: cc.Sprite = null;
    @property(cc.Label)
    mercenaryName: cc.Label = null;
    @property(cc.Label)
    level: cc.Label = null;
    @property(cc.RichText)
    mercenaryDes: cc.RichText = null;
    @property(cc.Node)
    jindu: cc.Node = null;
    @property(cc.Label)
    jinduLb: cc.Label = null;
    @property(cc.ScrollView)
    skillScrollVIew: cc.ScrollView = null;
    @property(cc.Node)
    content: cc.Node = null;
    @property(cc.Prefab)
    skillItem: cc.Prefab = null;

    list: ListView;

    jinduNum: number = 346;

    updateData(type: number, level: number) {

        let curMercenaryCfg = ConfigManager.getItemByField(Justice_mercenaryCfg, 'type', type, { 'lv': level })

        //设置头像
        let path = `icon/soldier/${curMercenaryCfg.icon}_s`;
        GlobalUtil.setSpriteIcon(this.node, this.headIcon, path);
        this.level.string = level + ""
        this.mercenaryName.string = curMercenaryCfg.name
        let isMax = false;
        let skillCfgs: Justice_mercenaryCfg[] = ConfigManager.getItems(Justice_mercenaryCfg, (item: Justice_mercenaryCfg) => {
            if (item.type == type && cc.js.isNumber(item.skillid) && item.skillid > 0) {
                return true;
            }
            return false;
        })
        let lastSkillCfg = ConfigManager.getItem(Justice_mercenaryCfg, (item: Justice_mercenaryCfg) => {
            if (item.type == type && item.lv > level && cc.js.isNumber(item.skillid) && item.skillid > 0) {
                return true;
            }
            return false;
        })
        if (!lastSkillCfg) {
            let index = skillCfgs.length - 1
            lastSkillCfg = skillCfgs[index];
            isMax = true;
        }
        if (isMax) {
            this.mercenaryDes.node.active = false;
            this.jinduLb.string = level + '/' + level;
            this.jindu.width = this.jinduNum;
        } else {
            this.mercenaryDes.node.active = true;
            let temData = ConfigManager.getItems(Justice_mercenaryCfg, (itemCfg: Justice_mercenaryCfg) => {
                if (itemCfg.type == type && itemCfg.lv <= lastSkillCfg.lv && cc.js.isNumber(itemCfg.skillid) && itemCfg.skillid == lastSkillCfg.skillid) {
                    return true;
                }
                return false;
            })
            let temCfg = ConfigManager.getItemByField(Justice_skillCfg, 'id', lastSkillCfg.skillid, { 'level': temData.length });
            if (!temCfg) {
                let tem = ConfigManager.getItemsByField(Justice_skillCfg, 'id', lastSkillCfg.skillid)
                temCfg = tem[tem.length - 1];
            }
            this.mercenaryDes.string = `等级到达<color=#B8D431>${lastSkillCfg.lv}</c>级解锁${temCfg.name}`
            this.jinduLb.string = level + '/' + lastSkillCfg.lv;
            this.jindu.width = Math.floor(level / lastSkillCfg.lv * this.jinduNum)
        }

        if (!this.list) {
            this._initMercenaryListView();
        }
        if (skillCfgs.length > 0) {
            let listData: any[] = [];
            for (let i = 0; i < skillCfgs.length; i++) {
                let temData = ConfigManager.getItems(Justice_mercenaryCfg, (itemCfg: Justice_mercenaryCfg) => {
                    if (itemCfg.type == type && itemCfg.lv <= skillCfgs[i].lv && cc.js.isNumber(itemCfg.skillid) && itemCfg.skillid == skillCfgs[i].skillid) {
                        return true;
                    }
                    return false;
                })
                let skillCfg = ConfigManager.getItemByField(Justice_skillCfg, 'id', skillCfgs[i].skillid, { 'level': temData.length });
                if (!skillCfg) {
                    let tem = ConfigManager.getItemsByField(Justice_skillCfg, 'id', skillCfgs[i].skillid);
                    skillCfg = tem[tem.length - 1];
                }
                let state = level < skillCfgs[i].lv;
                let data = { lock: state, skillId: skillCfg.index, lockLevel: skillCfgs[i].lv }
                listData.push(data);
            }
            this.list.set_data(listData, false);
        }
    }


    onDestroy() {
        if (this.list != null) {
            this.list.destroy();
        }
    }
    //初始化雇佣兵列表
    _initMercenaryListView() {
        if (this.list == null) {
            this.list = new ListView({
                scrollview: this.skillScrollVIew,
                mask: this.skillScrollVIew.node,
                content: this.content,
                item_tpl: this.skillItem,
                cb_host: this,
                async: true,
                column: 1,
                gap_y: 0,
                direction: ListViewDir.Vertical,
            })
        }
    }
}
