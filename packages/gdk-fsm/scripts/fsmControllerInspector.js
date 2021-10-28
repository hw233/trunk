/**
 * 
 * @Author: sthoo.huang 
 * @Date: 2019-02-14 18:07:15
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2019-02-15 14:14:40
 */

Vue.component('fsmControllerInspector-inspector', {
  template: `
      <ui-prop v-prop="target.enableToTrigger"></ui-prop>
      <ui-prop v-prop="target.control"></ui-prop>
      <ui-prop v-prop="target.fsmName"  v-show="isFsmNameShow(target.control.value)" placeholder="状态机名字"></ui-prop>
      <ui-prop v-prop="target.args"  v-show="isEventNameShow(target.control.value)"   
      :name="eventName(target.control.value)"
      ></ui-prop>
      <ui-prop v-prop="target.active"  v-show="isActiveShow(target.control.value)" ></ui-prop>
    `,

  props: {
    target: {
      twoWay: true,
      type: Object,
    },
  },


  methods: {
    onClick(event) {
      Editor.Panel.open('gdk-fsm', this.target.uuid.value);
    },
    isFsmNameShow(type) {
      return type != 1;
    },
    isEventNameShow(type) {
      return type == 0 || type == 1 || type == 5;
    },
    isActiveShow(type) {
      return type == 6;
    },
    eventName(type) {
      if (type == 5) {
        return "State Name"
      } else {
        return "Event Name"
      }
    },

  }

});