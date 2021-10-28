 "use strict";
 (function e () {
     const iclib = window.iclib = window.iclib || {};
     iclib.version = '1.0.1';
     iclib.datatime = '2021-03-24 11:33:09';
     iclib.hotupdateEnabled = !cc.sys.isNative;
     iclib.addProp = (p, v) => {
         iclib[p] = v;
     };
 })();