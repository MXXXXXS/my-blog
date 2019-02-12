<template>
  <div class="board">
    <div
      class="item"
      v-for="(content, title) in items"
      :key="title"
      @dblclick="del(title)"
      @click.right="get(title)"
    >
      <p style="height: 40px;margin: 0;">{{title}}</p>
      <p style="font-size: 12px;margin: 0; color: grey;">{{content}}</p>
    </div>
  </div>
</template>
<script>
export default {
  name: "listBoard",
  computed: {
    items() {
      return this.$store.state.items;
    }
  },
  methods: {
    del(title) {
      this.$store.dispatch("delete", title);
    },
    get(title) {
      this.$store.dispatch('get', title)
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
