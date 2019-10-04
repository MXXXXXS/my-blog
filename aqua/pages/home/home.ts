const cli = document.querySelector(`#cli`) as HTMLInputElement,
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
  cmds: <Array<string>> [],
  point: 0,
  addCmd(cmd: string) {
    if (cmd != `` && cmd != `undefined`) {
      this.cmds.push(cmd)
      this.point = this.cmds.length
      if (this.cmds.length > 10) {
        this.cmds.shift()
        this.point--
      }
    }
  },
  get getCmd(): string {
    return this.cmds[this.point] || ''
  },
  movePoint(key: String) {
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
      const cmd = input.match(/\S+/g) as string[]
      const method = cmd[0]
      if (cmd && options.hasOwnProperty(method)) {
        console.log(cmd, cmd.length)
        switch (cmd.length) {
          case 1:
            try {
              options[method]()
            } catch (error) {
              add(`p`, data.illegal)
            }
            break
          case 2:
            try {
              options[method](cmd[1])
            } catch (error) {
              add(`p`, data.illegal + error)
            }
            break
          default:
            add(`p`, data.illegal)
        }
      }
      (<HTMLInputElement>e.target).value = ``
    }
  }
})
//#show内添加一项元素
let add = (elTagName: string, content: string) => {
  let element = document.createElement(elTagName)
  element.innerHTML = content
  document.querySelector(`#show`)!.appendChild(element)
}
//命令种类, 及实现
const options: {[index: string]:any} = {
  clear() {
    document.querySelector(`#show`)!.innerHTML = ``
  },
  help() {
    add(`pre`, data.help)
  },
  home() {
    add(`pre`, data.welcome)
  },
  ls() {
    let handler = (resTxt: string) => {
      let list = ``
      const result: string[] = JSON.parse(resTxt)
      result.forEach(element => {
        list += element + `<br>`
      })
      add(`div`, list)
    }
    req(`get`, `articles`, handler)
  },
  read(article: string) {
    console.log(`请求文章:` + article)
    let handler = (resTxt: string) => {
      add(`div`, resTxt)
    }
    req(`get`, `article/` + article + `.md`, handler)

  },
  upgrade() {
    window.location.href = `/welcome`
  }
}
//ajax请求简单封装
function req(method: string, url: string, cb: (resTxt: string) => void) {
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