<template>
  <div class="pics" :class="{ active: isActive }" @mousedown.prevent="initX" @mousemove.prevent="moveX" @mouseup.prevent="endX" @mouseleave="endX" @dragover.stop.prevent="dragOver" @dragleave.stop.prevent="dragLeave" @drop.stop.prevent="addImg">
      <div class="imgs" :style="{ transform: 'translateX(' + left + 'px)' }">
        <img class="gallery" v-for="(value, src) in picsList" :key="src" :alt="value.name" :src="src"  @dblclick="delImg" />
      </div>
    </div>
</template>
<script>
import eBus from "./eBus.js";
import Vue from 'vue'
export default {
  name: "myGallery",
  props: {
    content: String
  },
  data() {
    return {
      //picsList格式: { objectURL: { name: 'sdfsdfm.jpg', blob: xxxx } }
      picsList: {},
      picsWidth: 0,
      //控制拖曳的css样式
      isActive: false,
      //imgs包裹盒的属性
      imgsWidth: 0,
      dragable: false,
      lastLeft: 0,
      left: 0,
      lastEScreenX: 0,
      EScreenX: 0
    };
  },
  watch: {
    left() {
      if (this.picsWidth > this.imgsWidth) {
        this.left = 0;
      } else if (this.left > 0) {
        this.left = 0;
      } else if (this.left < this.picsWidth - this.imgsWidth) {
        this.left = this.picsWidth - this.imgsWidth;
      }
    },
    EScreenX() {
      this.left = this.lastLeft + this.EScreenX - this.lastEScreenX;
    }
  },
  created() {
    eBus.$on("articleSentSuccessed", () => {
      this.left = 0;
      this.refreshArticle(true);
    });
    eBus.$on("clrAll", () => {
      this.left = 0;
      this.refreshArticle(true);
    });
    eBus.$on("clrGallery", () => {
      this.left = 0;
      this.refreshArticle();
    });
  },
  methods: {
    initX: function(e) {
      this.imgsWidth = document.querySelector(".imgs").offsetWidth;
      this.picsWidth = document.querySelector(".pics").offsetWidth;
      this.lastLeft = this.left;
      this.lastEScreenX = e.screenX;
      this.dragable = true;
    },
    moveX: function(e) {
      if (this.dragable) {
        this.EScreenX = e.screenX;
      }
    },
    endX: function(e) {
      this.dragable = false;
      // let imgs = document.querySelector('.imgs').offsetWidth - e.target.offsetWidth
      // if (this.left > 0) {
      //   this.left = 0
      // } else if (this.left < -1 * imgs) {
      //   this.left = -1 * imgs
      // }
    },
    dragOver: function() {
      this.isActive = true;
    },
    dragLeave: function() {
      this.isActive = false;
    },
    addImg: function(e) {
      let files = e.dataTransfer.files;
      for (let i = 0; i < files.length; i++) {
        if (!files[i].type.match("image.*")) {
          continue;
        }
        let imgLink = window.URL.createObjectURL(files[i]);
        this.picsList[imgLink] = {
          name: files[i].name,
          blob: files[i]
        };
      }
      eBus.$emit("picsList", this.picsList);
      console.log("添加图片\n", this.picsList);
      this.isActive = false;
    },
    //过滤掉文章里的链接, revoke传入的图片, 返回过滤后的文章
    filterRevokeUpdate: (nameAndSrc, gallery) => {
      nameAndSrc.forEach(pic => {
        window.URL.revokeObjectURL(pic.src);
        Vue.delete(gallery.picsList, pic.src);
        let picHash = pic.src.match(
          /[a-z0-9]{8}(-[a-z0-9]{4}){3}-[a-z0-9]{12}/
        );
        console.log(picHash[0]);
        gallery.content = gallery.content.replace(
          new RegExp("!\\[Alt .*\\]\\(blob:.*" + picHash[0] + "\\)", "g"),
          ""
        );
      });
      console.log(gallery.content);
    },
    delImg: function(e) {
      this.filterRevokeUpdate(
        [
          {
            src: e.target.src,
            name: e.target.alt
          }
        ],
        this
      );
      this.$emit("refresh-article", this.content);
    },
    refreshArticle: function(clrArticle = false) {
      let nameAndSrc = [];
      for (let src in this.picsList) {
        if (this.picsList.hasOwnProperty(src)) {
          nameAndSrc.push({
            src: src,
            name: this.picsList[src].name
          });
        }
      }
      this.filterRevokeUpdate(nameAndSrc, this);
      if (clrArticle) {
        this.$emit("refresh-article", "");
      } else {
        this.$emit("refresh-article", this.content);
      }

      console.log(clrArticle);
      this.left = 0;
    }
  }
};
</script>

<style scoped>
.pics {
  /* width: calc(51% - 80px);
  max-width: calc(51% - 80px); */
  flex: 1;
  height: 85px;
  background-color: #f6f6f6;
  transition: box-shadow 0.3s ease-in-out;
  display: flex;
  justify-content: flex-start;
  overflow: hidden;
}
.imgs {
  display: flex;
  justify-content: flex-start;
  position: relative;
  height: inherit;
  min-height: inherit;
  width: auto;
}
.gallery {
  height: 85px;
}
</style>
