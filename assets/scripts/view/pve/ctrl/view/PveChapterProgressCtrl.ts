import ConfigManager from '../../../../common/managers/ConfigManager';
import CopyUtil from '../../../../common/utils/CopyUtil';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import RoleModel from '../../../../common/models/RoleModel';
import { Copy_stageCfg } from '../../../../a/config';
/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-06-22 20:13:20 
  */// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/pve/view/PveChapterProgressCtrl")
export default class PveChapterProgressCtrl extends cc.Component {

    @property(cc.Node)
    lineBg: cc.Node = null;

    @property(cc.Node)
    progressLine: cc.Node = null;

    @property([cc.Node])
    chapters: cc.Node[] = [];

    @property([cc.SpriteFrame])
    maskSprite: cc.SpriteFrame[] = [];

    @property(cc.Node)
    head: cc.Node = null;

    showSid: number[] = [];
    lineTween: cc.Tween = null;
    headTween: cc.Tween = null;

    size: number[][] = [[74, 74], [90, 89], [97, 97]];
    onDisable() {
        if (this.lineTween) {
            this.lineTween.stop();
            this.lineTween = null;
        }
        if (this.headTween) {
            this.headTween.stop();
            this.headTween = null;
        }
    }

    updateView(cfg: Copy_stageCfg) {
        this.showSid = [];
        if (!cfg || CopyUtil.getChapterId(cfg.id) != CopyUtil.getChapterId(cfg.pre_condition)) {
            this.showSid.push(0);
        } else {
            this.showSid.push(cfg.pre_condition);
        }
        this.showSid.push(cfg.id);
        let nextSid = cfg.id + 1;
        let flag = true;
        while (flag) {
            let cfg = ConfigManager.getItemById(Copy_stageCfg, nextSid);
            if (cfg && this.showSid.length < 5) {
                this.showSid.push(nextSid);
                nextSid += 1;
            }
            else {
                flag = false;
            }
        }
        let spine = this.head.getChildByName('spine');
        spine.active = false;
        this._updateChapter();
    }

    _updateChapter() {
        let showChapter: cc.Node[] = [];
        this.chapters.forEach((chapter, idx) => {
            if (this.showSid[idx] >= 0) {
                showChapter.push(chapter);
            }
            else {
                chapter.active = false;
            }
        });

        if (showChapter.length >= 2) {
            showChapter[0].parent.getComponent(cc.Layout).updateLayout();
            this.lineBg.x = showChapter[0].x;
            this.progressLine.x = showChapter[0].x;
            this.lineBg.width = showChapter[showChapter.length - 1].x - showChapter[0].x;
            this.head.x = showChapter[0].x;
            GlobalUtil.setSpriteIcon(this.node, cc.find('mask/icon', this.head), GlobalUtil.getHeadIconById(ModelManager.get(RoleModel).head));

            let urlStr = ['putongguanka', 'jingyingguanka', 'bossguanka'];
            showChapter.forEach((chapter, idx) => {
                chapter.active = true;
                let bg1 = chapter.getChildByName('bg1');
                let bg2 = chapter.getChildByName('bg2');
                let sidLabel = chapter.getChildByName('numLabel');
                let title = chapter.getChildByName('title');
                let spine = chapter.getChildByName('spine');

                let sid = this.showSid[idx];
                let cfg = ConfigManager.getItemById(Copy_stageCfg, sid);
                let type = cfg ? cfg.hangup_type % 3 : 0;  //0-普通 1-精英 2-boss 3-普通
                //spine
                spine && (spine.active = false);
                //bg
                bg1.active = true;
                GlobalUtil.setSpriteIcon(this.node, bg2, `view/pve/texture/ui/zb_${urlStr[type]}02`);
                //关卡label
                sidLabel.active = sid != 0;
                sid != 0 && (sidLabel.getComponent(cc.Label).string = `${CopyUtil.getChapterId(sid)}-${CopyUtil.getSectionId(sid)}`);
                //title
                title.active = type == 0 ? false : true;
                type != 0 && GlobalUtil.setSpriteIcon(this.node, title, `view/pve/texture/ui/${type == 1 ? 'zb_jingyinggtxt' : 'zb_bosstxt'}`);
                if (idx >= 1) {
                    bg2.active = false;
                    GlobalUtil.setSpriteIcon(this.node, bg1, `view/pve/texture/ui/zb_${urlStr[type]}03`);
                }
                else {
                    GlobalUtil.setSpriteIcon(this.node, bg1, `view/pve/texture/ui/zb_${urlStr[type]}01`);
                    bg2.active = type == 0 ? true : false;
                    this.head.getChildByName('mask').getComponent(cc.Mask).spriteFrame = this.maskSprite[type];
                    this.head.getChildByName('mask').width = this.size[type][0];
                    this.head.getChildByName('mask').height = this.size[type][1];
                    cc.find('mask/icon', this.head).width = this.size[type][0];
                    cc.find('mask/icon', this.head).height = this.size[type][1];
                }
            });
            this._playAni();
        }
    }

    async _playAni() {
        await this._lineAni();
        let passSpine = this.chapters[1].getChildByName('spine').getComponent(sp.Skeleton);
        passSpine.node.active = true;
        passSpine.setCompleteListener(async () => {
            passSpine.setCompleteListener(null);
            passSpine.node.active = false;
            await this._headAni();
            //背景替换
            let bg1 = this.chapters[1].getChildByName('bg1');
            let sid = this.showSid[1];
            let cfg = ConfigManager.getItemById(Copy_stageCfg, sid);
            let type = cfg ? cfg.hangup_type % 3 : 0;  //0-普通 1-精英 2-boss
            let urlStr = ['putongguanka', 'jingyingguanka', 'bossguanka'];
            GlobalUtil.setSpriteIcon(this.node, bg1, `view/pve/texture/ui/zb_${urlStr[type]}01`);
        });
        passSpine.setAnimation(0, 'stand', true);
    }

    /**线动画 */
    _lineAni(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.progressLine.width = 0;
            this.lineTween = new cc.Tween();
            this.lineTween.target(this.progressLine)
                .to(1, { width: this.chapters[1].x - this.chapters[0].x })
                .call(() => {
                    return resolve();
                })
                .start();
        });
    }

    /**头像动画 */
    _headAni(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.head.x = this.chapters[0].x;
            this.headTween = new cc.Tween();
            this.headTween.target(this.head)
                .to(.2, { x: this.chapters[1].x })
                .call(() => {
                    let spine = this.head.getChildByName('spine').getComponent(sp.Skeleton);
                    let sid = this.showSid[1];
                    let cfg = ConfigManager.getItemById(Copy_stageCfg, sid);
                    let type = cfg ? cfg.hangup_type % 3 : 0;  //0-普通 1-精英 2-boss 3-普通
                    this.head.getChildByName('mask').getComponent(cc.Mask).spriteFrame = this.maskSprite[type];
                    this.head.getChildByName('mask').width = this.size[type][0];
                    this.head.getChildByName('mask').height = this.size[type][1];
                    cc.find('mask/icon', this.head).width = this.size[type][0];
                    cc.find('mask/icon', this.head).height = this.size[type][1];
                    spine.node.active = true;
                    spine.setCompleteListener(() => {
                        spine.setCompleteListener(null);
                        spine.node.active = false;
                    });
                    spine.setAnimation(0, `${type == 0 ? 'stand2' : 'stand3'}`, true);
                    return resolve();
                })
                .start();
        });
    }
}
