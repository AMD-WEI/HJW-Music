// const BASE_URL = "http://123.207.32.32:9001"
import { COOKIE } from "../constants/cookie_const"
import { TOKEN_KEY } from "../constants/token_const"

const token = wx.getStorageSync(TOKEN_KEY)
const cookie = wx.getStorageSync(COOKIE)

const BASE_URL = "http://xq.svger.cn"

const LOGIN_BASE_URL = "http://123.207.32.32:3000"

class JWRequest {
  constructor(baseURL, authHeader = {}) {
    this.baseURL = baseURL
    this.authHeader = authHeader
  }
  // request(url, method, params, token = "") {
  request(url, method, params, isAuth = false, header = {}) {
    const finalHeader = isAuth ? { ...this.authHeader, ...header } : header
    return new Promise((reslove, reject) => {
      wx.request({
        url: this.baseURL + url,
        method: method,
        data: params,
        // header: {
        //   "Cookie": "NMTID=00Ou2qT0L5c4ddE2Usmto-Dt6nj6_cAAAGBBZWD-Q; __csrf=639e8726517d1127b2d5fdb282f9c309; __remember_me=true; MUSIC_U=cb030cf1b5fee48a5afbe19003514f4975144528d030f710ef4d56ff2ef62931993166e004087dd30b32cd3bf143f62c82de8ca48d9e19784a7c7534e8515ca401f7e36c85bc7375a89fe7c55eac81f3",
        //   "token": token
        // },
        header: finalHeader,
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

  get(url, params, isAuth = false, header) {
    return this.request(url, "GET", params, isAuth, header)
  }

  post(url, data, isAuth = false, header) {
    return this.request(url, "POST", data, isAuth, header)
  }
}

const jwRequest = new JWRequest(BASE_URL, {
  cookie
})


const jwLoginRequest = new JWRequest(LOGIN_BASE_URL, {
  token
})

export default jwRequest

export {
  jwLoginRequest
}