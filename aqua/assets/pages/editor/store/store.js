import Vue from 'vue'
import Vuex from 'vuex'
import IDB from '../utils/indexDB.js'
let idb = new IDB(`mdEditor`, `title`, `article`)
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    //picsList格式: { objectURL: { name: 'sdfsdfm.jpg', blob: xxxx } }
    picsList: {},
    //article格式: {title: 'sffsdf', content: 'sfsdfs', picsList: picsList}
    article: {
      title: ``,
      content: ``,
      picsList: {}
    },
    //items格式: {title: content}
    items: {},
    imgsPositionReset: false
  },
  mutations: {
    changeTitle(state, title) {
      state.article.title = title
    },
    changeContent(state, content) {
      state.article.content = content
    },
    setIPR(state) {
      state.imgsPositionReset = true
    },
    resetIPR(state) {
      state.imgsPositionReset = false
    },
    inportImg(state, imgs) {
      state.picsList = Object.assign({}, state.picsList, imgs)
    },
    delImg(state, imgSrc) {
      let content = state.article.content
      window.URL.revokeObjectURL(imgSrc)
      content = content.replace(
        new RegExp(`!\\[Alt .*\\]\\(` + imgSrc + `\\)`, `g`),
        ``
      )
      Vue.set(state.article, `content`, content)
      Vue.delete(state.picsList, imgSrc)
    },
    addImg(state, img) {
      state.article.content += `\n\n![Alt ${img.alt}](${img.src})\n\n`
    },
    clrGallery(state) {
      let content = state.article.content
      Object.keys(state.picsList).forEach(key => {
        window.URL.revokeObjectURL(key)
        content = content.replace(
          new RegExp(`!\\[Alt .*\\]\\(` + key + `\\)`, `g`),
          ``
        )
      })
      Vue.set(state.article, `content`, content)
      state.picsList = {}
      store.commit(`setIPR`)
    },
    clrArticle(state) {
      Vue.set(state.article, `title`, ``)
      Vue.set(state.article, `content`, ``)
    },
    save(state) {
      Vue.set(state.article, `picsList`, state.picsList)
      idb.put(state.article)
        .then(() => {
          console.log(`🎉文章已保存`)
        }, () => {
          console.warn(`❌文章保存失败`)
        })
    },
    del(state, title) {
      if (title) {
        Vue.delete(state.items, title)
        console.log(`🎉文章删除成功`)
      } else {
        console.warn(`❌文章删除失败`)
      }
    },
    load(state, article) {
      if (article) {
        //gallery还原
        let newPicsList = {}
        let objectURLMap = {}
        for (const key in article.picsList) {
          if (article.picsList.hasOwnProperty(key)) {
            const element = article.picsList[key]
            let newObjectURL
            newObjectURL = URL.createObjectURL(element.blob)
            newPicsList[newObjectURL] = {
              name: element.name,
              blob: element.blob
            }
            //新旧objeURL映射表建立
            objectURLMap[key] = newObjectURL
          }
        }
        //文章还原
        let content = article.content
        let reg = /!\[Alt .*\]\((blob:.*[a-f0-9]{8}(-[a-f0-9]{4}){3}-[a-f0-9]{12})\)/g
        let result
        while ((result = reg.exec(content))) {
          //括号捕获
          let oldImgSrc = result[1]
          let newImgSrc = objectURLMap[oldImgSrc]
          content = content.replace(
            new RegExp(`!\\[Alt .*\\]\\(` + oldImgSrc + `\\)`, `g`),
            `![Alt ${newPicsList[newImgSrc].name}](${newImgSrc})`
          )
        }
        state.picsList = newPicsList
        state.article = {
          title: article.title,
          content: content,
          picsList: newPicsList
        }
        console.log(`🎉文章已加载`)
      } else {
        console.warn(`❌文章获取失败`)
      }
    },
    loadAll(state, articles) {
      if (articles) {
        let maxContentLength = 20
        articles.forEach(article => {
          let title = article.title
          let content = article.content.length < 20 ?
            article.content :
            article.content.slice(0, maxContentLength + 1) + `...`
          Vue.set(state.items, title, content)
        })
        console.log(`🎉文章目录已加载`)
      } else {
        console.warn(`❌文章目录加载失败`)
      }

    }
  },
  actions: {
    async delete({
      commit
    }, title) {
      commit(`del`, await idb.delete(title).catch(() => false))
    },
    async get({
      commit
    }, title) {
      commit(`load`, await idb.get(title).catch(() => false))
    },
    async getAll({
      commit
    }) {
      commit(`loadAll`, await idb.getAll().catch(() => false))
    }
  }
})

export default store