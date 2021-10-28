/**
 * 修复spine中使用缓存模式无事件的问题
 * @Author: sthoo.huang 
 * @Date: 2019-02-14 18:07:15
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-07-22 11:41:39
 */
if (CC_EDITOR) {
    // 针对编辑器不做任何处理
} else {

    var Skeleton = sp.Skeleton;
    var proto = Skeleton.prototype;

    if (CC_JSB) {
        // 针对原生的修改
        proto._$Skeleton0_setEventListener = proto.setEventListener;
        proto.setEventListener = function (listener) {
            if (this.isAnimationCached()) {
                this.setAnimationCacheMode(0);
            }
            this._$Skeleton0_setEventListener(listener);
        };
        proto._$Skeleton0_setAnimation = proto.setAnimation;
        proto.setAnimation = function (trackIndex, name, loop) {
            let skeletonData = this.skeletonData;
            if (skeletonData && !cc.isValid(skeletonData)) {
                this.skeletonData = null;
                return;
            }
            if (!this.isAnimationCached()) {
                let animation = this.animation;
                // if (name && animation) {
                //     let state = this.getState();
                //     let data = state ? state.data : null;
                //     if (data) {
                //         let from = this.findAnimation(animation);
                //         let to = from ? this.findAnimation(name) : null;
                //         if (!from || !to || data.getMix(from, to) == 0) {
                //             this.clearTrack(trackIndex);
                //         }
                //     }
                // } else {
                if (!name || !animation) {
                    this.clearTrack(trackIndex);
                }
            }
            return this._$Skeleton0_setAnimation(trackIndex, name, loop);
        };
    } else {
        // 针对h5的修改
        proto._$Skeleton0_setAnimation = proto.setAnimation;
        proto.setAnimation = function (trackIndex, name, loop) {
            this._$N_cacheEvents = null;
            let skeletonData = this.skeletonData;
            if (skeletonData && !cc.isValid(skeletonData)) {
                this.skeletonData = null;
                return;
            }
            return this._$Skeleton0_setAnimation(trackIndex, name, loop);
        };

        proto._$Skeleton0_updateCache = proto._updateCache;
        proto._updateCache = function (dt) {

            // 当前动作名无效或其他异常
            if (this._frameCache == null) return;
            if (dt <= 0) return;

            // 保存新的事件数组
            let accTime = this._accTime;
            if (accTime == 0) {
                let name = this._animationName;
                let sd = this.skeletonData;
                this._$N_cacheEvents = null;
                if (sd &&
                    sd._skeletonJson &&
                    sd._skeletonJson.animations &&
                    sd._skeletonJson.animations[name]) {
                    // 当前动作存在事件
                    let events = sd._skeletonJson.animations[name].events;
                    if (events && events.length) {
                        this._$N_cacheEvents = events.slice();
                    }
                }
            }

            // 查找并执行事件
            if (this._$N_cacheEvents) {
                accTime += dt;
                while (this._$N_cacheEvents && this._$N_cacheEvents.length) {
                    // 事件监听并且事件列表中有事件
                    let event = this._$N_cacheEvents[0];
                    if (accTime < event.time) {
                        break;
                    }
                    this._$N_cacheEvents.shift();
                    if (this._listener && this._listener.event) {
                        this._listener.event(null, {
                            data: event
                        });
                    }
                }
                if (this._$N_cacheEvents && this._$N_cacheEvents.length == 0) {
                    this._$N_cacheEvents = null;
                }
            }

            // 执行原方法
            this._$Skeleton0_updateCache(dt);
        };

        proto._$Skeleton0_validateRender = proto._validateRender;
        proto._validateRender = function () {
            let skeletonData = this.skeletonData;
            if (skeletonData && !cc.isValid(skeletonData)) {
                this.skeletonData = null;
                return;
            }
            this._$Skeleton0_validateRender();
        };
    }

    proto._emitCacheCompleteEvent = function () {
        if (!this._listener) return;
        this._endEntry.animation.name = this._animationName;
        this._listener && this._listener.complete && this._listener.complete(this._endEntry);
        this._listener && this._listener.end && this._listener.end(this._endEntry);
    };
}