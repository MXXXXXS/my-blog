let cli = document.querySelector('#cli'),
    data = {
        welcome: ' _       __       __                                 __            ___    ____   __  __ ___   _      \n| |     / /___   / /_____ ____   ____ ___   ___     / /_ ____     /   |  / __ \\ / / / //   | ( )_____\n| | /| / // _ \\ / // ___// __ \\ / __ `__ \\ / _ \\   / __// __ \\   / /| | / / / // / / // /| | |// ___/\n| |/ |/ //  __// // /__ / /_/ // / / / / //  __/  / /_ / /_/ /  / ___ |/ /_/ // /_/ // ___ |  (__  ) \n|__/|__/ \\___//_/ \\___/ \\____//_/ /_/ /_/ \\___/   \\__/ \\____/  /_/  |_|\\___\\_\\\\____//_/  |_| /____/  \n        ',
        get help() {
            let str = ''
            for (const key in options) {
                if (options.hasOwnProperty(key)) {
                    str += `  ${key}<br>`
                }
            }
            return str
        },
        illegal: '😥好像没有这条命令, 试试"help"?'
    }
//#show内添加一项元素
let add = (ele, content) => {
    let element = document.createElement(ele)
    element.innerHTML = content
    document.querySelector('#show').appendChild(element)
}
//命令种类, 及实现
let options = {
    clean() {
        document.querySelector('#show').innerHTML = ''
    },
    help() {
        add('pre', data.help)
    },
    home() {
        // document.getElementById('cli').previousSibling.previousSibling.innerHTML = ''
        add('pre', data.welcome)
    },
    ls() {
        //TODO: 查看文章列表
    },
    read(article) {
        let handler = resTxt => {
            add('div', resTxt)
        }
        req('get', 'article/' + article, handler)

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
    xhr.setRequestHeader('Content-Type', 'text/plain')
    xhr.send()
}
//监视输入, 并处理
cli.addEventListener('change', e => {
    let input = e.target.value
    if (input) {
        let cmd = input.match(/\w+/g)
        console.log(cmd, cmd.length)
        switch (cmd.length) {
            case 1:
                try {
                    options[cmd[0]]()
                } catch (error) {
                    add('p', data.illegal)
                }
                break
            case 2:
                try {
                    options[cmd[0]](cmd[1])
                } catch (error) {
                    add('p', data.illegal + error)
                }
                break
            default:
                add('p', data.illegal)
        }
        e.target.value = ''
    }

})
