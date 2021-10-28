 var EventTrigger = require("../../core/gdk_EventTrigger");
 var EaseType = require("../../const/gdk_EaseType");
 /**
  * 补间动画基类
  * @Author: sthoo.huang 
  * @Date: 2019-02-14 18:07:15
  * @Last Modified by: sthoo.huang
  * @Last Modified time: 2019-11-12 10:56:28
  */
 var BaseTween = cc.Class({
     extends: cc.Component,
     editor: {
         disallowMultiple: false
     },
     properties: {
         _fromIsCurrent: {
             default: true,
             visible: true,
             serializable: true,
         },
         fromIsCurrent: {
             visible: false,
             get() {
                 return this._fromIsCurrent;
             },
             set(value) {
                 if (this._fromIsCurrent == value) {
                     return;
                 }
                 this._fromIsCurrent = value;
                 this.updateTween()
             }
         },
         _isBy: {
             default: true,
             visible: true,
             serializable: true,
         },
         isBy: {
             visible: false,
             get() {
                 return this._isBy;
             },
             set(value) {
                 if (this._isBy == value) {
                     return;
                 }
                 this._isBy = value;
                 this.updateTween()
             }
         },
         _from: {
             default: 0,
             visible: true,
             serializable: true,
         },
         from: {
             visible: false,
             get() {
                 return this._from;
             },
             set(value) {
                 if (this._from == value) {
                     return;
                 }
                 this._from = value;
                 this.updateTween()
             }
         },
         _to: {
             default: 0,
             visible: true,
             serializable: true,
         },
         to: {
             visible: false,
             get() {
                 return this._to;
             },
             set(value) {
                 if (this._to == value) {
                     return;
                 }
                 this._to = value;
                 this.updateTween()
             }
         },
         _time: {
             default: 1,
             visible: true,
             serializable: true,
         },
         time: {
             visible: false,
             get() {
                 return this._time;
             },
             set(value) {
                 if (this._time == value) {
                     return;
                 }
                 this._time = value;
                 this.updateTween()
             }
         },
         _loop: {
             default: 0,
             visible: true,
             serializable: true,
         },
         loop: {
             visible: false,
             get() {
                 return this._loop;
             },
             set(value) {
                 if (this._loop == value) {
                     return;
                 }
                 this._loop = value;
                 this.updateTween()
             }
         },
         _ease: {
             default: EaseType.easeLinear,
             type: EaseType,
             visible: true,
             serializable: true,
         },
         ease: {
             visible: false,
             get() {
                 return this._ease;
             },
             set(value) {
                 if (this._ease == value) {
                     return;
                 }
                 this._ease = value;
                 this.updateTween()
             }
         },

         onComplete: {
             default: null,
             serializable: false,
             visible: false,
         },

     },
     ctor () {
         this.onComplete = EventTrigger.get();
     },
     onDestroy () {
         this.onComplete.release();
         this.onComplete = null;
     },
     unuse () {
         this.onComplete.offAll();
     },
     onEnable () {
         this.updateTween();
     },
     updateTween () {

     }
 });


 module.exports = BaseTween;