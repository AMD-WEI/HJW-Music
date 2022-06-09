// app.js
App({
  onLaunch() {
    const info = wx.getSystemInfoSync()
    this.globalData.screenWidth = info.screenWidth
    this.globalData.screenHeight = info.screenHeight
    this.globalData.statusBarHeight = info.statusBarHeight
    const deviceRedio = info.screenHeight / info.screenWidth
    this.globalData.deviceRedio = deviceRedio
  },
  globalData: {
    screenWidth: 0,
    screenHeight: 0,
    statusBarHeight: 0,
    navbarHeight: 44,
    deviceRedio: 0,
  }
})
