// pages/music-player/index.js
import { playerStore, audioContext } from "../../store/index"

const playerModeNames = ["order", "repeat", "random"]
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,

    currentSong: {},
    durationTime: 0,
    lyricInfos: [],

    currentTime: 0,
    currentLyricIndex: 0,
    currentLyricText: "",

    isMusicLyric: true,
    sliderValue: 0,
    isSilderChanging: false,
    lyricScrollTop: 0,
    currentPage: 0,
    contentHeight: 0,

    playerModeIndex: 0,
    playerModeName: "order",
    playingName: "pause",
    isPlaying: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const id = options.id
    this.setData({ id })
    // this.getPageData(id)
    // this.getSongLyric(id)

    //再点击歌曲进入到song-item-v1组件的时候就触发player-store.js里面的网络请求
    this.setupPlayerStoreListener()

    // playerStore.dispatch("playMusicWithSongIdAction", { id })


    const globalData = getApp().globalData
    const screenHeight = globalData.screenHeight
    const statusBarHeight = globalData.statusBarHeight
    const navbarHeight = globalData.navbarHeight
    const contentHeight = screenHeight - statusBarHeight - navbarHeight
    const deviceRedio = globalData.deviceRedio
    this.setData({
      contentHeight,
      isMusicLyric: deviceRedio >= 2
    })
  },

  //====================  网络请求  ====================
  // getPageData: function (ids) {
  //   getSongDetail(ids).then(res => {
  //     this.setData({
  //       currentSong: res.songs[0],
  //       durationTime: res.songs[0].dt
  //     })
  //   })
  // },

  //获取歌词
  // getSongLyric: function (id) {
  //   getSongLyric(id).then(res => {
  //     const lyricString = res.lrc.lyric
  //     const lyrics = parseLyric(lyricString)
  //     this.setData({
  //       lyricInfos: lyrics
  //     })
  //   })
  // },

  // ==================== 事件处理  ====================
  handleSliderChange: function (event) {
    // 1.获取slider变化的值
    const value = event.detail.value

    //2.计算当点击滑条时，滑条的位置与需要播放的音乐的时间对应的currentTime
    const currentTime = this.data.durationTime * value / 100

    //3.执行前先暂停音乐播放
    // audioContext.pause()

    //4.执行当前滑条位置的音乐时间，这里会调用上面的onCanplay函数 
    audioContext.seek(currentTime / 1000)

    //5.记录最新的sliderValue
    //这里isSliderChanging设置为false是因为handleSliderChanging调用完成之后会调用handleSliderChange，这时从handleSliderChanging过来的isSilderChanging还是true
    this.setData({ sliderValue: value, isSilderChanging: false })
  },

  //====================  事件处理  ====================

  handleSliderChanging: function (event) {
    const sliderValue = event.detail.value
    const currentTime = this.data.durationTime * sliderValue / 100
    this.setData({ currentTime, isSilderChanging: true })
  },

  handleSwiperChange: function (event) {
    const currentPage = event.detail.current
    this.setData({ currentPage })
  },

  handleBackBtnClick: function () {
    wx.navigateBack()
  },

  handlePlayingBtnClick: function () {
    playerStore.dispatch("changeMusicPlayStatusAction", !this.data.isPlaying)
  },

  handleModeBtnClick: function () {
    let playerModeIndex = this.data.playerModeIndex + 1
    if (playerModeIndex === 3) playerModeIndex = 0
    playerStore.setState("playerModeIndex", playerModeIndex)
  },

  handlePrevBtnClick: function () {
    playerStore.dispatch("switchMusicAction", false)
  },

  handleNextBtnClick: function () {
    playerStore.dispatch("switchMusicAction")
  },

  //====================  数据监听  ====================
  setupPlayerStoreListener: function () {
    playerStore.onStates(["currentSong", "durationTime", "lyricInfos"], ({
      currentSong,
      durationTime,
      lyricInfos
    }) => {
      if (currentSong) this.setData({ currentSong })
      if (durationTime) this.setData({ durationTime })
      if (lyricInfos) this.setData({ lyricInfos })
    })

    playerStore.onStates(["currentTime", "currentLyricText", "currentLyricIndex"], ({
      currentTime,
      currentLyricText,
      currentLyricIndex
    }) => {
      //时间变化
      if (currentTime && !this.data.isSilderChanging) {
        // 记录滑条的位置
        const sliderValue = currentTime / this.data.durationTime * 100
        this.setData({ sliderValue, currentTime })
      }
      // 歌词变化
      if (currentLyricIndex) {
        this.setData({ currentLyricIndex, lyricScrollTop: currentLyricIndex * 35 })
      }

      if (currentLyricText) {
        this.setData({ currentLyricText })
      }
    })

    playerStore.onStates(["playerModeIndex", "isPlaying"], ({ playerModeIndex, isPlaying }) => {
      if (playerModeIndex !== undefined) {
        this.setData({ playerModeIndex, playerModeName: playerModeNames[playerModeIndex] })
      }

      if (isPlaying !== undefined) {
        this.setData({
          isPlaying,
          playingName: isPlaying ? "pause" : "resume"
        })
      }
    })
  }
})
