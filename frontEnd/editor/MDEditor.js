import mdEditor from './mdEditor.vue'
import Vue from 'vue'
//事件监听: articleSentSuccessed 事件发送: articleSentSuccessed(全部清除) refresh-article(更新文章)
  const eBus = new Vue()
  new Vue({
    render: h => h(mdEditor)
  }).$mount('#editor')