// app.js
import { getLoginCode, codeToToken, checkToken, checkSession } from "/service/api_login"
import { TOKEN_KEY } from "./constants/token_const"
import { COOKIE } from "./constants/cookie_const"

App({
  globalData: {
    screenWidth: 0,
    screenHeight: 0,
    statusBarHeight: 0,
    navbarHeight: 44,
    deviceRedio: 0,
    cookie: "NMTID=00Ou2qT0L5c4ddE2Usmto-Dt6nj6_cAAAGBBZWD-Q; __csrf=639e8726517d1127b2d5fdb282f9c309; __remember_me=true; MUSIC_U=cb030cf1b5fee48a5afbe19003514f4975144528d030f710ef4d56ff2ef62931993166e004087dd30b32cd3bf143f62c82de8ca48d9e19784a7c7534e8515ca401f7e36c85bc7375a89fe7c55eac81f3"
  },
  onLaunch() {
    const info = wx.getSystemInfoSync()
    this.globalData.screenWidth = info.screenWidth
    this.globalData.screenHeight = info.screenHeight
    this.globalData.statusBarHeight = info.statusBarHeight
    const deviceRedio = info.screenHeight / info.screenWidth
    this.globalData.deviceRedio = deviceRedio

    // 用户打开小程序默认自动登录
    this.handleLogin()

    // 保存cookie到本地
    const cookie = this.globalData.cookie
    wx.setStorageSync(COOKIE, cookie)
  },

  handleLogin: async function () {
    // 用户默认登录
    const token = wx.getStorageSync(TOKEN_KEY)
    // token有没有过期
    const checkResult = await checkToken(token)
    // 判断session有没有过期
    const isSessionExpire = await checkSession()
    // console.log(isSessionExpire);
    if (!token || checkResult.errorCode || !isSessionExpire) {
      this.loginAction()
    }
  },

  loginAction: async function () {
    // 1.获取code
    const code = await getLoginCode()

    // 2.将code发送给服务器
    const result = await codeToToken(code)
    const token = result.token
    wx.setStorageSync(TOKEN_KEY, token)
  }
})
