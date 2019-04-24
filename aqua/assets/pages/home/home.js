let cli = document.querySelector(`#cli`),
  data = {
    welcome: ` _       __       __                                 __            ___    ____   __  __ ___   _      \n| |     / /___   / /_____ ____   ____ ___   ___     / /_ ____     /   |  / __ \\ / / / //   | ( )_____\n| | /| / // _ \\ / // ___// __ \\ / __ \`__ \\ / _ \\   / __// __ \\   / /| | / / / // / / // /| | |// ___/\n| |/ |/ //  __// // /__ / /_/ // / / / / //  __/  / /_ / /_/ /  / ___ |/ /_/ // /_/ // ___ |  (__  ) \n|__/|__/ \\___//_/ \\___/ \\____//_/ /_/ /_/ \\___/   \\__/ \\____/  /_/  |_|\\___\\_\\\\____//_/  |_| /____/  \n        `,
    get help() {
      let str = ``
      for (const key in options) {
        if (options.hasOwnProperty(key)) {
          str += `  ${key}<br>`
        }
      }
      return str
    },
    illegal: `😥好像没有这条命令, 试试"help"?`
  }
//命令栈
let cmdStack = {
  maxLength: 10,
  cmds: [],
  point: 0,
  addCmd(cmd) {
    if (cmd != `` && cmd != `undefined`) {
      this.cmds.push(cmd)
      this.point = this.cmds.length
      if (this.cmds.length > 10) {
        this.cmds.shift()
        this.point--
      }
    }
  },
  get getCmd() {
    return this.cmds[this.point]
  },
  movePoint(key) {
    switch (key) {
      case `ArrowUp`:
        if (this.point == this.maxLength) {
          this.point--
          cli.value = cmdStack.getCmd
        } else if (this.point == 0) {
          cli.value = cmdStack.getCmd
        } else if (this.point > 0) {
          this.point--
          cli.value = cmdStack.getCmd
        }
        break
      case `ArrowDown`:
        if (this.point == this.maxLength) {
          cli.value = ``
        } else if (this.point == this.cmds.length - 1) {
          this.point++
          cli.value = ``
        } else if (this.point < this.cmds.length - 1) {
          this.point++
          cli.value = cmdStack.getCmd
        }
        break
    }
  }
}
window.addEventListener(`keydown`, e => {
  //回溯历史命令
  if (e.key == `ArrowUp` || e.key == `ArrowDown`) {
    console.log(cmdStack.cmds, cmdStack.point)
    cmdStack.movePoint(e.key)
  }
  //监视输入, 并处理
  if (e.key == `Enter`) {
    let input = cli.value
    cmdStack.addCmd(input)
    if (input) {
      let cmd = input.match(/\S+/g)
      console.log(cmd, cmd.length)
      switch (cmd.length) {
        case 1:
          try {
            options[cmd[0]]()
          } catch (error) {
            add(`p`, data.illegal)
          }
          break
        case 2:
          try {
            options[cmd[0]](cmd[1])
          } catch (error) {
            add(`p`, data.illegal + error)
          }
          break
        default:
          add(`p`, data.illegal)
      }
      e.target.value = ``
    }
  }
})
//#show内添加一项元素
let add = (ele, content) => {
  let element = document.createElement(ele)
  element.innerHTML = content
  document.querySelector(`#show`).appendChild(element)
}
//命令种类, 及实现
let options = {
  clear() {
    document.querySelector(`#show`).innerHTML = ``
  },
  help() {
    add(`pre`, data.help)
  },
  home() {
    add(`pre`, data.welcome)
  },
  ls() {
    let handler = resTxt => {
      let list = ``
      JSON.parse(resTxt).forEach(element => {
        list += element + `<br>`
      })
      add(`div`, list)
    }
    req(`get`, `articles`, handler)
  },
  read(article) {
    console.log(`请求文章:` + article)
    let handler = resTxt => {
      add(`div`, resTxt)
    }
    req(`get`, `article/` + article + `.md`, handler)

  },
  upgrade() {
    window.location.href = `/welcome`
  }
}
//ajax请求简单封装
function req(method, url, cb) {
  let xhr = new XMLHttpRequest
  xhr.open(method, url)
  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4 && xhr.status == 200) {
      cb(xhr.responseText)
    }
  }
  xhr.setRequestHeader(`Content-Type`, `text/plain`)
  xhr.send()
}

