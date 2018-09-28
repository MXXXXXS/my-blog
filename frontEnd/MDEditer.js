const eBus = new Vue()
Vue.component('update-button', {
  props: ['articleTitle', 'content'],
  data: function () {
    return {
      state: '上传'
    }
  },
  methods: {
    update: function () {
      let jwt = localStorage.getItem('jwt')
      if (jwt) {
        let that = this
        this.state = '上传中'
        // console.log(this.articleTitle + '\n' + this.content)
        function resHandler(responseText) {
          if (responseText == 'Successed') {
            eBus.$emit('articleSentSuccessed', true)
            that.state = '已上传'
          } else {
            console.log(responseText)
            that.state = '上传失败'
          }
        }
        let xhr = new XMLHttpRequest
        xhr.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            //处理文章上传的进度
            let percent = Math.round(e.loaded / e.total * 100)
            this.progress = - 100 + percent
          } else {
            console.log('无法获取上传进度')
          }
          if (xhr.readyState == 2) console.log('xhr.readyState is 2');

        })
        xhr.onreadystatechange = () => {
          if (xhr.readyState == 4 && xhr.status == 200) {
            resHandler(xhr.responseText)
          }
        }
        xhr.open('POST', '/addArticle')
        xhr.setRequestHeader('jwt', jwt)
        let formData = new FormData()
        formData.append('content', this.content)
        formData.append('title', this.articleTitle)
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
  template: '<button @click="update">{{state}}</button>'
})
Vue.component('my-gallery', {
  props: { 'content': String },
  data: function () {
    return {
      //picsList格式: { name1: { src: 'xxxxxxx1' }, name2: { src: 'xxxxxxx2' } }
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
      this.clrGallery()
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
        this.picsList[files[i].name] = { src: window.URL.createObjectURL(files[i]) }
      }
      this.isActive = false
    },
    //过滤掉文章里的链接和revoke传入的图片, 返回过滤后的文章
    clrPicsInArticle: (nameAndSrc, that) => {
      nameAndSrc.forEach(pic => {
        window.URL.revokeObjectURL(pic.src)
        Vue.delete(that.picsList, pic.name)
        let picHash = pic.src.match(/[a-z0-9]{8}(-[a-z0-9]{4}){3}-[a-z0-9]{12}/)
        that.content = that.content.replace(new RegExp('!\\[Alt .*\\]\\(blob:null\\/' + picHash[0] + '\\)', 'g'), '')
      })
      console.log(that.content)
    },
    delImg: function (e) {
      this.clrPicsInArticle([{ src: e.target.src, name: e.target.alt }], this)
      this.$emit('refreshArticle', this.content)
    },
    clrGallery: function (clrArticle = false) {
      let nameAndSrc = []
      for (let name in this.picsList) {
        if (this.picsList.hasOwnProperty(name)) {
          nameAndSrc.push({ name: name, src: this.picsList[name].src })
        }
      }
      this.clrPicsInArticle(nameAndSrc, this)
      if (clrArticle)
        this.$emit('refreshArticle', '')
      else
        this.$emit('refreshArticle', this.content)
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
      return marked(this.input, { sanitize: true })
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
      eBus.$emit('articleSentSuccessed', true)
    }
  }
})