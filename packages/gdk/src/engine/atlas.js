/** 
 * Atlas图集类优化
 * @Author: sthoo.huang  
 * @Date: 2020-05-23 16:12:13 
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-12-10 19:54:28
 */

/**
 * MaxRectanglesBinPack
 * @param {Number} width The container width
 * @param {Number} height The container height
 */
function MaxRectsBinPack (width, height) {
    this.binWidth = width;
    this.binHeight = height;
    this.usedRectangles = [];
    this.freeRectangles = [cc.rect(0, 0, width, height)];
};
var proto = MaxRectsBinPack.prototype;

/**
 * insert a rect
 * @param  {Number} width  The width of the rect
 * @param  {Number} height The height of the rect
 * @param  {Number} method The pack rule, allow value is BestShortSideFit, BestLongSideFit, BestAreaFit, BottomLeftRule, ContactPointRule
 * @return {Rect}
 */
proto.insert = function (width, height) {
    let node = this._findNode(width, height);
    if (node) {
        let freeRectangles = this.freeRectangles;
        let numRectanglesToProcess = freeRectangles.length;
        for (let i = 0; i < numRectanglesToProcess; i++) {
            if (this._splitFreeNode(freeRectangles[i], node)) {
                freeRectangles.splice(i, 1);
                i--;
                numRectanglesToProcess--;
            }
        }
        this._pruneFreeList();
        this.usedRectangles.push(node);
    }
    return node;
};

proto._findNode = function (width, height) {
    let bestNode;
    let bestY = Number.MAX_VALUE;
    let bestX = Number.MAX_VALUE;
    let freeRectangles = this.freeRectangles;
    for (let i = 0, n = freeRectangles.length; i < n; ++i) {
        let r = freeRectangles[i];
        // Try to place the rectangle in upright (non-flipped) orientation.
        if (r.width >= width && r.height >= height) {
            let topSideY = r.y + height;
            if (topSideY < bestY || (topSideY == bestY && r.x < bestX)) {
                bestNode = r;
                bestX = r.x;
                bestY = topSideY;
            }
        }
    }
    if (bestNode) {
        return cc.rect(bestNode.x, bestNode.y, width, height);
    }
    return null;
};

proto._splitFreeNode = function (freeRect, usedNode) {
    // Test if usedNode intersect with freeRect
    if (!freeRect.intersects(usedNode)) return false;

    // Do vertical split
    if (usedNode.x < freeRect.x + freeRect.width && usedNode.x + usedNode.width > freeRect.x) {
        // New node at the top side of the used node
        if (usedNode.y > freeRect.y && usedNode.y < freeRect.y + freeRect.height) {
            let newNode = cc.rect(freeRect.x, freeRect.y, freeRect.width, usedNode.y - freeRect.y);
            this.freeRectangles.push(newNode);
        }
        // New node at the bottom side of the used node
        if (usedNode.y + usedNode.height < freeRect.y + freeRect.height) {
            let newNode = cc.rect(
                freeRect.x,
                usedNode.y + usedNode.height,
                freeRect.width,
                freeRect.y + freeRect.height - (usedNode.y + usedNode.height),
            );
            this.freeRectangles.push(newNode);
        }
    }

    // Do Horizontal split
    if (usedNode.y < freeRect.y + freeRect.height &&
        usedNode.y + usedNode.height > freeRect.y) {
        // New node at the left side of the used node.
        if (usedNode.x > freeRect.x && usedNode.x < freeRect.x + freeRect.width) {
            let newNode = cc.rect(freeRect.x, freeRect.y, usedNode.x - freeRect.x, freeRect.height);
            this.freeRectangles.push(newNode);
        }
        // New node at the right side of the used node.
        if (usedNode.x + usedNode.width < freeRect.x + freeRect.width) {
            let newNode = cc.rect(
                usedNode.x + usedNode.width,
                freeRect.y,
                freeRect.x + freeRect.width - (usedNode.x + usedNode.width),
                freeRect.height,
            );
            this.freeRectangles.push(newNode);
        }
    }
    return true;
};

proto._pruneFreeList = function () {
    let freeRectangles = this.freeRectangles;
    // Go through each pair of freeRects and remove any rects that is redundant
    let i = 0;
    let len = freeRectangles.length;
    while (i < len) {
        let j = i + 1;
        let tmpRect1 = freeRectangles[i];
        while (j < len) {
            let tmpRect2 = freeRectangles[j];
            if (tmpRect2.containsRect(tmpRect1)) {
                freeRectangles.splice(i, 1);
                i--;
                len--;
                break;
            }
            if (tmpRect1.containsRect(tmpRect2)) {
                freeRectangles.splice(j, 1);
                j--;
                len--;
            }
            j++;
        }
        i++;
    }
};

/**
 * Atlas图集类优化
 */
var dynamicAtlasManager = cc.dynamicAtlasManager;
var Atlas = dynamicAtlasManager.Atlas;
var __proto = Atlas.prototype;

/**
 * 获得spriteFrame的唯一key
 * @param {*} spriteFrame 
 */
function getKey (spriteFrame) {
    let key = null;
    if (cc.js.isString(spriteFrame)) {
        key = cc.assetManager.utils.getUuidFromURL(spriteFrame);
    } else {
        key = spriteFrame._texture._uuid;
    }
    return key;
};

// 插入纹理至图集
// __proto.$Atlas0_insertSpriteFrame = __proto.insertSpriteFrame;
__proto.insertSpriteFrame = function (spriteFrame) {
    let texture = spriteFrame._texture;
    let key = getKey(spriteFrame);
    if (key && this._infoIdx) {
        this._innerTextureInfos[texture._id] = this._infoIdx[key];
    }
    let frame = null;
    let info = this._innerTextureInfos[texture._id];
    if (!info) {
        // 查找合适的位置插入纹理
        if (!this._maxRect) {
            this._maxRect = new MaxRectsBinPack(this._width, this._height);
        }
        let rect = this._maxRect.insert(texture.width, texture.height);
        if (rect) {
            this._texture.drawTextureAt(texture, rect.x, rect.y);
            this._innerTextureInfos[texture._id] = info = {
                x: rect.x,
                y: rect.y,
                width: texture.width,
                height: texture.height,
                rect: spriteFrame._rect.clone(),
            };
            this._count++;
            this._dirty = true;
        }
    }
    if (info) {
        // 缓存对象
        if (key) {
            if (!this._infoIdx) this._infoIdx = {};
            if (!this._infoIdx[key]) {
                this._infoIdx[key] = info;
            }
        }
        this._innerSpriteFrames.push(spriteFrame);
        // 合图结果
        frame = {
            x: spriteFrame._rect.x + info.x,
            y: spriteFrame._rect.y + info.y,
            width: info.width,
            height: info.height,
            rect: info.rect,
            texture: this._texture,
        };
    }
    return frame;
};

// 从图集中移除纹理
__proto.$Atlas0_deleteInnerTexture = __proto.deleteInnerTexture;
__proto.deleteInnerTexture = function (texture) {
    if (!texture) return;
    if (!this._infoIdx) return;
    if (!this._innerTextureInfos[texture._id]) return;
    // 从列表中移除
    let frames = this._innerSpriteFrames;
    for (let i = frames.length - 1; i >= 0; i--) {
        let frame = frames[i];
        if (!frame._original) {
            // 无效的spriteFrame实例
            frames.splice(i, 1);
            this._count--;
        } else if (frame._original._texture === texture) {
            frames.splice(i, 1);
            // 重置frame
            if (cc.isValid(frame, true)) {
                frame._resetDynamicAtlasFrame(true);
            }
            this._count--;
        }
    }
    // 从字典中移除
    delete this._innerTextureInfos[texture._id];
};

// 从图集中移除SpriteFrame实例
__proto.deleteInnerSpriteFrame = function (spriteFrame) {
    if (!spriteFrame) return;
    if (!spriteFrame._original) return;
    if (!this._infoIdx) return;
    // 从列表中移除
    let texture = spriteFrame._original._texture;
    let frames = this._innerSpriteFrames;
    for (let i = frames.length - 1; i >= 0; i--) {
        let frame = frames[i];
        if (frame === spriteFrame) {
            frames.splice(i, 1);
            // 重置frame
            if (cc.isValid(frame, true)) {
                frame._resetDynamicAtlasFrame(true);
            }
            this._count--;
            break;
        }
    }
    // 已经没有引用此texture的spriteFrame则从字典中移除
    if (!frames.some(frame => frame._original._texture === texture)) {
        delete this._innerTextureInfos[texture._id];
    }
};

__proto.hasInfo = function (spriteFrame) {
    let key = getKey(spriteFrame);
    return key && this._infoIdx && !!this._infoIdx[key];
};

__proto.getInfo = function (spriteFrame) {
    let key = getKey(spriteFrame);
    if (key && this._infoIdx) {
        return this._infoIdx[key];
    }
    return null;
};

__proto.isEmpty = function () {
    return this._innerSpriteFrames.length == 0;
};

__proto.info = CC_DEV && function () {
    cc.log('size:', this._innerSpriteFrames.length);
    cc.log('frames:', this._innerSpriteFrames);
    cc.log('inner:', this._innerTextureInfos);
    cc.log('info:', this._infoIdx);
};

// 重置图集
__proto.$Atlas0_reset = __proto.reset;
__proto.reset = function () {
    let frames = this._innerSpriteFrames;
    this._count = 0;
    this._infoIdx = null;
    this._innerTextureInfos = {};
    this._innerSpriteFrames = [];
    this._maxRect = null;
    for (let i = 0, l = frames.length; i < l; i++) {
        let frame = frames[i];
        // 重置frame
        if (cc.isValid(frame, true)) {
            frame._resetDynamicAtlasFrame(true);
        }
    }
    this.$Atlas0_reset();
};