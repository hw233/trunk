'use strcit';

const Fs = require('fs');
const Path = require('path');
const Utils = Editor.require("packages://inspector/utils/utils");


///////////////////////// gojs ///////////////////////////////

var FsmGo = {
    diagram: null,
    diagramFsm: null,

    initGojs () {
        const go = Editor.require('packages://gdk-fsm/libs/go.js')
        var $ = go.GraphObject.make;
        go.Shape.defineArrowheadGeometry("myTriangle", "F1 m 0,0 l 18,6 -18,6 z");

        var vue = gdk_fsm.vue;
        var panel = gdk_fsm.panel;
        var diagram = this.diagram = gdk_fsm.diagram =
            $(go.Diagram, panel.$drawView, {
                initialContentAlignment: go.Spot.Center,
                "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,
                "undoManager.isEnabled": false, // enable Ctrl-Z to undo and Ctrl-Y to redo
                "linkingTool.direction": go.LinkingTool.ForwardsOnly,
                "toolManager.hoverDelay": 200,
                allowCopy: false,

                // contextMenu: $(go.Adornment, "Vertical",
                //   $("ContextMenuButton",
                //     $(go.TextBlock, "添加状态"), {
                //       margin: new go.Margin(3, 20)
                //     }, {
                //       click: menu_addState
                //     })
                // ),
            });

        diagram.grid =
            $(go.Panel, "Grid", {
                    name: "GRID",
                    visible: false,
                    gridCellSize: new go.Size(25, 25),
                    gridOrigin: new go.Point(0, 0)
                },
                $(go.Shape, "LineH", {
                    stroke: "lightgray",
                    strokeWidth: 0.05,
                    interval: 1
                }),
                $(go.Shape, "LineH", {
                    stroke: "lightgray",
                    strokeWidth: 0.2,
                    interval: 5
                }),
                $(go.Shape, "LineV", {
                    stroke: "lightgray",
                    strokeWidth: 0.05,
                    interval: 1
                }),
                $(go.Shape, "LineV", {
                    stroke: "lightgray",
                    strokeWidth: 0.2,
                    interval: 5
                }),
            );

        diagram.grid.visible = true; // so that this example shows the standard grid

        function showContextMenu (obj, diagram, tool) {
            vue.menuSelection = "none";
            vue.menuSelectEventIndex = -1;
            if (obj) {
                if (obj.name == "stateName") {
                    vue.menuSelection = "state";
                } else if (obj.name == "event") {
                    vue.menuSelection = "event";
                    vue.menuSelectEventIndex = obj.part.data.events.indexOf(obj.data);
                    vue.inputEventString = obj.data.eventName;
                } else if (obj.name == "globalEvent") {
                    vue.menuSelection = "globalEvent";
                    vue.menuSelectEventIndex = obj.part.data.globalEvents.indexOf(obj.data);
                    vue.inputEventString = obj.data.eventName;
                }

                var data = obj.part.data;
                vue.menuSelectionItem.showStart = !data.isStart;
                vue.menuSelectionItem.showFinish = true;
                for (var i = 0; i < data.events.length; i++) {
                    if (data.events[i].eventName == "FINISH") {
                        vue.menuSelectionItem.showFinish = false;
                        break;
                    }
                }
            }
            panel.$menu.style.display = "block";
            var mousePt = diagram.lastInput.viewPoint;
            panel.$menu.style.left = mousePt.x + "px";
            panel.$menu.style.top = mousePt.y + "px";
        };
        var menu = $(go.HTMLInfo, {
            show: showContextMenu,
            mainElement: panel.$menu
        });
        diagram.contextMenu = menu;
        panel.$menu.addEventListener("contextmenu", function (e) {
            e.preventDefault();
            return false;
        }, false);

        diagram.addDiagramListener("ChangedSelection", function (e) {
            var s = diagram.selection;
            if (s && s.first()) {
                var state = s.first().part.data;
                if (state.hasOwnProperty("type") && state.type == "state") {
                    vue.propTabIndex = 1;
                    vue.currentStateName = state.stateName;
                } else {
                    vue.currentStateName = null;
                }
            } else {
                vue.currentStateName = null;
            }
        });

        diagram.addDiagramListener("LinkDrawn", function (e) {
            gdk_fsm.FsmEvent.linkTo(
                e.subject.part.data.from,
                e.subject.part.data.fromEvent,
                e.subject.part.data.toState
            );
        });

        diagram.addDiagramListener("LinkRelinked", function (e) {
            gdk_fsm.FsmEvent.linkTo(
                e.subject.part.data.from,
                e.subject.part.data.fromEvent,
                e.subject.part.data.toState
            );
        });

        diagram.addDiagramListener("SelectionDeleted", function (e) {
            var s = e.subject;
            if (s) {
                var arr = s.toArray();
                for (var i = 0; i < arr.length; i++) {
                    var part = arr[i];
                    if (part.name == "link") {
                        gdk_fsm.FsmEvent.linkTo(part.data.from, part.data.fromEvent, null);
                    } else if (part.name == "state") {
                        if (part.data.hasOwnProperty("stateName")) {
                            gdk_fsm.FsmState.deleteState(part.data.stateName, true);
                        }
                    }
                }
            }
        });

        diagram.addDiagramListener("SelectionMoved", function (e) {
            var s = e.subject;
            if (s) {
                var arr = s.toArray();
                for (var i = 0; i < arr.length; i++) {
                    var state = arr[i].part.data;
                    let p = {
                        x: arr[i].location.x,
                        y: arr[i].location.y,
                    };
                    p.x = Math.floor(p.x);
                    p.y = Math.floor(p.y);
                    gdk_fsm.FsmState.modifyState(state.stateName, p);
                }
            }
        });

        var fieldTemplate =
            $(go.Panel, "TableRow", // this Panel is a row in the containing Table
                new go.Binding("portId", "eventName"), // this Panel is a "port"
                {
                    name: "event",
                    background: "transparent", // so this port's background can be picked by the mouse
                    fromSpot: go.Spot.LeftRightSides, // links only go from the right side to the left side
                    toSpot: go.Spot.LeftRightSides,
                    fromMaxLinks: 1,
                    fromLinkableDuplicates: false,
                    toLinkableSelfNode: false,
                    fromLinkableSelfNode: true,
                    // allow drawing links from or to this port:
                    fromLinkable: true,
                    toLinkable: false,
                    doubleClick: gdk_fsm.FsmClick.eventDoubleClicked,
                    contextMenu: menu,
                }, { // allow the user to select items -- the background color indicates whether "selected"
                    //?? maybe this should be more sophisticated than simple toggling of selection
                    // click: function (e, item) {
                    //   // assume "transparent" means not "selected", for items
                    //   var oldskips = item.diagram.skipsUndoManager;
                    //   item.diagram.skipsUndoManager = true;
                    //   if (item.background === "transparent") {
                    //     item.background = "dodgerblue";
                    //   } else {
                    //     item.background = "transparent";
                    //   }
                    //   item.diagram.skipsUndoManager = oldskips;
                    // }
                    mouseOver: function (e, item) {
                        item.background = "#c9d6de";
                        var link = FsmGo._getLinkFrom(item);
                        if (link) {
                            FsmGo._setLinkHight(link, true);
                        }
                    },
                    mouseLeave: function (e, item) {
                        item.background = "transparent";
                        var link = FsmGo._getLinkFrom(item);
                        if (link) {
                            FsmGo._setLinkHight(link, false);
                        }
                    }
                },
                $(go.Panel, "Vertical", {
                        stretch: go.GraphObject.Horizontal,
                    },
                    $(go.TextBlock, {
                            margin: new go.Margin(1, 2),
                            column: 1,
                            font: " 12px sans-serif",
                            // and disallow drawing links from or to this text:

                        },
                        new go.Binding("text", "eventName")),
                    $(go.Shape, {
                        stretch: go.GraphObject.Horizontal,
                        fill: '#b5b5b5',
                        stroke: null,
                        height: 0.5,
                    })
                )
            );

        var fieldTemplate2 =
            $(go.Panel, "TableRow", // this Panel is a row in the containing Table
                {
                    name: "globalEvent",
                    doubleClick: gdk_fsm.FsmClick.eventDoubleClicked,
                    contextMenu: menu,
                    mouseOver: function (e, item) {
                        var area = item.findObject("background");
                        area.fill = "#c9d6de";
                    },
                    mouseLeave: function (e, item) {
                        var area = item.findObject("background");
                        area.fill = "#eeeeee";
                    },
                },
                $(go.Panel, "Auto", {
                        margin: new go.Margin(0, 0, -1, 0),
                    },
                    $(go.Shape, {
                        name: "background",
                        fill: "#eeeeee",
                        strokeWidth: 1,
                        stroke: null,
                    }),
                    $(go.Shape, {
                        fill: "#ffd400",
                        width: 7,
                        height: 18,
                        alignment: go.Spot.Left,
                        stroke: "#ffd400",
                        margin: 0,
                    }),
                    $(go.TextBlock, {
                            margin: new go.Margin(1, 6, 1, 12),
                            column: 1,
                            font: "bold 12px sans-serif",
                            // and disallow drawing links from or to this text:
                            fromLinkable: false,
                            toLinkable: false,
                            wrap: false,
                            stroke: "#333333",
                        },
                        new go.Binding("text", "eventName")))
            );

        diagram.nodeTemplate =
            $(go.Node, "Position", {
                    name: "state",
                    isShadowed: true,
                    shadowBlur: 5,
                    shadowColor: "#333333",
                    shadowOffset: new go.Point(3, 6),
                    // toolTip:
                    // $(go.Adornment, "Auto",
                    //   $(go.Shape, { fill: "lightyellow" }),
                    //     $(go.TextBlock, { margin: 3 },
                    //       new go.Binding("text", "stateDescription")))
                },
                new go.Binding("layerName", "isSelected", function (sel) {
                    return sel ? "Foreground" : "";
                }).ofObject(),
                new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
                // this rectangular shape surrounds the content of the node
                $(go.Panel, "Vertical",
                    //   Start
                    $(go.Panel, "Auto", {
                            alignment: go.Spot.Top,
                            shadowVisible: false,
                            margin: new go.Margin(0, 0, -1, 0),
                            toolTip: $(go.Adornment, "Auto", {
                                    isShadowed: true,
                                    shadowBlur: 3,
                                    shadowColor: "#333333",
                                    shadowOffset: new go.Point(3, 4),
                                },
                                $(go.Shape, {
                                    fill: "lightyellow",
                                    stroke: "#555555",
                                }),
                                $(go.TextBlock, {
                                    margin: 3,
                                    stroke: "#444444",
                                    text: "起始状态",
                                }, ))
                        }, // as wide as the whole node
                        new go.Binding("visible", "isStart"),
                        $(go.Shape, {
                            fill: "#eeeeee",
                            stroke: null,
                            // alignment: go.Spot.Top,
                        }),
                        $(go.Shape, {
                            fill: "#00aa00",
                            width: 6,
                            height: 15,
                            alignment: go.Spot.Left,
                            stroke: "#00aa00",
                            margin: 0,
                        }),
                        $(go.TextBlock, {
                            // alignment: go.Spot.Top,
                            margin: new go.Margin(2, 6, 0, 12),
                            stroke: "#333333",
                            textAlign: "center",
                            wrap: false,
                            font: "bold 12px sans-serif",
                            text: "START"
                        })),
                    //   全局事件
                    $(go.Panel, "Vertical", {
                            shadowVisible: false,
                        },
                        new go.Binding("visible", "hasGlobalEvents"),
                        $(go.Panel, "Auto", {
                                padding: 0,
                            },
                            // $(go.Shape, {
                            //   fill: "#EEEEEE",
                            // }),
                            $(go.Panel, "Table", {
                                    name: "globalEventTable",
                                    minSize: new go.Size(100, 10),
                                    defaultStretch: go.GraphObject.Horizontal,
                                    itemTemplate: fieldTemplate2,
                                },
                                new go.Binding("itemArray", "globalEvents")
                            ),
                        ),
                        $(go.Shape, {
                                width: 2,
                                height: 8,
                                fill: '#eeeeee',
                                stroke: null,
                                margin: -1,
                            },
                            new go.Binding("visible", "isStart", function (val) {
                                return !val;
                            })),
                        $(go.Shape, {
                                toArrow: "myTriangle",
                                fill: '#eeeeee',
                                stroke: null,
                                height: 5,
                                scale: 0.7,
                                angle: 90,
                            },
                            new go.Binding("visible", "isStart", function (val) {
                                return !val;
                            }))
                    ),
                    $(go.Panel, "Vertical", {
                            shadowVisible: false,

                        }, // as wide as the whole node
                        new go.Binding("visible", "isStart"),
                        $(go.Shape, {
                            width: 2,
                            height: 8,
                            fill: '#eeeeee',
                            stroke: null,
                            margin: -1,
                        }),
                        $(go.Shape, {
                            toArrow: "myTriangle",
                            fill: '#eeeeee',
                            stroke: null,
                            height: 5,
                            scale: 0.7,
                            angle: 90,
                        })
                    ),
                    //---------     状态   ---------
                    $(go.Panel, "Auto", {
                            shadowVisible: true,
                            defaultStretch: go.GraphObject.Horizontal,
                        },
                        $(go.Panel, "Auto", {
                                shadowVisible: true,
                                defaultStretch: go.GraphObject.Horizontal,
                            },
                            $(go.Shape, {
                                fill: "#EEEEEE",
                                stroke: "#003350",

                            }),
                            // the content consists of a header and a list of items
                            $(go.Panel, "Vertical", {
                                    defaultStretch: go.GraphObject.Horizontal,
                                },
                                // this is the header for the whole node
                                $(go.Panel, "Auto", {
                                        name: "stateName",
                                        fromLinkable: false,
                                        toLinkable: true,
                                        toLinkableSelfNode: true,
                                        toSpot: go.Spot.LeftRightSides,
                                        isPanelMain: true,
                                        doubleClick: gdk_fsm.FsmClick.nodeDoubleClicked,
                                        contextMenu: menu,
                                        padding: 0,
                                        defaultStretch: go.GraphObject.Horizontal,
                                    }, // as wide as the whole node
                                    new go.Binding("portId", "stateName"),
                                    $(go.Shape, {
                                        fill: "#1570A6",
                                        stroke: null
                                    }),
                                    $(go.Shape, {
                                        fill: "#025e94",
                                        width: 7,
                                        height: 20,
                                        alignment: go.Spot.Left,
                                        stroke: "#025e94",
                                        margin: 0,
                                    }),
                                    $(go.TextBlock, {
                                            alignment: go.Spot.Center,
                                            stretch: go.GraphObject.Horizontal,
                                            margin: new go.Margin(1, 6, 1, 10),
                                            stroke: "white",
                                            textAlign: "center",
                                            font: "bold 12pt sans-serif"
                                        },
                                        new go.Binding("text", "stateName").makeTwoWay()),
                                ),
                                // this Panel holds a Panel for each item object in the itemArray;
                                // each item Panel is defined by the itemTemplate to be a TableRow in this Table
                                $(go.Panel, "Table", {
                                        name: "eventTable",
                                        padding: 0,
                                        margin: new go.Margin(1, 5, 1, 5),
                                        minSize: new go.Size(100, 10),
                                        defaultStretch: go.GraphObject.Horizontal,
                                        itemTemplate: fieldTemplate,
                                    },
                                    new go.Binding("itemArray", "events")
                                ), // end Table Panel of items
                            ),
                        ), // end Vertical Panel
                    ),
                    //描述
                    $(go.Panel, "Auto", {
                            shadowVisible: false,
                            // stretch: go.GraphObject.Horizontal,
                            margin: new go.Margin(5, 0, 0, 0),
                        },
                        new go.Binding("visible", "stateDescription", function (v) {
                            return v != "" && v != null;
                        }),
                        $(go.Shape, {
                            // fill: "lightyellow",
                            fill: "#555555",
                            stroke: "#6f6f6f",
                        }),
                        $(go.TextBlock, {
                                margin: new go.Margin(3, 6, 1, 6),
                                alignment: go.Spot.Center,
                                verticalAlignment: go.Spot.Center,
                                stroke: "#afafaf",
                            },
                            new go.Binding("text", "stateDescription")
                        )
                    ),
                ),
            ); // end Node

        diagram.linkTemplate =
            $(go.Link, {
                    name: "link",
                    relinkableTo: true,
                    toShortLength: 10,
                    curve: go.Link.Bezier,
                    toSpot: go.Spot.LeftRightSides,
                    fromEndSegmentLength: 60,
                    toEndSegmentLength: 100,
                    layerName: "Background",
                    smoothness: 1,
                    curviness: 0,
                    routing: go.Link.Normal,
                    // toolTip: $(go.Adornment, "Auto", {
                    //     isShadowed: true,
                    //     shadowBlur: 3,
                    //     shadowColor: "#333333",
                    //     shadowOffset: new go.Point(3, 4),
                    //   },
                    //   $(go.Shape, {
                    //     fill: "lightyellow",
                    //     stroke: "#555555",
                    //   }),
                    //   $(go.TextBlock, {
                    //       margin: 3,
                    //       stroke: "#444444",
                    //     },
                    //     new go.Binding("text", "fromEvent"),
                    //   ))
                }, // let user reconnect links
                {
                    mouseOver: function (e, item) {
                        FsmGo._setLinkHight(item, true);
                        item.part.fromPort.background = "#f5d282";
                    },
                    mouseLeave: function (e, item) {
                        FsmGo._setLinkHight(item, false);
                        item.part.fromPort.background = "transparent";
                    },
                },
                $(go.Shape, {
                    name: "linkLine",
                    strokeWidth: 2,
                    stroke: '#a0a0a0'
                }),
                $(go.Shape, {
                    name: "linkArrow",
                    toArrow: "myTriangle",
                    fill: '#aaaaaa',
                    stroke: null
                })
            );

        var myOverview =
            $(go.Overview, panel.$drawOverView, // the HTML DIV element for the Overview
                {
                    observed: diagram,
                    contentAlignment: go.Spot.Center,
                }); // tell it which Diagram to show and pan
        myOverview.box.elt(0).stroke = "#999977";
        myOverview.box.selectionAdorned = false;

        var myModel = $(go.GraphLinksModel);
        // in the model data, each node is represented by a JavaScript object:
        myModel.linkFromPortIdProperty = "fromEvent";
        myModel.linkToPortIdProperty = "toState";
        myModel.nodeKeyProperty = "stateName";
        // myModel.nodeDataArray = [];
        // myModel.linkDataArray = [];
        diagram.model = myModel;
        this.updateModelData();
    },

    _getLinkFrom (prot) {
        var links = this.diagram.links;
        var it = links.iterator;
        while (it.next()) {
            var item = it.value;
            if (item.part.fromPort == prot) {
                return item;
            }
        }
        return null;
    },

    _setLinkHight (item, isOver) {
        var linkLine = item.findObject("linkLine");
        linkLine.stroke = isOver ? "#ffd42f" : "#a0a0a0";
        var linkArrow = item.findObject("linkArrow");
        linkArrow.fill = isOver ? "#ffd42f" : "#aaaaaa";
        item.layerName = isOver ? "" : "Background";
        item.part.fromPort.background = isOver ? "#ffe378" : "transparent";
    },

    updateModelData () {
        var diagram = this.diagram;
        if (!diagram == null) return;
        var vue = gdk_fsm.vue;
        var fsmCom = vue.fsmCom;
        var myModel = diagram.model;
        var stateCount = 0;
        var linkCount = 0;
        myModel.linkDataArray = [];
        myModel.nodeDataArray = [];
        if (fsmCom) {
            this.diagramFsm = fsmCom.value.uuid.value;
            let fsm = fsmCom.value.fsm.value;
            let states = fsm.states.value;
            var stateDic = {};
            for (let i = 0; i < states.length; i++) {
                let state = states[i];
                stateDic[state.value.stateName.value] = true;
            }
            for (let i = 0; i < states.length; i++) {
                stateCount++;
                let state = states[i];
                let isStart = fsm.startState.value == state.value.stateName.value;
                let s = myModel.nodeDataArray[i];
                if (s == null) {
                    s = {
                        type: "state",
                        events: [],
                        globalEvents: [],
                    };
                    myModel.nodeDataArray.push(s);
                }
                s.isStart = isStart;
                s.stateName = state.value.stateName.value;
                s.stateDescription = state.value.stateDescription.value;
                s.loc = state.value.x.value + " " + state.value.y.value;
                s.events = [];
                s.globalEvents = [];
                s.hasGlobalEvents = false;
                ///
                let transitions = state.value.transitions.value;
                for (let j = 0; j < transitions.length; j++) {
                    let e = transitions[j];
                    let event = {
                        eventName: e.value.eventName.value,
                        isGlobal: false,
                    }
                    s.events.push(event);
                    var toStart = e.value.toState.value;
                    if (!stateDic[toStart])
                        toStart = "";
                    if (toStart != "") {
                        linkCount++;

                        let link = myModel.linkDataArray[linkCount];
                        if (link == null) {
                            link = {
                                from: "",
                                fromEvent: "",
                                to: "",
                                toState: "",
                            }
                            myModel.linkDataArray.push(link);
                        }

                        link.from = state.value.stateName.value;
                        link.fromEvent = e.value.eventName.value;
                        link.to = toStart;
                        link.toState = toStart;
                    }
                }

                transitions = fsm.globalTransitions.value;
                for (let j = 0; j < transitions.length; j++) {
                    let e = transitions[j];
                    if (e.value.toState.value == s.stateName) {
                        let event = {
                            type: "event",
                            eventName: e.value.eventName.value,
                            isGlobal: true,
                        }
                        s.globalEvents.push(event);
                        s.hasGlobalEvents = true;
                    }
                }
            }
        }

        myModel.nodeDataArray.length = stateCount;
        myModel.linkDataArray.length = linkCount;
        diagram.startTransaction("updated");
        // This is very general but very inefficient.
        // It would be better to modify the diagramData data by calling
        // Model.setDataProperty or Model.addNodeData, et al.
        diagram.updateAllRelationshipsFromData();
        diagram.updateAllTargetBindings();
        diagram.commitTransaction("updated");
        // 选中当前状态
        if (vue.currentStateName) {
            diagram.select(diagram.findNodeForKey(vue.currentStateName));
        }
    },

    // 选中的状态水平居中对齐
    aligningCenterX () {
        Editor.log('aligningCenterX', this._aligningCenter);
        this._aligningCenter('x');
    },

    aligningCenterY () {
        Editor.log('aligningCenterY', this._aligningCenter);
        this._aligningCenter('y');
    },

    _aligningCenter (prop) {
        var diagram = this.diagram;
        var selection = diagram.selection;
        if (!selection.first()) return;
        diagram.startTransaction("aligningCenter");

        // 得到将要对齐的节点
        var nodes = [];
        selection.each(current => {
            if (current instanceof go.Link) return;
            if (current.part.data.type != 'state') return;
            nodes.push([current, current.actualBounds]);
        });
        var count = nodes.length;
        if (count < 1) return;
        nodes.sort((a, b) => {
            if (prop == 'x') {
                return a[1].y - b[1].y;
            } else {
                return a[1].x - b[1].x;
            }
        });

        // 计算X坐标中心，起点Y坐标，每行空间
        var beginY = 0;
        var centerX = 0;
        var tempY = 0;
        var spaceY = 0;
        for (let i = 0; i < count; i++) {
            let actualBounds = nodes[i][1];
            if (prop == 'x') {
                // 水平方向
                if (i == 0) {
                    beginY = actualBounds.y;
                    centerX = actualBounds.x + actualBounds.width / 2;
                    tempY = actualBounds.y;
                    spaceY = 0;
                } else {
                    spaceY += actualBounds.y - tempY;
                }
                tempY = actualBounds.y + actualBounds.height;
            } else {
                // 垂直方向
                if (i == 0) {
                    beginY = actualBounds.x;
                    centerX = actualBounds.y + actualBounds.height / 2;
                    tempY = actualBounds.x;
                    spaceY = 0;
                } else {
                    spaceY += actualBounds.x - tempY;
                }
                tempY = actualBounds.x + actualBounds.width;
            }
        }

        // 设置各节点坐标
        spaceY = spaceY / (count - 1);
        tempY = beginY;
        for (let i = 0; i < count; i++) {
            let actualBounds = nodes[i][1];
            let p = {};
            if (prop == 'x') {
                p.x = centerX - actualBounds.width / 2;
                p.y = tempY;
            } else {
                p.x = tempY;
                p.y = centerX - actualBounds.height / 2;
            }
            p.x = Math.floor(p.x);
            p.y = Math.floor(p.y);
            if (p.x != actualBounds.x || p.y != actualBounds.y) {
                let current = nodes[i][0];
                current.move(new go.Point(p.x, p.y));
                gdk_fsm.FsmState.modifyState(current.part.data.stateName, p);
            }
            if (prop == 'x') {
                tempY += actualBounds.height + spaceY;
            } else {
                tempY += actualBounds.width + spaceY;
            }
        }

        diagram.commitTransaction("aligningCenter");
    },
};

module.exports = FsmGo;