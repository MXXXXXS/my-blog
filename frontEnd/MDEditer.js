window.onload = () => {
  Vue.component('update-button', {
    props: ['sotitle', 'content'],
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
          // console.log(this.sotitle + '\n' + this.content)
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
              console.log('无法获取上传进度');

            }
          })
          xhr.onreadystatechange = () => {
            if (xhr.readyState == 4 && xhr.status == 200) {
              resHandler(xhr.responseText)
            }
          }
          xhr.open('POST', '/addArticle/' + this.sotitle)
          xhr.setRequestHeader('Content-Type', 'text/plain')
          xhr.setRequestHeader('Authorization', 'Bearer ' + jwt)
          xhr.send(this.content)
        } else {
          alert('没有token, 无法发送')
        }
      }
    },
    template: '<button v-on:click="update">{{state}}</button>'
  })
  let vm = new Vue({
    el: '#editor',
    data: {
      title: '',
      input: '# hello',
      width: 0,
      picsList: {},
      isActive: false,
      imgsOffset: {
        left: 0,
        lastLeft: 0,
        dragable: false,
        mouseX: 0
      },
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
      initX: function (e) {
        console.log('left mousedown');
        this.imgsOffset.lastLeft = this.imgsOffset.left
        this.imgsOffset.mouseX = e.screenX
        this.imgsOffset.dragable = true
        console.log(this.width);

      },
      moveX: function (e) {

        if (this.imgsOffset.dragable) {
          this.imgsOffset.left = this.imgsOffset.lastLeft + e.screenX - this.imgsOffset.mouseX
        }
      },
      endX: function (e) {
        console.log('mousedup, or leave');
        this.imgsOffset.dragable = false
      },
      dragOver: function (e) {
        this.isActive = true
      },
      dragLeave: function (e) {
        this.isActive = false
      },
      addImg: function (e) {


        //使用dataurl
        // let files = e.dataTransfer.files
        // for (let i = 0; i < files.length; i++) {
        //   if (!files[i].type.match('image.*')) {
        //     continue;
        //   }
        //   let reader = new FileReader()
        //   reader.onprogress = e => {
        //     if (e.lengthComputable) {
        //       let percent = Math.round(e.loaded / e.total * 100)
        //         this.progress = - 100 + percent
        //     }
        //   }
        //   reader.onload = e => {
        //     this.progress = -100
        // this.picsList[files[i].name] ={ src: window.URL.createObjectURL(files[i]), live: true }
        //   }
        //   reader.readAsDataURL(files[i])
        // }

        //使用objecturl
        let files = e.dataTransfer.files
        for (let i = 0; i < files.length; i++) {
          if (!files[i].type.match('image.*')) {
            continue;
          }
          this.picsList[files[i].name] = { src: window.URL.createObjectURL(files[i]), live: true }
          console.log(this.picsList[files[i].name]);

        }

        this.isActive = false
      },
      img2md: function (e) {
        console.log(e.target.tagName)
        this.input += `\n\n![Alt ${e.target.alt}](${e.target.src})\n\n`
        window.URL.revokeObjectURL(e.target.src)
      },
      delImg: function (e) {
        console.log('db clicked')
        window.URL.revokeObjectURL(e.target.src)
        this.picsList[e.target.alt].live = false
        // e.target.style.width = '0'
      }
    }
  })
}