<template>
  <button @click="upload">{{state}}</button>
</template>
<script>
export default {
  name: 'uploadBtn',
  data: function() {
    return {
      state: "上传"
    };
  },
  computed: {
    picsList() {
      return this.$store.state.picsList
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
        //收集发送内容
        let picsHashRegExp = /blob:.*([a-z0-9]{8}(-[a-z0-9]{4}){3}-[a-z0-9]{12})/g,
          picsHash,
          picsList = this.picsList,
          objectURLNameMap = {};
        picsHash = this.content.match(picsHashRegExp);
        //构造发送表单
        let formData = new FormData();
        formData.append("content", this.content);
        formData.append("title", this.title);
          //文内是否有图片
        if (picsHash)
          picsHash.forEach(src => {
            if (picsList.hasOwnProperty(src)) {
              //核对picsQueue, 过滤无效链接
              objectURLNameMap[src] = picsList[src].name;
              formData.append(src, picsList[src].blob, picsList[src].name);
            }
          });
        formData.append("objectURLNameMap", JSON.stringify(objectURLNameMap));
        //xhr开始
        function resHandler(responseText) {
          if (responseText == "Successed") {
            _this.state = "已上传";
            let tId = window.setTimeout(() => {
              window.clearTimeout(time_id);
              _this.state = "上传";
            }, 3000);
          } else if (responseText == "Authorize Failed") {
            window.location.href = "/login";
          } else {
            console.log(responseText);
            _this.state = "上传失败";
          }
        }
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
          if (xhr.readyState == 4 && xhr.status == 200) {
            resHandler(xhr.responseText);
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

