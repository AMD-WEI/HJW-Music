// app.js
import { getLoginCode, codeToToken, checkToken, checkSession } from "/service/api_login"
import { TOKEN_KEY } from "./constants/token_const"

App({
  globalData: {
    screenWidth: 0,
    screenHeight: 0,
    statusBarHeight: 0,
    navbarHeight: 44,
    deviceRedio: 0,
  },
  async onLaunch() {
    const info = wx.getSystemInfoSync()
    this.globalData.screenWidth = info.screenWidth
    this.globalData.screenHeight = info.screenHeight
    this.globalData.statusBarHeight = info.statusBarHeight
    const deviceRedio = info.screenHeight / info.screenWidth
    this.globalData.deviceRedio = deviceRedio

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
