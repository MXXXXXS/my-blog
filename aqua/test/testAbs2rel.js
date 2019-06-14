const abs2rel = require(`../utils/abs2rel`)
const path = require(`path`)
const paths = [
  [`/aa/bb/ee/ff/g.md`, `/aa/bb/cc/dd/a.jpg`],
  [`/aa/bb/ee`, `/aa/bb/ee/dd/g.md`],
  [`/发/生了/什么.md`, `/发/生了/啥子.jpg`],
  [`/发/生了`, `/发/生了/什么.md`]
]

paths.forEach(pathPair => {
  console.log(abs2rel(...pathPair))
})