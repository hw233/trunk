import ConfigManager from '../../../common/managers/ConfigManager';
import CopyModel, { CityData, CityState } from '../../../common/models/CopyModel';
import CopyUtil from '../../../common/utils/CopyUtil';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import GuideUtil from '../../../common/utils/GuideUtil';
import ModelManager from '../../../common/managers/ModelManager';
import RoleModel from '../../../common/models/RoleModel';
import { Copy_stageCfg } from '../../../a/config';
import { CopyType } from './../../../common/models/CopyModel';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/map/WorldMapViewCtrl")
export default class WorldMapViewCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;
    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Node)
    pathNode: cc.Node = null;
    @property(cc.Prefab)
    pathLinePrefab: cc.Prefab = null;

    @property(cc.TiledMapAsset)
    tmxAsset: cc.TiledMapAsset = null;
    @property(cc.Prefab)
    cityPrefab: cc.Prefab = null;
    @property(cc.Node)
    cityParent: cc.Node = null;

    @property(sp.Skeleton)
    unlockSpine: sp.Skeleton = null;
    @property(cc.Node)
    mask: cc.Node = null;

    // @property(cc.Graphics)
    // pathGraphics: cc.Graphics = null;

    cityObjects: any[];
    cityDatas: CityData[];
    focusCityData: CityData; //当前选中章节
    contentOrginPos: cc.Vec2; //content原始坐标
    isOpenNewChapter: boolean = false; //是否开启新的章节
    newChapter: number;
    cityNode: cc.Node;

    _isMove: boolean = false; //是否正在移动
    get isMove(): boolean { return this._isMove; }
    set isMove(v: boolean) {
        this._isMove = v;
        if (v) {
            this.scrollView.vertical = this.scrollView.horizontal = false;
        }
        else {
            this.scrollView.vertical = this.scrollView.horizontal = true;
        }
    }

    private _tasks: Function[];
    private _next_task() {
        if (!cc.isValid(this.node)) return;
        if (!this.node.activeInHierarchy) return;
        if (!this._tasks || !this._tasks.length) {
            this._tasks = null;
            return;
        }
        let task = this._tasks.shift();
        task.call(this);
        gdk.Timer.callLater(this, this._next_task);
    }

    get model() { return ModelManager.get(CopyModel) }
    get roleModel() { return ModelManager.get(RoleModel) }

    /**获取在世界坐标系下的节点包围盒(不包含自身激活的子节点范围) */
    private _get_bounding_box_to_world(node_o_: any): cc.Rect {
        let w_n: number = node_o_._contentSize.width;
        let h_n: number = node_o_._contentSize.height;
        let rect_o = cc.rect(
            -node_o_._anchorPoint.x * w_n,
            -node_o_._anchorPoint.y * h_n,
            w_n,
            h_n
        );
        node_o_._calculWorldMatrix();
        rect_o.transformMat4(rect_o, node_o_._worldMatrix);
        return rect_o;
    }
    /**检测碰撞 */
    private _check_collision(rect1_o: cc.Rect, node_o_: cc.Node): boolean {
        let rect2_o = this._get_bounding_box_to_world(node_o_);
        return rect1_o.intersects(rect2_o);
    }
    /**自定义事件 */
    private _event_update_active(): void {
        gdk.Timer.callLater(this, this._event_update_active_later);
    }
    private _event_update_active_later() {
        if (!cc.isValid(this.node)) return;
        if (!this.node.activeInHierarchy) return;
        // let node = this.scrollView.content.getChildByName('mapNode');
        // // 保险范围
        // let rect1_o = this._get_bounding_box_to_world(this.scrollView.node);
        // rect1_o.width += rect1_o.width * 0.5;
        // rect1_o.height += rect1_o.height * 0.5;
        // rect1_o.x -= rect1_o.width * 0.25;
        // rect1_o.y -= rect1_o.height * 0.25;
        //     node.children.forEach(n => n.active = this._check_collision(rect1_o, n));
        //     gdk.Timer.frameOnce(1, this, this._update_city_nodes);
        // }
        // // 创建显示区域中的节点
        // private _update_city_nodes() {
        let count = 0;
        let rect1_o = this._get_bounding_box_to_world(this.scrollView.node);
        this.cityDatas.some(d => {
            if (d.cityNode) return;
            this.cityNode.opacity = 1;
            this.cityNode.setPosition(d.pos);
            if (this._check_collision(rect1_o, this.cityNode)) {
                this._createCityNode(d);
                count++;
            }
            return count >= 3;
        });
        this.cityNode.setPosition(99999, 99999);
        this.cityNode.opacity = 0;
        if (count >= 3) {
            gdk.Timer.callLater(this, this._event_update_active_later);
        }
    }

    // onLoad() {
    //     let node = this.scrollView.content.getChildByName('mapNode');
    //     node.children.forEach(n => n.active = false);
    // }

    onEnable() {
        this._tasks = [];
        this._tasks.push(this._preCreateCitys);
        this._tasks.push(this._createCitysStep);
        this._tasks.push(this._checkNewChapter);
        this._tasks.push(this._initDatas);
        this._tasks.push(() => this.scrollView.getComponent(cc.Widget).updateAlignment());
        this._tasks.push(this._addEventListener);
        this._tasks.push(() => {
            this.cityParent.opacity = 255;
            this.contentOrginPos = this.content.position as cc.Vec2;
            if (!GuideUtil.isGuiding) {
                let key = this.newChapter ? `popup#WorldMapView#${this.newChapter}#open` : 'none';
                if (!GuideUtil.isHideGuide && GuideUtil.model.activeCfgs[key]) {
                    GuideUtil.activeGuide(key);
                }
                else {
                    this._showPath();
                }
            }
        });
        gdk.Timer.callLater(this, this._next_task);
    }

    onDisable() {
        this._removeEventListener();
        this.pathNode.destroyAllChildren();
        this.cityParent.destroyAllChildren();
        this.content.stopAllActions();
        this.cityNode = null;
        this._tasks = null;
        gdk.Timer.clearAll(this);
    }

    close() {
        if (this.isMove) return;
        super.close();
    }

    // 解析tiledMap数据
    parseMap() {
        let file = this.tmxAsset;
        let texValues = file.textures;
        let texKeys = file.textureNames;
        let textures = {};
        for (let i = 0; i < texValues.length; ++i) {
            textures[texKeys[i]] = true; // texValues[i];
        }

        let tsxFileNames = file['tsxFileNames'];
        let tsxFiles = file['tsxFiles'];
        let tsxMap = {};
        for (let i = 0; i < tsxFileNames.length; ++i) {
            if (tsxFileNames[i].length > 0) {
                tsxMap[tsxFileNames[i]] = tsxFiles[i].text;
            }
        }

        let TMXMapInfo: any = cc['TMXMapInfo'];
        let tmxXmlStr = file['tmxXmlStr'].replace(/<imagelayer(([\s\S])*?)<\/imagelayer>/g, '');
        let mapInfo = new TMXMapInfo(tmxXmlStr, tsxMap, textures, {});
        let getObjectGroup = function (name: string): any[] {
            for (let i = 0; i < mapInfo._objectGroups.length; i++) {
                let item = mapInfo._objectGroups[i];
                if (item.name == name) {
                    return item._objects;
                }
            }
            return [];
        }
        return getObjectGroup('city');
    }

    //初始化关卡相关数据
    _initDatas() {
        let cfgs = ConfigManager.getItems(Copy_stageCfg, { copy_id: CopyType.MAIN });
        let cityDatas = this.cityDatas;
        let stageId = this.model.latelyStageId;
        let curCityId = CopyUtil.getChapterId(stageId);
        for (let i = 0, n = cfgs.length; i < n; i++) {
            let cfg = cfgs[i];
            let stageId = cfg.id;
            let cityId = CopyUtil.getChapterId(stageId);
            let cityData = cityDatas[cityId - 1];
            if (!cityData) {
                // cc.error("通知程序添加城市");
                continue;
            }
            if (!cityData.cityId) {
                cityData.cityId = cityId;
                cityData.stageDatas = [];
                let names: string[] = cfg.des.split('-');
                cityData.cityName = names[names.length - 2];
                if (cityId == curCityId) {
                    cityData.state = CityState.Open;
                } else if (cityId < curCityId) {
                    cityData.state = CityState.Pass;
                } else {
                    cityData.state = CityState.Lock;
                }

                //等待解锁动画之后再显示
                if (this.isOpenNewChapter && cityId == curCityId) {
                    cityData.state = CityState.Lock;
                }

                cityData.cityType = 1;
            }
            cityData.isTrack = false;
        }
    }

    _preCreateCitys() {
        this.cityObjects = this.parseMap();
        this.cityObjects.sort((a, b) => {
            if (!!a.name && !!b.name) {
                if (parseInt(a.name) == parseInt(b.name)) {
                    return parseInt(a.id) - parseInt(b.id);
                }
                else {
                    return parseInt(a.name) - parseInt(b.name);
                }
            }
            else {
                return parseInt(a.id) - parseInt(b.id);
            }
        });
        this.cityDatas = [];
        this.cityParent.destroyAllChildren();
        this.cityParent.opacity = 0;
    }

    _createCitysStep() {
        let objects = this.cityObjects;
        let idx = this.cityDatas.length;
        let len = objects.length;
        let num = Math.ceil(len / 4);
        let city = new cc.Node('__vis__');
        city.width = 200;
        city.height = 210;
        while (num > 0 && idx < len) {
            let data = objects[idx];
            let cityData = new CityData();
            cityData.index = idx;
            cityData.pos = cc.v2(data.x + (city.width * .6) / 2, -data.y + (city.height * .6) / 2);
            this.cityDatas.push(cityData);
            idx++;
            num--;
        }
        // 节点还没有创建完
        if (idx < len) {
            this._tasks.unshift(this._createCitysStep);
        }
        // 保存此节点
        city.name = `__vis__`;
        city.opacity = 0;
        city.parent = this.cityParent;
        city.setScale(.6);
        city.setPosition(99999, 99999);
        this.cityNode = city;
    }

    _getCityDataBy(index: number) {
        let cityData = this.cityDatas[index];
        if (cityData) {
            this._createCityNode(cityData);
        }
        return cityData;
    }

    // 创建节点
    _createCityNode(cityData: CityData) {
        let city = cityData.cityNode;
        if (!city) {
            city = cityData.cityNode = cc.instantiate(this.cityPrefab);
            city.name = `city${cityData.index + 1}`;
            city.parent = this.cityParent;
            city.setScale(.6);
            city.setPosition(cityData.pos);
            city.on('click', this._onCityClick, this, true);

            let node = city.getChildByName('node');
            cityData.iconSprite = node.getChildByName("icon").getComponent(cc.Sprite);
            cityData.nameLab = node.getChildByName("dt_mingzidi");
            cityData.lockNode = node.getChildByName("unSelect");
            cityData.trackNode = node.getChildByName("track");
            cityData.fightAni = node.getChildByName("fightAni").getComponent(cc.Animation);
            cityData.friendNode = node.getChildByName("friendNode");
            cityData.unLockSpine = node.getChildByName("unLockSpine").getComponent(sp.Skeleton);
            this._updataCity(cityData);
        }
    }

    openCity(data: CityData) {
        if (data.state == CityState.Lock) {
            GlobalUtil.showMessageAndSound(`${data.cityName}${gdk.i18n.t("i18n:MAP_TIP1")}`);
            return;
        }
        else if (data.state == CityState.Pass) {
            GlobalUtil.showMessageAndSound(`${gdk.i18n.t("i18n:MAP_TIP4")}`);
            return;
        }
        this.close();
    }

    _addEventListener() {
        this.cityDatas.forEach(d => {
            if (d.cityNode) {
                d.cityNode.on('click', this._onCityClick, this, true);
            }
        });
        this.content.on(cc.Node.EventType.POSITION_CHANGED, this._event_update_active, this);
        this._event_update_active();
    }

    _removeEventListener() {
        this.cityDatas.forEach(d => {
            if (d.cityNode) {
                d.cityNode.off('click', this._onCityClick, this, true);
            }
        });
        this.content.targetOff(this);
    }

    _onCityClick(btn: cc.Button) {
        if (!btn.node || this.isMove) return;
        let name = btn.node.name; //city xx
        let id = name.slice(4);
        let cityData = this._getCityDataBy(parseInt(id) - 1);
        if (cityData) {
            this.isMove = true;
            this._removeEventListener();
            this.moveToCenter(cityData);
            cityData.trackNode.stopAllActions();
            cityData.isTrack = false;
            this._setTrack(cityData);
            gdk.Timer.once(500, this, () => {
                if (this.focusCityData) this.openCity(this.focusCityData);
            });
        }
    }

    /**
     * 更新单个城市
     * @param data 
     */
    _updataCity(data: CityData) {
        GlobalUtil.setSpineData(this.node, data.unLockSpine, null);
        data.unLockSpine.setCompleteListener(null);
        data.unLockSpine.node.active = false;
        let path = `view/map/texture/worldmap/texture/dt_jianzhu` + `${data.cityId == CopyUtil.getChapterId(this.model.latelyStageId) && data.state == CityState.Open ? '_select' : ''}`;
        GlobalUtil.setSpriteIcon(this.node, data.iconSprite, path);
        data.lockNode.active = data.state == CityState.Lock;
        data.fightAni.node.active = data.cityId == CopyUtil.getChapterId(this.model.latelyStageId) && data.state == CityState.Open;
        if (data.fightAni.node.active) {
            data.fightAni.play("mapFightAni");
        }
        else {
            data.fightAni.stop("mapFightAni");
        }
        data.trackNode.active = false;
        let name = data.nameLab.getChildByName('name').getComponent(cc.Label);
        name.string = data.state == CityState.Lock ? `${data.cityName}` : `${data.cityId}.${data.cityName}`;
        GlobalUtil.setAllNodeGray(data.nameLab, data.state == CityState.Lock ? 1 : 0);
        if (data.state == CityState.Lock) {
            name.node.color = new cc.Color(125, 125, 125);
            name.node.getComponent(cc.LabelOutline).enabled = false;
        }
        else {
            name.node.color = new cc.Color().fromHEX('#FCFFBA');
            name.node.getComponent(cc.LabelOutline).enabled = true;
        }
        let friendList = CopyUtil.getFriendListByChapter(data.cityId);
        data.friendNode.children.forEach((node, idx) => {
            if (friendList[idx]) {
                node.active = true;
                let iconFrame = node.getChildByName('iconBg');
                let icon = cc.find('mask/icon', node);
                let lv = node.getChildByName('lv').getComponent(cc.Label);
                GlobalUtil.setSpriteIcon(this.node, iconFrame, GlobalUtil.getHeadFrameById(friendList[idx].roleInfo.headFrame));
                GlobalUtil.setSpriteIcon(this.node, icon, GlobalUtil.getHeadIconById(friendList[idx].roleInfo.head));
                lv.string = '.' + friendList[idx].roleInfo.level;
            }
            else {
                node.active = false;
            }
        });
    }

    _setTrack(data: CityData) {
        data.trackNode.active = data.isTrack;;
        if (data.isTrack) {
            data.trackNode.runAction(cc.repeatForever(
                cc.sequence(
                    cc.moveBy(1, 0, -20),
                    cc.moveBy(1, 0, 20)
                )
            ))
        }
        else {
            data.trackNode.stopAllActions();
        }
    }

    /**
     * 获取城市数据
     * @param id 
     */
    getCityDataById(id: number) {
        if (!this.cityDatas) return null;
        for (let i = 0; i < this.cityDatas.length; i++) {
            if (this.cityDatas[i].cityId == id) {
                return this.cityDatas[i];
            }
        }
    }

    /**
     * 移动选中关卡到视图中心,坐标计算统一至scrollView, 移动content
     */
    moveToCenter(cityData: CityData, duration: number = .5) {
        if (this._tasks) {
            this._tasks.push(() => this._moveToCenterExec(cityData, duration));
            return;
        }
        this._moveToCenterExec(cityData, duration);
    }
    private _moveToCenterExec(cityData: CityData, duration: number = .5) {
        // console.log(`moveToCenter: ${cityData.cityName}`);
        if (!cityData) return;
        if (!this.contentOrginPos) {
            gdk.Timer.callLater(this, () => {
                this.contentOrginPos = this.content.getPosition();
                this.moveToCenter(cityData, duration);
            });
            return;
        }
        this._createCityNode(cityData);
        this.focusCityData = cityData;
        let cityNode = this.focusCityData.cityNode;
        let cityPosInScrollView = new cc.Vec2();
        let contentPos = this.content.position;
        let tempPos = this.content.convertToWorldSpaceAR(cityNode.position);
        cityPosInScrollView = this.scrollView.node.convertToNodeSpaceAR(tempPos) as cc.Vec2;
        let targetX = contentPos.x - cityPosInScrollView.x;
        if (targetX > this.contentOrginPos.x) {
            targetX = this.contentOrginPos.x; //左边界
        }
        else if (targetX + this.content.width < this.scrollView.node.width / 2) {
            targetX = this.scrollView.node.width / 2 - this.content.width; //右边界
        }

        let targetY = contentPos.y - cityPosInScrollView.y;
        if (targetY < this.contentOrginPos.y) {
            targetY = this.contentOrginPos.y; //上边界
        }
        else if (targetY - this.content.height > - this.scrollView.node.height / 2) {
            targetY = this.content.height - this.scrollView.node.height / 2;  // 下边界
        }
        targetX = Math.floor(targetX);
        targetY = Math.floor(targetY);

        let action = cc.sequence(
            cc.moveTo(duration, targetX, targetY),
            cc.delayTime(0.15),
            cc.callFunc(() => {
                if (!this.isOpenNewChapter) {
                    this.isMove = false;
                }
                this._addEventListener();
                let curCfg = GuideUtil.getCurGuide();
                if (curCfg) {
                    this._setTrack(cityData);
                    GuideUtil.activeGuide('trackAni#end');
                }
            }, this)
        )
        this.isMove = true;
        this.content.runAction(action);
    }

    /**
     * 解锁最新章节
     */
    unLockNewChapter(id: number) {
        if (this._tasks) {
            this._tasks.push(() => this._unLockNewChapterExec(id));
            return;
        }
        this._unLockNewChapterExec(id);
    }
    private _unLockNewChapterExec(id: number) {
        this.cityParent.children.forEach(child => {
            let name = child.name;
            let cityId = name.slice(4);
            if (parseInt(cityId) == id) GuideUtil.bindGuideNode(id, child);
        });
        this._showPath();
    }

    /**
     * 检测是否开启新章节(只显示一次,记录本地Local， key:'openNewChapter' value:chapter)
     */
    _checkNewChapter() {
        if (!this.model) return;
        let stageId = this.model.latelyStageId;
        if (CopyUtil.isNewChapter(stageId)) {
            this.isOpenNewChapter = true;
            this.newChapter = CopyUtil.getChapterId(stageId);
        }
        else {
            this.isOpenNewChapter = false;
            this.newChapter = null;
        }
    }

    _showPath() {
        let cid = CopyUtil.getChapterId(this.model.latelyStageId);
        let cids: number[] = [];
        while (cid > 0) {
            cids.push(cid);
            cid -= 1;
        }
        if (cids.length <= 1) return;
        this.isMove = true;
        cids.sort((a, b) => { return a - b; });
        let newChapter: number;
        let preCityData: CityData;
        if (this.isOpenNewChapter) {
            newChapter = cids.pop();
            preCityData = this._getCityDataBy(cids[cids.length - 1] - 1);
            GlobalUtil.setSpriteIcon(this.node, preCityData.iconSprite, `view/map/texture/worldmap/texture/dt_jianzhu_select`);
        }
        let pathPointArr: cc.Vec2[] = [];
        cids.forEach((cid) => {
            let cityData = this._getCityDataBy(cid - 1);
            if (cityData) {
                let pos = cityData.cityNode.getPosition();
                pathPointArr.push(pos);
            }
        });

        let normalVec = new cc.Vec2(1, 0);
        this.pathNode.removeAllChildren(false);
        for (let i = 0; i < pathPointArr.length - 1; i++) {
            let line = cc.instantiate(this.pathLinePrefab);
            let vec = pathPointArr[i + 1].sub(pathPointArr[i]);
            line.parent = this.pathNode;
            // line.angle = -normalVec.signAngle(vec);
            line.angle = normalVec.signAngle(vec) * 180 / Math.PI;
            line.width = vec.mag();
            line.setPosition(pathPointArr[i].x, pathPointArr[i].y);
        }

        if (this.isOpenNewChapter) {
            let newCityData = this._getCityDataBy(newChapter - 1);
            if (newCityData) {
                let newCityNode = newCityData.cityNode;
                GlobalUtil.setSpriteIcon(this.node, newCityData.iconSprite, `view/map/texture/worldmap/texture/dt_jianzhu_select`);
                newCityData.lockNode.active = false;
                this.moveToCenter(this._getCityDataBy(CopyUtil.getChapterId(this.model.latelyStageId) - 2), 0); //视角先锁定至前一章
                gdk.Timer.once(500, this, () => { //同步路线迁移 和 最终视角的锁定的动画 
                    this.isMove = true;
                    let preCity = preCityData.iconSprite.node;
                    preCity.stopAllActions();
                    preCity.setAnchorPoint(.5, 0);
                    preCity.y -= preCity.height / 2;
                    preCity.setScale(1);
                    preCity.runAction(cc.sequence(
                        cc.scaleTo(.1, .7, .7),
                        cc.callFunc(() => {
                            let path = `view/map/texture/worldmap/texture/dt_jianzhu`;
                            GlobalUtil.setSpriteIcon(this.node, preCityData.iconSprite, path);
                            preCity.setAnchorPoint(.5, .5);
                            preCity.y += preCity.height / 2;
                        }),
                        cc.scaleTo(.25, 1.1, 1.1),
                        cc.scaleTo(.2, 1, 1),
                        cc.callFunc(() => {
                            let dt = new cc.Vec2(newCityNode.position.x - pathPointArr[pathPointArr.length - 1].x, newCityNode.position.y - pathPointArr[pathPointArr.length - 1].y);
                            let len = dt.mag();
                            let speed = 150;
                            this.delayDrawLine(pathPointArr[pathPointArr.length - 1], newCityNode.getPosition(), len / speed);
                            this.moveToCenter(this._getCityDataBy(newChapter - 1), len / speed);
                            GlobalUtil.setCookie('openNewChapter', newChapter);
                        })
                    ))
                });
            } else {
                // 已经没有新的章节了
                this.isOpenNewChapter = false;
                this.newChapter = null;
                this.isMove = false;
                this.moveToCenter(this._getCityDataBy(CopyUtil.getChapterId(this.model.latelyStageId) - 1), 0);
            }
        }
        else {
            this.moveToCenter(this._getCityDataBy(CopyUtil.getChapterId(this.model.latelyStageId) - 1), 0);
        }
    }

    delayDrawLine(startPoint: cc.Vec2, endPoint: cc.Vec2, duration: number) {
        let normalVec = new cc.Vec2(1, 0);
        let line = cc.instantiate(this.pathLinePrefab);
        line.parent = this.pathNode;
        let dt = new cc.Vec2(endPoint.x - startPoint.x, endPoint.y - startPoint.y);
        // line.angle = -normalVec.signAngle(dt);
        line.angle = normalVec.signAngle(dt) * 180 / Math.PI;
        line.setPosition(startPoint.x, startPoint.y);
        line.width = 0;
        let tween = new cc.Tween();
        tween.target(line)
            .to(duration, { width: dt.mag() })
            .call(() => {
                tween = null;
                let data = this._getCityDataBy(CopyUtil.getChapterId(this.model.latelyStageId) - 1);
                if (data) {
                    data.state = CityState.Open;
                    this._updataCity(data);
                    let unLockCity = data.iconSprite.node;
                    unLockCity.setAnchorPoint(.5, 0);
                    unLockCity.y -= unLockCity.height / 2;
                    unLockCity.setScale(1);
                    unLockCity.runAction(cc.sequence(
                        cc.scaleTo(.25, 1.1, 1.1),
                        cc.scaleTo(.2, 1, 1),
                        cc.callFunc(() => {
                            unLockCity.setAnchorPoint(.5, .5);
                            unLockCity.y += unLockCity.height / 2;
                        })
                    ));
                    data.unLockSpine.setCompleteListener(() => {
                        if (cc.isValid(this.node)) {
                            data.unLockSpine.setCompleteListener(null);
                            data.unLockSpine.node.active = false;
                            this.mask.active = true;
                            this.unlockSpine.node.active = true;
                            this.unlockSpine.setCompleteListener(() => {
                                if (cc.isValid(this.node)) {
                                    gdk.Timer.once(300, this, () => {
                                        if (!cc.isValid(this.node)) return;
                                        this.isMove = false;
                                        this.openCity(data);
                                    })
                                    this.unlockSpine.setCompleteListener(null);
                                    this.mask.active = false;
                                    this.unlockSpine.node.active = false;
                                }
                            });
                            this.unlockSpine.setAnimation(0, 'stand7', true);
                            this.isMove = true;
                        }
                    });
                    data.unLockSpine.node.active = true;
                    GlobalUtil.setSpineData(this.node, data.unLockSpine, 'spine/ui/UI_chengshiditu/UI_chengshiditu', true, 'stand', true);
                    data.nameLab.getChildByName('name').getComponent(cc.Label).string = `${data.cityId}.${data.cityName}`;
                    data.nameLab.opacity = 0;
                    data.nameLab.runAction(cc.fadeIn(0.5));
                    GlobalUtil.setAllNodeGray(data.nameLab, 0);
                    data.nameLab.getChildByName('name').getComponent(cc.Label).node.color = new cc.Color().fromHEX('#FCFFBA');
                    data.nameLab.getChildByName('name').getComponent(cc.Label).node.getComponent(cc.LabelOutline).enabled = true;
                    GuideUtil.activeGuide('unLockAni#end');
                    // this._moveToCenter(data);
                }
            })
            .start();
    }
}