<template>
  <div class="board">
    <div class="item" v-for="item in items" :key="item.title">
      <div class="details" @click="$emit('load-article',item.title)">
        <p style="height: 40px;margin: 0;">{{item.title}}</p>
        <p style="font-size: 12px;margin: 0; color: grey;">{{item.content}}</p>
      </div>
      <div
        @click="$emit('del-article',item.title)"
        style="width: 40px;
        height: 80px;
        color: rgb(240, 240, 240);
        background-color: rgb(250, 135, 135);
        font-size: 40px;
        text-align:center;
        line-height:80px;
        "
      >×</div>
    </div>
  </div>
</template>
<script>
import eBus from "./eBus.js";
export default {
  name: "listBoard",
  data() {
    return {
      items: [{ title: "001" }, { title: "002" }, { title: "003" }]
    };
  },
  created() {
    eBus.$on("sychronizeDB", this.sychronizeDB);
  },
  methods: {
    sychronizeDB(getAllArticles) {
      getAllArticles(this);
    }
  }
};
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
  display: flex;
  width: 100%;
  height: 80px;
}
.details {
  width: calc(100% - 40px);
}
</style>
