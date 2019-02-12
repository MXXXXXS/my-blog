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
    @drop.stop.prevent="inportImg"
  >
    <div class="imgs" :style="{ transform: 'translateX(' + left + 'px)' }">
      <img
        class="gallery"
        v-for="(value, src) in picsList"
        :key="src"
        :alt="value.name"
        :src="src"
        @dblclick="delImg"
        @click.right="addImg"
      >
    </div>
  </div>
</template>
<script>
export default {
  name: "myGallery",
  props: {
    content: String
  },
  data() {
    return {
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
  computed: {
    picsList() {
      return this.$store.state.picsList
    },
    imgsPositionReset() {
      return this.$store.state.imgsPositionReset
    }
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
    },
    imgsPositionReset(trueness) {
      if (trueness) {
        this.left = 0
        this.$store.commit('resetIPR')
      }
    }
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
    inportImg: function(e) {
      let files = e.dataTransfer.files;
      let picsListBuffer = {}
      for (let i = 0; i < files.length; i++) {
        if (!files[i].type.match("image.*")) {
          continue;
        }
        let imgLink = window.URL.createObjectURL(files[i]);
        picsListBuffer[imgLink] = {
          name: files[i].name,
          blob: files[i]
        };
      }
      this.$store.commit('inportImg', picsListBuffer)
      this.isActive = false;
      console.log("添加图片\n", this.picsList);
    },
    delImg: function(e) {
      //以下为自由编写区
      this.$store.commit('delImg', e.target.src)
      //以上为自由编写区
    },
    //以下为自由编写区
    addImg: function(e) {
      this.$store.commit("addImg", { alt: e.target.alt, src: e.target.src });
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
