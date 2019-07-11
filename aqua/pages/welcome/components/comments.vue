<template>
  <div id="main">
    <div class="articleComments" v-for="(c, id) in commentsList" :key="id">
      <div class="id"  :style="{color: themeColor}">{{id}}</div>
      <button @click="replyTo = id" :style="{color: themeColor}">回复</button>
      <div class="content" :style="{color: themeColor}" v-html="c.content"></div>
      <comment
        @sent="sent"
        :words="'@' + id + ' '"
        :themeColor="themeColor"
        :url-to-send="'../comments?target=' + id + '&article=' + currentArticle"
        v-if="id === replyTo"
      ></comment>
      <div class="subComments" v-for="(content, subId) in c.subComments" :key="subId">
        <div class="subId"  :style="{color: themeColor}">{{subId}}</div>
        <button @click="replyTo = subId" :style="{color: themeColor}">回复</button>
        <div class="subContent" :style="{color: themeColor}" v-html="content"></div>
        <comment
          @sent="sent"
          :words="'@' + subId + ' '"
          :themeColor="themeColor"
          :url-to-send="'../comments?target=' + id + '&article=' + currentArticle"
          v-if="subId === replyTo"
        ></comment>
      </div>
      <button
        @click="fetchComments(id, Object.keys(c.subComments).length)"
        v-if="c.finished === false"
        :style="{color: themeColor}"
      >加载回复</button>
    </div>
    <div class="fetchMore" v-if="!finished" @click="fetchComments(currentArticle, offset)">加载更多</div>
  </div>
</template>
<script>
import comment from "./comment.vue";
import MarkdownIt from "markdown-it";
const md = new MarkdownIt();

export default {
  data() {
    return {
      replyTo: "",
      commentsTree: {}
    };
  },
  created: function() {
    this.fetchComments(this.currentArticle, 0);
    this.$on("initComments", this.fetchComments);
  },
  watch: {
    currentArticle: function(newVal) {
      console.log(newVal);
      if (newVal) this.fetchComments(newVal, this.offset);
    }
  },
  computed: {
    finished: {
      get: function() {
        if (this.commentsTree[this.currentArticle]) {
          return this.commentsTree[this.currentArticle].finished;
        } else {
          return true;
        }
      },
      set: function(param) {
        if (this.commentsTree[this.currentArticle])
          this.commentsTree[this.currentArticle].finished = param;
      }
    },
    offset: function() {
      if (this.commentsTree[this.currentArticle]) {
        return Object.keys(this.commentsTree[this.currentArticle].comments)
          .length;
      } else {
        return 0;
      }
    },
    commentsList: function() {
      if (this.commentsTree[this.currentArticle]) {
        return this.commentsTree[this.currentArticle].comments;
      } else {
        return {};
      }
    }
  },
  methods: {
    sent: function() {
      this.replyTo = "";
      console.log("子评论发送成功");
    },
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
        .then(res =>
          res
            .json()
            .catch(err => console.error(`Parsing response JSON error: ` + err))
        )
        .then(json => {
          console.log(`FetchComments got:` + JSON.stringify(json));
          //区分文章评论和子评论
          if (target === this.currentArticle) {
            if (this.commentsTree[this.currentArticle] === undefined)
              this.$set(this.commentsTree, this.currentArticle, {
                finished: true,
                comments: {}
              });
            //this.finished 指代文章评论是否加载完, 是一个计算属性
            this.finished = json.finished;
            for (const id in json.comments) {
              if (json.comments.hasOwnProperty(id)) {
                const c = json.comments[id];
                //this.commentsList 也是一个计算属性
                this.$set(this.commentsList, id, {
                  content: md.render(c),
                  subComments: {}
                });
              }
            }
            Object.keys(this.commentsList).forEach(id => {
              this.fetchComments(id, 0);
            });
          } else {
            this.$set(this.commentsList[target], "finished", json.finished);
            for (const id in json.comments) {
              if (json.comments.hasOwnProperty(id)) {
                const content = md.render(json.comments[id]);
                this.$set(this.commentsList[target].subComments, id, content);
              }
            }
          }
        })
        .catch(err => {
          console.error(`FetcheComments error: ` + err);
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
.articleComments {
 border: 2px dashed black;
}

.subComments {
 border: 2px dashed rgb(245, 111, 34);
 width: 90%;
 position: relative;
 left: calc(10% - 2px);
}
</style>