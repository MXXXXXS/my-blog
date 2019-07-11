<template>
  <div id="sideBar">
    <div id="menu" @click="click"></div>
    <transition name="slide-fade" @after-enter="keepWidth" @before-leave="resetWidth">
      <div id="list" :class="active" v-show="show" :style='{backgroundColor: themeColor}'>
          <p @click="getArticle" class="titles" :class="{chosen: currentItem === title}" v-for="title in items" :key="title">{{title}}</p>
      </div>
    </transition>
  </div>
</template>
<script>
import lottie from "lottie-web";
import path from "path";

const menuData = "/welcome/assets/data.json";

let anime;

console.log(menuData);
export default {
  props: ["items", "themeColor"],
  data() {
    return {
      reverse: -1,
      show: false,
      active: '',
      currentItem: ''
    };
  },
  mounted: function() {
    anime = lottie.loadAnimation({
      container: document.querySelector(`#menu`),
      renderer: "svg",
      loop: false,
      autoplay: false,
      path: menuData
    });
    anime.addEventListener('DOMLoaded', () => {
      document.querySelectorAll('svg path').forEach(element => {
        element.style.fill = this.themeColor
      });
    })
  },
  watch: {
    themeColor: function(newVal, oldVal) {
      document.querySelectorAll('svg path').forEach(element => {
        element.style.fill = newVal
      });
    }
  },
  methods: {
    click: function(e) {
      if (this.reverse === -1) {
        this.$emit("get-articles");
        this.show = true;
      } else {
        this.show = false;
      }
      anime.play();
      anime.setDirection(
        this.reverse > 0 ? (this.reverse = -1) : (this.reverse = 1)
      );
    },
    keepWidth: function() {
      this.active = "active";
    },
    resetWidth: function() {
      this.active = "";
    },
    getArticle: function(e) {
      this.currentItem = e.target.innerHTML
      this.$emit("current-article", e.target.innerHTML)
      this.$emit("get-article", e.target.innerHTML);
    }
  }
};
</script>
<style scoped>
#sideBar {
  height: 100vh;
}

#menu {
  position: relative;
  height: 40px;
  width: 40px;
  left: 50%;
  transform: translate(-50%, 0%);
}
#list {
  position: relative;
  height: calc(100vh - 40px);
  overflow-y: auto;
  /* 此处比较魔法, 必须有一个很小的值来显示虚线边框(当第一篇文章被选中, 上方虚线的显示 */
  padding-top: 0.1px;
  left: 50%;
  transform: translate(-50%, 0%);
}

.titles {
  cursor: pointer;
  margin: 2px;
  padding: 0 10px;
  height: 40px;
  color: white;
  font-size: 16px;
  line-height: 40px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transform: translateZ(0);
}

.active {
  width: 15vw;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  width: 15vw;
  transition: width 0.8s cubic-bezier(0.19, 1, 0.22, 1),
    opacity 0.8s cubic-bezier(0.19, 1, 0.22, 1);
}

.slide-fade-enter,
.slide-fade-leave-to {
  width: 0;
  opacity: 0;
}

svg {
  fill: currentColor;
}

.chosen {
  outline: 2px dashed white;
}
</style>
