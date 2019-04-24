import welcome from './components/welcome.vue'
import Vue from 'vue'
new Vue({
  render: h => h(welcome)
}).$mount(`#welcome`)