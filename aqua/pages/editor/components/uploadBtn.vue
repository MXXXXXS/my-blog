<template>
  <button @click="upload">{{state}}</button>
</template>
<script>
const {wrap} = require(`../utils/clientSide.js`)
export default {
  name: "uploadBtn",
  data: function() {
    return {
      state: "上传"
    };
  },
  computed: {
    picsList() {
      return this.$store.state.picsList;
    },
    content() {
      return this.$store.state.article.content;
    },
    title() {
      return this.$store.state.article.title;
    }
  },
  methods: {
    upload() {
      let _this = this,
        jwt = localStorage.getItem("jwt");
      if (jwt) {
        this.state = "上传中";

        const formData = wrap(this.content, this.picsList, { title: this.title })
        
        //xhr开始
        let xhr = new XMLHttpRequest();
        //处理文章上传的进度
        xhr.onprogress = e => {
          if (e.lengthComputable) {
            let percent = Math.round((e.loaded / e.total) * 100);
            this.progress = -100 + percent;
          } else {
            console.log("无法获取上传进度");
          }
        };
        xhr.onreadystatechange = () => {
          if (xhr.readyState == 4 && xhr.status === 201) {
            _this.state = "已上传";
            const timer = window.setTimeout(() => {
              window.clearTimeout(timer);
              _this.state = "上传";
            }, 3000);
          } else if (xhr.readyState === 4 && xhr.status === 401) {
            window.location.href = "/login";
          } else if (xhr.readyState === 4 && xhr.status === 403) {
            console.error(xhr.responseText);
            _this.state = "上传失败";
          } else if (xhr.readyState === 4) {
            console.error(`Some thing wrong, unhandled`);
            _this.state = "上传失败";
          }
        };
        xhr.open("POST", "/article/" + this.title);
        xhr.setRequestHeader("jwt", jwt);
        if (this.title) {
          xhr.send(formData);
        } else {
          alert("请输入标题");
        }
      } else {
        window.location.href = "/login";
      }
    }
  }
};
</script>
<style scoped>
button {
  outline: none;
  color: rgb(0, 0, 0);
  background-color: rgba(204, 204, 204, 0.253);
  width: 80px;
  padding: 5px;
  height: 80px;
  border: none;
  transition: background-color 0.3s ease-in-out;
}

button:hover {
  background-color: rgb(173, 219, 104);
}
</style>

