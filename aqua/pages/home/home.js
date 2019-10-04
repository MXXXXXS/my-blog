"use strict";
var cli = document.querySelector("#cli"), data = {
    welcome: " _       __       __                                 __            ___    ____   __  __ ___   _      \n| |     / /___   / /_____ ____   ____ ___   ___     / /_ ____     /   |  / __ \\ / / / //   | ( )_____\n| | /| / // _ \\ / // ___// __ \\ / __ `__ \\ / _ \\   / __// __ \\   / /| | / / / // / / // /| | |// ___/\n| |/ |/ //  __// // /__ / /_/ // / / / / //  __/  / /_ / /_/ /  / ___ |/ /_/ // /_/ // ___ |  (__  ) \n|__/|__/ \\___//_/ \\___/ \\____//_/ /_/ /_/ \\___/   \\__/ \\____/  /_/  |_|\\___\\_\\\\____//_/  |_| /____/  \n        ",
    get help() {
        var str = "";
        for (var key in options) {
            if (options.hasOwnProperty(key)) {
                str += "  " + key + "<br>";
            }
        }
        return str;
    },
    illegal: "\uD83D\uDE25\u597D\u50CF\u6CA1\u6709\u8FD9\u6761\u547D\u4EE4, \u8BD5\u8BD5\"help\"?"
};
var cmdStack = {
    maxLength: 10,
    cmds: [],
    point: 0,
    addCmd: function (cmd) {
        if (cmd != "" && cmd != "undefined") {
            this.cmds.push(cmd);
            this.point = this.cmds.length;
            if (this.cmds.length > 10) {
                this.cmds.shift();
                this.point--;
            }
        }
    },
    get getCmd() {
        return this.cmds[this.point] || '';
    },
    movePoint: function (key) {
        switch (key) {
            case "ArrowUp":
                if (this.point == this.maxLength) {
                    this.point--;
                    cli.value = cmdStack.getCmd;
                }
                else if (this.point == 0) {
                    cli.value = cmdStack.getCmd;
                }
                else if (this.point > 0) {
                    this.point--;
                    cli.value = cmdStack.getCmd;
                }
                break;
            case "ArrowDown":
                if (this.point == this.maxLength) {
                    cli.value = "";
                }
                else if (this.point == this.cmds.length - 1) {
                    this.point++;
                    cli.value = "";
                }
                else if (this.point < this.cmds.length - 1) {
                    this.point++;
                    cli.value = cmdStack.getCmd;
                }
                break;
        }
    }
};
window.addEventListener("keydown", function (e) {
    if (e.key == "ArrowUp" || e.key == "ArrowDown") {
        console.log(cmdStack.cmds, cmdStack.point);
        cmdStack.movePoint(e.key);
    }
    if (e.key == "Enter") {
        var input = cli.value;
        cmdStack.addCmd(input);
        if (input) {
            var cmd = input.match(/\S+/g);
            var method = cmd[0];
            if (cmd && options.hasOwnProperty(method)) {
                console.log(cmd, cmd.length);
                switch (cmd.length) {
                    case 1:
                        try {
                            options[method]();
                        }
                        catch (error) {
                            add("p", data.illegal);
                        }
                        break;
                    case 2:
                        try {
                            options[method](cmd[1]);
                        }
                        catch (error) {
                            add("p", data.illegal + error);
                        }
                        break;
                    default:
                        add("p", data.illegal);
                }
            }
            e.target.value = "";
        }
    }
});
var add = function (elTagName, content) {
    var element = document.createElement(elTagName);
    element.innerHTML = content;
    document.querySelector("#show").appendChild(element);
};
var options = {
    clear: function () {
        document.querySelector("#show").innerHTML = "";
    },
    help: function () {
        add("pre", data.help);
    },
    home: function () {
        add("pre", data.welcome);
    },
    ls: function () {
        var handler = function (resTxt) {
            var list = "";
            var result = JSON.parse(resTxt);
            result.forEach(function (element) {
                list += element + "<br>";
            });
            add("div", list);
        };
        req("get", "articles", handler);
    },
    read: function (article) {
        console.log("\u8BF7\u6C42\u6587\u7AE0:" + article);
        var handler = function (resTxt) {
            add("div", resTxt);
        };
        req("get", "article/" + article + ".md", handler);
    },
    upgrade: function () {
        window.location.href = "/welcome";
    }
};
function req(method, url, cb) {
    var xhr = new XMLHttpRequest;
    xhr.open(method, url);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            cb(xhr.responseText);
        }
    };
    xhr.setRequestHeader("Content-Type", "text/plain");
    xhr.send();
}
