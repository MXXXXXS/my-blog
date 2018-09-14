  Vue.component('update-button', {
    props: ['articleTitle', 'content'],
    data: function () {
      return {
        state: '上传'
      }
    },
    methods: {
      update: function (e) {
        let jwt = localStorage.getItem('jwt')
        if (jwt) {
          this.state = '上传中'
          // console.log(this.articleTitle + '\n' + this.content)
          function resHandler(responseText) {
            responseText == 'successed' ? this.state = '已上传' : console.error(responseText)
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
          })
          xhr.onreadystatechange = () => {
            if (xhr.readyState == 4 && xhr.status == 200) {
              resHandler(xhr.responseText)
            }
          }
          xhr.open('POST', '/addArticle/' + this.articleTitle)
          xhr.setRequestHeader('Content-Type', 'text/plain')
          xhr.setRequestHeader('Authorization', 'Bearer ' + jwt)
          xhr.send(this.content)
        } else {
          alert('没有token, 无法发送')
        }
      }
    },
    template: '<button @click="update">{{state}}</button>'
  })
  Vue.component('my-gallery', {
    data: function () {
      return {
        picsList: {},
        isActive: false,
        imgsOffset: {
          left: 0,
          lastLeft: 0,
          dragable: false,
          mouseX: 0
        }
      }
    },
    computed: {
      livingImgs: function () {
        return this.picsList
      }
    },
    methods: {
      delImg: function (e) {
        // this.picsList[e.target.alt].live = false
        window.URL.revokeObjectURL(e.target.src)
        // delete this.picsList[e.target.alt]
        Vue.delete(this.picsList, e.target.alt)
      },
      initX: function (e) {
        this.imgsOffset.lastLeft = this.imgsOffset.left
        this.imgsOffset.mouseX = e.screenX
        this.imgsOffset.dragable = true
      },
      moveX: function (e) {
        if (this.imgsOffset.dragable) {
          this.imgsOffset.left =
            this.imgsOffset.lastLeft + e.screenX - this.imgsOffset.mouseX
        }
      },
      endX: function (e) {
        this.imgsOffset.dragable = false
      },
      dragOver: function (e) {
        this.isActive = true
      },
      dragLeave: function (e) {
        this.isActive = false
      },
      addImg: function (e) {
        //   //使用dataurl
        //   // let files = e.dataTransfer.files
        //   // for (let i = 0; i < files.length; i++) {
        //   //   if (!files[i].type.match('image.*')) {
        //   //     continue;
        //   //   }
        //   //   let reader = new FileReader()
        //   //   reader.onprogress = e => {
        //   //     if (e.lengthComputable) {
        //   //       let percent = Math.round(e.loaded / e.total * 100)
        //   //         this.progress = - 100 + percent
        //   //     }
        //   //   }
        //   //   reader.onload = e => {
        //   //     this.progress = -100
        //   // this.picsList[files[i].name] ={ src: window.URL.createObjectURL(files[i]), live: true }
        //   //   }
        //   //   reader.readAsDataURL(files[i])
        //   // }
        //使用objecturl
        let files = e.dataTransfer.files
        for (let i = 0; i < files.length; i++) {
          if (!files[i].type.match('image.*')) {
            continue
          }
          this.picsList[files[i].name] = { src: window.URL.createObjectURL(files[i]) }
        }
        this.isActive = false
      }
    },
    template: `
      <div class="pics" :class="{ active: isActive }" @mousedown="initX" @mousemove="moveX" @mouseup="endX" @mouseleave="endX">
        <div class="imgs" :style="{ left: imgsOffset.left + 'px'}" @dragover.prevent="dragOver" @dragleave.prevent="dragLeave" @drop.prevent="addImg">
          <img class="gallery" v-for="(info, name) in picsList" :key="name" :alt="name" :src="info.src"  @dblclick="delImg" />
        </div>
      </div>`
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
      }
    }
  })