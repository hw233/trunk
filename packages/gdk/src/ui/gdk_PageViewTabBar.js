/**
 * PageView组件的TabBar
 * @author
 */

var PageViewTabBar = cc.Class({
    extends: cc.Component,
    editor: {
        menu: 'gdk(UI)/PageViewTabBar',
        disallowMultiple: false
    },
    properties: {

        pageView: cc.PageView,
        _selectIndex: {
            default: 0,
            serializable: true,
            visible: true,
        },
        selectIndex: {
            visible: false,
            get() {
                return this._selectIndex;
            },
            set(value) {
                if (this._selectIndex == value)
                    return;
                this._selectIndex = value;
                this.pageView.setCurrentPageIndex(value);
                this._pageIndexChanaged();
            },
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.toggles = this.node.getComponentsInChildren(cc.Toggle);
        for (let i = 0; i < this.toggles.length; i++) {
            let toggle = this.toggles[i];
            toggle.node.on("toggle", function () {
                toggle.isChecked = true;
                this.selectIndex = i;
            }, this);
        }
        this.pageView.node.on("page-turning", function () {
            this._selectIndex = this.pageView.getCurrentPageIndex();
            this._pageIndexChanaged();
        }, this);

    },
    start() {
        if (this._selectIndex != this.pageView.getCurrentPageIndex())
            this.pageView.setCurrentPageIndex(this._selectIndex);
        else
            this._pageIndexChanaged();
    },
    _pageIndexChanaged() {
        for (let i = 0; i < this.toggles.length; i++) {
            let toggle = this.toggles[i];
            toggle.isChecked = i == this._selectIndex;
        }
    }

    // update (dt) {},
});

module.exports = PageViewTabBar;