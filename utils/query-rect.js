export default function (selector) {
  return new Promise((resolve) => {
    const query = wx.createSelectorQuery()
    query.select(selector).boundingClientRect()

    query.exec(resolve)
    //相当于query.exec((res) => {
      //resolve(res) 我认为，resolve函数会调用then函数，这里传入的res是给到then函数的，加上query.exec()也是一个回调函数，会返回res
      //上面的query.exec(resolve)把resolve函数当做一个参数包起来，同时query.exec()也会返回res，因此res自然而然的就会被resolve当做参数，因此是可以这样简写的
    //})
  })
}