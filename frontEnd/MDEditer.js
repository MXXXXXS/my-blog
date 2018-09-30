//事件监听: articleSentSuccessed 事件发送: articleSentSuccessed(全部清除) refresh-article(更新文章)
const eBus = new Vue()
Vue.component('update-button', {
  props: ['articleTitle', 'content'],
  data: function () {
    return {
      state: '上传',
      picsList: {}
    }
  },
  created() {
    eBus.$on('picsList', picsList => {
      console.log('收到picsList\n', picsList)
      this.picsList = picsList
      console.log('更新upBtn的picsList\n', this.picsList)
    })
  },
  methods: {
    update: function () {
      let upBtn = this,
        jwt = localStorage.getItem('jwt')
      if (jwt) {
        this.state = '上传中'
        //收集发送内容
        let picsHashRegExp = /blob:.*([a-z0-9]{8}(-[a-z0-9]{4}){3}-[a-z0-9]{12})/g,
          picsHash,
          picsQueue = this.picsList,
          linkNamePairs = {}
        picsHash = this.content.match(picsHashRegExp)
        //构造发送表单
        let formData = new FormData()
        formData.append('content', this.content)
        formData.append('title', this.articleTitle)
        if (picsHash)//文内是否有图片
          picsHash.forEach(src => {
            if (picsQueue[src]) { //核对picsQueue, 过滤无效链接
              linkNamePairs[src] = picsQueue[src].name
              formData.append(src, picsQueue[src].blob, picsQueue[src].name)
            }

          })
        formData.append('linkNamePairs', JSON.stringify(linkNamePairs))
        //xhr开始
        function resHandler(responseText) {
          if (responseText == 'Successed') {
            eBus.$emit('articleSentSuccessed', true)
            upBtn.articleTitle = ''
            upBtn.$emit('clr-title', upBtn.articleTitle)
            upBtn.state = '已上传'
            let time_id = _.delay(() => {
              window.clearTimeout(time_id)
              upBtn.state = '继续上传'
            }, 3000)
          } else {
            console.log(responseText)
            upBtn.state = '上传失败'
          }
        }
        let xhr = new XMLHttpRequest
        //处理文章上传的进度
        xhr.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            let percent = Math.round(e.loaded / e.total * 100)
            this.progress = -100 + percent
          } else {
            console.log('无法获取上传进度')
          }
        })
        xhr.onreadystatechange = () => {
          if (xhr.readyState == 4 && xhr.status == 200) {
            resHandler(xhr.responseText)
          }
        }
        xhr.open('POST', '/addArticle')
        xhr.setRequestHeader('jwt', jwt)
        if (this.articleTitle) {
          xhr.send(formData)
        } else {
          alert('请输入标题')
        }
      } else {
        window.location.href = '/login'
      }
    }
  },
  template: '#update-button'
})
let myGlry = Vue.component('my-gallery', {
  props: {
    'content': String
  },
  data: function () {
    return {
      //picsList格式: { objectURL: { name: 'sdfsdfm.jpg', blob: xxxx } }
      picsList: {},
      //控制拖曳的css样式
      isActive: false,
      //imgs包裹盒的属性
      imgsOffset: {
        left: 0,
        lastLeft: 0,
        dragable: false,
        mouseX: 0
      }
    }
  },
  created() {
    eBus.$on('articleSentSuccessed', () => {
      this.refreshArticle(true)
    })
    eBus.$on('clrAll', () => {
      this.refreshArticle(true)
    })
    eBus.$on('clrGallery', () => {
      this.refreshArticle()
    })
  },
  methods: {
    initX: function (e) {
      this.imgsOffset.lastLeft = this.imgsOffset.left
      this.imgsOffset.mouseX = e.screenX
      this.imgsOffset.dragable = true
    },
    moveX: function (e) {
      if (this.imgsOffset.dragable) {
        this.imgsOffset.left = this.imgsOffset.lastLeft + e.screenX - this.imgsOffset.mouseX
      }
    },
    endX: function (e) {
      this.imgsOffset.dragable = false
      // let imgs = document.querySelector('.imgs').offsetWidth - e.target.offsetWidth
      // if (this.imgsOffset.left > 0) {
      //   this.imgsOffset.left = 0
      // } else if (this.imgsOffset.left < -1 * imgs) {
      //   this.imgsOffset.left = -1 * imgs
      // }

    },
    dragOver: function () {
      this.isActive = true
    },
    dragLeave: function () {
      this.isActive = false
    },
    addImg: function (e) {
      let files = e.dataTransfer.files
      for (let i = 0; i < files.length; i++) {
        if (!files[i].type.match('image.*')) {
          continue
        }
        let imgLink = window.URL.createObjectURL(files[i])
        this.picsList[imgLink] = {
          name: files[i].name,
          blob: files[i]
        }
      }
      eBus.$emit('picsList', this.picsList)
      console.log('添加图片\n', this.picsList)
      this.isActive = false
    },
    //过滤掉文章里的链接, revoke传入的图片, 返回过滤后的文章
    filterRevokeUpdate: (nameAndSrc, gallery) => {
      nameAndSrc.forEach(pic => {
        window.URL.revokeObjectURL(pic.src)
        Vue.delete(gallery.picsList, pic.src)
        let picHash = pic.src.match(/[a-z0-9]{8}(-[a-z0-9]{4}){3}-[a-z0-9]{12}/)
        console.log(picHash[0])
        gallery.content = gallery.content.replace(new RegExp('!\\[Alt .*\\]\\(blob:.*' + picHash[0] + '\\)', 'g'), '')
      })
      console.log(gallery.content)
    },
    delImg: function (e) {
      this.filterRevokeUpdate([{
        src: e.target.src,
        name: e.target.alt
      }], myGlry)
      this.$emit('refresh-article', this.content)
    },
    refreshArticle: function (clrArticle = false) {
      let nameAndSrc = []
      for (let src in this.picsList) {
        if (this.picsList.hasOwnProperty(src)) {
          nameAndSrc.push({
            src: src,
            name: this.picsList[src].name
          })
        }
      }
      this.filterRevokeUpdate(nameAndSrc, this)
      if (clrArticle) {
        this.$emit('refresh-article', '')
      } else {
        this.$emit('refresh-article', this.content)
      }

      console.log(clrArticle)
      this.imgsOffset.left = 0
    }
  },
  template: `#my-gallery`
})
new Vue({
  el: '#editor',
  data: {
    title: '',
    input: '# hello',
    progress: -100
  },
  computed: {
    compiledMarkdown: function () {
      return marked(this.input, {
        sanitize: true
      })
    }
  },
  methods: {
    update: _.debounce(function (e) {
      this.input = e.target.value
    }, 300),
    img2md: function (e) {
      this.input += `\n\n![Alt ${e.target.alt}](${e.target.src})\n\n`
    },
    clrAll: function () {
      this.title = ''
      eBus.$emit('clrAll')
    },
    clrGallery: function () {
      eBus.$emit('clrGallery')
    },
    clrArticle: function () {
      this.input = ''
    }
  }
})