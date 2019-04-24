<template>
  <div id="sideBar">
    <div id="menu" @click="click"></div>
    <transition name="slide-fade" @after-enter="keepWidth" @before-leave="resetWidth">
      <div id="list" :class="active" v-show="show">
          <p @click="getArticle" class="titles" v-for="title in items" :key="title">{{title}}</p>
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
  props: ["items"],
  data() {
    return {
      reverse: -1,
      show: 0,
      active: ""
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
  },
  watch: {
    items: function(newVal, oldVal) {}
  },
  methods: {
    click: function(e) {
      if (this.reverse === -1) {
        this.$emit("get-articles");
        this.show = 1;
      } else {
        this.show = 0;
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
  height: 100%;
  left: 50%;
  transform: translate(-50%, 0%);
}

.titles {
  margin: 0;
  height: 40px;
  color: white;
  font-size: 16px;
  line-height: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.active {
  background-color: rgb(138, 159, 239);
  width: 15vw;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  width: 15vw;
  background-color: rgb(138, 159, 239);
  transition: width 0.8s cubic-bezier(0.19, 1, 0.22, 1),
    background-color 0.8s cubic-bezier(0.19, 1, 0.22, 1);
}

.slide-fade-enter,
.slide-fade-leave-to {
  width: 0;
  background-color: rgba(138, 159, 239, 0);
}
</style>
