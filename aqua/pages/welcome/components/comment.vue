<template>
  <div class="whole" :style="{border: '2px solid ' + themeColor}">
    <div class="bar">
      <div class="tools" :style="{top: offset}">
        <div v-html="icons.emo" id="addEmo" class="tool" @click="showOption('addEmo')"></div>
        <div v-html="icons.preview" id="preview" class="tool" @click="showOption('preview')"></div>
        <div v-html="icons.send" id="send" class="tool" @click="showOption('send')"></div>
      </div>
      <div class="option" :style="{top: offset}">
        <div v-html="icons.back" id="back" @click="showTools"></div>
        <div class="emos" @wheel="scrollHori">
          <div :style="{left: '-' + emosOffset + 'px'}" @click="addEmo">
            <span v-for="emo in emos" :key="emo">{{emo}}</span>
          </div>
        </div>
        <input type="file" id="choseImg" accept=".jpg, .jpeg, .png, .gif, .bmp" @input="imgChosen">
        <div v-html="icons.folder" class="add" @click="$el.querySelector('#choseImg').click()"></div>
      </div>
    </div>

    <div class="comment" :style="{borderColor: themeColor}">
      <textarea class="md" v-model="md"></textarea>
      <div class="mdPre" v-html="mdPre"></div>
    </div>
    <div class="wordsLimit">---/140</div>
  </div>
</template>
<script>
import MarkdownIt from "markdown-it";
const md = new MarkdownIt();
import { wrap, addImgs } from "../utils/clientSide.js";
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
  props: ["themeColor"],
  data() {
    return {
      icons: icons,
      emos: emos,
      offset: "0",
      emosOffset: 0,
      imgs: {}, //{name: [base64, false],...}
      md: ""
    };
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
          srcmd = srcmd.replace(result[0], `![Alt ${prefix_name.slice(4, -1)}](${this.imgs[prefix_name][0]})`);
        }
      }
      //清理未使用图片, 减小内存占用
      for (const key in this.imgs) {
        if (this.imgs.hasOwnProperty(key)) {
          const element = this.imgs[key];
          if (!element[1]) this.$delete(this.imgs, key);
          //全部置false, 当下次检验到使用中时再置true
          this.imgs[key][1] = false;
        }
      }

      return md.render(srcmd);
    }
  },
  methods: {
    addEmo: function(e) {
      if (e.target.tagName === "SPAN") {
        insert(e.target.innerText)
      }
    },
    scrollHori: function(e) {
      const width =
        this.$el.querySelector(".emos div").offsetWidth - Math.abs(e.deltaY);
      this.emosOffset += parseFloat(e.deltaY);
      if (this.emosOffset < 0) {
        this.emosOffset = 0;
      }
      if (this.emosOffset > width) {
        this.emosOffset = width;
      }
    },
    showOption: function(action) {
      this.offset = "-40px";
      // [action]
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
          insert(`[${prefix + "_" + image.name}]`)
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
  transition: all 0.8s cubic-bezier(0.19, 1, 0.22, 1);
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
  height: calc(100% - 64px);
  display: flex;
  border-style: solid;
  border-width: 2px 0;
}

.md {
  width: 100%;
  height: 200px;
  margin: 2px;
  border: none;
  resize: none;
}

.mdPre {
  /* margin: 2px; */
  width: 50%;
  height: 200px;
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
