// pages/music-player/index.js
import { getSongDetail } from "../../service/api_player"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    currentSong: {},
    currentPage: 0,
    contentHeight: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const id = options.id
    this.setData({ id })
    this.getPageData(id)

    const globalData = getApp().globalData
    const screenHeight = globalData.screenHeight
    const statusBarHeight = globalData.statusBarHeight
    const navbarHeight = globalData.navbarHeight
    const contentHeight = screenHeight - statusBarHeight - navbarHeight
    console.log(contentHeight);
    this.setData({ contentHeight })

    // 创建播放器
    const audioContext = wx.createInnerAudioContext()
    audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
    audioContext.play()
  },

  //网络请求
  getPageData: function (ids) {
    getSongDetail(ids).then(res => {
      this.setData({ currentSong: res.songs[0] })
    })
  },

  //
  handleSwiperChange: function (event) {
    const current = event.detail.current
    this.setData({ currentPage: current })
  }
})
