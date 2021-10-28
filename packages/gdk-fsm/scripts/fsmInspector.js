/**
 * 妈的， 没文档，盲试了半天终于可以序列化它。
 * @Author: sthoo.huang 
 * @Date: 2019-02-14 18:07:15
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2019-03-25 16:21:09
 */

Vue.component('fsmComponent-inspector', {
    template: `
      <ui-prop v-prop="target._persist" ></ui-prop>
      <ui-prop v-prop="target.syncActive" ></ui-prop>
      <ui-input v-value="target.fsm.value.fsmName.value" placeholder="名称" @change="fsmNameChange"></ui-input>
      <ui-text-area v-value="target.fsm.value.fsmDescription.value"  resize-v placeholder="描述"  @change="fsmDesChange"></ui-text-area>
      <ui-button class="tiny blue" @click="onClick">编辑</ui-button>
    `,

    props: {
        target: {
            twoWay: true,
            type: Object,
        },
    },

    methods: {
        onClick (event) {
            Editor.Panel.open('gdk-fsm', this.target.uuid.value);
        },
        fsmNameChange (event) {
            Editor.Ipc.sendToPanel("gdk-fsm", "fsm-name-changed", this.target.uuid.value, this.target.fsm.value.fsmName.value);
            Editor.Ipc.sendToMain("gdk-fsm:fsm-name-changed");
        },
        fsmDesChange (event) {
            Editor.Ipc.sendToPanel("gdk-fsm", "fsm-des-changed", this.target.uuid.value, this.target.fsm.value.fsmDescription.value);
            Editor.Ipc.sendToMain("gdk-fsm:fsm-des-changed");
        },
    }
});