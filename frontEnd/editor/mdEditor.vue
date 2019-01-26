<template>
  <div>
    <div class="sidebar">
      <button class="save" @click="save">保存文章</button>
      <button class="load" @click="load">恢复文章</button>
      <button class="clrAll" @click="clrAll">全部清除</button>
      <button class="clrGallery" @click="clrGallery">清除画廊</button>
      <button class="clrArticle" @click="clrArticle">清除文章</button>
      <upload-btn :article-title="title" :content="input" @clr-title="title = ''"></upload-btn>
    </div>
    <div class="toolbar">
      <input type="text" v-model="title" placeholder="输入标题">
      <my-gallery
        @click.native.right.prevent
        @add-img2article="addImg2article"
        @del-img="delImgInArticle"
        @del-all-imgs="delAllImgsInArticle"
        :content="input"
      ></my-gallery>
    </div>
    <div class="progress" :style="{ left: progress + '%' }"></div>
    <div class="writing">
      <textarea :value="input" @input="update"></textarea>
      <div id="preview" v-html="compiledMarkdown"></div>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import MarkdownIt from "markdown-it";
const md = new MarkdownIt();
import myGallery from "./gallery.vue";
import uploadBtn from "./uploadBtn.vue";
import eBus from "./eBus.js";

let request = window.indexedDB.open("articles", 1);
let db;
request.onupgradeneeded = e => {
  db = e.target.result;
  let objStore = db.createObjectStore("articleCollection", {
    keyPath: "title"
  });
};
request.onerror = e => {
  alert(`indexedDB启动失败, 错误: ${e}`);
};
request.onsuccess = e => {
  db = e.target.result;
  console.log("db打开成功");
};
function addArticle(article) {
  let result = db
    .transaction(["articleCollection"], "readwrite")
    .objectStore("articleCollection")
    .add({
      title: article.title,
      content: article.content,
      picsList: article.picsList
    });

  result.onsuccess = function(e) {
    console.log(`文章保存成功!\n${e}`);
  };
  result.onerror = function(e) {
    console.error(`文章保存失败...\n${JSON.stringify(e)}`);
  };
}

function getArticle(articleTitle, _this, handle) {
  let request = db
    .transaction(["articleCollection"])
    .objectStore("articleCollection")
    .get(articleTitle);

  request.onsuccess = function(e) {
    console.log("尝试取出文章成功!");
    if (request.result) {
      console.log(request.result)
      console.log(`标题: \n${request.result.title}
      内容: \n${request.result.content}`);
      //此处已获得文章
      handle(_this, request.result);
    } else {
      console.warn(`没有标题为:${articleTitle}的文章`);
    }
  };
  request.onerror = function(e) {
    console.error("尝试取出文章失败...");
  };
}

function loadArticle(_this, article) {
  //gallery还原
  let newPicsList = {};
  let objectURLMap = {}
  console.log(article);
  
  for (const key in article.picsList) {
    if (article.picsList.hasOwnProperty(key)) {
      const element = article.picsList[key];
      let newObjectURL
      newObjectURL = URL.createObjectURL(element.blob);
      newPicsList[newObjectURL] = {
        name: element.name,
        blob: element.blob
      };
      //新旧objeURL映射表建立
      objectURLMap[key] = newObjectURL
    }
  }
  eBus.$emit("rebuildPicsList", newPicsList);
  //文章还原
  _this.title = article.title;
  let content = article.content;
  let reg = /!\[Alt .*\]\((blob:.*[a-f0-9]{8}(-[a-f0-9]{4}){3}-[a-f0-9]{12})\)/g;
  let result;
  while ((result = reg.exec(content))) {
    // let oldImg = result[0];
    let oldImgSrc = result[1];
    content = content.replace(
        new RegExp("!\\[Alt .*\\]\\(" + oldImgSrc + "\\)", "g"),
        `![Alt ${newPicsList[objectURLMap[oldImgSrc]].name}](${objectURLMap[oldImgSrc]})`
    )
  }
  _this.input = content
}

export default {
  name: "mdEditor",
  data() {
    return {
      title: "",
      input: "# hello",
      progress: -100,
      article: {}
    };
  },
  computed: {
    compiledMarkdown: function() {
      return md.render(this.input);
    }
  },
  methods: {
    update: _.debounce(function(e) {
      this.input = e.target.value;
    }, 300),
    addImg2article(img) {
      this.input += `\n\n![Alt ${img.alt}](${img.src})\n\n`;
    },
    delImgInArticle(imgSrc) {
      window.URL.revokeObjectURL(imgSrc);
      let picHash = imgSrc.match(/[a-z0-9]{8}(-[a-z0-9]{4}){3}-[a-z0-9]{12}/);
      console.log(picHash[0]);
      this.input = this.input.replace(
        new RegExp("!\\[Alt .*\\]\\(blob:.*" + picHash[0] + "\\)", "g"),
        ""
      );
    },
    delAllImgsInArticle(imgSrcs) {
      imgSrcs.forEach(imgSrc => {
        this.delImgInArticle(imgSrc);
      });
    },
    save() {
      let createArticle = picsList => {
        this.article.title = this.title;
        this.article.content = this.input;
        this.article.picsList = picsList;

        addArticle(this.article);
      };
      eBus.$emit("needPicsList", createArticle);
    },
    load() {
      let title = "test";
      getArticle(title, this, loadArticle);
    },
    clrAll() {
      this.title = "";
      this.input = "";
      eBus.$emit("clrGallery");
    },
    clrGallery() {
      eBus.$emit("clrGallery");
    },
    clrArticle() {
      this.input = "";
    }
  },
  components: {
    myGallery,
    uploadBtn
  }
};
</script>
<style scoped>
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
  min-height: calc(100vh - 115px);
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

code {
  color: #f66;
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
  color: rgb(0, 0, 0);
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

.progress {
  background-color: rgb(173, 219, 104);
  position: relative;
  width: 100%;
  height: 10px;
}

#preview >>> img {
  max-width: 400px;
  max-height: 300px;
}

.sidebar {
  display: flex;
  position: fixed;
  left: calc(5 * -80px);
  bottom: 0;
  transition: left 0.3s ease-in-out 1s;
}

.sidebar:hover {
  left: 0;
}
</style>
