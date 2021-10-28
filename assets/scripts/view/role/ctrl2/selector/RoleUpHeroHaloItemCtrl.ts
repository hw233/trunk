import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import StringUtils from '../../../../common/utils/StringUtils';
import UiListItem from '../../../../common/widgets/UiListItem';
import { Copy_towerhaloCfg, GroupCfg } from '../../../../a/config';

/** 
 * @Description: 角色英雄面板-选择面板子项
 * @Author:yaozu.hu  
 * @Date: 2019-03-28 17:21:18 
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2020-12-16 09:53:40
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/selector/RoleUpHeroHaloItemCtrl")
export default class RoleUpHeroHaloItemCtrl extends UiListItem {

    @property([cc.Node])
    addhaloNode: cc.Node[] = []

    @property(cc.Sprite)
    selectBg: cc.Sprite = null;
    @property(cc.Sprite)
    icon: cc.Sprite = null;
    @property(cc.Sprite)
    groupName: cc.Sprite = null;
    @property(cc.Node)
    listNode: cc.Node = null;
    @property(cc.Node)
    lastNode: cc.Node = null;
    @property(cc.Label)
    lastStr: cc.Label = null;

    colorStrs: string[] = ['#5DFF05', '#BF9973']//绿、灰
    groupNameStr: string[] = ['yx_jiguangzhezi', 'yx_manyezhezi', 'yx_linglizhezi', 'yx_qianlizhezi', 'yx_meilizhezi', 'yx_ronghezhili']
    info: { cfgs: Copy_towerhaloCfg[], group: number, lastAlive: boolean }
    updateView() {

        this.info = this.data;
        let islast = this.info.group == 99;
        let iconStr = islast ? '390008' : 'groupB_' + this.info.group
        let path = 'view/role/texture/select/' + iconStr;
        GlobalUtil.setSpriteIcon(this.node, this.icon, path);

        let nameIndex = this.info.group == 99 ? 5 : this.info.group - 1;
        let namePath = 'view/role/texture/select/' + this.groupNameStr[nameIndex];
        GlobalUtil.setSpriteIcon(this.node, this.groupName, namePath);

        this.selectBg.node.active = false;
        this.listNode.active = !islast;
        this.lastNode.active = islast;
        if (!islast) {
            let temCfgs = ConfigManager.getItems(Copy_towerhaloCfg, (cfg: Copy_towerhaloCfg) => {
                if (cfg.group[0] == this.info.group) {
                    return true;
                }
                return false
            })
            let groupcfg = ConfigManager.getItemById(GroupCfg, this.info.group)
            for (let i = 0; i < this.addhaloNode.length; i++) {
                if (i < temCfgs.length) {
                    let temCfg = temCfgs[i];
                    let node = this.addhaloNode[i]
                    node.active = true;
                    let group = node.getChildByName('group').getComponent(cc.Label);
                    let name1 = node.getChildByName('name1').getComponent(cc.Label);
                    let name2 = node.getChildByName('name2').getComponent(cc.Label);
                    let name3 = node.getChildByName('name3').getComponent(cc.Label);
                    let num1 = node.getChildByName('num1').getComponent(cc.Label);
                    let num2 = node.getChildByName('num2').getComponent(cc.Label);
                    let num3 = node.getChildByName('num3').getComponent(cc.Label);
                    //设置颜色
                    let res = false;
                    this.info.cfgs.some(cfg => {
                        if (cfg.group[0] == temCfg.group[0] && cfg.id == temCfg.id) {
                            res = true
                            return true
                        }
                        return false;
                    })
                    if (res && !this.info.lastAlive) {
                        this.selectBg.node.active = true;
                        group.node.color = cc.color(this.colorStrs[0])
                        name1.node.color = cc.color(this.colorStrs[0])
                        name2.node.color = cc.color(this.colorStrs[0])
                        name3.node.color = cc.color(this.colorStrs[0])
                        num1.node.color = cc.color(this.colorStrs[0])
                        num2.node.color = cc.color(this.colorStrs[0])
                        num3.node.color = cc.color(this.colorStrs[0])
                    } else {
                        group.node.color = cc.color(this.colorStrs[1])
                        name1.node.color = cc.color(this.colorStrs[1])
                        name2.node.color = cc.color(this.colorStrs[1])
                        name3.node.color = cc.color(this.colorStrs[1])
                        num1.node.color = cc.color(this.colorStrs[1])
                        num2.node.color = cc.color(this.colorStrs[1])
                        num3.node.color = cc.color(this.colorStrs[1])
                    }

                    group.string = StringUtils.format(gdk.i18n.t("i18n:ROLE_UPHERO_HALO_TIP1"), temCfg.num, groupcfg.name);//`上阵${temCfg.num}个${groupcfg.name}英雄`
                    let addstrs = temCfg.des.split(';')
                    name1.string = addstrs[0].split('-')[0];
                    num1.string = '+' + addstrs[0].split('-')[1] + '%';
                    name2.string = addstrs[1].split('-')[0];
                    num2.string = '+' + addstrs[1].split('-')[1] + '%';
                    if (addstrs.length < 3 || addstrs[2] == '') {
                        name3.node.active = false;
                        num3.node.active = false;
                    } else {
                        name3.node.active = true;
                        num3.node.active = true;
                        name3.string = addstrs[2].split('-')[0];
                        num3.string = '+' + addstrs[2].split('-')[1] + '%';
                    }

                } else {
                    this.addhaloNode[i].active = false;
                }
            }
        } else {
            let temStr = gdk.i18n.t("i18n:ROLE_UPHERO_HALO_TIP2")//'上阵5个不同阵营的英雄';
            let temcfg = ConfigManager.getItem(Copy_towerhaloCfg, (cfg: Copy_towerhaloCfg) => {
                if (cfg.group[0] == this.info.group) {
                    return true;
                }
                return false
            })
            let addstrs = temcfg.des.split(';')
            addstrs.forEach(addStr => {
                let tem = addStr.split('-');
                if (tem[0] != '') {
                    temStr += '   ' + tem[0] + '+' + tem[1] + '%';
                }
            })
            this.lastStr.string = temStr
            this.lastStr.node.color = this.info.lastAlive ? cc.color(this.colorStrs[0]) : cc.color(this.colorStrs[1]);
            this.selectBg.node.active = this.info.lastAlive
        }


    }


}
