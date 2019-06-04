<template>
  <div id="container">
    <div @wheel="scroll" id="welcomeBoard" :style="{ top: coverOffset}">
      <img class="welcomeImg" src="images/welcome.jpg">
      <h1 :style="{color: themeColor, boxShadow: '0px 0px 20px ' + themeColor }">WELCOME</h1>
    </div>
    <div id="content">
      <div id="settings">
        <div
          v-html="icons.gear"
          @click="gearRotate = !gearRotate"
          :class="{gearRotation: gearRotate}"
          id="gear"
        ></div>
        <div class="colorPicker" :class="{pickerRotation: gearRotate}">
          <color-picker id="picker" @color="changeThemeColor"></color-picker>
        </div>
      </div>
      <side-bar
        @current-article="setCurrentArticle"
        @get-articles="getArticles"
        @get-article="getArticle"
        :items="articles"
        :theme-color="themeColor"
      ></side-bar>
      <div class="home">
        <div v-html="icons.home" class="welcome" @click="home"></div>
        <div class="article">
          <div class="content" :style="{color: themeColor}" v-html="article"></div>
          <comment
            @sent='$refs[`comments`].$emit(`loadMore`, currentArticle, $refs[`comments`].offset + 1)'
            words=''
            :url-to-send= "'../comments?target=' + currentArticle + '&article=' + currentArticle"
            :article="currentArticle"
            :theme-color="themeColor"
            class="commentBox"
          ></comment>
        </div>
      </div>
      <div id="about">
        <div v-html="icons.people" class="me"></div>
        <div class="intro">
          <comments ref="comments" v-if="currentArticle" :current-article="currentArticle" :target="currentArticle" :theme-color="themeColor"></comments>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import sideBar from "./sideBar.vue";
import colorPicker from "./color-picker.vue";
import comment from "./comment.vue";
import comments from "./comments.vue";
import icons from "../assets/icons.js";

export default {
  data: function() {
    return {
      icons: icons,
      currentArticle: "",
      coverOffset: 0,
      gearRotate: false,
      articles: [
        "0 klsahglkas",
        "1 lasjdflasg",
        "2 as;ldjgalk;sdjferyhwehsdre"
      ],
      article: "",
      themeColor: "rgb(138, 39, 239)"
    };
  },
  mounted: function() {},
  methods: {
    setCurrentArticle: function(currentArticle) {
      this.currentArticle = currentArticle;
    },
    scroll: function() {
      this.coverOffset = `-100vh`;
    },
    home: function() {
      this.coverOffset = "0";
    },
    getArticles: function() {
      fetch("../articles")
        .then(res => {
          // this.articles = res.json()
          const json = res.json();
          console.log(json);
          return json;
        })
        .then(json => {
          this.articles = json;
          console.log(json);
        });
    },
    getArticle: function(article) {
      fetch("../article/" + article + ".md")
        .then(res => {
          // this.articles = res.json()
          const text = res.text();
          return text;
        })
        .then(text => {
          this.article = text;
        });
    },
    changeThemeColor: function(color) {
      this.themeColor = color;
    }
  },
  components: {
    sideBar,
    colorPicker,
    comment,
    comments
  }
}
</script>
<style scoped>
#contaniner {
  position: relative;
  height: 100vh;
}

#welcomeBoard {
  position: absolute;
  width: 100vw;
  height: 100vh;
  transition: all 0.8s cubic-bezier(0.19, 1, 0.22, 1);
  z-index: 2;
}

#content {
  position: absolute;
  width: 100vw;
  height: calc(100vh - 40px);
  display: flex;
  justify-content: center;
}

.home {
  width: 50vw;
  max-width: 1000px;
  min-width: 250px;
  transition: all 0.8s cubic-bezier(0.19, 1, 0.22, 1);
}

.article {
  height: calc(100% - 40px);
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.content >>> img {
  width: 400px;
}

h1 {
  margin: 0;
  padding: 0 20px;
  border-radius: 20px;
  opacity: 0.5;
  font-size: 10vh;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.welcomeImg {
  display: block;
  position: absolute;
  min-width: 100%;
  height: 100%;
  overflow: hidden;
}

#gear >>> svg,
.welcome >>> svg,
.me >>> svg {
  width: 40px;
  height: 40px;
}

#gear,
.welcome,
.me {
  width: 40px;
  height: 40px;
  position: relative;
  left: calc(50% - 20px);
  transition: all 0.8s cubic-bezier(0.19, 1, 0.22, 1);
}

.gearRotation {
  transform: rotateZ(720deg);
}

#picker {
  position: relative;
  left: 50%;
  transform: translate(-50%, 0);
}

.colorPicker {
  /* position: relative; */
  transform: rotateY(630deg);
  opacity: 0;
  width: 0;
  transition: all 0.8s cubic-bezier(0.19, 1, 0.22, 1);
}

.pickerRotation {
  opacity: 1;
  width: 270px;
  transform: rotateY(0deg);
}

/* .commentBox {
} */
</style>
