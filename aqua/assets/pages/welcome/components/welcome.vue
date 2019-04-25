<template>
  <div id="container">
    <div @wheel="scroll" id="welcomeBoard" :style="{ top: offset }">
      <img class="welcomeImg" src="images/welcome.jpg">
      <h1>WELCOME</h1>
    </div>
    <div id="content">
      <side-bar @get-articles=getArticles @get-article=getArticle :items="items" :theme-color="themeColor"></side-bar>
      <div id="articles">
        <color-picker @color="changeThemeColor"></color-picker>
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



</style>
