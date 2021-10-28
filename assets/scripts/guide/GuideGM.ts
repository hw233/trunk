import GlobalUtil from '../common/utils/GlobalUtil';
import PanelId from '../configs/ids/PanelId';
import PveFsmEventId from '../view/pve/enum/PveFsmEventId';
import PveSceneCtrl from '../view/pve/ctrl/PveSceneCtrl';
import PveSceneState from '../view/pve/enum/PveSceneState';

/** 
 * 游戏秘籍定义
 * @Author: chengyou.lin
 * @Date: 2019-12-07 15:29:03 
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-04-13 09:49:56
 */
interface IGuideGMInterface {
    init(): void;
}
let GuideGM: IGuideGMInterface;
let menuItems: {
    id?: number,
    panelId?: gdk.PanelValue,
    name: string,
    func: () => void,
    closeAfter?: boolean,
}[];

// 条件编译，使正式版不包括此代码
if (CC_DEBUG || CC_DEV) {
    menuItems = [
        {
            name: "塔防胜利",
            panelId: PanelId.PveScene,
            closeAfter: true,
            func: function () {
                let node = gdk.panel.get(PanelId.PveScene);
                if (node) {
                    let panel = node.getComponent(PveSceneCtrl);
                    if (panel && panel.model.state == PveSceneState.Fight) {
                        gdk.fsm.Fsm.broadcastEvent(PveFsmEventId.PVE_FIGHT_IDLE);
                        panel.fsm.broadcastEvent(PveFsmEventId.PVE_SCENE_WIN);
                    }
                }
            }
        },
        {
            name: "塔防能量+10",
            panelId: PanelId.PveScene,
            func: function () {
                let node = gdk.panel.get(PanelId.PveScene);
                if (node) {
                    let panel = node.getComponent(PveSceneCtrl);
                    if (panel) {
                        panel.model.energy += 10;
                    }
                }
            }
        },
        {
            name: "塔防无敌",
            panelId: PanelId.PveScene,
            closeAfter: true,
            func: function () {
                let node = gdk.panel.get(PanelId.PveScene);
                if (node) {
                    let panel = node.getComponent(PveSceneCtrl);
                    if (panel) {
                        panel.model.proteges.forEach(p => {
                            p.model.hpMax = 999;
                            p.model.hp = 999;
                        });
                    }
                }
            }
        },
    ];

    // GM工具类
    window['gm'] = {

        /**
         * 设置塔防战斗速度
         */
        set pveSpeed(v: number) {
            let node = gdk.panel.get(PanelId.PveScene);
            if (node) {
                let panel = node.getComponent(PveSceneCtrl);
                if (panel) {
                    panel.model.timeScale = v;
                }
            }
        },

        /**
         * 显示gm界面
         */
        show() {

            if (gdk.gui.getPopupByName('GM_DEBUG_NODE')) {
                return;
            }

            let content = new cc.Node('GM_DEBUG_NODE');
            content.zIndex = cc.macro.MAX_ZINDEX;
            content.opacity = 0;
            content.setPosition(0, cc.winSize.height / 2);
            content.addComponent(cc.BlockInputEvents);
            content.addComponent(gdk.FadeShowHideEffect).hideTime = 0.1;

            let layout = content.addComponent(cc.Layout);
            layout.type = cc.Layout.Type.VERTICAL;
            layout.resizeMode = cc.Layout.ResizeMode.CONTAINER;
            layout.spacingY = 5;

            function addButton(name: string, func: Function) {
                let node = new cc.Node();
                let spriteNode = new cc.Node();
                let sprite = spriteNode.addComponent(cc.Sprite);
                sprite.type = cc.Sprite.Type.SIMPLE;
                sprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
                sprite.trim = true;
                spriteNode.width = node.width = 400;
                spriteNode.height = node.height = 65;
                GlobalUtil.setSpriteIcon(node, spriteNode, 'common/texture/zb_huanseanniu');

                let labelNode = new cc.Node();
                let label = labelNode.addComponent(cc.Label);
                let labelOutline = labelNode.addComponent(cc.LabelOutline);
                labelNode.color = cc.color('#FDDFB7');
                label.fontSize = 26;
                label.lineHeight = 26;
                label.string = name;
                labelNode.y = 6;
                labelOutline.color = cc.color('#785814');
                labelOutline.width = 2;

                let button = node.addComponent(cc.Button);
                button.transition = cc.Button.Transition.SCALE;
                button.duration = 0.1;
                button.zoomScale = 0.85;

                spriteNode.parent = node;
                labelNode.parent = node;
                node.parent = content;
                node.on(cc.Node.EventType.TOUCH_END, func);
            }

            let num = 0;
            menuItems.forEach(item => {
                if (!item.panelId || gdk.panel.isOpenOrOpening(item.panelId)) {
                    addButton(item.name, item.closeAfter ? () => {
                        item.func();
                        gdk.NodeTool.hide(content);
                    } : item.func);
                    num++;
                }
            });

            num <= 0 && addButton("没有适合当前界面的秘籍", () => {
                gdk.NodeTool.hide(content);
            });

            gdk.gui.addPopup(content, true, null, pop => {
                pop.isTouchMaskClose = true;
            });
        },
    };

    // 自动生成id
    menuItems.forEach((item, i) => {
        item.id = 1000 + i;
    });
}

if (CC_PREVIEW) {
    // 预览版则添加gm按钮
    class GuideGmClass implements IGuideGMInterface {

        _isInit: boolean = false;

        init() {
            if (this._isInit) {
                return;
            }
            this._isInit = true;
            if (cc.sys.isNative) {
                return;
            }
            let toolbar = document.getElementsByClassName("toolbar")[0];
            if (toolbar) {
                let div = document.createElement("div");
                div.className = "item";
                div.innerHTML = '<button onclick="gm.show()">GM</button>';
                toolbar.insertBefore(div, toolbar.childNodes[toolbar.childNodes.length - 1]);
            }
        }
    }
    GuideGM = gdk.Tool.getSingleton(GuideGmClass);
} else {
    // 非预览版则导出空类实例
    class GuideGmClass implements IGuideGMInterface {
        init() { }
    }
    GuideGM = gdk.Tool.getSingleton(GuideGmClass);
}
export default GuideGM;