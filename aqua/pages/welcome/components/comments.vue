<template>
  <div>
    <div v-for="c in commentsList" :key="c.id">
      <div class="id">{{c.id}}</div>
      <div class="content">{{c.content}}</div>
      <button @click="replyTo = c.id">回复</button>
      <button @click="fetchComments(c.id, c.subComments.length)" v-if="c.hasSubComments">加载回复</button>
      <comment
        @sent="fetchComments(c.id, c.subComments.length)"
        :words="'@' + c.id"
        :themeColor="themeColor"
        :url-to-send="'../comments?target=' + c.id + '&article=' + currentArticle"
        v-if="c.id === replyTo"
      ></comment>
      <div>
        <div class="subComments" v-if="c.hasSubComments"></div>
      </div>
    </div>
    <div class="fetchMore" v-if="!finished" @click="fetchComments(currentArticle, offset)">加载更多</div>
  </div>
</template>
<script>
import comment from "./comment.vue";

export default {
  data() {
    return {
      replyTo: "",
      finished: true,
      showMore: false,
      commentsList: []
    };
  },
  created: function() {
    this.$on('loadMore', this.fetchComments)
  },
  watch: {
    currentArticle: function(newVal) {
      if (newVal)
      this.fetchComments(newVal, this.offset)
    }
  },
  computed: {
    offset: function() {
      return this.commentsList.length
    }
  },
  methods: {
    fetchComments: function(target, offset) {
      fetch(
        `../comments?target=${target}&article=${
          this.currentArticle
        }&offset=${offset}`,
        {
          method: "GET",
          headers: new Headers({
            Accept: "application/json"
          })
        }
      )
        .then(res => {
          // this.articles = res.json()
          const json = res.json().catch(err => console.error(err));
          return json;
        })
        .then(json => {
          console.log(json);
          this.showMore = !json.finished;
          if (target === this.currentArticle) {
            // json.comments.forEach(c => {
            //   this.$set(this.commentsList)
            // });
            this.finished = json.finished;
            this.commentsList.push(...json.comments);
          } else {
            this.commentsList[target].push(...json.comments);
          }
        })
        .catch(err => {
          console.error(err);
        });
    }
  },
  name: "comments",
  props: ["currentArticle", "target", "themeColor"],
  components: {
    comment
  }
};
</script>
<style scoped>
</style>
