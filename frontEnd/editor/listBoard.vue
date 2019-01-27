<template>
  <div class="board">
    <div class="item" @click="$emit('load-article',item.title)" v-for="item in items" :key="item.title">
      <p>{{item.title}}</p>
      <p>{{item.content}}</p>
    </div>
  </div>
</template>
<script>
import eBus from "./eBus.js"
export default {
  name: 'listBoard',
  data() {
    return {
      items: [{title: '001'}, {title: '002'}, {title: '003'}]
    }
  },
  created() {
    eBus.$on('sychronizeDB', this.sychronizeDB)
  },
  methods: {
    sychronizeDB(getAllArticles) {
      getAllArticles(this)
    }
  },
}
</script>
<style scoped>
.board {
  width: 350px;
  height: 500px;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
}
.item {
  width: 100%;
  height: 80px;
}
</style>
