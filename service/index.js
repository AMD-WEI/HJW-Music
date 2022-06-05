// const BASE_URL = "http://123.207.32.32:9001"
const BASE_URL = "http://xq.svger.cn"

class JWRequest {
  request(url, method, params) {
    return new Promise((reslove, reject) => {
      wx.request({
        url: BASE_URL + url,
        method: method,
        data: params,
        header: {
          "Cookie": "NMTID=00Ou2qT0L5c4ddE2Usmto-Dt6nj6_cAAAGBBZWD-Q; __csrf=639e8726517d1127b2d5fdb282f9c309; __remember_me=true; MUSIC_U=cb030cf1b5fee48a5afbe19003514f4975144528d030f710ef4d56ff2ef62931993166e004087dd30b32cd3bf143f62c82de8ca48d9e19784a7c7534e8515ca401f7e36c85bc7375a89fe7c55eac81f3"
        },
        success: (result) => {
          // if(result.data.code === -462){
          //   this.get("/login/cellphone",{
          //     phone : 13005681432,
          //     password : "s13226441552"
          //   }).then(res => {
          //     wx.setStorageSync('cookie', res.data.cookie)
          //     wx.request({
          //       url: BASE_URL + url,
          //       method: method,
          //       data: params,
          //       header: {
          //         "Cookie": wx.getStorageSync('cookie')
          //       },
          //       success: (result) => {
          //         reslove(result.data)
          //       },
          //       fail: (err) => {
          //         reject(err)
          //       }
          //     })
          //     // return
          //   })
          // }else {
          //   reslove(result.data)
          // }
          reslove(result.data)
        },
        fail: (err) => {
          reject(err)
        }
      })
    })
  }

  get(url, params) {
    return this.request(url, "GET", params)
  }

  post(url, data) {
    return this.request(url, "POST", data)
  }
}

const jwRequest = new JWRequest()

export default jwRequest