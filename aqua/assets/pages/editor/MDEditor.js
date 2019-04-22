import mdEditor from './components/mdEditor.vue'
import Vue from 'vue'
import store from './store/store.js'
//事件监听: articleSentSuccessed 事件发送: articleSentSuccessed(全部清除) refresh-article(更新文章)
new Vue({
  render: h => h(mdEditor),
  store
}).$mount(`#editor`)