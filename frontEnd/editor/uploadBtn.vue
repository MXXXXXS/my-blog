<template>
  <button @click="update">{{state}}</button>
</template>
<script>
import eBus from "./eBus.js";
export default {
  name: 'uploadBtn',
  props: ["articleTitle", "content"],
  data: function() {
    return {
      state: "上传",
      picsList: {}
    };
  },
  created() {
    eBus.$on("picsList", picsList => {
      console.log("收到picsList\n", picsList);
      this.picsList = picsList;
      console.log("更新upBtn的picsList\n", this.picsList);
    });
  },
  methods: {
    update() {
      let upBtn = this,
        jwt = localStorage.getItem("jwt");
      if (jwt) {
        this.state = "上传中";
        //收集发送内容
        let picsHashRegExp = /blob:.*([a-z0-9]{8}(-[a-z0-9]{4}){3}-[a-z0-9]{12})/g,
          picsHash,
          picsQueue = this.picsList,
          linkNamePairs = {};
        picsHash = this.content.match(picsHashRegExp);
        //构造发送表单
        let formData = new FormData();
        formData.append("content", this.content);
        formData.append("title", this.articleTitle);
        if (picsHash)
          //文内是否有图片
          picsHash.forEach(src => {
            if (picsQueue[src]) {
              //核对picsQueue, 过滤无效链接
              linkNamePairs[src] = picsQueue[src].name;
              formData.append(src, picsQueue[src].blob, picsQueue[src].name);
            }
          });
        formData.append("linkNamePairs", JSON.stringify(linkNamePairs));
        //xhr开始
        function resHandler(responseText) {
          if (responseText == "Successed") {
            eBus.$emit("articleSentSuccessed", true);
            upBtn.articleTitle = "";
            upBtn.$emit("clr-title", upBtn.articleTitle);
            upBtn.state = "已上传";
            let time_id = _.delay(() => {
              window.clearTimeout(time_id);
              upBtn.state = "继续上传";
            }, 3000);
          } else if (responseText == "Authorize Failed") {
            window.location.href = "/login";
          } else {
            console.log(responseText);
            upBtn.state = "上传失败";
          }
        }
        let xhr = new XMLHttpRequest();
        //处理文章上传的进度
        xhr.addEventListener("progress", e => {
          if (e.lengthComputable) {
            let percent = Math.round((e.loaded / e.total) * 100);
            this.progress = -100 + percent;
          } else {
            console.log("无法获取上传进度");
          }
        });
        xhr.onreadystatechange = () => {
          if (xhr.readyState == 4 && xhr.status == 200) {
            resHandler(xhr.responseText);
          }
        };
        xhr.open("POST", "/addArticle");
        xhr.setRequestHeader("jwt", jwt);
        if (this.articleTitle) {
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

