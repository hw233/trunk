/**
 * 妈的， 没文档，盲试了半天终于可以序列化它。
 * @Author: sthoo.huang 
 * @Date: 2019-02-14 18:07:15
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2019-02-15 14:42:09
 */

Vue.component('SceneAdapaterComponent-inspector', {
  template: `<ui-hint>根据屏幕长宽比自动设置Canvas的Fit Height或Fit Width,务必调整组件顺序，一定要放在Canvas之前，否则会有问题 </ui-hint>`,

  props: {
    target: {
      twoWay: true,
      type: Object,
    },
  },

  methods: {

  }
});