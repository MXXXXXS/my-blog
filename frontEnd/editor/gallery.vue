<template>
  <div
    class="pics"
    :class="{ active: isActive }"
    @mousedown.prevent="initX"
    @mousemove.prevent="moveX"
    @mouseup.prevent="endX"
    @mouseleave="endX"
    @dragover.stop.prevent="dragOver"
    @dragleave.stop.prevent="dragLeave"
    @drop.stop.prevent="addImg"
  >
    <div class="imgs" :style="{ transform: 'translateX(' + left + 'px)' }">
      <img
        class="gallery"
        v-for="(value, src) in picsList"
        :key="src"
        :alt="value.name"
        :src="src"
        @dblclick="delImg"
        @click.right="addImg2article"
      >
    </div>
  </div>
</template>
<script>
import eBus from "./eBus.js";
import Vue from "vue";
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
    //以下为自由编写区
    eBus.$on("clrGallery", this.clrGallery);
    eBus.$on("needPicsList", this.sendPicsList);
    eBus.$on("rebuildPicsList", this.rebuildPicsList);
    //以上为自由编写区
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
      console.log("添加图片\n", this.picsList);
      this.isActive = false;
    },
    delImg: function(e) {
      Vue.delete(this.picsList, e.target.src);
      //以下为自由编写区
      this.$emit("del-img", e.target.src);
      //以上为自由编写区
    },
    clrGallery: function() {
      //以下为自由编写区
      this.$emit("del-all-imgs", Object.keys(this.picsList));
      Object.keys(this.picsList).forEach(key =>
        window.URL.revokeObjectURL(key)
      );
      //以上为自由编写区
      this.picsList = {};
      this.left = 0;
    },
    //以下为自由编写区
    addImg2article: function(e) {
      this.$emit("add-img2article", { alt: e.target.alt, src: e.target.src });
    },
    sendPicsList: function(createArticle) {
      createArticle(this.picsList);
    },
    rebuildPicsList: function(picsList) {
      
      console.log("picsList has been rebuilt");
      for (const key in picsList) {
        if (picsList.hasOwnProperty(key)) {
          const element = picsList[key];
          Vue.set(this.picsList, key, element);
        }
      }
    }
    //以上为自由编写区
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
