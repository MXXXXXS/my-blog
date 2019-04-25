<template>
  <div id="container">
    <div @wheel="scroll" id="welcomeBoard" :style="{ top: offset }">
      <img class="welcomeImg" src="images/welcome.jpg">
      <h1>WELCOME</h1>
    </div>
    <div id="content">
      <div id="settings">
        <svg @click="rotate = !rotate" :class="{gearRotation: rotate}" id="gear" class="icon" style="" viewBox="0 0 1036 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="202.34375" height="200"><path d="M1017.6 467.2c0-19.2 0-38.4-6.4-51.2 0-25.6-12.8-44.8-38.4-51.2-38.4-6.4-70.4-25.6-96-70.4-19.2-38.4-25.6-76.8-12.8-115.2 6.4-19.2 0-38.4-12.8-64-44.8-44.8-102.4-76.8-166.4-96-19.2-6.4-38.4 0-64 12.8-25.6 32-64 44.8-108.8 44.8-38.4 0-76.8-19.2-108.8-44.8-25.6-25.6-51.2-19.2-64-12.8-44.8 32-96 57.6-153.6 102.4-25.6 12.8-32 38.4-25.6 57.6 12.8 38.4 6.4 83.2-12.8 121.6-12.8 32-44.8 57.6-89.6 70.4H44.8c-12.8 6.4-25.6 19.2-32 44.8v19.2c-6.4 25.6-12.8 51.2-12.8 70.4 0 32 0 70.4 12.8 96 0 25.6 19.2 44.8 44.8 51.2 38.4 6.4 70.4 25.6 96 70.4 19.2 38.4 25.6 76.8 12.8 115.2-6.4 19.2 0 38.4 12.8 64 38.4 38.4 89.6 70.4 166.4 102.4h12.8c12.8 0 32-6.4 44.8-19.2 25.6-32 64-44.8 108.8-44.8 38.4 0 76.8 19.2 108.8 44.8 12.8 12.8 25.6 19.2 44.8 19.2h19.2c57.6-25.6 108.8-51.2 166.4-96 19.2-12.8 32-38.4 19.2-57.6-12.8-38.4-6.4-83.2 12.8-121.6 19.2-32 51.2-57.6 96-70.4h12.8c19.2-6.4 32-25.6 38.4-44.8l6.4-19.2c-19.2-32-12.8-51.2-12.8-76.8 0-19.2-6.4-32-6.4-51.2z m-224 384c-32 32-76.8 57.6-134.4 76.8-38.4-38.4-96-64-153.6-64-57.6 0-115.2 25.6-153.6 64-51.2-19.2-96-51.2-128-76.8 19.2-57.6 12.8-115.2-19.2-160-32-57.6-70.4-89.6-128-102.4V512c0-25.6 0-51.2 6.4-83.2 57.6-19.2 96-51.2 128-96 32-57.6 38.4-115.2 19.2-160 32-32 76.8-57.6 134.4-76.8 44.8 44.8 96 70.4 153.6 70.4 57.6 0 115.2-25.6 153.6-64 51.2 19.2 96 51.2 128 76.8-19.2 57.6-12.8 115.2 19.2 160 32 57.6 70.4 89.6 128 102.4 6.4 25.6 6.4 51.2 6.4 83.2 0 19.2 0 38.4-6.4 70.4-57.6 19.2-102.4 57.6-128 102.4-32 51.2-38.4 108.8-25.6 153.6z" p-id="755"></path><path d="M691.2 428.8c-12.8-6.4-19.2-6.4-32-6.4-19.2 12.8-25.6 25.6-25.6 44.8 12.8 25.6 6.4 51.2 0 76.8v6.4c-19.2 76.8-89.6 108.8-160 89.6-32-12.8-64-32-76.8-64s-19.2-64-6.4-102.4c25.6-70.4 96-102.4 160-83.2 6.4 6.4 19.2 6.4 25.6 0 12.8-6.4 19.2-12.8 25.6-19.2 6.4-6.4 6.4-19.2 0-25.6-6.4-12.8-12.8-19.2-25.6-25.6-102.4-38.4-211.2 12.8-256 121.6-12.8 51.2-12.8 102.4 12.8 153.6 25.6 44.8 64 83.2 115.2 102.4 12.8 6.4 38.4 12.8 64 12.8 83.2 0 153.6-51.2 185.6-134.4 12.8-38.4 12.8-83.2 0-128 0-12.8-6.4-19.2-6.4-19.2z" p-id="756"></path></svg>
        <div class="colorPicker" :class="{pickerRotation: rotate}"><color-picker id="picker" @color="changeThemeColor"></color-picker></div>
      </div>
      <side-bar @get-articles=getArticles @get-article=getArticle :items="items" :theme-color="themeColor"></side-bar>
      <div id="articles">
        <p v-html="article">
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import sideBar from "./sideBar.vue";
import colorPicker from "./color-picker.vue"

export default {
  data: function() {
    return {
      offset: 0,
      rotate: false,
      items: ["0 klsahglkas", "1 lasjdflasg", "2 as;ldjgalk;sdjferyhwehsdre"],
      article: '',
      themeColor: 'rgb(138, 39, 239)'
    };
  },
  mounted: function() {},
  methods: {
    scroll: function() {
      console.log(`scroll`);
      this.offset = `-100vh`;
    },
    getArticles: function() {
      fetch('../articles')
      .then(res => {
        // this.items = res.json()
        const json = res.json()
        console.log(json)
        return json
      }).then(json => {
        this.items = json
        console.log(json)
      })
    },
    getArticle: function(article) {
      fetch('../article/' + article + '.md')
      .then(res => {
        // this.items = res.json()
        const text = res.text()
        return text
      }).then(text => {
        this.article = text
      })
    },
    changeThemeColor: function (color) {
      this.themeColor = color
    }
  },
  components: {
    sideBar,
    colorPicker
  }
};
</script>
<style scoped>
#contaniner {
  position: relative;
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
  display: flex;
  justify-content: center;
}

#articles {
  max-width: 1000px;
  min-width: 500px;
  width: 62vw;
  transition: all 0.8s cubic-bezier(0.19, 1, 0.22, 1);
}

.title {
  /* width: 100%; */
  height: 40px;
  line-height: 100%;
  font-size: 28px;
  text-align: center;
  color: rgb(138, 159, 239);
}

p {
  padding: 10px;
  color: rgb(138, 159, 239);
}

p >>> img {
  width: 400px;
}

h1 {
  margin: 0;
  color: rgba(240, 248, 255, 0.6);
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

#gear {
  width: 40px;
  height: 40px;
  position: relative;
  left: 50%;
  transform: translate(-50%, 0);
  transition: all 0.8s cubic-bezier(0.19, 1, 0.22, 1);
}

.gearRotation {
  transform: rotate(720deg);
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

</style>
