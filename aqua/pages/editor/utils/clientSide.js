//input:file 上传事件处理, 限制类型为图片, 启用多文件选项
module.exports.addImgs = function addImgs(event) {
  const imgs = {}
  event.target.files.forEach(file => {
    const imgSrc = URL.createObjectURL(file)
    imgs[imgSrc] = {
      name: file.name,
      blob: file
    }
  })
  return imgs
}

//事先准备包含图片Object URL的markdown,
//图片本体与其Object URL的映射
// const imgs = {
//   imgSrc: { name: 'name', blob: 'file' }//name为图片名称, file继承自blob, 由input触发事件后获得
// }
//输出一个对象
// let output = {
//   info: {title: 'title'},
//   md: '源markdown',
//   imgs: {
//     imgSrc: { name: 'name', blob: 'file' } //imgSrc为括号捕获的Object URL, name为图片名字
//   }
// }
module.exports.wrap = function wrap(markdown, imgs, info) {
  //Object URL的图片链接pip
  const imgReg = /!\[Alt .*\]\((blob:.*[a-f0-9]{8}(-[a-f0-9]{4}){3}-[a-f0-9]{12})\)/g
  let output = { md: markdown, imgs: {}, info: info }
  let result
  while ((result = imgReg.exec(markdown))) {
    //括号捕获Object URL
    let imgSrc = result[1]
    //核对imgs, 过滤无效链接
    if (imgs.hasOwnProperty(imgSrc)) {
      output.imgs[imgSrc] = {
        name: imgs[imgSrc].name,
        blob: imgs[imgSrc].blob
      }
    }
  }

  const formData = new FormData()
  formData.append(`info`, JSON.stringify(output.info))
  formData.append(`md`, output.md)
  for (const imgSrc in output.imgs) {
    if (output.imgs.hasOwnProperty(imgSrc)) {
      const name_blob = output.imgs[imgSrc]
      formData.append(imgSrc, name_blob.blob, name_blob.name)
    }
  }

  return formData
}