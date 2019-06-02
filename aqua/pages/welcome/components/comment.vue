<template>
  <div class="whole" :style="{border: '2px solid ' + themeColor}">
    <div class="bar">
      <div class="tools" :style="{top: offset}">
        <div v-html="icons.emo" class="addEmo tool" @click="showOption('addEmo')"></div>
        <div v-html="icons.preview" class="preview tool" @click="preview = !preview"></div>
        <div v-html="icons.send" class="send tool" @click="send"></div>
      </div>
      <div class="option" :style="{top: offset}">
        <div v-html="icons.back" class="back" @click="showTools"></div>
        <div class="emos" @wheel="scrollHori">
          <div :style="{left: '-' + emosOffset + 'px', color: themeColor}" @click="addEmo">
            <span v-for="emo in emos" :key="emo">{{emo}}</span>
          </div>
        </div>
        <input
          type="file"
          id="choseImg"
          accept=".jpg, .jpeg, .png, .gif, .bmp"
          @input="imgChosen"
        >
        <div v-html="icons.folder" class="add" @click="$el.querySelector('#choseImg').click()"></div>
      </div>
    </div>
    <div class="comment" :style="{borderColor: themeColor}">
      <textarea
        class="md"
        v-model="md"
        v-show="!preview"
        :style="{backgroundColor: themeColor.replace('rgb', 'rgba').replace(')', ', 0.1)'), color: themeColor}"
      ></textarea>
      <div class="mdPre" v-html="mdPre" v-show="preview"></div>
    </div>
    <div class="wordsLimit" :style="{color: themeColor}">{{md.length + '/' + maxWordLenght}}</div>
  </div>
</template>
<script>
import MarkdownIt from "markdown-it";
const md = new MarkdownIt();
import Randexp from "randexp";
import resizeImg from "../utils/resizeImg.js";
import icons from "../assets/icons.js";
import emos from "../assets/emos.js";

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

const debounce = new Debounce();

function insert(text) {
  const einput = new Event(`input`);
  const textarea = document.querySelector(`.md`);
  textarea.setRangeText(text);
  textarea.dispatchEvent(einput);
}

export default {
  props: ["themeColor", "urlToSend", "article"],
  data() {
    return {
      maxWordLenght: 120,
      preview: false,
      icons: icons,
      emos: emos,
      offset: "0",
      emosOffset: 0,
      imgs: {}, //{name: [base64, false],...}
      md: "",
      mdToSend: ""
    };
  },
  watch: {
    md: function(md) {
      if (md.length > this.maxWordLenght)
        this.md = md.slice(0, this.maxWordLenght);
    }
  },
  computed: {
    mdPre: function() {
      let srcmd = this.md;
      const imgReg = /\[([\w\d]{2}_.*)\]/g;
      let result;
      while ((result = imgReg.exec(srcmd))) {
        const prefix_name = result[1];
        if (this.imgs[prefix_name]) {
          this.imgs[prefix_name][1] = true; //使用中的图片, 置true
          srcmd = srcmd.replace(
            result[0],
            `![Alt ${prefix_name.slice(4, -1)}](${this.imgs[prefix_name][0]})`
          );
        }
      }
      //清理未使用图片, 减小内存占用
      for (const key in this.imgs) {
        if (this.imgs.hasOwnProperty(key)) {
          const element = this.imgs[key];
          if (!element[1]) {
            this.$delete(this.imgs, key);
          } else {
            //全部置false, 当下次检验到使用中时再置true
            this.imgs[key][1] = false;
          }
        }
      }
      this.mdToSend = srcmd;
      return md.render(srcmd);
    }
  },
  methods: {
    send: function() {
      fetch(this.urlToSend, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: this.mdToSend })
      })
        .then(res => {
          if (res.status !== 201) {
            console.error("Something wrong: " + res);
          } else {
            console.log("Sent succed");
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    addEmo: function(e) {
      if (e.target.tagName === "SPAN") {
        insert(e.target.innerText);
      }
    },
    scrollHori: function(e) {
      const width =
        this.$el.querySelector(".emos div").offsetWidth - Math.abs(e.deltaY);
      this.emosOffset += e.deltaY;
      if (this.emosOffset < 0) {
        this.emosOffset = 0;
      }
      if (this.emosOffset > width) {
        this.emosOffset = width;
      }
    },
    showOption: function(action) {
      this.offset = "-40px";
    },
    showTools: function() {
      this.offset = "0";
    },
    imgChosen: function(e) {
      const prefixReg = /[\w\d]{2}/;
      const prefix = new Randexp(prefixReg).gen();
      if (e.target.files[0]) {
        const image = e.target.files[0];
        resizeImg(image, 40, 40).then(dataurl => {
          this.imgs = Object.assign({}, this.imgs, {
            [prefix + "_" + image.name]: [dataurl, true]
          });
          console.log(image);
          insert(`[${prefix + "_" + image.name}]`);
        });
      }
    },
    update(e) {
      debounce.debounce(() => {
        this.md = e.target.value;
      }, 100);
    }
  }
};
</script>
<style scoped>
.whole {
  max-width: 500px;
  min-width: 200px;
  width: 70%;
  /* height: 200px; */
  max-height: 500px;
  border-radius: 10px;
  overflow: hidden;
}

.bar {
  overflow: hidden;
  width: 100%;
  height: 40px;
  position: relative;
}

.tools {
  width: 100%;
  position: relative;
  display: flex;
  justify-content: space-around;
}

.option {
  position: relative;
  display: flex;
}

.func {
  width: 100%;
  display: flex;
}

.emos {
  white-space: nowrap;
  width: calc(100% - 80px);
  height: 100%;
  overflow: hidden;
}

.emos > div {
  width: max-content;
  position: relative;
  transition: left 0.8s cubic-bezier(0.19, 1, 0.22, 1);
}

.emos >>> span {
  font-size: 26px;
  margin: 0 10px;
}

.tools,
.option {
  transition: all 0.8s cubic-bezier(0.19, 1, 0.22, 1);
}

.tools >>> div {
  width: 40px;
  height: 40px;
}

.tools >>> svg,
.option >>> svg {
  width: 40px;
  height: 40px;
}

#back {
  width: min-content;
}

.option {
  height: 40px;
}

#imgURL {
  width: 100%;
}

#choseImg {
  display: none;
}

.comment {
  height: 200px;
  display: flex;
  border-style: solid;
  border-width: 2px 0;
}

.md {
  width: 100%;
  border: none;
  resize: none;
  font-size: 20px;
}

.mdPre {
  width: 100%;
  overflow: auto;
}

.mdPre >>> img {
  max-width: 40px;
  max-height: 40px;
}

.wordsLimit {
  position: relative;
  width: 70px;
  left: calc(80% - 30px);
}
</style>
