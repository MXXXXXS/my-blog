<template>
  <div>
    <div v-for="comment in comments" :key="comment.id">
      <div>{{comment.content}}</div>
      <button @click="currentCommentID = comment.id">评论</button>
      <button @click="loadMore" v-if="showMore">加载更多</button>
      <comment
        :themeColor="themeColor"
        :url-to-send="'../comments?target=' + currentCommentID"
        v-if="comment.id === currentCommentID"
      ></comment>
      <div>
        <comments :themeColor="themeColor" :target="id" v-if="comment.hasSubComments"></comments>
      </div>
    </div>
  </div>
</template>
<script>
//评论返回格式
// {
//   finished: Boolean,
//   comments:
//   [{
//     id: String,
//     content: String,
//     hasSubComments: Boolean
//    },
//    ...
//   ]
// }
import comment from "./comment.vue";

export default {
  data() {
    return {
      currentCommentID: "",
      showMore: false,
      id: "",
      comments: ""
    };
  },
  mounted: function() {
    // this.loadMore();
  },
  methods: {
    loadMore: function() {
      fetch("../comments?target=" + this.target)
        .then(res => {
          // this.articles = res.json()
          const json = res.json().catch(err => console.error(err));
          return json;
        })
        .then(json => {
          console.log(json)
          this.showMore = !json.finished;
          this.id = json.comment.id;
          this.comments = json.comments.content;
        })
        .catch(err => {
          console.error(err)
        })
    }
  },
  name: "comments",
  props: ["target", "themeColor"],
  components: {
    comment
  }
};
</script>
<style scoped>
</style>
