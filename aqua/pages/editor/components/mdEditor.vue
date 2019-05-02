<template>
  <div>
    <div class="sidebar">
      <upload-btn></upload-btn>
      <button class="load" @mouseover="getAll">恢复文章</button>
      <list-board @click.native.right.prevent></list-board>
      <button class="save" @click="save">保存文章</button>
    </div>
    <div class="toolbar">
      <input type="text" :value="title" @change="changeTitle" placeholder="输入标题">
      <my-gallery @click.native.right.prevent></my-gallery>
    </div>
    <div class="writing">
      <textarea @input="update"></textarea>
      <div id="preview" v-html="compiledMarkdown"></div>
    </div>
  </div>
</template>

<script>
import MarkdownIt from "markdown-it";
const md = new MarkdownIt();
import myGallery from "./gallery.vue";
import uploadBtn from "./uploadBtn.vue";
import listBoard from "./listBoard.vue";

class Debounce {
  constructor() {
    this.time = new Date().getTime();
  }
  debounce(fn, ms) {
    window.clearTimeout(this.tId);
    this.tId = window.setTimeout(() => {
      fn();
      window.clearTimeout();
    }, ms);
  }
}

let debounce = new Debounce();

export default {
  name: "mdEditor",
  data() {
    return {
      progress: -100
    };
  },
  computed: {
    compiledMarkdown() {
      return md.render(this.$store.state.article.content);
    },
    content() {
      return this.$store.state.article.content;
    },
    title() {
      return this.$store.state.article.title;
    }
  },
  methods: {
    update(e) {
      debounce.debounce(() => {
        this.$store.commit("changeContent", e.target.value);
      }, 100);
    },
    changeTitle(e) {
      this.$store.commit("changeTitle", e.target.value);
    },
    save() {
      this.$store.commit("save");
    },
    getAll() {
      this.$store.dispatch("getAll");
    },
    clrAll() {
      this.$store.commit("clrGallery");
      this.$store.commit("clrArticle");
    },
    clrGallery() {
      this.$store.commit("clrGallery");
    },
    clrArticle() {
      this.$store.commit("clrArticle");
    }
  },
  components: {
    myGallery,
    uploadBtn,
    listBoard
  }
};
</script>
<style scoped>
textarea, input {
  font: menu;
}

#editor {
  margin: 0;
  height: 100%;
  font-family: "Helvetica Neue", Arial, sans-serif;
  color: #333;
}

.writing {
  display: flex;
}

textarea,
#preview {
  width: 50%;
  min-height: calc(100vh - 105px);
  padding: 10px;
  /* overflow-y: scroll; */
}

textarea {
  border: none;
  resize: none;
  outline: none;
  background-color: #f6f6f6;
  font-size: 14px;
  font-family: "Monaco", courier, monospace;
}

#preview {
  overflow: auto;
}

.toolbar {
  display: flex;
  width: 100%;
}

input,
input::placeholder {
  font-size: 2.5rem;
  text-align: center;
}

input {
  border: none;
  padding: 0;
  outline: none;
  height: 85px;
  width: 50%;
  min-width: 50%;
}

button {
  outline: none;
  color: rgba(0, 0, 0, 0);
  background-color: rgba(204, 204, 204, 0.253);
  width: 80px;
  padding: 5px;
  height: 80px;
  border: none;
  transition: background-color 0.3s ease-in-out;
}

button:hover {
  background-color: rgb(173, 219, 104);
}

.active {
  box-shadow: inset 0 0 10px 4px rgb(173, 219, 104);
}

#preview >>> img {
  max-width: 400px;
  max-height: 300px;
}

.sidebar {
  display: flex;
  position: fixed;
  left: calc(2 * -80px);
  bottom: 0;
  transition: left 0.3s ease-in-out 1s;
}

.sidebar:hover {
  left: 0;
}
.sidebar:hover >>> button {
  transition: color 0.3s ease-in-out;
  color: rgba(0, 0, 0, 1);
}

.board {
  z-index: -1;
  position: fixed;
  left: 0;
  bottom: -500px;
  transition: bottom 0.3s ease-in-out 0.3s;
  background: rgba(151, 151, 151, 0.842);
}
.board >>> .item:nth-child(2n) {
  background-color: rgb(218, 218, 218);
}
.board >>> .item:nth-child(2n + 1) {
  background-color: rgb(255, 255, 255);
}
.load:hover + .board {
  bottom: 90px;
}
.board:hover {
  bottom: 90px;
}
</style>
