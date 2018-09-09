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
          function cb(responseText) {
            responseText == 'successed' ? this.state = '已上传' : console.error(responseText)
          }
          let xhr = new XMLHttpRequest
          xhr.open('POST', '/addArticle/' + this.sotitle)
          xhr.onreadystatechange = () => {
            if (xhr.readyState == 4 && xhr.status == 200) {
              cb(xhr.responseText)
            }
          }
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
  new Vue({
    el: '#editor',
    data: {
      title: '',
      input: '# hello',
      picsList: [],
      isActive: false
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
      dragOver: function(e) {
        this.isActive = true
      },
      dragLeave: function(e) {
        this.isActive = false
      },
      addPics: function (e) {
        let files = e.dataTransfer.files
        for (let i = 0; i < files.length; i++) {
          if (!files[i].type.match('image.*')) {
            continue;
          }
          let reader = new FileReader()
          reader.onload = e => {
            this.picsList.push({name: files[i].name, dataURL: e.target.result})
          }
          reader.readAsDataURL(files[i])
        }
        this.isActive = false
      }
    }
  })
}
