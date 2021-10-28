var PopupComponent;
var NodeTool = require("../Tools/gdk_NodeTool");

/**
 * 弹窗管理器, 
 * 建意使用GUIManger可以指定弹到哪一层
 * @Author: sthoo.huang 
 * @Date: 2019-02-14 18:07:15
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2019-02-27 13:36:44
 */
var PopupManager = {
    /**
     * 弹出一个面板。
     * @param {Node|Prefab} nodeOrPrefab 要弹出的面板
     * @param {Node} parent 父级
     * @param {bool} isMask 是否模态
     * @returns {PopupComponent}
     */
    addPopup (nodeOrPrefab, parent, isMask = true) {
        if (nodeOrPrefab == null || parent == null) {
            return null;
        }
        if (PopupComponent == null) {
            PopupComponent = require("../components/gdk_PopupComponent"); //互相引用所以延时加载
        }
        var node = nodeOrPrefab;
        if (nodeOrPrefab instanceof cc.Prefab) {
            node = cc.instantiate(nodeOrPrefab);
            node.name = nodeOrPrefab.name;
        }
        if (node.parent != parent) {
            node.parent = parent;
        }
        var pop = node.getComponent(PopupComponent);
        if (pop == null) {
            pop = node.addComponent(PopupComponent);
        }
        pop.enabled = true;
        pop.isMask = isMask;
        return pop;
    },

    /**
     * 弹出一个面板。 同一个prefab只弹一个
     * @param {Node|Prefab} nodeOrPrefab 要弹出的面板
     * @param {Node} parent 父级
     * @param {bool} isMask 是否模态
     * @returns {PopupComponent}
     */
    addPopupOne (nodeOrPrefab, parent, isMask = true) {
        if (nodeOrPrefab == null || parent == null) {
            return null;
        }
        if (PopupComponent == null) {
            PopupComponent = require("../components/gdk_PopupComponent"); //互相引用所以延时加载
        }
        var node = nodeOrPrefab;
        if (nodeOrPrefab instanceof cc.Prefab) {
            var pop = PopupComponent._popupDic[node.name];
            if (pop) {
                if (pop.node.parent != parent) {
                    pop.node.parent = parent;
                }
                pop.enabled = true;
                pop.isMask = isMask;
                return pop;
            } else {
                node = cc.instantiate(nodeOrPrefab);
                node.name = nodeOrPrefab.name;
            }
        }
        return PopupManager.addPopup(node, parent, isMask);
    },
    has (nodeOrPrefabOrName) {
        return this.get(nodeOrPrefabOrName) != null;
    },
    get(nodeOrPrefabOrName) {
        if (nodeOrPrefabOrName == null || parent == null) {
            return false;
        }
        if (PopupComponent == null) {
            PopupComponent = require("../components/gdk_PopupComponent"); //互相引用所以延时加载
        }
        var pop = null;
        if (nodeOrPrefabOrName instanceof cc.Prefab) {
            pop = PopupComponent._popupDic[nodeOrPrefabOrName.name];
            return pop;
        } else if (nodeOrPrefabOrName instanceof cc.Node) {
            for (var d in PopupComponent._popupDic) {
                pop = PopupComponent._popupDic[d];
                if (pop.node == nodeOrPrefabOrName) {
                    return pop;
                }
            }
        } else if (typeof nodeOrPrefabOrName == "string") {
            pop = PopupComponent._popupDic[nodeOrPrefabOrName];
            return pop;
        }
        return null;
    },

    /**
     * 移除弹出面板,并调用 NodeTool.hide();
     */
    removePopup (nodeOrPopup) {
        if (nodeOrPopup == null) {
            return;
        }
        if (nodeOrPopup instanceof cc.Component) {
            nodeOrPopup = nodeOrPopup.node;
        }
        var pop = nodeOrPopup.getComponent(PopupComponent);
        if (pop) {
            pop.enabled = false;
        }
        NodeTool.hide(nodeOrPopup);
    },
};

module.exports = PopupManager;